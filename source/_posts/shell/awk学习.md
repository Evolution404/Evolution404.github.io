---
title: awk学习
date: 2019-06-18 10:56:46
tags:
- 效率
categories:
- shell
---
## awk简介
awk是一种编程语言
sed主要用于修改文件, awk可以进行文件切割和统计
我们主要使用`gawk`, GNU版本的`awk`

## 参数形式

### -F指定分割符
指定冒号为分割符
```sh
awk -F':' '{print $1}' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618110320.png)

### BEGIN和END
`c-x c-e`可以快速启动vim来进行命令编辑
BEGIN{}   {}      END{}
行处理前  行处理  行处理后

```sh
awk 'BEGIN{print 1/2} {print $1} END{print "-------"}' a
```
BEGIN只在最开始执行了一次,同样END也只在最终执行了一次
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618114643.png)


## 内置变量

### FS与OFS
```sh
awk 'BEGIN{FS=":"} {print $1}' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618114818.png)
在开始之前使用BEGIN定义了变量FS代表分割符
```sh
awk 'BEGIN{FS=":";OFS="---"} {print $1,$2}' a
```
默认打印变量使用空格分割, 定义了OFS之后使用定义的变量来替代
OFS即out FS
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618115147.png)

### RS与ORS
输入和输出行分割符
```sh
awk 'BEGIN{ORS=" "}{print $0}' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618125210.png)
可以合并多行
将刚才输出写入aa文件, 使用RS查看结果
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618125401.png)
将输入分割符换成空格之后可以打印出原来的结果

### NR与FNR
NR代表总的行号
FNR代表当前文件的行号
一个文件看不出区别, 当在多个文件查询是可以发现区别
```sh
awk '{print NR,FNR,$0}' a b
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618120424.png)

### NF与$NF
代表当前行的字段个数
例如第2行被分为了3个字段为3,其他行只有一个冒号都为2
```sh
awk -F':' '{print $0,NF}' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618120814.png)
对于$NF,NF首先会转换成数字,加上$就代表了最后一个字段

## 格式化输出
```sh
awk '{print NR,FNR,$0}' a b
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618130204.png)
想让列对齐使用print做不到
为了解决问题,可以使用printf函数
```sh
awk 'BEGIN{print "NR   FNR  $0  "}{printf "%-4s %-4s %-4s\n",NR,FNR,$0}' a b
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618130405.png)
%-4s的含义: -代表左对齐(默认是右对齐),s代表字符串,4代表长度为4
**注意**printf函数默认没有换行符,需要手动加上`\n`

**美化一下**
```sh
awk 'BEGIN{line="+--------------------+";print line;print "|NR   |FNR  |$0      |"}{print line;printf "|%-4s |%-4s |%-8s|\n",NR,FNR,$0}END{print line}' a b
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618131107.png)

## 模式匹配
```sh
awk '/^11/' a
awk '!/^11/' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618131733.png)
查询11开头的和不是11开头的
```sh
awk -F: '$1~/^11/' a
awk -F: '$1!~/^11/' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618131756.png)
查询第一列是11开头的不是11开头的
使用变量的时候需要加上波浪号`~`

## 条件处理
```sh
awk -F: '{if($1>33){print $0}}' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618132254.png)
只查看第一列大于33的情况

```sh
ls | awk '{if($0!="aa"&&$0!="a"){print $0}}'|xargs rm -rf
ls | grep -vE "^(a|aa)$"|xargs rm -rf
```
删除除了a和aa文件其他的文件的两种方法

### 统计用户个数
```sh
awk -F: '{if($3==0){count++}else if($3>0){i++}}END{print "管理员个数:"count;print "普通用户个数:"i}' /etc/passwd
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618135058.png)
首先$3必须要是数字,0代表是root,其他数字就是普通用户

## 数组
### 基础使用
```sh
awk -F: '{username[i++]=$1}END{for(i in username){print i,username[i]}}' passwd
```
遍历出来的是数组的索引
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618140516.png)

### 统计/etc/passwd中各种shell的个数
```sh
awk -F: '/^[^#]/{list[$NF]++}END{for(i in list){print i,list[i]}}' /etc/passwd
awk -F: '!/^#/{list[$NF]++}END{for(i in list){print i,list[i]}}' /etc/passwd
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618141631.png)
去除掉了注释行


## 内置函数和外部变量

### length函数
```sh
awk '{if(length($1)==4){print $1}}' a
```
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190618162206.png)
打印出长度为4的行

### sub,gsub函数
### int函数

### 外部变量
* 方法1
  ```sh
  df -h | awk '{if(int($5)>'''$i''')print $0}'
  ```
  使用3个单引号包起来
* 方法2
  使用-v参数
  ```sh
  df -h | awk -v i=$i '{if(int($5)>i)print $0}'
  ```
