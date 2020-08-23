---
title: docker基础
date: 2020-08-16 12:16:09
category:
- docker
---

## docker安装和卸载
### 安装
```sh
# 先下载官方的自动安装脚本 然后执行
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```
### 解决每次输入sudo的问题
Docker 需要用户具有sudo权限,为了避免每次命令都输入sudo,可以把用户加入Docker用户组 [官方文档](https://docs.docker.com/engine/install/linux-postinstall/)
```sh
sudo usermod -aG docker $USER
```

### 卸载
```sh
sudo apt purge docker-ce docker-ce-cli containerd.io
# Images, containers, volumes, or customized configuration files on your host are not automatically removed.
# Delete all images, containers, and volumes.
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

## docker常用命令
### 启动容器
```sh
# -it会启动交互式窗口
docker run -it ubuntu bash
# -d让容器后台运行
docker run -d -p 80:80 nginx
```
#### 启动容器后进入容器执行命令

### 删除容器镜像
删除容器用`rm`命令,删除镜像用`rmi`命令
**复合命令**
```sh
# 这条命令会删除所有的容器 -q参数只输出容器的id
docker rm -f $(docker ps -aq)
```

## Dockerfile
### 自定义一个nginx镜像
```sh
# 新建一个文件夹 里面创建Dockerfile文件
mkdir mynginx
touch Dockerfile
```
写入`Dockerfile`内容
```
FROM nginx
RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html
```
执行`build`构建镜像
```sh
docker build -t nginx:v2 .
# 启动自己创建的nginx 访问localhost可以发现更新的内容
docker run -d -p 80:80 nginx:v2
```
