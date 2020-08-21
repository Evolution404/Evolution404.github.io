---
title: screen命令常用方式
date: 2018-10-08 17:35:47
tags:
categories:
- Linux
---

## 创建一个screen

> screen -S name
其中name是创建的screen的名字

## detach这个screen

> 使用快捷键 `<c-a> d`

## 重新进入这个screen

> screen -ls
查看当前离线的所有screen

> screen -r xxxx

其中**xxxx**是ls命令中显示的该screen的编号

