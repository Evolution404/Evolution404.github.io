---
title: nginx启动,重启与关闭
date: 2019-05-10 20:13:53
tags:
categories:
- nginx
---

## 启动
直接进入nginx的可执行文件目录
```shell
./nginx
```
加载默认的配置文件

## 重启

重新加载配置文件, 用于配置文件修改后nginx的重启
```shell
./nginx -s reload
```

## 关闭

关闭nginx
```shell
./nginx -s stop
```
