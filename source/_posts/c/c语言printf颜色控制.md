---
title: c语言printf颜色控制
date: 2018-11-19 20:46:47
tags:
- 技巧
categories:
- c
---

## 动态输出百分比的例子

```c
#include <stdio.h>
#include <unistd.h>

int main(){
    for(int i=0; i<100; i++){
        if(i%10 == 0)
            printf("\33[3%dm",i/10);
        printf("%5d%%",i);
        usleep(50000);
        printf("\33[6D");
        fflush (stdout) ;   
    }
    printf("\33[0m");
    return 0;
}
```
![](https://img-blog.csdn.net/20170427141225449?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc3BhcmtzdHJpa2U=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

```c
#include <stdio.h>
#include <unistd.h>

int main() {
  printf("\33[31mheword");
  fflush(stdout);
  sleep(1);
  printf("\33[1D");
  printf("\33[K");
  fflush(stdout);
  sleep(1);
  printf("\33[1D");
  printf("\33[K");
  fflush(stdout);
  sleep(1);
  printf("\33[1D");
  printf("\33[K");
  fflush(stdout);
  sleep(1);
  printf("\33[1D");
  printf("\33[K");
  fflush(stdout);
  sleep(1);
  printf("l");
  fflush(stdout);
  sleep(1);
  printf("l");
  fflush(stdout);
  sleep(1);
  printf("o");
  fflush(stdout);
  sleep(1);
  puts("");
  return 0;
}
```
这是一个先输出`heword` 然后一步一步修改成hello的动态效果

## ANSI控制码

字背景颜色范围:40~49
40:黑41:深红42:绿43:黄色44:蓝色45:紫色46:深绿47:白色
字颜色:30~39
30:黑31:红32:绿33:黄34:蓝色35:紫色36:深绿37:白色

\33[0m 关闭所有属性\33[1m 设置高亮度\33[4m 下划线
\33[5m 闪烁\33[7m 反显\33[8m 消隐
\33[30m -- \33[37m 设置前景色
\33[40m -- \33[47m 设置背景色
\33[nA 光标上移n行
\33[nB 光标下移n行
\33[nC 光标右移n行
\33[nD 光标左移n行
\33[y;xH设置光标位置
\33[2J 清屏
\33[K 清除从光标到行尾的内容
\33[s 保存光标位置
\33[u 恢复光标位置
\33[?25l 隐藏光标
\33[?25h 显示光标

`特别的指定48;5或者38;5 是指定xterm256色`
```c
int main()
{
  for(int i=0;i<256;i++){
    printf("\033[38;5;%dmhello world\033[0m\n",i);
    printf("\033[48;5;%dmhello world\033[0m\n",i);
  }
  return 0;
}

```

[CSDN文章](https://blog.csdn.net/wilson1068/article/details/42970551?utm_source=blogxgwz3)
