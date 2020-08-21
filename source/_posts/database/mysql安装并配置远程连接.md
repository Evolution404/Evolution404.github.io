---
title: mysql安装并配置远程连接
date: 2019-09-02 18:14:35
categories:
- 数据库
tags:
- 经验
---

## 安装

**使用apt安装mysql**
```sh
sudo apt-get install mysql-server
```

## 解决初次登录问题
```sh
# 使用 root 权限执行 mysql 命令登录 mysql 控制台
sudo mysql
```

```sql
use mysql;
SELECT user, host, plugin, authentication_string FROM user;
UPDATE user SET plugin="mysql_native_password", authentication_string=PASSWORD("123456") WHERE user="root";
FLUSH PRIVILEGES;
```
此时便可以在普通 Linux 账户下,并使用 mysql的root账户及新设密码“123456”,来登录mysql服务.

## 设置远程访问

**允许用户远程登录**
```sql
use mysql;
UPDATE mysql.user SET host="%" WHERE user="root";
FLUSH PRIVILEGES;
```

**修改配置文件**
```sh
cd /etc/mysql
find . -name "*.cnf" | xargs grep "address"
```
找到bind-address字段修改为`0.0.0.0`

**最后重启mysql**
```sh
sudo service mysql restart 
```

