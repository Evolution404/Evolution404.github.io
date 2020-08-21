---
title: lua源码2-新建一个自己的程序入口.md
date: 2019-01-22 12:39:00
tags:
- c
categories:
- lua
---

## 源程序

```c
#include "lauxlib.h"
#include "lualib.h"

int main(int argc, char *argv[]) {
  lua_State *L = luaL_newstate();  /* create state */
  luaL_openlibs(L);
  luaL_dofile(L, "my.lua");
  return 0;
}
```

## 解释

1. 创建全局的状态对象
2. 加载所有的需要的lib
3. 加载要执行的lua代码文件
