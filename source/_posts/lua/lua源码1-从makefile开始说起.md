---
title: lua源码1-从makefile开始说起.md
date: 2018-12-21 20:09:55
tags:
- c
categories:
- lua
---

## 从makefile开始说起

源码makefile中的如下变量就是用来自定义操作的

>MYCFLAGS=
MYLDFLAGS=
MYLIBS=
MYOBJS=

### 在mac上进行编译

在mac上使用 `make macosx` 就可以对源码进行编译了

``` shell
$(MAKE) $(ALL) SYSCFLAGS="-DLUA_USE_MACOSX" SYSLIBS="-lreadline" CC=cc
```
阅读makefile可以发现上面的命令其实是执行了`make all` 其后指定了SYSFLAGS, SYSLIBS, CC 三个变量

注意到当直接使用`make`命令时后输出一些提示信息,这里是通过default实现的
default依赖于PLAT而PLAT默认正是none,也就是说默认执行了`make none`可以发现其中就是shell上输出的信息

### Makefile执行的过程
使用`make macosx`命令进行编译
实际执行了`make all`, 令`SYSCFLAGS="-DLUA_USE_MACOSX"`
设定了`SYSCFLAGS`参数之后, 就可以在gcc编译过程中并指定了编译选项`-DLUA_USE_MACOSX`

### .PHONY 的应用

单词phony (即phoney)的意思是：伪造的，假的。
那么，在Makefile中，.PHONY后面的target表示的也是一个伪造的target, 而不是真实存在的文件target，注意Makefile的target默认是文件。
[详细解释](http://www.cnblogs.com/idorax/p/9306528.html)
