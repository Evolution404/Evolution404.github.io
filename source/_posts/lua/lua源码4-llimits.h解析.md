---
title: lua源码4-llimits.h解析
date: 2019-01-23 10:01:00
tags:
- c
categories:
- lua
---

## lu-mem与l-mem

这两个用于存储`total memory used by lua(in bytes)`
```c
typedef size_t lu_mem;
typedef ptrdiff_t l_mem;
```
> `size_t`本质就是`unsigned int` `ptrdiff__t`就是`int`

## 几个数据的最大值
```c
/* maximum value for size_t */
#define MAX_SIZET	((size_t)(~(size_t)0))

/* maximum size visible for Lua (must be representable in a lua_Integer */
#define MAX_SIZE	(sizeof(size_t) < sizeof(lua_Integer) ? MAX_SIZET \
                          : (size_t)(LUA_MAXINTEGER))


#define MAX_LUMEM	((lu_mem)(~(lu_mem)0))

#define MAX_LMEM	((l_mem)(MAX_LUMEM >> 1))


#define MAX_INT		INT_MAX  /* maximum value of an int */
```
无符号数的最大值直接使用`~`按位取反就可以得到,有符号最大值利用无符号数值右移一位即可


## point2unit

```c
#define point2uint(p)	((unsigned int)((size_t)(p) & UINT_MAX))
```
很明显这样将8字节的地址转换为4字节的int会有溢出,但是根据注释我们
可以知道这个函数只会用于hash相关地方,也就是说基本可以保证转换后数字
不同即可. 这种转换可以保留尾数,所以不必担心.

## assert系列
1. **lua_assert**
2. **lua_longassert**
3. **check_exp(c, e)**
4. **luai_apicheck(l,e)**
5. **api_check(l,e,msg)**

一个有意思的点是`UNUSED`宏
```c
#define UNUSED(x)	((void)(x))
```
一个没有作用的宏, 可以用来标记这个参数没有被使用过

## cast系列
> 用于类型转换
```c
/* type casts (a macro highlights casts in the code) */
#define cast(t, exp)	((t)(exp))
#define cast_void(i)	cast(void, (i))
#define cast_byte(i)	cast(lu_byte, (i))
#define cast_num(i)	cast(lua_Number, (i))
#define cast_int(i)	cast(int, (i))
#define cast_uchar(i)	cast(unsigned char, (i))
#define l_castS2U(i)	((lua_Unsigned)(i))
#define l_castU2S(i)	((lua_Integer)(i))
```
U代表`lua_Unsigned` S代表`lua_Integer`

## string相关
虚拟机的指令使用`unsigned int`来存储
```c
#define LUAI_MAXSHORTLEN	40
#define MINSTRTABSIZE	128
```

```c
#define STRCACHE_N		53
#define STRCACHE_M		2
```
字符串的缓存是用哈希表来存的,
`_N`的意思是缓存有多少个桶, 这个数最好是质数`数据结构中哈希表中有说到使用质数可以有效避免冲突`
`_M`是这个桶的最多元素个数

## 多线程
定义了一系列锁相关的宏
由于都是定义了`(void)L`, 暂时不研究

## 数学操作
```c
// 整除, 除法之后取整
#define luai_numidiv(L,a,b)     ((void)L, l_floor(luai_numdiv(L,a,b)))
// 直接计算除法
#define luai_numdiv(L,a,b)      ((a)/(b))
```

```c
#define luai_numadd(L,a,b)      ((a)+(b))
#define luai_numsub(L,a,b)      ((a)-(b))
#define luai_nummul(L,a,b)      ((a)*(b))
// unm -- unary minus -- 一元减
#define luai_numunm(L,a)        (-(a))
#define luai_numeq(a,b)         ((a)==(b))
#define luai_numlt(a,b)         ((a)<(b))
#define luai_numle(a,b)         ((a)<=(b))
#define luai_numisnan(a)        (!luai_numeq((a), (a)))
```
NAN的实现还有疑问, 下一步源码中继续找答案

## 强制测试
```c
#define condmovestack(L,pre,pos)  \
	{ int sz_ = (L)->stacksize; pre; luaD_reallocstack((L), sz_); pos; }

#define condchangemem(L,pre,pos)  \
	{ if (G(L)->gcrunning) { pre; luaC_fullgc(L, 0); pos; } }
```
没有看明白要做的工作, 到用的时候继续理解




## 杂项
```c
typedef unsigned int Instruction;
```
