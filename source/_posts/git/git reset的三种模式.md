---
title: git reset的三种模式
date: 2019-03-30 15:04:57
tags:
- 效率
- 工具
categories:
- git
---

## 三种模式介绍
**三种模式共分别为soft, mixed, hard**
`shell
git reset head^
git reset -soft head^
git reset -hard head^
`
首先我们要明确工作区, 暂存区, 版本库三种位置的区别
他们的英语分别是head版本库, index暂存区, working copy工作区

## 实验项目的搭建
```shell
git init
touch a.txt
echo "1">>a.txt
git add a.txt
git commit -m "add 1"
echo "2">>a.txt
git add a.txt
git commit -m "add 2"
echo "3">>a.txt
git add a.txt
git commit -m "add 3"
git log
```
结果如下
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kuay0luwj30ss0hugoa.jpg)

## mixed模式
这是`reset`命令的默认模式
执行结果是**工作区不变**, **暂存区, 版本库变成指向的位置的内容**
执行命令
```shell
git reset head^^
```

**查看工作区**
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kucryyt2j30ik03wmxa.jpg)
内容没有变化, 说明工作区内容没有变化
**查看暂存区**
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kug1mgmqj30sm04eq3v.jpg)
此时暂存区内容已经是两次提交之前的了, 只有一个1
**查看版本库**
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kuhvsh6oj30me0303yw.jpg)
```
git checkout -- .
cat a.txt
```
首先丢弃所有修改, 然后查看`a.txt`的内容就是版本库的内容了
版本库的内容是一个1, 说明版本库内容也已经是两次提交前的内容了

**另一种比较的方法**
```
git diff <filename> 比较工作区与暂存区
git diff head <filename> 比较工作区与版本库的最新版本
git diff --cached head <filename> 比较暂存区与版本库的最新版本
```

![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kus4hvglj30fe09gjru.jpg)
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kusodvjbj30fa094wez.jpg)
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kusy51rcj309w062jr8.jpg)
所以工作区内容`123`, 暂存区和版本库为`1`
结论如图
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kuugunx1j30g403s3ys.jpg)


## soft模式
如上方介绍的命令结构, 添加参数`--soft`
**工作区与暂存区比较**
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kuxy837ej30fa08cdfq.jpg)
两者没有区别都是`123`
**工作区与版本库比较**
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kuyto5wpj30ew09edga.jpg)
工作区是`123`版本库是`1`
**暂存区与版本库比较**
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kuz6dc12j30h40a0aaj.jpg)
暂存区是`123`版本库是`1`
结论如图
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kux3s9x6j30g403saac.jpg)
## hard模式
如上方介绍的命令结构, 添加参数`--hard`
**工作区与暂存区比较**
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kuxy837ej30fa08cdfq.jpg)
**工作区与版本库比较**
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kuxy837ej30fa08cdfq.jpg)
**暂存区与版本库比较**
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kuxy837ej30fa08cdfq.jpg)
结论如图
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1g1kux919fhj30m8058gm2.jpg)

## 总结
soft模式只会重置版本库的head位置
mixed模式会重置版本库的head位置以及暂存区内容
hard模式会让版本库,暂存区以及工作区一致都是新重置的内容
