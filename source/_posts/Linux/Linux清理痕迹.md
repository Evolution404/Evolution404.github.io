---
title: Linux清理痕迹
date: 2021-02-28 13:18:24
tags:
- 技巧
categories:
- Linux
---

## 执行命令
```sh
sudo su
echo > /var/log/wtmp && echo > /var/log/btmp && echo > /var/log/lastlog
exit
rm -rf ~/.bash_history && history -c
```
