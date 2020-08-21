---
title: lua源码3-luaconf.h解析
date: 2019-01-22 12:40:00
tags:
- c
categories:
- lua
---

## macos平台相关

### 基础选项

> 在第一篇分析中我们得知当执行`make macosx`命令会让编译器定义宏`LUA_USE_MACOSX`


```c
#if defined(LUA_USE_MACOSX)
#define LUA_USE_POSIX
#define LUA_USE_DLOPEN		/* MacOS does not need -ldl */
#define LUA_USE_READLINE	/* needs an extra library: -lreadline */
#endif
```
 也就是说macosx平台上定义了以上三个宏
1. POSIX(可一直操作系统接口)是一个标准用于保证软件的可移植性
2. DLOPEN 如果你的程序中使用dlopen、dlsym、dlclose、dlerror 显示加载动态库，需要设置链接选项 -ldl
3. READLINE 用于给shell添加自动补全
### 路径配置
```c
#define LUA_ROOT	"/usr/local/"
#define LUA_LDIR	LUA_ROOT "share/lua/" LUA_VDIR "/"
#define LUA_CDIR	LUA_ROOT "lib/lua/" LUA_VDIR "/"
#define LUA_PATH_DEFAULT  \
		LUA_LDIR"?.lua;"  LUA_LDIR"?/init.lua;" \
		LUA_CDIR"?.lua;"  LUA_CDIR"?/init.lua;" \
		"./?.lua;" "./?/init.lua"
#define LUA_CPATH_DEFAULT \
		LUA_CDIR"?.so;" LUA_CDIR"loadall.so;" "./?.so"
#define LUA_DIRSEP	"/"
```
`LUA_DIRSEP`是路径的分隔符

### 访问控制

```c
/*
@@ LUA_API is a mark for all core API functions.
@@ LUALIB_API is a mark for all auxiliary library functions.
@@ LUAMOD_API is a mark for all standard library opening functions.
*/
#define LUA_API		extern
#define LUALIB_API	LUA_API
#define LUAMOD_API	LUALIB_API

/*
@@ LUAI_FUNC is a mark for all extern functions that are not to be
** exported to outside modules.
@@ LUAI_DDEF and LUAI_DDEC are marks for all extern (const) variables
** that are not to be exported to outside modules (LUAI_DDEF for
*/
#define LUAI_FUNC	extern
#define LUAI_DDEC	LUAI_FUNC
#define LUAI_DDEF	/* empty */
```




## 数据类型相关

### 类型的宏定义
去除平台相关性, 在支持c99平台上

```c
#define LUAI_BITSINT	32
#define LUA_INT_TYPE	LUA_INT_LONGLONG
#define LUA_FLOAT_TYPE	LUA_FLOAT_DOUBLE
```

就是说`LUA_INT_TYPE`为`long long`
就是说`LUA_FLOAT_TYPE`为`double`

`LUAI_UACINT` is the result of a 'default argument promotion' over a `lUA_INTEGER.`

### l-floor的实现
本质就是根据`LUA_NUMBER`的类型来定义的
当其是float类型调用`floorf`函数
当其是double类型调用`floor`函数
当其是long double类型调用`floorl`函数
