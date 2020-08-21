---
title: lua源码7-ltable解析
date: 2019-01-26 12:16:04
tags:
- c
categories:
- lua
---

## table的结构
```c
typedef union TKey {
  struct {
    TValuefields;
    int next;  /* for chaining (offset for next node) */
  } nk;
  TValue tvk;
} TKey;
typedef struct Node {
  TValue i_val;
  TKey i_key;
} Node;
typedef struct Table {
  CommonHeader;
  lu_byte flags;  /* 1<<p means tagmethod(p) is not present */
  lu_byte lsizenode;  /* log2 of size of 'node' array */
  unsigned int sizearray;  /* size of 'array' array */
  TValue *array;  /* array part */
  Node *node;
  Node *lastfree;  /* any free position is before this position */
  struct Table *metatable;
  GCObject *gclist;
} Table;

```
**结构图**
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1fzk0mjhvfpj30p50ijwfr.jpg)

<!-- more -->

**Table**
分为`array`和`hash表`两部分
1. array: 使用数组存储, 表示的是`Table`的数组部分
2. node: 表示`Table`的哈希表部分, 这个地址指向第一个桶
3. lastfree: 存放最后一个桶的地址

**TKey**
[结构体对齐](https://www.cnblogs.com/dingxiaoqiang/p/8059329.html)
```c
typedef struct TKey {
  TValue tvk;
  int next;
} TKey;
```
可以这样存储, 但是为了对齐和节省空间, 使用了源码中的方式

`TValue`是16个字节, 如果像上面那样定义的话`TKey`增加了4个字节又因为要按照8字节对齐所以是24字节
这样就浪费了因为对齐使用的4个字节
```c
typedef union TKey {
  struct {
    TValuefields;
    int next;  /* for chaining (offset for next node) */
  } nk;
  TValue tvk;
} TKey;
```
如果采用这样的定义方式, 总共需要16个字节
```c
#define TValuefields	Value value_; int tt_
```
正好使用next占据了4个字节, 填补了浪费的对齐字节, 
利用union的特点 `TValue`继续利用之前的12个字节,与原来是等价的
这样在访问`TValue`的时候依然是`k.tvk`, 只是获取next的时候需要`k.nk.next`,
不过这一点也被封装进了宏 `#define gnext(n)	((n)->i_key.nk.next)`

**Node**
`Node`的定义就没什么好说的了, 定义了一个键值对

## hash系列宏
**hashpow2**
hashpow2(t, n) t是table, n是hash值. 功能就是根据hash值得到table里哈希表对应的元素

**hashstr**
这个宏是针对短字符串的, 调用hashpow2, 传入的hash值就是`str->hash`

**hashboolean, hashint**
hash值都是直接传入hashpow2, 没有什么多余操作

**hashmod**
hashmod(t,n) 与hashpow2功能类似,但是取余运算时2的指数的数减1, 
由于指针等数据都和2的指数有关很容易冲突,所以利用这种方式来减少冲突

**hashpointer**
内部调用了`hashmod`传入的`hash`值是将指针强转成`uint`的值

## 序列相关(findindex)
**主要功能**
输入`table`和`key`返回`value`的序号
1. 搜索`array`区域
  利用`arrayindex`函数
2. 搜索`hash`区域
  利用`mainposition`函数, 得到桶内第一个元素
  遍历这个链, 如果找不到直接`abort`退出
  因为`luaG_runerror`中调用了`abort`

哈希部分的存储不是通常的桶结构, 是提前申请好的一个数组
`next`代表的是下一个元素的相对位置

**arrayindex**
实质就是将`TValue`转化成一个`unsigned int`返回
不能转换就返回0

**mainposition**
针对不同的类型计算哈希值, 然后取得对应哈希值的桶的头`Node`

## new,free相关函数
**luaH_new**
功能很简单就是创建一个表, 
`array`部分和`hash`部分大小都是0
**luaH_free**
释放`array`部分和`hash`部分的内存
**getfreepos**
从`lastfree`开始向前找一个key为nil的Node, 返回这个Node
如果找不到返回`NULL`
**luaH_newkey**
流程图
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1fzm5bmyskrj30pe1070uh.jpg)

## luaH_get系列
**luaH_getint**
*根据整数key返回t中的TValue*
传入`lua_Integer key`
如果`key`在`array`中返回`t->array[key-1]`
如果`key`在`hash`中查询这条链, 找到返回值
找不到返回`luaO_nilobject` 这个全局共享的一个`TValue`地址

**luaH_getshortstr**
与`getint`类似, 但是不需要到`array`中进行查询
因为短字符串只会存在于`hash`部分

**getgeneric**
通用的get函数, 适用于只在`hash`部分进行查询的`TValue`

**luaH_getstr**
综合了上面两个函数, 区分长短字符串分别进行查询

**luaH_get**
1. shrstr: 直接调用`getshortstr`短字符串函数
2. numint: 直接调用`getint`函数
3. nil: 直接返回全局`nilobject`
4. numflt: 如果可以转成整数使用`getint`, 否则调用`getgeneric`
5. 其余类型: 使用`getgeneric`

### luaH_getn 获取table的长度
获取table长度总共有三种情况
1. 有数组部分, 且数组最后一位是nil
  这种情况对数组部分进行二分查找
  例如`{1,nil,3,nil}`, j为右侧游标是数组长度4指向最后一个nil, i为0 指向隐藏位置0即1之前的位置(假设序号从1开始)
  逐渐靠近最终i指向1,j指向1之后的nil,所以i为1返回i
2. 没有数组部分或数组最后一位不是nil 并且不存在`hash`部分
  很简单的操作直接返回数组size
  ```c
    return j;  /* that is easy... */
  ```
  *作者也是这么说(tu)的(cao)*

3. 没有数组部分或数组最后一位不是nil 且存在`hash`部分
  这个也是二分查找, 不过初始i就是数组的size了, j是i加1之后的值
  如果加1之后能够在hash部分查找到值的话就不断对j翻倍直到找到不能查找到值得一个j
  现在i和j已经具备,继续按照上述的二分法查找
  例如: 
    {1,nil,3,qs = 19891103}
    i=3 j=4, j与i的差值小于1不需要二分直接返回i为3

    {1,2,3,[4] = 4}
    i=3 j=8  初始j=4由于获取4的值不为nil 变成8
    i=3 j=5  (3+8)/2 为5 是nil j设置为5
    i=4 j=5  (3+5)/2 为4 不是nil i设置为4
    相差为1直接返回i为4
    这个例子中我发现了[4]=4 实际的存储key类型就是整数,但是单独划分在了hash部分
[详细解读](https://blog.csdn.net/ball32109/article/details/44904253)

## luaH_set系列
**luaH_set**
传入`TValue *key`
返回这个key对应的value指针
如果不存在这个key就会新建key

**luaH_setint**
传入`lua_Integer key`和`TValue *value`
在`table`中如果存在这个key就修改对应的值
否则就创建这个key,并设置value
创建是调用了`luaH_newkey`


## Rehash

### computesizes
**参数解读**
传入两个参数`unsigned int nums[]` 和 `unsigned int *pna`
`nums[i]`中存储的是2^(i-1)到2^i之间表中元素的个数
例如一个表有`key` 1,2,3,20, 那么
```
nums[0] = 1(1落在此区间)
nums[1] = 1(2落在此区间)
nums[2] = 1(3落在此区间)
nums[3] = 0
nums[4] = 0
nums[5] = 1(20落在此区间)
nums[6] = 0
```
`*pna`是当前数组元素的个数
**函数功能**
返回一个最优值, 所谓最优值是`table`的数组部分的最优大小
  最优值满足以下条件:
  1. 2的指数
  2. 元素占用率大于50%
  3. 满足前两个条件下的最大值
修改`pna`的值为当前的数组占用元素个数

### countint
这个函数就是用来提供`computesizes`中`nums`参数的
传入一个`key`如果这个`key`是整数型就对它向上取2的对数
在`nums`的相应位置加1
返回值: 1代表执行了操作, 0未进行操作


### numusearray numusehash
**numusearray**
返回`array`部分的使用量, 设置`nums`数组的值

**numusehash**
返回`hash`部分的使用(非nil)数量
修改`*pna`的值为`hash`部分数字键的数量
修改`*nums`的数量

### rehash
**函数功能**
输入一个新key为`ek`
对当前t的数组部分,哈希部分以及新加的`ek`重新统计
`nums`数组各项值就是三个部分所有可以变成整数键的以2的指数阶梯统计的个数
  在`computesizes`中有介绍
`na`就是所有可以存放到`array`部分的元素个数 `键可以转换成整数的元素`

```c
/* compute new size for array part */
asize = computesizes(nums, &na);
/* resize the table to new computed sizes */
luaH_resize(L, t, asize, totaluse - na);
```
接下来这两句,根据`nums`和`na`对数组部分进行最优计算, 得到新的`array`大小
更新`na`为`array`的使用量
最后重新分配数组和哈希部分的大小
数组大小: 显然是asize
哈希大小: 总使用量减去数组部分的使用量, 
  可能会有疑问这样哈希部分不就没有余量了吗, 而且大小不一定满足2的指数?
  在`luaH_resize`中已经对哈希部分大小进行了处理, 如果不是2的指数向上取到最近的2的指数



### setarrayvector setnodevector

**setarrayvector**
这个就是对`t->array`重新分配内存, 修改`t->sizearray`的值
初始化分配的空间为`nil`

**setnodevector**
1. 传入的size为0 将`t->node`设置为`dummynode` `lsizenode`为0, `lastfree`为`NULL`
2. size不为0, 检测size是否越界, 是否超过2^MAXHBITS
3. 分配内存并且将key, value都设置为nil
4. 设置`lsizenode`为size, `lastfree`为第size个node
注意点: 
如果传入size不是2的指数, 会被转换成2的指数
wgkey, gkey有区别,前者可以进行修改

### luaH_resize
**主要功能**
为table重新分配数组部分和哈希部分的大小
**流程**
1. 保存旧数组大小, 旧哈希大小, 旧哈希指针
2. 如果数组部分扩大直接重新分配大小
3. 重新分配哈希部分内存
4. 如果数组部分缩小将缩小部分存到哈希部分, 之后重新分配数组内存
5. 拷贝旧哈希值到新分配的空间
6. 释放旧哈希部分空间
