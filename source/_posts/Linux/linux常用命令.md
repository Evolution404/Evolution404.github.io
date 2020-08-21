---
title: linux常用命令
date: 2018-07-10 16:42:38
tags:
- 命令
categories:
- Linux
---

[命令查询网站](http://man.linuxde.net)

## 文件处理命令

### ls
> 原意: list

```bash
ls -ald [目录]
```
* -a --all 显示所有文件,包括隐藏文件
* -l long 详细信息显示 -h human 人性化显示
    ```bash
    ll
    ls -l 两者等价
    ```
    第一个参数十个字节
    * \- 文件 d 目录 l 软连接
    * r读w写x执行
    * 前三所有者u 中三所属组g 后三其他人o
* -d  查看目录属性 
    ```bash
    ls -ld 查看当前目录的信息
    ```
* -i  查看目录id号 inode

### mkdir
> 原意: make directories

* -p 递归创建目录

### cp
> 原意: copy

* -r 复制目录
* -p 保留文件属性,例如保留最后修改日期

### mv
同上,但是不需要-r属性
同目录下移动就可以改名
```bash
mv a b 将a改名为b
```

### rm
> 原意: remove

* -r 删除目录
* -f 不进行提示

### cat tac
tac即cat反过来
* cat 正向显示结果
* tac 反向显示结果 --> mac中不存在这个命令

### ln
> 原意: link

* ln 硬链接 --> 同步更新,不能跨分区
    `等价于cp -p + 同步更新`
* ln -s 软链接

```bash
ln -s a a.soft
```

## 权限管理命令

### chmod
chmod [{ugoa} {+-=} {rwx}] [文件或目录]
```bash
chmod a+x a 对所有用户给a文件添加x权限
chmod o=rwx a  让其他人对a文件的权限为rwx
chmod 777 a
chmod -R 777 a -R递归修改
```

|代表字符  |权限    |对文件的含义    |对目录的含义            |
|-         |-       |-               |-                       |
|r         |读权限  |可以查看文件内容|可以列出目录中的内容    |
|w         |写权限  |可以修改文件内容|可以在目录中创建删除文件|
|x         |执行权限|可以执行文件    |可以进入目录            |

### 其他权限管理命令

#### chown
> 原意: change file ownership

```bash
chown root a  将a文件的所有者更改为root
```

#### chgrp
> 原意: change file group ownership

```bash
chgrp root a 将a文件的所属组改为root
```

#### umask
```bash
umask -S 查看系统的默认权限
```

## 文件搜索命令
### find
> 格式: find [搜索范围] [匹配条件]

```bash
find /etc -name init etc目录下搜索init
find /etc -size +163840 -a -size -204800 并且关系查找 -o或者
find . -name requ* -exec ls -l {} \;  查找名称为requ*的文件并且展示文件的详细信息
```

* \*匹配任意字符,?匹配单个字符
* -name 根据文件名查找
* -iname 根据文件名查找不区分大小写
* -size 查找大小 +大于 -小于
* -user 查找所有者
* -group 查找所属组
* -amin 最近访问时间
* -cmin change
* -mmin modify
* -exec -ok 前者执行命令,后者执行命令每个都进行确认操作

### 其他搜索命令 
#### locate
> 加速的搜索命令

#### which  hereis
```bash
which ls
whereis ls 显示命令路径以及帮助文档路径
```
#### grep 
```bash
grep -i hello hello.c 不区分大小写查找
grep -v hello hello.c 反向查找,去掉存在表达式的行
```

## 帮助命令
### man
> 原意: manual

可以查看命令的帮助和配置文件的帮助-->配置文件的帮助直接写名字不写绝对路径
1命令的帮助,5配置文件的帮助

```bash
man passwd 查看命令的帮助
man 5 passwd 查看配置文件的帮助
```

### help
> mac上不能使用


## 用户管理命令

### useradd

### who, w
>`who`查看所用用户登录状况

>`w`查看所用用户更详细登录状况
`可以查看当前服务器已经运行了多久`


## 压缩解压命令
### .gz压缩格式

```bash
gzip fileName 压缩文件
gunzip fileName 解压文件
```
gzip 命令只能压缩文件,不能压缩目录.而且压缩之后会删除原文件

### .zip压缩格式

```bash
zip fileName 压缩文件
unzip fileName 解压文件
```
zip -r directory 压缩目录

### tar 命令

```bash
tar -cvf 
```
-c 打包
-v 显示详细信息
-f 指定文件名
-z 打包同时压缩
```bash
tar -cvf a.tar a 打包a文件夹生成a.tar
gzip a.tar 将a.tar进行压缩
```

同时打包和压缩
```bash
tar -zcf a.tar.gz a  z放在前面
```

解压缩

`-c` 更换为 `-x`
```bash
tar -zxf a.tar.gz
```


## 网络命令
### wirte
在线用户发送信息 使用<c-d>退出发送信息

### wall
> 原意: write all

向所有在线用户发送信息

### ping

```bash
ping -c 3 www.baidu.com -c选项表示次数
```

### last
查看用户的登录记录
lastlog 查看所有用户的最后一次登录信息

### traceroute
```bash
traceroute www.baidu.com
```

### netstat
* -t tcp协议
* -u udp协议
* -l 监听
* -r 路由
* -n 显示ip地址和端口号

```bash
netstat -tuln 查看本机监听的端口
```

## 关机重启命令

### shutdown

-c 取消上一个关机命令
-h 关机
-r 重启

```bash
shutdown -h now  现在关机
```

### init

* 0  停机（千万不能把initdefault 设置为0）
* 1  单用户模式
* 2  多用户，没有 NFS(和级别3相似，会停止部分服务)
* 3  完全多用户模式
* 4  没有用到
* 5  x11(Xwindow)
* 6  重新启动（千万不要把initdefault 设置为6）

```bash
cat /etc/inittab  设置系统默认运行级别
```
runlevel  查看当前运行级别

### logout
退出命令
使用结束之后退出
