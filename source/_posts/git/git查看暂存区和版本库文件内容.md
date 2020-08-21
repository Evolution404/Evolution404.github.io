---
title: git查看暂存区和版本库文件内容
date: 2019-10-15 10:05:58
tags:
- 效率
- 工具
categories:
- git
---

## git cat-file

### 查看暂存区文件
```sh
git cat-file -p :filename
git show :filename
```
filename就是要查看的文件名

### 查看版本库文件
```sh
git cat-file -p head:filename
git show head:filename
```
head指定要查看的版本库 filename指定要查看的版本库的文件名
