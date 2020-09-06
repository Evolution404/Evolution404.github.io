---
title: linux后台执行
date: 2019-10-26 17:46:52
tags:
categories:
- Linux
---

## 后台执行命令
```sh
nohup your commond >/dev/null 2>&1 </dev/null &
```
* 使用nohup和&进入后台执行
* 丢弃标准输出和错误输出
* 丢弃标准输入 防止执行后还留有输入框
