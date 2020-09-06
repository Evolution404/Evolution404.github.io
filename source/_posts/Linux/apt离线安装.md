---
title: apt离线安装
date: 2020-09-06 17:10:24
tags:
- 技巧
categories:
- Linux
---

## 准备离线文件
1. 准备一个和目标机器系统一致并且没有安装软件的初始机器
2. 使用`sudo apt install -d xxx`下载缓存文件
3. 保存`/var/cache/apt/archives`目录下的所有`deb`文件到自定义目录,例如`apt_offline`
4. 在`apt_offline`目录外部,执行`dpkg-scanpackages apt-offline/ /dev/null | gzip -r > apt-offline/Packages.gz`

## 在目标机器上安装
1. 将准备好的`apt_offline`目录放到目标机器的**根目录**下,也就是`/`目录
2. 修改`/etc/apt/sources.list`文件,加入`deb [trusted=yes] file:/// /apt-offline/`这一行,并把其他行注释
3. 执行`apt update`
4. 执行`apt install xxx`即可
