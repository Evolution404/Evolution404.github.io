---
title: c语言判断机器大端小端
date: 2020-08-24 08:48:39
tags:
categories:
- c
---

## 示例程序
```c
#include <stdio.h>

int main(){
  int t = 0x1234;
  char *a = (char *)(&t);
  if(*a==0x12)
    printf("big\n");
  else
    printf("little\n");
}
```
大端机器12保存在低地址,34保存在高地址
小端机器34保存在低地址,12保存在高地址
