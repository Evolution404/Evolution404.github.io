---
title: vim格式化代码
date: 2018-07-22 00:27:24
tags:
- 解决方案
categories:
- vim
---

### 使用插件neoformat

vim-plug安装
`Plug 'sbdchd/neoformat'`

### python

使用**autopep8**

### 前端

> 使用js-beautify

```bash
sudo npm install -g js-beautify
```
其中自带了html,css,js的格式化方案

### vim使用shell命令路径问题
```bash
echo $PATH
```
使用这个命令可以查看当前使用终端**PATH**变量的值
即可以从这个路径进行判断为何找不到命令
