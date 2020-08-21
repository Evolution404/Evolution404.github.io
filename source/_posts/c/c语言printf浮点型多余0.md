---
title: c语言printf浮点型多余0
date: 2018-10-21 22:42:56
tags:
- 语法
categories:
- c
---

## 解决多余零的问题
```c
#include <stdio.h>
int main(void)
{
    double a = 1;
    printf("%g\n", a);
    printf("%f\n", a);
    return 0;
}
```
> 使用`%g` 来解决, 结果如下

![](http://evolution404.gitee.io/markdownimg/006tNbRwly1fwg88eyv7aj30oa0bq3yp.jpg)

## 原理
[CSDN上文章](https://blog.csdn.net/K346K346/article/details/52252626?utm_source=blogxgwz3)
