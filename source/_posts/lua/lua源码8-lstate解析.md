---
title: lua源码8-lstate解析
date: 2019-01-28 18:11:17
tags:
- c
categories:
- lua
---

## lua_State的详细解释
[简书文章](https://www.jianshu.com/p/f415697fd952)

lua源码中定义的结构为了字节对齐打乱了顺序
根据功能对`lua_State`进行分组, 如下
```c
struct lua_State {
  CommonHeader;

  // 1 
  global_State *l_G;

  // 2
  lu_byte status;

  // 3 
  const Instruction *oldpc;  /* last pc traced */

  // 4 Data Stack: [stak,...,top,...,stack_last], length is stacksize
  int stacksize;
  StkId top;                 /* first free slot in the stack */
  StkId stack;               /* stack base */
  StkId stack_last;          /* last free slot in the stack */
  
  // 5 Call Stack
  CallInfo base_ci;          /* CallInfo for first level (C calling Lua) */  
  CallInfo *ci;              /* call info for current function */
  
  unsigned short nCcalls;    /* number of nested C calls */
  unsigned short nny;        /* number of non-yieldable calls in stack */

  // 6 Up Value
  UpVal *openupval;          /* list of open upvalues in this stack */
  struct lua_State *twups;   /* list of threads with open upvalues */

  // 7 Recover
  struct lua_longjmp *errorJmp;  /* current error recover point */
  ptrdiff_t errfunc;  /* current error handling function (stack index) */

  // 8 Hook for Debug
  lua_Hook hook;
  int basehookcount;
  int hookcount;
  lu_byte hookmask;
  lu_byte allowhook;

  // 9
  GCObject *gclist;
};
```

## lua栈结构
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1fzmjh19d59j30md0eugml.jpg)

申请了一块栈空间从`stack`到`stack_last`
`top`标记栈顶, 最初指向`stack`位置, 随着元素的进入`top`不断后移

**callinfo**
使用一个双向链表存储, 这个双向链表具有头结点
`L->ci`就可以得到`callinfo`的头结点

## 内部函数
首先分析`static`修饰的文件作用域函数, 这些函数是其他公开函数的基础

**stack_init**
用来对`lua_state`的栈进行初始化
初始化之后的内存结构
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1fzmk1o27uaj30wx0ieq4i.jpg)
1. `L->top` 向后移动了一位
2. `L->ci` 指向了`base_ci`
3. `ci->func` 指向栈中第一个元素
4. `ci->top` 指向`lua_State`的top指针之后的`LUA_MINSTACK`位置

**luaE_freeCI**
`callinfo`链是一个带头节点的链表
释放`callinfo`的空间是保留头释放其余所有节点

**luaE_shrinkCI**
去掉`callinfo`链的一半节点(头节点的下一个节点去掉,隔一个去掉一个)
重新串联`callinfo`链表

**freestack**
1. 释放`callinfo`链表
2. 释放`stack`空间

**f_luaopen**
1. 初始化`stack`
2. 初始化`registry`
3. 初始化字符串缓存
4. 初始化`tag method`
5. 初始化词法分析器

**preinit_thread**
这个函数是创建L时候最先被调用的
传入g和L, 设置L的g
初始化L的所有值

## newstate
传入内存分配函数
1. 使用内存分配函数f分配LG的空间
2. 解构LG, 为L和G赋值
3. 设置L的类型`tt`
4. 调用`preinit_thread`初始化L的各项参数
5. 初始化G, `seed`是随机数种子
