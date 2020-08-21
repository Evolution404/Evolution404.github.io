---
title: lua源码11-lvm解析
date: 2019-01-30 16:11:52
tags:
- c
categories:
- lua
---

## 指令执行

**luav_execute**
这个函数是lua指令执行的函数, 内部包括了一个死循环
```c
for(;;){
  vmdispatch(){
  }
}
```
这样一个结构, `vmdispatch`本质就是一个`switch case`

### goto的意义
在函数中定义了一个goto标签`newframe`
一旦遇到`OP_CALL OP_TAILCALL OP_RETURN`
这几个操作码都会回到这里刷新函数信息

### ra以及base
ra和base都是与堆栈相关的变量
在运行过程中, lua栈大小可能会变化所以ra与base指针指向的地方
也要对应的变化
为此定义了`Protect`宏, 来进行base的修改

```c
#define vmfetch()	{ \
  i = *(ci->u.l.savedpc++); \
  if (L->hookmask & (LUA_MASKLINE | LUA_MASKCOUNT)) \
    Protect(luaG_traceexec(L)); \
  ra = RA(i); /* WARNING: any stack reallocation invalidates 'ra' */ \
  lua_assert(base == ci->u.l.base); \
  lua_assert(base <= L->top && L->top < L->stack + L->stacksize); \
}
```
`vmfetch`用来取到一条指令, 并且进行一些初始化
1. 对i进行了赋值和指令自增
2. 对ra进行赋值, 指向一个栈位置 注释中明确表示了`WARNING: any stack reallocation invalidates 'ra'`


## 指令详解

### 赋值类指令

#### 寄存器
**OP_MOVE**
这个让指令中指向的B的值赋值给A寄存器
```c
setobjs2s(L, ra, RB(i));
```
#### 常量
**nil**
OP_LOADNIL
由于只有nil这一种可能, 所以B表示的是需要赋值的个数
这个指令可以令从A寄存器开始的B个元素的值赋值为nil

**bool**
OP_LOADBOOL
```c
if (GETARG_C(i)) ci->u.l.savedpc++;  /* skip next instruction (if C) */
```
在加载bool值的时候额外可以根据c的值确定是否跳过下一条指令

**复杂常量**
这些值存储在常量表中
```c
vmcase(OP_LOADK) {
  TValue *rb = k + GETARG_Bx(i);
  setobj2s(L, ra, rb);
  vmbreak;
}
vmcase(OP_LOADKX) {
  TValue *rb;
  // 当前savedpc指向的就是下一条指令, 因为在vmfetch中对指令进行了自增
  lua_assert(GET_OPCODE(*ci->u.l.savedpc) == OP_EXTRAARG);
  rb = k + GETARG_Ax(*ci->u.l.savedpc++);
  setobj2s(L, ra, rb);
  vmbreak;
}
```
k就是常量表, 在k基础上向后移动
K和KX的区别在于
K是用B区存的位置
KX使用ABC区合并表示位置, 可以寻址更大范围

#### 既不是常量也不在寄存器

**OP_GETTABUP**
```c
gettableProtected(L, upval, rc, ra);
#define gettableProtected(L,t,k,v)  { const TValue *slot; \
  if (luaV_fastget(L,t,k,slot,luaH_get)) { setobj2s(L, v, slot); } \
  else Protect(luaV_finishget(L,t,k,v,slot)); }

#define luaV_fastget(L,t,k,slot,f) \
  (!ttistable(t)  \
   ? (slot = NULL, 0)  /* not a table; 'slot' is NULL and result is 0 */  \
   : (slot = f(hvalue(t), k),  /* else, do raw access */  \
      !ttisnil(slot)))  /* result not nil? */

```
upval -> t
rc -> k
ra -> v
注释中明确表示了功能 R(A) := UpValue[B][RK(C)]

fastget:
  return 0, slot=NULL 不是table类型
  return 0, slot=nil  没有从table中取到值, 值可能从metamethod获得
  return 1, slot=val  这种情况是期望状态, 正确的取到了table中的值

finishget:
  当fastget返回0时会进入这个函数, 此时slot可能是NULL也可能是nil
  功能: 从table t中取到指定key的值到val中
  更详细的研究等待阅读过`ltm.c`之后再分解

### 表达式运算

**luaV_tonumber_**
将整数类型和字符串类型转换成浮点数
**tonumber**
宏, 将o转换成数字赋值个n, 如果不能转换返回0

```c
OP_ADD,/*	A B C	R(A) := RK(B) + RK(C)				*/
OP_SUB,/*	A B C	R(A) := RK(B) - RK(C)				*/
OP_MUL,/*	A B C	R(A) := RK(B) * RK(C)				*/
OP_DIV,/*	A B C	R(A) := RK(B) / RK(C)				*/
```
这几个实现流程基本一致, 检测类型, 都是整数直接处理
如果都能转换成浮点型, 执行操作返回类型
如果有非数字调用`luaT_trybinTm`

### 与或异或
**与**
```c
setivalue(ra, intop(&, ib, ic));
```
直接调用了&运算符

**或**
```c
setivalue(ra, intop(|, ib, ic));
```
直接调用了|运算符

**异或**
```c
setivalue(ra, intop(^, ib, ic));
```
直接调用了^运算符

### 左移右移

```c
setivalue(ra, luaV_shiftl(ib, ic));
setivalue(ra, luaV_shiftl(ib, -ic));
```
`luaV_shiftl`支持负数, 所以左移负数位也是可以的, 等价于右移

### 连接

**OP_CONCAT**
即字符串的连接运算符`..`

`luaV_concat(total)`传入total
将从`L->top - 1`之前的total个元素进行连接
为了使用这个函数, 在`OP_CONCAT`指令中首先修改了`top`的位置
调用结束后并进行了恢复
**tostring**
这个宏返回值1表示可以转换成字符串, 并且会将传入的o的指向的值变成字符串

**luaV_concat**
1. 元素1和元素2都不能转换成字符串, 报错
2. 元素2是空, 直接转换元素1变成字符串
3. 元素1是空, 将元素2拷贝到1位置
4. 普通情况, 1和2都有值且都能转换成字符串进行连接
  计算出需要连接的总长度tl
  如果合并后是短字符串创建短字符串ts
  如果是长字符串创建长字符串对象并拷贝实际字符串值到新建的ts中

### 分支和跳转
**jump**
jump指令是有`dojump宏来实现的`
指令的Bx部分指明了跳转的偏移量, A部分是标记位

```c
OP_JMP,/*	A sBx	pc+=sBx; if (A) close all upvalues >= R(A - 1)	*/
/* execute a jump instruction */
#define dojump(ci,i,e) \
  { int a = GETARG_A(i); \
    if (a != 0) luaF_close(L, ci->u.l.base + a - 1); \
    ci->u.l.savedpc += GETARG_sBx(i) + e; }
```
> 在 Lua5.1以前，JMP操作并无这个职责，它仅仅修改savedpc。但Lua5.1有另一个操作码CLOSE。
若JMP操作会跳出一个代码块时，就生成一条CLOSE操作的指令来调用luaF_close。
CLOSE操作总是伴随着JMP，Lua5.2对虚拟机指令集做了优化，去掉了CLOSE，把这个操作合并到了JMP中。

**分支**
```c
OP_EQ,/*	A B C	if ((RK(B) == RK(C)) ~= A) then pc++		*/
OP_LT,/*	A B C	if ((RK(B) <  RK(C)) ~= A) then pc++		*/
OP_LE,/*	A B C	if ((RK(B) <= RK(C)) ~= A) then pc++		*/

OP_TEST,/*	A C	if not (R(A) <=> C) then pc++			*/
OP_TESTSET,/*	A B C	if (R(B) <=> C) then R(A) := R(B) else pc++	*/
```

这几个逻辑类似, 都有对应的API, 直接调用进行比较即可

### 函数调用
**OP_CALL**
B: 函数参数个数, 为0代表参数不固定, 不为0参数为B-1个
C: 返回值个数, 为0代表返回值不固定, 不为0返回值为C-1个
等函数调用原理研究透彻再来解析


