---
title: lua源码9-lfunc解析
date: 2019-01-28 21:56:12
tags:
- c
categories:
- lua
---

## UpVal
```c
struct UpVal {
  TValue *v;  /* points to stack or to its own value */
  lu_mem refcount;  /* reference counter */
  union {
    struct {  /* (when open) */
      UpVal *next;  /* linked list */
      int touched;  /* mark to avoid cycles with dead threads */
    } open;
    TValue value;  /* the value (when closed) */
  } u;
};

#define upisopen(up)	((up)->v != &(up)->u.value)
```

upvalue有两种存在状态, 一种是open, 一种是close
open: 当前upvalue存在于L的数据栈上
close: 当前upvalue已经不在L的数据栈上了, 数据被移动到了UpVal结构体内部

当开放的时候UpVal的v指向的是数据栈的位置, 关闭后指向了union中的value
所以`upisopen`的实现原理就是检测v指向的位置是否是内部的value

由于next链表只需要在开放的时候使用, 为了节省空间使用了共用体

## Lclosure
lua的闭包

```c
#define ClosureHeader \
	CommonHeader; lu_byte nupvalues; GCObject *gclist

typedef struct LClosure {
  ClosureHeader;
  struct Proto *p;
  UpVal *upvals[1];  /* list of upvalues */
} LClosure;
```
`nupvalues`存放的是这个闭包`upvalue`的个数
`upvals`是一个指针数组, 指向所有`upvalue`
这里首先申请一个指针的空间
```c
#define sizeLclosure(n)	(cast(int, sizeof(LClosure)) + \
                         cast(int, sizeof(TValue *)*((n)-1)))
```
这个宏传入了n是`upvalue`的个数, 一个`Lclosure`的大小是
`sizeof(LClosure) + sizeof(TValue *) * (n-1)`
之所以要减一,是因为在`LClosure`中已经申请了一个大小的指针数组

```c
LClosure *luaF_newLclosure (lua_State *L, int n) {
  GCObject *o = luaC_newobj(L, LUA_TLCL, sizeLclosure(n));
  LClosure *c = gco2lcl(o);
  c->p = NULL;
  c->nupvalues = cast_byte(n);
  while (n--) c->upvals[n] = NULL;
  return c;
}
```

申请了`LClosure`的空间, 对`Proto`和所有`upvalue`初始化并返回这个指针

## findupval

1. 首先从`L->openupval`链表中找到传入的`UpVal`
2. 如果在以上链表中找不到新建一个
3. 将输入的`TValue`包装成`Upval`为uv
4. 令uv串入`L->openupval`的头部
5. 返回新创建的uv

## initupvals
输入`LClosure *cl`
对这个cl的所有`upvalue`申请空间,并让`cl->upvals`
指针数组指向新申请的空间
新创建的`upvalue`都是关闭状态的

## luaF_close
传入一个栈上位置, 将传入位置之后的所有的在openupval链表上的upval
关闭, 并移动值到内部的`value`字段

