---
title: nginx配置反向代理服务器
date: 2019-05-11 08:50:45
tags:
categories:
- nginx
---

## 配置只能本地访问
```
listen 127.0.0.1:8888;
```
在listen中指定ip+端口, 即可控制本地访问

## 一个实例
```
events{

}
http{
  include /usr/local/nginx/conf/mime.types;
  upstream remote {
    server 140.249.19.181:8910;
  }
  server{
    listen 9999;
    location /{
      proxy_pass http://remote;
    }
  }
}
```
这样本地访问`localhost:9999`就会被代理到`140.249.19.181:8910`
