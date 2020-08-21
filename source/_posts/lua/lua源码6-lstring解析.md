---
title: lua源码6-lstring解析
date: 2019-01-24 20:51:16
tags:
- c
categories:
- lua
---

## 哈希计算
```c
#define LUAI_HASHLIMIT		5
```
首先是这个宏定义, 定义了对一个字符串生成hash的长度限制
最多不会超过`(2^LUAI_HASHLIMIT)`个字符参与hash运算

### 哈希计算函数

```c
// 求字符串的哈希值
unsigned int luaS_hash (const char *str, size_t l, unsigned int seed) {
  unsigned int h = seed ^ cast(unsigned int, l);
  // 求哈希时的步长, 长度小于32的时候步长是1, 之后每翻倍步长加一
  size_t step = (l >> LUAI_HASHLIMIT) + 1;
  for (; l >= step; l -= step)
    h ^= ((h<<5) + (h>>2) + cast_byte(str[l - 1]));
  return h;
}
```
这就是具体运用的函数, 可以得出长度小于32步长为1,32-64步长为2之后都是类似的情况
也就符合了上面的结论, 参与计算的字符数不会超过`(2^LUAI_HASHLIMIT)`


### 长字符串哈希计算
> 短字符串创建的时候就计算了hash值,长字符串不会立即计算,只会在需要时计算

```c
unsigned int luaS_hashlongstr (TString *ts) {
  lua_assert(ts->tt == LUA_TLNGSTR);
  if (ts->extra == 0) {  /* no hash? */
    ts->hash = luaS_hash(getstr(ts), ts->u.lnglen, ts->hash);
    ts->extra = 1;  /* now it has its hash */
  }
  return ts->hash;
}
```

TString的extra字段对于长字符串来说
* 0代表未计算hash
* 1代表已计算hash

## 初始化
主要是函数**luaS_init**
进行的操作
1. 申请`string table`的空间
2. 为`g->memerrmsg`设置初始值,并且令其不会被回收
3. 令`g->strcache`的所有元素指向`g->memerrmsg`


## 字符串的创建
### createstrobj
内部调用了`luaC_newobj`申请了`字符串长度+1+sizeof(UTString)`的空间
设置了`tt`, `hash`, `extra`, 以及最后的`\0`界定结束位置
对于生成的`ts`对象, 还缺少拷贝的真实字符内容, 字符串长度字段, gc链的下一个地址

### luaS_newlstr

通过显式的指明字符串的长度, 来创建字符串
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1fzjuk2a9scj30br0kqt95.jpg)

### internshrstr

首先, 这个函数有static标记,表示这个函数是内部函数不被外接调用
```c
typedef struct stringtable {
  TString **hash;
  int nuse;  /* number of elements */
  int size;
} stringtable;
```
`size`是桶的个数, `nuse`是这个表里面总共存在的字符串数

短字符串是存储在哈希桶内的,这个桶就是`g->strt.hash`
`g->strt.size`是这个桶的大小

**执行流程**
1. 计算哈希值h
2. 通过哈希值h得到桶的地址
3. 查找这个桶是否存在相同的字符串, 存在直接返回
4. 如果nuse大于等于size重新分配表的大小(扩大一倍) `luaS_resize(L, g->strt.size * 2)`
5. 更新桶的地址
6. 创建`TString`T对象 `createstrobj(L, l, LUA_TSHRSTR, h)`
7. 拷贝真实字符串到创建的对象地址后
8. 修改ts的`shrlen`, 在桶的头插入这个节点, 让`g->strt.nuse`自增

### luaS_createlngstrobj
内部实现直接调用了`createstrobj`
值得注意的是需要长字符串的哈希值并没有计算,直接就存的全局随机数种子
而且在这个函数里没有进行实际的拷贝字符串, 是在`luaS_newlstr`中得到`TSring`对象之后才拷贝的

### luaS_new
这就是最终进行创建字符串函数
1. 根据地址计算哈希, 到cache中查找是否已经存在
2. 不存在使用`luaS_newlstr`创建新字符串
3. 往cache中添加新创建的地址, 移除多余的地址


## 其余辅助函数
### luaS_resize 
**核心算法**
```c
for (i = 0; i < tb->size; i++) {  /* rehash */
  TString *p = tb->hash[i];
  tb->hash[i] = NULL;
  while (p) {  /* for each node in the list */
    TString *hnext = p->u.hnext;  /* save next */
    unsigned int h = lmod(p->hash, newsize);  /* new position */
    p->u.hnext = tb->hash[h];  /* chain it */
    tb->hash[h] = p;
    p = hnext;
  }
}
```
实现的效果, 将原来size个桶的元素重新排布到newsize个桶内
1. 首先进入第0个桶, 得到桶内的第一个元素node
2. 计算node的新h值, 就是在newsize个桶的新位置
3. 将node插入到h桶的头
4. 更新`node`的值为`node->u.hnext`
5. 直到将第0个桶的所有元素重新排布, 继续进行第1个桶, 直到所有桶完毕

**扩大空间**
使用`luaM_reallocvector` 重新分配大小
对增加的空间赋值`NULL`
**缩小空间**

检测`newsize`和`size-1`位置的值为`NULL`
潜在意思就是缩小的空间的开头结尾是`NULL`, 也就是整个缩小的空间都是`NULL`
检测完成使用`luaM_reallocvector`重新分配空间

### luaS_clearcache
检测`g->strcache`中的所有元素
如果这个对象即将被回收, 清除`strcache`的这个位置
设置为一个被固定的对象, 例如`g->memerrmsg`
