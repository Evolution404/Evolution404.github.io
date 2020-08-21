---
title: nginx进程管理
date: 2019-05-11 10:06:23
tags:
categories:
- nginx
---

## 进程管理的信号
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190511100638.png)

### CHLD
子进程结束时会向父进程发送CHLD信号
Master进程收到CHLD信号之后会重新拉起worker进程

## reload命令的实质
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190511102245.png)
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190511102443.png)
旧worker子进程如果出错就会导致旧进程长时间存在
新版本中增加了`worker_shutdown_timeout`, 决定旧worker子进程最长存在时间
