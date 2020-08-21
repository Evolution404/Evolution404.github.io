---
title: c语言double内存存储剖析
date: 2018-11-05 19:25:38
tags:
- 进阶
categories:
- c
---
## 分析以下程序的输出结果

```c
#include <stdio.h>

void f(double *px){
  char *pc = (char*)px;
  short *ps = (short*)px;
  unsigned short *pus = (unsigned short*)px;
  printf("%lf\n",*px);
  for (int i = 0; i < 8; ++i) {
    printf("%x ",pc[i]);
  }
  printf("\n");
  for (int i = 0; i < 4; ++i) {
    printf("%x ",ps[i]);
  }
  printf("\n");
  for (int i = 0; i < 4; ++i) {
    printf("%x ",pus[i]);
  }
  printf("\n");
}

int main(void)
{
  double a = 4.5;
  f(&a);
  return 0;
}
```

## 运行结果
![](http://evolution404.gitee.io/markdownimg/006tNbRwly1fwxeu38qywj30bw03u3yb.jpg)

## 分析

### 4.5的二进制表示结果
![](http://evolution404.gitee.io/markdownimg/006tNbRwly1fwxeuwehvsj30xs0ceq3n.jpg)
[细节分析](http://www.cnblogs.com/bingdaocaihong/p/6993028.html)

所以4.5占用64个bit 
`0100 0000 0001 0010 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000`

由于普遍系统是小端存储所以在内存中存储方式是正好相反(字节级别的倒序,每个字节倒序,字节内部不倒序)
`0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0001 0010 0100 0000`

### 程序分析
1. char 占用一个字节8bit, 两种short都是两个字节16bit
2. char的前六次全部是0,第七次读取到`00010010` 正好是16进制`12`
3. short占据两个字节第三次读取16bit `00010010 01000000` **大端小端的层级不是比特是字节,字节级别的倒序**
  >所以先解读后一个字节40 前一个字节12 综合就是4012
