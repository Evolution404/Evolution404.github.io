---
title: lua源码5-lobject解析
date: 2019-01-24 13:40:00
tags:
- c
categories:
- lua
---

## 基本类型图解
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1fzhmaeyhzrj31du0u012t.jpg)

## 类型标记

### lua数据类型
```c
#define LUA_TNONE		(-1)

#define LUA_TNIL		0
#define LUA_TBOOLEAN		1
#define LUA_TLIGHTUSERDATA	2
#define LUA_TNUMBER		3
#define LUA_TSTRING		4
#define LUA_TTABLE		5
#define LUA_TFUNCTION		6
#define LUA_TUSERDATA		7
#define LUA_TTHREAD		8

#define LUA_NUMTAGS		9
```
lua中的数据类型就是以上9种, 最后一个用来标记数据类型的总数
`LUA_TNONE`没有计算在内


### 使用位置
```c
#define TValuefields	Value value_; int tt_
typedef struct lua_TValue {
  TValuefields;
} TValue;

```
在`lua_TValue`的定义中`tt_`就是类型标记

### 标记原理
```c

/*
** tags for Tagged Values have the following use of bits:
** bits 0-3: actual tag (a LUA_T* value)
** bits 4-5: variant bits
** bit 6: whether value is collectable
*/

```
根据以上源码中的注释, int总共8位
最后4位用来标记大类型,用两位标记变体类型
第7位用来标记gc,最后一位空闲

> 所谓变体类型就是大类型下的子类型,例如函数类型有三个变体类型
```c
/*
** LUA_TFUNCTION variants:
** 0 - Lua function
** 1 - light C function
** 2 - regular C function (closure)
*/
```

### 进行类型位操作的相关宏

#### 变体操作
```c
/* Variant tags for functions */
#define LUA_TLCL	(LUA_TFUNCTION | (0 << 4))  /* Lua closure */
#define LUA_TLCF	(LUA_TFUNCTION | (1 << 4))  /* light C function */
#define LUA_TCCL	(LUA_TFUNCTION | (2 << 4))  /* C closure */


/* Variant tags for strings */
#define LUA_TSHRSTR	(LUA_TSTRING | (0 << 4))  /* short strings */
#define LUA_TLNGSTR	(LUA_TSTRING | (1 << 4))  /* long strings */


/* Variant tags for numbers */
#define LUA_TNUMFLT	(LUA_TNUMBER | (0 << 4))  /* float numbers */
#define LUA_TNUMINT	(LUA_TNUMBER | (1 << 4))  /* integer numbers */
```
使用大类型数字与变体左移4位的数字或运算, 这样组合起来就确定了一种类型的最后六位
现在gc位还没有进行标记是0


```c
/* Bit mark for collectable types */
#define BIT_ISCOLLECTABLE	(1 << 6)

/* mark a tag as collectable */
#define ctb(t)			((t) | BIT_ISCOLLECTABLE)
```

第一个宏就是用来操作gc位置
ctb(t)本质将输入的t返回将他的gc位设置为1的数字,是`collectable`的简写

### 类型检测
```c
#define val_(o)		((o)->value_)

/* raw type tag of a TValue */
#define rttype(o)	((o)->tt_)

/* tag with no variants (bits 0-3) */
#define novariant(x)	((x) & 0x0F)

/* type tag of a TValue (bits 0-3 for tags + variant bits 4-5) */
#define ttype(o)	(rttype(o) & 0x3F)

/* type tag of a TValue with no variants (bits 0-3) */
#define ttnov(o)	(novariant(rttype(o)))
```
除了这些还定义了一堆关于类型检测的宏, 原理就是对`tt_`属性进行位运算

### 值设置,set系列宏
分为set(xx)value以及chg(xx)value
1. set系列
  设置值,并且修改类型
2. chg系列
  检测类型,通过检查修改值

---
**缩写含义**:
  svalue: string
  hvalue: table
  ptvalue: 除了这个地方没找到应用的地方,至少这个版本这个定义没有意义


## 复杂数据类型
### 字符串
```c
typedef struct TString {
  CommonHeader;
  lu_byte extra;  /* reserved words for short strings; "has hash" for longs */
  lu_byte shrlen;  /* length for short strings */
  unsigned int hash;
  union {
    size_t lnglen;  /* length for long strings */
    struct TString *hnext;  /* linked list for hash table */
  } u;
} TString;
```
**union u的理解**
lnglen: 长字符串的长度
*hext: hash table的下一个元素地址
对于长字符串不存储在hash table中所以使用union来节省空间

![](http://evolution404.gitee.io/markdownimg/006tNc79ly1fzhxhqoifrj315i0u0gqh.jpg)

**ts**代表**TString** **s**代表**String**
* tsvalue(o) 传入`TValue`得到`TString`
  value系列,都是传入`TValue`根据命名`ts`是`TString` 就是获得`TString`类型的结果
* getstr(ts) 传入`TString` 强制类型转换成`char`类型, 加上`sizeof(UTString)`就得到了str的开始地址,
  内存中字符串和这个头是存在一起的
* svalue(o) 传入`TValue`, 获取到实际的字符串, 实现是`(char*)((GCUnion*)(o->value_.gc)->ts)+sizeof(UTString)`
  也是value系列的宏,获得`String`类型
* tsslen(s) 传入`TString`得到字符串的长度 `ts`传入参数,`slen`字符串长度
* vslen(s) 传入`TValue`得到字符串的长度 `v`传入参数,`slen`字符串长度

### 函数原型

```c
typedef struct Proto {
  CommonHeader;
  lu_byte numparams;  /* number of fixed parameters */
  lu_byte is_vararg;
  lu_byte maxstacksize;  /* number of registers needed by this function */
  int sizeupvalues;  /* size of 'upvalues' */
  int sizek;  /* size of 'k' */
  int sizecode;
  int sizelineinfo;
  int sizep;  /* size of 'p' */
  int sizelocvars;
  int linedefined;  /* debug information  */
  int lastlinedefined;  /* debug information  */
  TValue *k;  /* constants used by the function */
  Instruction *code;  /* opcodes */
  struct Proto **p;  /* functions defined inside the function */
  int *lineinfo;  /* map from opcodes to source lines (debug information) */
  LocVar *locvars;  /* information about local variables (debug information) */
  Upvaldesc *upvalues;  /* upvalue information */
  struct LClosure *cache;  /* last-created closure with this prototype */
  TString  *source;  /* used for debug information */
  GCObject *gclist;
} Proto;
```
Proto结构体, 在文件中定义了
```c
#define LUA_TPROTO	LUA_NUMTAGS		/* function prototypes */
```
没有在`lua.h`中定义表明这是一个私有的类型, 不提供一个公开的接口
