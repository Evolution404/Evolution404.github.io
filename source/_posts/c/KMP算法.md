---
title: KMP算法
date: 2018-10-25 20:53:46
tags:
- 算法
categories:
- c
---

## 参考文章


[阮一峰](http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html)
[CSDN](https://blog.csdn.net/u011564456/article/details/20862555?utm_source=blogxgwz0)


## c语言源码
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define N 100

void cal_next(char *str, int *next, int len) {
  int i, j;

  next[0] = -1;
  for (i = 1; i < len; i++) {
    j = next[i - 1];
    while (str[j + 1] != str[i] && (j >= 0)) {
      j = next[j];
    }
    if (str[i] == str[j + 1]) {
      next[i] = j + 1;
    } else {
      next[i] = -1;
    }
  }
}

int KMP(char *str, int slen, char *ptr, int plen, int *next) {
  int s_i = 0, p_i = 0;
  while (s_i < slen && p_i < plen) {
    if (str[s_i] == ptr[p_i]) {
      s_i++;
      p_i++;
    } else {
      if (p_i == 0) {
        s_i++;
      } else {
        p_i = next[p_i - 1] + 1;
      }
    }
  }
  return (p_i == plen) ? (s_i - plen) : -1;
}

int main() {
  char str[N] = {0};
  char ptr[N] = {0};
  int slen, plen;
  int next[N];

  while (scanf("%s%s", str, ptr)) {
    slen = strlen(str);
    plen = strlen(ptr);
    cal_next(ptr, next, plen);
    printf("%d\n", KMP(str, slen, ptr, plen, next));
  }
  return 0;
}
```
