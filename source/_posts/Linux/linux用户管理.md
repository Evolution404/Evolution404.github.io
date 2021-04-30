---
title: linux用户管理
date: 2021-04-30 10:41:00
tags:
- 技巧
categories:
- Linux
---

## 添加用户到某个组
### 方法一usermod
```shell
sudo usermod -aG group user
```
`usermod`命令是针对用户进行操作，所以最后一个参数是用户

### 方法二gpasswd
```shell
sudo gpasswd -a user group
```
`gpasswd`是针对组进行操作，所以最后指定要操作的组

## 将用户从某个组删除
```shell
sudo gpasswd -d user group
```
将user从group组中删除
