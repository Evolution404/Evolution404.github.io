---
title: lua源码14-lzio解析
date: 2019-02-28 15:20:56
tags:
- c
categories:
- lua
---

## 研究的路径

`luaL_loadfilex`中调用了`lua_load`
```c
status = lua_load(L, getF, &lf, lua_tostring(L, -1), mode);
```
`lua_load`中使用到了`lzio`中的函数
```c
luaZ_init(L, &z, reader, data);
```

## 简介
用于缓冲流
公开的函数有
* luaZ_init
* luaZ_read

**操作的结构**
```c
struct Zio {
  size_t n;			/* bytes still unread */
  const char *p;		/* current position in buffer */
  lua_Reader reader;		/* reader function */
  void *data;			/* additional data */
  lua_State *L;			/* Lua state (for reader) */
};
```

## luaZ_init
功能就是初始化z, 这个一个ZIO的指针
操作的方式很直白
```c
z->L = L;
z->reader = reader;
z->data = data;
z->n = 0;
z->p = NULL;
```
## luaZ_read

**luaZ_fill**
1. 从`z->data`中读取出一个buff, `z->data`就是那个`LoadF`结构
2. 设置`z->n`以及`z->p`
3. 返回buff的第一个值

`luaZ_read`从z中读取n个字符到b中
使用一个while循环, 每次通过`luaZ_fill`读取一个buff的数据
然后将刚刚读取的内容拷贝到b中, 将n减去刚刚拷贝的大小
一直循环到n为0

