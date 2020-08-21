---
title: mac笔记本修改网卡mac地址
date: 2018-07-16 17:58:32
tags:
- 破解
categories:
- shell
---

```bash
networksetup -listallhardwareports
sudo ifconfig en0 ether 44:c3:46:69:11:73
```

1. 查看电脑目前现有的网卡以及mac地址
2. 修改en0网卡的mac地址为44:c3:46:69:11:73

原mac地址截图
![原mac地址截图](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftbuwyeyimj30fy078abn.jpg)
