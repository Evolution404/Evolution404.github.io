---
title: sed命令
date: 2019-06-17 19:53:41
tags:
- 工具
categories:
- shell
---


## 基本功能
用于非交互的文件修改
测试文件
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617224718.png)

## 替换

**注意**
sed替换时必须要有三个/, `s/old/new/`最后的这个/不能少

### 普通用法
有a文件
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617195753.png)
执行

```sh
sed 's/222/333' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617195838.png)
替换方式以vim十分相似

### &的意义
&代表匹配的部分

```sh
sed 's/.*/#&/' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617202232.png)
在所有行开始加上#, 还有一个等价的方法是
```sh
sed 's/^/#/' a
```
直接将开始符号替换为#

## 模式空间和暂存空间

### 基本指令
* d删除
* s替换

### 高级指令
* 存入暂存区指令h H
* 取出暂存区指令g G
* 暂存空间和模式空间互换指令x
小写是覆盖式,大写是追加式
例如命令
```sh
sed 'g' a
sed 'G' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617214508.png)
g是覆盖的,读入一行然后从暂存区取出一个换行直接替换为空
G是追加的,读入一行然后从暂存区取出一个换行一行变成两行

**sed处理的行是绝对概念,一旦开始处理一行不论处理结果是几行操作都是针对的处理后所有部分**
**如果通过g或者G将一行变成了多行,之后的操作也是针对这多行**
例如这两个指令
```sh
sed '1h;2G;2h;3G' a
sed '1h;2G;2h;3G;3d' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617224508.png)
通过操作第3行追加了暂存区的两行, 一旦第3行删除不只是原来的第3行还有新增的两行

### 实例
```sh
sed '1h;$G' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617214832.png)
第一行存入暂存区, 到最后一行追加过去 相当于复制第一行到最后一行

剪切第一行到最后一行
```sh
sed '1{h;d};$G' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617215839.png)

```sh
sed '1,3H;$G' a
sed '1h;2,3H;$G' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617220120.png)
造成这两个命令区别的原因是暂存区本来有一个空行,直接追加会导致最前面留一个空行

```sh
sed '4h;5x;6G' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617220901.png)
首先第4行写入暂存区, 第5行和暂存区进行交换第五行变成444,暂存区变成555,  第6行拉下来555所以666之后是555


倒序
```sh
sed '1!G;$!h;$!d' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617223104.png)
解释图
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190617223605.png)
