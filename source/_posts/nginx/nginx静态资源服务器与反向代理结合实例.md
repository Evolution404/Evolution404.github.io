---
title: nginx静态资源服务器与反向代理结合实例
date: 2019-05-12 11:17:47
tags:
categories:
- nginx
---

## 搭建静态资源服务器

1. 增加`server`字段
2. 监听80端口
3. 设置访问根目录
```
server {
  listen 80;
  server_name localhost;
  location / {
    alias /Users/zhangyuxi/Desktop/public-house/build/;
    autoindex on;
  }
}
```

## 配置服务器接口的反向代理

直接配置一个新的location以及对应的需要访问的服务器地址即可
```
location /api/gongyongfang{
  proxy_pass http://140.249.19.181:8910/api/gongyongfang;
}
```

### 配置proxy-pass时斜线的问题
两台nginx服务器
nginx A: 192.168.1.48
nginx B: 192.168.1.56
请求nginxA： http://192.168.1.48/foo/api

|案例|location|proxy_pass|结果|
|:-:|:-:|:-:|:-:|
|1| /foo/	|http://192.168.1.48/	|/api
|2| /foo	|http://192.168.1.48/	|//api
|3| /foo/	|http://192.168.1.48	|/foo/api
|4| /foo	|http://192.168.1.48	|/foo/api
***
|案例	|location	|proxy_pass	              |结果
|:-:|:-:|:-:|:-:|
|5	  |/foo/	  |http://192.168.1.48/bar/	|/bar/api
|6	  |/foo	    |http://192.168.1.48/bar/	|/bar//api
|7	  |/foo/	  |http://192.168.1.48/bar	|/barapi
|8	  |/foo	    |http://192.168.1.48/bar	|/bar/api

区分方法很简单, 代理的地址区分为ip:port加后面的字符串
1. 如果后面的字符串为空那么请求到被代理的地址就是访问地址
2. 如果后面的字符串不为空, 那么结果就是先去掉location中的部分再加在`proxy_pass`的地址后面

只有3,4是情况1, 那么访问什么结果就是什么, 都是/foo/api
剩下都是情况2, 例如对7进行分析
访问的是`/foo/api`去掉`/foo/`为`api`在proxy_pass的`/bar`后面加上`api`
就是`/barapi`, 剩下的5中情况都是同样的方法

## 路由的正则匹配
由于上传的图片和excel模板文件需要被代理, 而css,js文件不需要代理
并且这两种类型的路径都是`static`开头, 所以用正则来进行区分

```
# root 方案
#location ~ /static/(js|css|media) {
#  alias /Users/zhangyuxi/Desktop/public-house/;
#  autoindex on;
#}
# alias 方案
location ~ /static/(js|css|media)/(.*) {
  alias /Users/zhangyuxi/Desktop/public-house/build/static/$1/$2;
  autoindex on;
}
#location /static/js {
#  alias /var/www/public-house-build/static/js/;
#  autoindex on;
#}
#location /static/css {
#  alias /var/www/public-house-build/static/css/;
#  autoindex on;
#}
#location /static/media {
#  alias /var/www/public-house-build/static/media/;
#  autoindex on;
#}
location /api/gongyongfang{
  proxy_pass http://140.249.19.181:8910/api/gongyongfang;
}
```
**注意点**
1. 如果在匹配方式前不加`~`, 会导致优先级不够, js等文件不会从本地查找
2. 使用了正则匹配之后alias使用方法有变化, 访问路径的剩余部分并不会自动加到后面
   使用了`(.*)`接收到了所有的剩余字符, 在`alias`中使用`$2`代替, 精确定位到每个文件
   如果使用root就会便捷一些

## 完整的配置文件

```c
events{

}
http{
  include /usr/local/etc/nginx/mime.types;
  gzip on;

  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_buffers 16 8k;
  gzip_http_version 1.1;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
  server {
    listen 80;
    server_name localhost;
    location / {
      alias /Users/zhangyuxi/Desktop/public-house/build/;
      autoindex on;
    }
    # root 方案
    #location ~ /static/(js|css|media)/(.*) {
    #  alias /Users/zhangyuxi/Desktop/public-house/;
    #  autoindex on;
    #}
    # alias 方案
    location ~ /static/(js|css|media)/(.*) {
      alias /Users/zhangyuxi/Desktop/public-house/build/static/$1/$2;
      autoindex on;
    }
    location /api/gongyongfang{
      proxy_pass http://140.249.19.181:8910/api/gongyongfang;
    }
    location /static{
      proxy_pass http://140.249.19.181:8910/static;
    }

  }
}
```
