---
title: lua源码10-lopcodes解析
date: 2019-01-29 17:47:21
tags:
- c
categories:
- lua
---

## 虚拟机指令格式
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1fzobfkvum3j30jh05mwew.jpg)

虚拟机的指令总共有四种
`ABC`, `ABx`, `AsBx`, `Ax`

**基础宏**
```c
#define SIZE_C		9
#define SIZE_B		9
#define SIZE_Bx		(SIZE_C + SIZE_B)
#define SIZE_A		8
#define SIZE_Ax		(SIZE_C + SIZE_B + SIZE_A)
#define SIZE_OP		6

#define POS_OP		0
#define POS_A		(POS_OP + SIZE_OP)
#define POS_C		(POS_A + SIZE_A)
#define POS_B		(POS_C + SIZE_C)
#define POS_Bx		POS_C
#define POS_Ax		POS_A

#define MAXARG_Bx        ((1<<SIZE_Bx)-1)
#define MAXARG_sBx        (MAXARG_Bx>>1)         /* 'sBx' is signed */
#define MAXARG_Ax	((1<<SIZE_Ax)-1)
#define MAXARG_A        ((1<<SIZE_A)-1)
#define MAXARG_B        ((1<<SIZE_B)-1)
#define MAXARG_C        ((1<<SIZE_C)-1)
```
就是
`SIZE`类: 各个部分的比特数
`POS`类: 各个部分的开始位置, 从0开始 
`MAXARG`类: 每个部分所能表示的最大数字

**get, set宏**
```c
/* creates a mask with 'n' 1 bits at position 'p' */
#define MASK1(n,p)	((~((~(Instruction)0)<<(n)))<<(p))

/* creates a mask with 'n' 0 bits at position 'p' */
#define MASK0(n,p)	(~MASK1(n,p))

/*
** the following macros help to manipulate instructions
*/

#define GET_OPCODE(i)	(cast(OpCode, ((i)>>POS_OP) & MASK1(SIZE_OP,0)))
#define SET_OPCODE(i,o)	((i) = (((i)&MASK0(SIZE_OP,POS_OP)) | \
		((cast(Instruction, o)<<POS_OP)&MASK1(SIZE_OP,POS_OP))))

#define getarg(i,pos,size)	(cast(int, ((i)>>pos) & MASK1(size,0)))
#define setarg(i,v,pos,size)	((i) = (((i)&MASK0(size,pos)) | \
                ((cast(Instruction, v)<<pos)&MASK1(size,pos))))

#define GETARG_A(i)	getarg(i, POS_A, SIZE_A)
#define SETARG_A(i,v)	setarg(i, v, POS_A, SIZE_A)

#define GETARG_B(i)	getarg(i, POS_B, SIZE_B)
#define SETARG_B(i,v)	setarg(i, v, POS_B, SIZE_B)

#define GETARG_C(i)	getarg(i, POS_C, SIZE_C)
#define SETARG_C(i,v)	setarg(i, v, POS_C, SIZE_C)

#define GETARG_Bx(i)	getarg(i, POS_Bx, SIZE_Bx)
#define SETARG_Bx(i,v)	setarg(i, v, POS_Bx, SIZE_Bx)

#define GETARG_Ax(i)	getarg(i, POS_Ax, SIZE_Ax)
#define SETARG_Ax(i,v)	setarg(i, v, POS_Ax, SIZE_Ax)

#define GETARG_sBx(i)	(GETARG_Bx(i)-MAXARG_sBx)
#define SETARG_sBx(i,b)	SETARG_Bx((i),cast(unsigned int, (b)+MAXARG_sBx))


#define CREATE_ABC(o,a,b,c)	((cast(Instruction, o)<<POS_OP) \
			| (cast(Instruction, a)<<POS_A) \
			| (cast(Instruction, b)<<POS_B) \
			| (cast(Instruction, c)<<POS_C))

#define CREATE_ABx(o,a,bc)	((cast(Instruction, o)<<POS_OP) \
			| (cast(Instruction, a)<<POS_A) \
			| (cast(Instruction, bc)<<POS_Bx))

#define CREATE_Ax(o,a)		((cast(Instruction, o)<<POS_OP) \
			| (cast(Instruction, a)<<POS_Ax))
```
`MASK1`是在p位置开始生成n个1其余位置是0, `MASK0`正好相反
其余各个宏的功能名字上就写的很直白了


## luaP_opmodes
这是一个和指令数目大小相同的数组, 使用8个比特标记了每条指令的信息
```c
enum OpArgMask {
  OpArgN,  /* argument is not used */
  OpArgU,  /* argument is used */
  OpArgR,  /* argument is a register or a jump offset */
  OpArgK   /* argument is a constant or register/constant */
};
```
以上4项是B和C在一条指令中的状态
```c
enum OpMode {iABC, iABx, iAsBx, iAx};  /* basic instruction format */
```
这4个是指令的四种格式, 就是开头的图片的标记


1. bits 0-1: op mode, 就是指令的4种格式
2. bits 2-3: C arg mode
3. bits 4-5: B arg mode
4. bit 6: instruction set register A
5. bit 7: operator is a test (next instruction must be a jump)

第6位表示这个指令是否会修改寄存器A, 第7位标记当前指令用来检测, 下一条指令必定是跳转
