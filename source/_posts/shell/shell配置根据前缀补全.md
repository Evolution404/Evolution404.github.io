---
title: shell配置根据前缀补全
date: 2019-06-02 10:53:00
categories:
- linux
tags:
- 效率
---

## shell 自动根据前缀查找补全历史命令

在 ~/.inputrc或/etc/inputrc 最后面加上如下代码
```
"\e[A": history-search-backward
"\e[B": history-search-forward
"\e[1~": beginning-of-line
"\e[4~": end-of-line
```
后面两行可以不用加, 用来移动到行首和行尾
