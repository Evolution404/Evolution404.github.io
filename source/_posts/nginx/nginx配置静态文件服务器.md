---
title: nginx配置静态文件服务器
date: 2019-05-11 07:59:49
tags:
categories:
- nginx
---

## 配置文件结构

* 配置文件的命令以分号结尾
* 根结构是`http`, 内部配置各个`server`
* 每个server内可以配置监听的端口, 以及自己的`server_name`
* 每个server内的`location`属性用于指定对应路由所访问的静态文件

```
server {
    listen       80;
    server_name  localhost;
    location / {
      alias    dist/;
    }
}

```

## 可用的静态文件配置文件
```
events{

}
http{
  include /usr/local/nginx/conf/mime.types;
  server{
    listen 8888;
    location /{
      alias dist/;
    }
  }
}
```
* `events` 必须要有, 否则会报错
* 引入`mime.types`为了对请求头的`content-type`属性进行设置

## 指定目录的静态文件配置
```
events{

}
http{
  include /usr/local/nginx/conf/mime.types;
  server{
    listen 8888;
    charset utf-8,gbk;
    location /{
      alias /Users/zhangyuxi/Desktop/;
      autoindex on;
    }
  }
}
```
* 首先要解决的是权限问题, 对于部署的目录需要给nginx权限
  简单的话可以直接 `chomod 777 .`
* audoindex 的目的是展示目录的所有文件
* 要解决目录显示中文乱码的问题, 指定charset即可
* alias是别名, 就是说location的路径等价于alias的路径
* root可以理解为拼接, root就是当前server或location的根路径,
  location指定的路径要在root的拼接下
  alias最后要有/, root可有可无

