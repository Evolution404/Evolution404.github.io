---
title: makefile编写规则
date: 2019-11-17 10:53:40
tags:
- 技巧
- 工具
categories:
- Linux
---
## 简单示例
### 架构
```
.
├── a.c
├── b.c
├── b.h
└── makefile

0 directories, 4 files
```
有a.c b.c 和 b.h文件 生成可执行文件a

### 第一版

```
a: a.o b.o
	gcc -o a a.o b.o
a.o: a.c b.h
	gcc -c a.c
b.o: b.c
	gcc -c b.c
clean:
	rm a a.o b.o
```

### 第二版

```
objs=a.o b.o
a: a.o b.o
	gcc -o a $(objs)
a.o: a.c b.h
	gcc -c a.c
b.o: b.c
	gcc -c b.c
clean:
	rm a $(objs)
```
使用了变量

### 第三版
```
objs=a.o b.o
a: a.o b.o
	gcc -o a $(objs)
a.o: b.h
clean:
	rm a $(objs)
```
使用了自动推导, 例如a.o的依赖会自动推导出a.c

