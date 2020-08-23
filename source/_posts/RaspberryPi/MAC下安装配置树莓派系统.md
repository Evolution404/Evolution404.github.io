---
title: MAC下安装配置树莓派系统
date: 2020-01-08 19:30:27
category:
- RaspberryPi
tags:
---

## 安装系统

### 下载镜像
[官网下载](https://www.raspberrypi.org/downloads/raspbian/)
其中分别是完整版,桌面版去掉一些软件,以及Lite轻量版只有命令行界面不包括桌面

### 安装镜像
安装镜像有两种方式

#### 使用Etcher安装
[下载Etcher](https://www.balena.io/etcher/)

#### 使用命令行安装

##### 格式化硬盘
使用磁盘工具(Disk Utility)格式化SD卡,使用FAT格式点击抹掉(Erase)
或者使用`SD Card Formatter`格式化SD卡

##### 卸载分区
1. 首先执行`df -h`查看SD卡的分区名
2. 执行`diskutil unmount 分区名`卸载分区

##### 写入镜像
1. 执行`diskutil list`查看分区名
![](https://gitee.com/Evolution404/picgo-img/raw/master/20200108202351-llkJ6x.png)
2. 执行`sudo dd bs=4m if=xxxx.img of=分区名`写入镜像

### 配置wifi
1. 在`boot`目录下创建`wpa_supplicant.conf`文件
2. 写入wifi信息
```
country=CN
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
 
network={
  ssid="WiFi-A"
  psk="12345678"
  key_mgmt=WPA-PSK
  priority=1
}
 
network={
  ssid="WiFi-B"
  psk="12345678"
  key_mgmt=WPA-PSK
  priority=2
  scan_ssid=1
}
```
ssid:wifi名称
psk:wifi密码
key_mgmt:加密方式
priority:连接优先级,越大优先级越高
scan_ssid:如果是隐藏wifi需要设置该项

### 开启ssh服务
在boot目录下创建`ssh`文件,执行`touch ssh`即可

## 配置系统
### 支持中文
1. sudo raspi-config
2. 选择Localisation Options
3. 选择Change Locale
4. 去掉`en_GB.UTF-8 UTF-8`,选择`en_US.UTF-8 UTF-8`

### 创建用户修改密码
#### 创建用户
```sh
adduser nas
```
#### 修改密码
使用passwd命令

### 安装proxychains
1. 执行`sudo apt install proxychains`
2. 修改配置文件`/etc/proxychains.conf`
3. 设置为socket5,配置对应的ip和端口

### 使用apt安装必要的库
1. `sudo proxychains apt update`
2. `sudo proxychains apt upgrade`
3. `sudo proxychains apt install ncurses-dev`

### 编译安装vim
```sh
proxychains git clone https://github.com/vim/vim.git
cd vim
./configure --with-features=huge --enable-multibyte --enable-python3interp=yes --with-python-config-dir=/usr/lib/python3.7/config-3.7m-arm-linux-gnueabihf --enable-cscope --prefix=/usr/local
sudo make -j4 && sudo make install
```

### 硬盘相关
#### 挂载
##### 挂载硬盘
1. 首先插上硬盘,执行`sudo fdisk -l`查看硬盘的名字
![](https://gitee.com/Evolution404/picgo-img/raw/master/uPic/hQLuFP.png)
2. 执行`sudo mount /dev/sda1 /home/nas`挂载硬盘,`/home/nas`是挂载的目标目录,需要提前创建

##### 自动挂载
1. 修改`/etc/fstab`文件 添加`/dev/sda1  /home/nas ext4 defaults,nofail,x-systemd.device-timeout=5,noatime 0 0`
2. `nofail`选项避免未检测到硬盘后无法启动
3. `x-systemd.device-timeout`代表未检测到硬盘后的等待时间,默认为90s太长了,这里修改为5s
4. `noatime`代表不记录最后访问时间等,提高文件系统的效率
5. [fstab文件的详细信息](https://wiki.archlinux.org/index.php/Fstab#File_system_labels)

#### 测试硬盘读写速度
##### 测试写入速度
```sh
dd if=/dev/zero of=tmp.data bs=1000M count=1
```
##### 测试读取速度
```sh
sudo hdparm -Tt /dev/sda
```

### 备份与恢复
#### 备份
```sh
# 不压缩
sudo dd bs=4M if=/dev/mmcblk0 status=progress of=raspbian.img
# 压缩
wget https://raw.githubusercontent.com/Drewsif/PiShrink/master/pishrink.sh
sudo dd bs=4M if=/dev/mmcblk0 status=progress of=raspbian.img
sudo bash pishrink.sh -z raspbian.img
```
#### 恢复
直接使用`Etcher`写入镜像即可

### 网络相关问题

#### 查看网口的速度
```sh
sudo ethtool eth0
```

#### 查看当前连接的wifi
`iw wlan0 link`

#### 扫描所有wifi
`sudo iw wlan0 scan`

#### 5G频段wifi搜索不到的问题
1. 执行`sudo raspi-config`
2. 选择`Localisation Options`
3. 选择`Change Wi-fi Country`
4. 选择`US`

### 自定义命令
#### temp命令
用来查看CPU温度
在`~/.bashrc`中加入
```sh
alias temp="awk '{print \$1/1000\"C\"}' /sys/class/thermal/thermal_zone0/temp"
```
#### CPU压力测试
```sh
cat /dev/urandom | md5sum
```
这条命令可以占满一个核心,多个核心执行多次

### 配置透明网关
#### 安装v2ray和ipset
```sh
# 树莓派开启ip转发
echo net.ipv4.ip_forward=1 >> /etc/sysctl.conf && sysctl -p
wget https://install.direct/go.sh
sudo bash go.sh
# 安装ipset
sudo apt install ipset
# 启动v2ray
sudo systemctl start v2ray
```
#### 修改v2ray配置文件
配置文件是`/etc/v2ray/config.json`,详细信息查看[官方文档](https://www.v2ray.com/index.html)
```sh
# 编辑配置文件命令
sudo vim /etc/v2ray/config.json
# 测试配置文件语法命令
/usr/bin/v2ray/v2ray -test -config /etc/v2ray/config.json
# 测试能否访问谷歌的命令,10886就是inbounds中socks的端口
# 返回301或200说明能访问,无反应或是000说明不行
curl -so /dev/null -w "%{http_code}" google.com -x socks5://127.0.0.1:10886
```

配置文件内容
```json
{
  "log": {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "none"
  },
  "inbounds": [
    {
      "tag": "transparent",
      "port": 12345,
      "protocol": "dokodemo-door",
      "settings": {
        "network": "tcp,udp",
        "followRedirect": true
      },
      "streamSettings": {
        "sockopt": {
          "tproxy": "tproxy"
        }
      }
    }
  ],
  "outbounds": [
    {
      "tag": "direct",
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIPv4"
      },
      "streamSettings": {
        "sockopt": {
          "mark": 255
        }
      }
    }
  ]
}
```
修改后执行`sudo systemctl restart v2ray`重新加载配置文件

#### 设置透明代理规则并开机自动运行
新建脚本`ip.sh`
```sh
# Destroy ipset if it already exists
systemctl stop ipset
ipset destroy china

# Create the ipset list
ipset -N china hash:net

# remove any old list that might exist from previous runs of this script
rm cn.zone

# Pull the latest IP set for China
wget -P . http://www.ipdeny.com/ipblocks/data/countries/cn.zone

# Add each IP address from the downloaded list into the ipset 'china'
for i in $(cat ./cn.zone ); do ipset -A china $i; done
rm cn.zone

mkdir -p /etc/ipset && ipset -file /etc/ipset/ipset.conf save
cat > /etc/systemd/system/ipset.service << 'END_TEXT'
[Unit]
Description=ipset persistent rule service
Before=tproxyrule.service
ConditionFileNotEmpty=/etc/ipset/ipset.conf
[Service]
Type=oneshot
RemainAfterExit=true
ExecStart=/sbin/ipset -exist -file /etc/ipset/ipset.conf restore
ExecStop=/sbin/ipset -file /etc/ipset/ipset.conf save
[Install]
WantedBy=multi-user.target
END_TEXT
systemctl enable ipset

ip rule add fwmark 1 table 100
ip route add local 0.0.0.0/0 dev lo table 100

iptables -F -t mangle
# 代理局域网设备
iptables -t mangle -N V2RAY
iptables -t mangle -A V2RAY -d 127.0.0.1/32 -j RETURN
iptables -t mangle -A V2RAY -d 224.0.0.0/4 -j RETURN
iptables -t mangle -A V2RAY -d 255.255.255.255/32 -j RETURN
iptables -t mangle -A V2RAY -d 192.168.0.0/16 -p tcp -j RETURN # 直连局域网，避免 V2Ray 无法启动时无法连网关的 SSH，如果你配置的是其他网段（如 10.x.x.x 等），则修改成自己的
iptables -t mangle -A V2RAY -d 192.168.0.0/16 -p udp ! --dport 53 -j RETURN # 直连局域网，53 端口除外（因为要使用 V2Ray 的
iptables -t mangle -A V2RAY -p tcp -m set --match-set china dst -j RETURN
iptables -t mangle -A V2RAY -p udp --dport 53 -j DROP -m mark --mark 0xff # 这里丢弃发送到本机被标记了的udp 53端口流量,如果不丢弃会形成死循环
iptables -t mangle -A V2RAY -p udp -j TPROXY --on-port 12345 --tproxy-mark 1 # 给 UDP 打标记 1，转发至 12345 端口
iptables -t mangle -A V2RAY -p tcp -j TPROXY --on-port 12345 --tproxy-mark 1 # 给 TCP 打标记 1，转发至 12345 端口
iptables -t mangle -A PREROUTING -j V2RAY # 应用规则

# 代理网关本机
iptables -t mangle -N V2RAY_MASK
iptables -t mangle -A V2RAY_MASK -d 224.0.0.0/4 -j RETURN
iptables -t mangle -A V2RAY_MASK -d 255.255.255.255/32 -j RETURN
iptables -t mangle -A V2RAY_MASK -d 192.168.0.0/16 -p tcp -j RETURN # 直连局域网
iptables -t mangle -A V2RAY_MASK -p tcp -m set --match-set china dst -j RETURN
iptables -t mangle -A V2RAY_MASK -p udp --dport 53 -j RETURN
iptables -t mangle -A V2RAY_MASK -d 192.168.0.0/16 -p udp ! --dport 53 -j RETURN # 直连局域网，53 端口除外（因为要使用 V2Ray 的 DNS）
# 这条命令使用的是RETURN,如果有发送到本机的udp 53端口流量经过这里发送出去后会重新进入上面的PREROUTING
iptables -t mangle -A V2RAY_MASK -j RETURN -m mark --mark 0xff    # 直连 SO_MARK 为 0xff 的流量(0xff 是 16 进制数，数值上等同与上面V2Ray 配置的 255)，此规则目的是避免代理本机(网关)流量出现回环问题
iptables -t mangle -A V2RAY_MASK -p udp -j MARK --set-mark 1   # 给 UDP 打标记,重路由
iptables -t mangle -A V2RAY_MASK -p tcp -j MARK --set-mark 1   # 给 TCP 打标记，重路由
iptables -t mangle -A OUTPUT -j V2RAY_MASK # 应用规则
mkdir -p /etc/iptables && iptables-save > /etc/iptables/rules.v4
cat > /etc/systemd/system/tproxyrule.service << 'END_TEXT'
[Unit]
Description=Tproxy rule
After=network.target
Wants=network.target

[Service]

Type=oneshot
#注意分号前后要有空格
ExecStart=/sbin/ip rule add fwmark 1 table 100 ; /sbin/ip route add local 0.0.0.0/0 dev lo table 100 ; /sbin/iptables-restore /etc/iptables/rules.v4

[Install]
WantedBy=multi-user.target
END_TEXT
systemctl enable tproxyrule
```
创建脚本后使用`sudo bash ip.sh`执行

#### 解决访问慢问题
启动后一直报错`too many open files`,导致访问缓慢,特别是在域名解析时使用UDP协议
**解决方案**
1. 编辑`/etc/systemd/system/v2ray.service`文件,在**[Service]**下加入`LimitNPROC=500`和`LimitNOFILE=1000000`两行
2. 执行`systemctl daemon-reload && systemctl restart v2ray`生效

#### 设置网关

##### 在路由器上直接设置
在路由器的DHCP设置里修改默认网关为树莓派的ip即可

一些路由器不能设置默认网关所以各种设备需要单独设置

##### 设置MAC的默认网关
**方法一**
```sh
sudo route delete default && sudo route add default 192.168.x.x
```
这种方法容易失效

**方法二**
1. Network Preferences
2. Advanced
3. 修改TCP/IP设置为Manually填写Router设置为树莓派ip
4. 修改DNS设置为树莓派地址

##### 设置手机等的默认网关
1. 设置ip地址静态分配
2. 其中可能有路由器,route或者网关,这三种名称都代表网关,修改为树莓派的地址
3. 修改默认DNS服务器为树莓派地址

#### 根据订阅地址自动更新节点

##### 创建python文件并设置权限
首先执行以下命令
```sh
sudo pip3 install pysocks colorlog
sudo touch /usr/bin/v2ray_auto_change
sudo chmod 777 /usr/bin/v2ray_auto_change
sudo chmod -R 777 /var/log/
```

写入文件`/usr/bin/v2ray_auto_change`以下内容
```python
#!/usr/bin/python3
import re
import sys,os
import socket
import multiprocessing
import threading
import logging
import json
import time
import requests
import argparse
import subprocess
import base64
import uuid
import random
import colorlog

from glob import glob
from pprint import pprint
from requests.adapters import HTTPAdapter
from multiprocessing import Pool
from logging import handlers


SUBSCRIBE_URL = 'https://xbssr.fun/rss/v809dCv/I6SgUz?net_type=VMESS'
SUBSCRIBE_RETRY_MAX = 3      # 加载订阅信息最大尝试次数
TEST_CONNECT_URL = 'https://www.google.com/'
TEST_CONNECT_TIMES = 10      # 检测上面url的次数
V2RAY_PATH = '/usr/bin/v2ray/v2ray'
V2RAY_CONIG_FILE = '/etc/v2ray/config.json'
LOG_FILE = '/var/log/v2ray/v2ray_auto_change.log'
MAX_SERVER = 30              # 最多同时检测多少个服务器
LOG_COLORS_CONFIG = {
    'DEBUG': 'cyan',
    'INFO': 'green',
    'WARNING': 'yellow',
    'ERROR': 'red',
    'CRITICAL': 'red',
}

# 时间设置
TIME_INTERVAL = 3           # 多少秒循环检测一次当前服务器状态
SUBSCRIBE_CACHE_TIME = 1800  # 订阅信息缓存多少秒,超时后访问订阅地址重新获取
SUBSCRIBE_TIMEOUT = 10       # 获取订阅内容超时时间
TEST_CONNECT_TIMEOUT = 3     # 连接测试地址的超时时间
TEST_READ_TIMEOUT = 5        # 等待测试地址返回数据的超时时间

# 系数
PERFECT_FACTOR = 100
LATENCY_FACTOR = 100
CHECK_LIMIT = 2
RESET_FACTOR_LIMIT = 200     # 当前服务器系数达到该值寻找新的最优服务器

TMP_CONFIG_FILE = '''
{
  "inbounds": [
    {
      "port": 1080,
      "protocol": "socks",
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls"]
      },
      "settings": {
        "auth": "noauth"
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "vnext": [
        ]
      }
    }
  ]
}
'''

FINAL_CONFIG_FILE = '''
{
  "log": {
    "access": "/var/log/v2ray/access.log",
    "error": "/var/log/v2ray/error.log",
    "loglevel": "none"
  },
  "inbounds": [
    {
      "tag":"transparent",
      "port": 12345,
      "protocol": "dokodemo-door",
      "settings": {
        "network": "tcp,udp",
        "followRedirect": true
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      },
      "streamSettings": {
        "sockopt": {
          "tproxy": "tproxy"
        }
      }
    }
  ],
  "outbounds": [
    {
      "tag": "proxy",
      "protocol": "vmess",
      "settings": {
        "vnext": [
        ]
      },
      "streamSettings": {
        "sockopt": {
          "mark": 255
        }
      }
    },
    {
      "tag": "direct",
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIPv4"
      },
      "streamSettings": {
        "sockopt": {
          "mark": 255
        }
      }      
    },
    {
      "tag": "block",
      "protocol": "blackhole",
      "settings": {
        "response": {
          "type": "none"
        }
      }
    },
    {
      "tag": "dns-out",
      "protocol": "dns",
      "streamSettings": {
        "sockopt": {
          "mark": 255
        }
      }  
    }
  ],
  "dns": {
    "servers": [
      "8.8.8.8",
      "1.1.1.1",
      "114.114.114.114",
      {
        "address": "223.5.5.5",
        "port": 53,
        "domains": [
          "geosite:cn",
          "ntp.org",
          "xbssr.fun",
          "domain:zhangyuxi.xyz"
        ]
      }
    ]
  },
  "routing": {
    "domainStrategy": "IPOnDemand",
    "rules": [
      {
        "type": "field",
        "inboundTag": [
          "transparent"
        ],
        "port": 53,
        "network": "udp",
        "outboundTag": "dns-out" 
      },    
      {
        "type": "field",
        "inboundTag": [
          "transparent"
        ],
        "port": 123,
        "network": "udp",
        "outboundTag": "direct" 
      },    
      {
        "type": "field", 
        "ip": [ 
          "223.5.5.5",
          "114.114.114.114"
        ],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "ip": [ 
          "8.8.8.8",
          "1.1.1.1"
        ],
        "outboundTag": "proxy"
      },
      {
        "type": "field", 
        "domain": [
          "geosite:category-ads-all"
        ],
        "outboundTag": "block"
      },
      {
        "type": "field",
        "protocol":["bittorrent"], 
        "outboundTag": "direct"
      },
      {
        "type": "field", 
        "ip": [
          "geoip:private",
          "geoip:cn"
        ],
        "outboundTag": "direct"
      },
      {
        "type": "field", 
        "domain": [
          "geosite:cn",
          "xbssr.fun"
        ],
        "outboundTag": "direct"
      }
    ]
  }
}
'''

DEFAULT_SUBSCRIBE = 'dm1lc3M6Ly9leUoySWpvaU1pSXNJbkJ6SWpvaTVibTA2TFM1d3JkV3dyZm52bzdsbTcxRVFjSzM2YXVZNllDZndyYzROY0szVG1WMFpteHBlRWhDVDhLM01UQXdNRTNDdCtlcHV1bVhzaUlzSW1Ga1pDSTZJakUxTkM0eE55NHhNaTQ0TlNJc0luQnZjblFpT2pJeU1UQTNMQ0pwWkNJNklqZzVOR0ZtWmpKa0xUQTNNemN0T1RnNE15MHdPR1k1TFdKbU5UVXhaVEZtWm1abE5DSXNJbUZwWkNJNklqQWlMQ0p1WlhRaU9pSjBZM0FpTENKMGVYQmxJam9pYm05dVpTSjkKdm1lc3M6Ly9leUoySWpvaU1pSXNJbkJ6SWpvaTVibTA2TFM1d3JkV3dyZm52bzdsbTcxRVFjSzM2YXVZNllDZndyYzROc0szVG1WMFpteHBlRWhDVDhLM01UQXdNRTNDdCtlcHV1bVhzaUlzSW1Ga1pDSTZJakUxTkM0eE55NHhNaTQ0TmlJc0luQnZjblFpT2pJeU1UQTNMQ0pwWkNJNklqZzVOR0ZtWmpKa0xUQTNNemN0T1RnNE15MHdPR1k1TFdKbU5UVXhaVEZtWm1abE5DSXNJbUZwWkNJNklqQWlMQ0p1WlhRaU9pSjBZM0FpTENKMGVYQmxJam9pYm05dVpTSjkKdm1lc3M6Ly9leUoySWpvaU1pSXNJbkJ6SWpvaTVibTA2TFM1d3JkV3dyZm52bzdsbTcxSXdyZnBxNWpwZ0ovQ3R6SXdNY0szVG1WMFpteHBlRWgxYkhWSVFrL0N0ekV3TURCTndyZm5xYnJwbDdJaUxDSmhaR1FpT2lJek9DNHhORGN1TVRZMUxqSXdNU0lzSW5CdmNuUWlPakV5TWpjNUxDSnBaQ0k2SWpnNU5HRm1aakprTFRBM016Y3RPVGc0TXkwd09HWTVMV0ptTlRVeFpURm1abVpsTkNJc0ltRnBaQ0k2SWpBaUxDSnVaWFFpT2lKMFkzQWlMQ0owZVhCbElqb2libTl1WlNKOQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmcHBwbm11SzlOd3JmcHE1anBnSi9DdHpnd3dyZE9aWFJtYkdsNFZGWkNWbWwxVkZaSVMxUld3cmN4TURBd1RjSzM1Nm02NlpleUlpd2lZV1JrSWpvaU5UZ3VNVFV6TGpVdU9EQWlMQ0p3YjNKMElqb3lPRFU0T1N3aWFXUWlPaUk0T1RSaFptWXlaQzB3TnpNM0xUazRPRE10TURobU9TMWlaalUxTVdVeFptWm1aVFFpTENKaGFXUWlPaUl3SWl3aWJtVjBJam9pZEdOd0lpd2lkSGx3WlNJNkltNXZibVVpZlE9PQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmcHBwbm11SzlId3JmcHE1anBnSi9DdHpJek1zSzNUbVYwWm14cGVGUldRc0szTVRBd01FM0N0K1dkaCtpaG9TSXNJbUZrWkNJNklqRXdNeTR4TVRNdU1UVTJMakl6TWlJc0luQnZjblFpT2pJM01qRTVMQ0pwWkNJNklqZzVOR0ZtWmpKa0xUQTNNemN0T1RnNE15MHdPR1k1TFdKbU5UVXhaVEZtWm1abE5DSXNJbUZwWkNJNklqQWlMQ0p1WlhRaU9pSjBZM0FpTENKMGVYQmxJam9pYm05dVpTSjkKdm1lc3M6Ly9leUoySWpvaU1pSXNJbkJ6SWpvaTVibTA2TFM1d3JkV3dyZnBwcG5tdUs5SHdyZnBxNWpwZ0ovQ3R6RTNOc0szVG1WMFpteHBlRlJXUXNLM01UQXdNRTNDdCtlcHV1bVhzaUlzSW1Ga1pDSTZJakV3TXk0eE1UTXVNVFUyTGpFM05pSXNJbkJ2Y25RaU9qTTNPRGs1TENKcFpDSTZJamc1TkdGbVpqSmtMVEEzTXpjdE9UZzRNeTB3T0dZNUxXSm1OVFV4WlRGbVptWmxOQ0lzSW1GcFpDSTZJakFpTENKdVpYUWlPaUowWTNBaUxDSjBlWEJsSWpvaWJtOXVaU0o5CnZtZXNzOi8vZXlKMklqb2lNaUlzSW5Ceklqb2k1Ym0wNkxTNXdyZFd3cmZsajdEbXViNU53cmZwcTVqcGdKL0N0ekU0TWNLM1RtVjBabXhwZU9XS3FPZVV1K2VXcjhLM01UQXdNRTNDdCtlcHV1bVhzaUlzSW1Ga1pDSTZJall4TGpJeU15NDRNaTR4T0RFaUxDSndiM0owSWpvek16VXdNQ3dpYVdRaU9pSTRPVFJoWm1ZeVpDMHdOek0zTFRrNE9ETXRNRGhtT1MxaVpqVTFNV1V4Wm1abVpUUWlMQ0poYVdRaU9pSXdJaXdpYm1WMElqb2lkR053SWl3aWRIbHdaU0k2SW01dmJtVWlmUT09CnZtZXNzOi8vZXlKMklqb2lNaUlzSW5Ceklqb2k1Ym0wNkxTNXdyZFd3cmZudm83bG03MVBUTUszNmF1WTZZQ2Z3cmN4TURqQ3R6RXdNREJOd3JmbnFicnBsN0lpTENKaFpHUWlPaUk1TVM0eU1qQXVNakF5TGpFd09DSXNJbkJ2Y25RaU9qTXhOalUyTENKcFpDSTZJamc1TkdGbVpqSmtMVEEzTXpjdE9UZzRNeTB3T0dZNUxXSm1OVFV4WlRGbVptWmxOQ0lzSW1GcFpDSTZJakFpTENKdVpYUWlPaUowWTNBaUxDSjBlWEJsSWpvaWJtOXVaU0o5CnZtZXNzOi8vZXlKMklqb2lNaUlzSW5Ceklqb2k1Ym0wNkxTNXdyZFd3cmZudm83bG03MVBUc0szNmF1WTZZQ2Z3cmN4TmpQQ3R6RXdNREJOd3JmbnFicnBsN0lpTENKaFpHUWlPaUl4T0RVdU1UY3hMakV5TVM0eE5qTWlMQ0p3YjNKMElqb3pPRFU0TXl3aWFXUWlPaUk0T1RSaFptWXlaQzB3TnpNM0xUazRPRE10TURobU9TMWlaalUxTVdVeFptWm1aVFFpTENKaGFXUWlPaUl3SWl3aWJtVjBJam9pZEdOd0lpd2lkSGx3WlNJNkltNXZibVVpZlE9PQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmbnZvN2xtNzFQU3NLMzZhdVk2WUNmd3JjeE16WEN0ekV3TURCTndyZm5xYnJwbDdJaUxDSmhaR1FpT2lJME5TNHhORFF1TWpRd0xqRXpOU0lzSW5CdmNuUWlPakV3T1RneUxDSnBaQ0k2SWpnNU5HRm1aakprTFRBM016Y3RPVGc0TXkwd09HWTVMV0ptTlRVeFpURm1abVpsTkNJc0ltRnBaQ0k2SWpBaUxDSnVaWFFpT2lKMFkzQWlMQ0owZVhCbElqb2libTl1WlNKOQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmbnZvN2xtNzFOd3JmcHE1anBnSi9DdHpFd004SzNOVEF3VGNLMzU2bTY2WmV5SWl3aVlXUmtJam9pTVRBekxqRTVOaTR5TWk0eE1ETWlMQ0p3YjNKMElqbzBNRGsyTnl3aWFXUWlPaUk0T1RSaFptWXlaQzB3TnpNM0xUazRPRE10TURobU9TMWlaalUxTVdVeFptWm1aVFFpTENKaGFXUWlPaUl3SWl3aWJtVjBJam9pZEdOd0lpd2lkSGx3WlNJNkltNXZibVVpZlE9PQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmbnZvN2xtNzFDd3JmcHE1anBnSi9DdHpZMXdyY3hNREF3VGNLMzU2bTY2WmV5SWl3aVlXUmtJam9pTmpjdU1qTXdMakU0T1M0Mk5TSXNJbkJ2Y25RaU9qTTVPRGt6TENKcFpDSTZJamc1TkdGbVpqSmtMVEEzTXpjdE9UZzRNeTB3T0dZNUxXSm1OVFV4WlRGbVptWmxOQ0lzSW1GcFpDSTZJakFpTENKdVpYUWlPaUowWTNBaUxDSjBlWEJsSWpvaWJtOXVaU0o5CnZtZXNzOi8vZXlKMklqb2lNaUlzSW5Ceklqb2k1Ym0wNkxTNXdyZFd3cmZudm83bG03MUhRY0szNmF1WTZZQ2Z3cmMxTU1LM01UQXdNRTNDdCtlcHV1bVhzaUlzSW1Ga1pDSTZJak00TGpFME15NDRMalV3SWl3aWNHOXlkQ0k2TXpFME5ESXNJbWxrSWpvaU9EazBZV1ptTW1RdE1EY3pOeTA1T0RnekxUQTRaamt0WW1ZMU5URmxNV1ptWm1VMElpd2lZV2xrSWpvaU1DSXNJbTVsZENJNkluUmpjQ0lzSW5SNWNHVWlPaUp1YjI1bEluMD0Kdm1lc3M6Ly9leUoySWpvaU1pSXNJbkJ6SWpvaTVibTA2TFM1d3JkV3dyZm52bzdsbTcxV3dyZnBxNWpwZ0ovQ3R6RXlNY0szTVRBd01FM0N0K2VwdXVtWHNpSXNJbUZrWkNJNklqRTBOQzR5TURJdU56Y3VNVEl4SWl3aWNHOXlkQ0k2TWpFd01EQXNJbWxrSWpvaU9EazBZV1ptTW1RdE1EY3pOeTA1T0RnekxUQTRaamt0WW1ZMU5URmxNV1ptWm1VMElpd2lZV2xrSWpvaU1DSXNJbTVsZENJNkluUmpjQ0lzSW5SNWNHVWlPaUp1YjI1bEluMD0Kdm1lc3M6Ly9leUoySWpvaU1pSXNJbkJ6SWpvaTVibTA2TFM1d3JkV3dyZm1sNlhtbkt4UHdyZnBxNWpwZ0ovQ3R6VTJ3cmN4TURBd1RjSzM1Nm02NlpleUlpd2lZV1JrSWpvaU9USXVNVEU0TGpRMUxqVTJJaXdpY0c5eWRDSTZNelUwT1Rjc0ltbGtJam9pT0RrMFlXWm1NbVF0TURjek55MDVPRGd6TFRBNFpqa3RZbVkxTlRGbE1XWm1abVUwSWl3aVlXbGtJam9pTUNJc0ltNWxkQ0k2SW5SamNDSXNJblI1Y0dVaU9pSnViMjVsSW4wPQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmbWw2WG1uS3hQd3JmcHE1anBnSi9DdHpFM05NSzNNVEF3TUUzQ3QrZXB1dW1Yc2lJc0ltRmtaQ0k2SWpRMUxqa3pMakl4Tmk0eE56UWlMQ0p3YjNKMElqb3hORFF5TUN3aWFXUWlPaUk0T1RSaFptWXlaQzB3TnpNM0xUazRPRE10TURobU9TMWlaalUxTVdVeFptWm1aVFFpTENKaGFXUWlPaUl3SWl3aWJtVjBJam9pZEdOd0lpd2lkSGx3WlNJNkltNXZibVVpZlE9PQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmbWw2WG1uS3hQd3JmcHE1anBnSi9DdHpJd01jSzNNVEF3TUUzQ3QrV2RoK2lob1NJc0ltRmtaQ0k2SWpnNUxqTXhMakV5Tmk0eU1ERWlMQ0p3YjNKMElqb3lNRGMwTWl3aWFXUWlPaUk0T1RSaFptWXlaQzB3TnpNM0xUazRPRE10TURobU9TMWlaalUxTVdVeFptWm1aVFFpTENKaGFXUWlPaUl3SWl3aWJtVjBJam9pZEdOd0lpd2lkSGx3WlNJNkltNXZibVVpZlE9PQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmbWw2WG1uS3hQd3JmcHE1anBnSi9DdHpJd044SzNNVEF3TUUzQ3QrZUlodWE3b1NJc0ltRmtaQ0k2SWpnNUxqTXhMakV5Tmk0eU1EY2lMQ0p3YjNKMElqb3hOemt6TlN3aWFXUWlPaUk0T1RSaFptWXlaQzB3TnpNM0xUazRPRE10TURobU9TMWlaalUxTVdVeFptWm1aVFFpTENKaGFXUWlPaUl3SWl3aWJtVjBJam9pZEdOd0lpd2lkSGx3WlNJNkltNXZibVVpZlE9PQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmbWxyRGxpcURsbmFGUHdyZnBxNWpwZ0ovQ3R6RXhNc0szTVRBd01FM0N0K2VwdXVtWHNpSXNJbUZrWkNJNklqUTFMalkzTGpVMExqRXhNaUlzSW5CdmNuUWlPalEzTURJeUxDSnBaQ0k2SWpnNU5HRm1aakprTFRBM016Y3RPVGc0TXkwd09HWTVMV0ptTlRVeFpURm1abVpsTkNJc0ltRnBaQ0k2SWpBaUxDSnVaWFFpT2lKMFkzQWlMQ0owZVhCbElqb2libTl1WlNKOQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmbnZvN2xtNzFJd3JmbGpwL25sSi9DdHpJek1zSzNNVEF3TUUzQ3QrZXB1dW1Yc2lJc0ltRmtaQ0k2SWpZMExqY3hMakUwTWk0eU16SWlMQ0p3YjNKMElqb3lOVGc0TUN3aWFXUWlPaUk0T1RSaFptWXlaQzB3TnpNM0xUazRPRE10TURobU9TMWlaalUxTVdVeFptWm1aVFFpTENKaGFXUWlPaUl3SWl3aWJtVjBJam9pZEdOd0lpd2lkSGx3WlNJNkltNXZibVVpZlE9PQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmbWw2WG1uS3hEd3JmbGpwL25sSi9DdHpJeU5zSzNNakF3VGNLMzU2bTY2WmV5SWl3aVlXUmtJam9pTVRFNExqSTNMakl3TGpJeU5pSXNJbkJ2Y25RaU9qTXlOakUyTENKcFpDSTZJamc1TkdGbVpqSmtMVEEzTXpjdE9UZzRNeTB3T0dZNUxXSm1OVFV4WlRGbVptWmxOQ0lzSW1GcFpDSTZJakFpTENKdVpYUWlPaUowWTNBaUxDSjBlWEJsSWpvaWJtOXVaU0o5CnZtZXNzOi8vZXlKMklqb2lNaUlzSW5Ceklqb2k1Ym0wNkxTNXdyZFd3cmZtbDZYbW5LeER3cmZsanAvbmxKL0N0elExd3JjeU1EQk53cmZucWJycGw3SWlMQ0poWkdRaU9pSXhNVGd1TWpjdU1UY3VORFVpTENKd2IzSjBJam95TkRnME1pd2lhV1FpT2lJNE9UUmhabVl5WkMwd056TTNMVGs0T0RNdE1EaG1PUzFpWmpVMU1XVXhabVptWlRRaUxDSmhhV1FpT2lJd0lpd2libVYwSWpvaWRHTndJaXdpZEhsd1pTSTZJbTV2Ym1VaWZRPT0Kdm1lc3M6Ly9leUoySWpvaU1pSXNJbkJ6SWpvaTVibTA2TFM1d3JkV3dyZm1sNlhtbkt4RHdyZmxqcC9ubEovQ3R6RTJNY0szTWpBd1RjSzM1Nm02NlpleUlpd2lZV1JrSWpvaU1URTRMakkzTGpRdU1UWXhJaXdpY0c5eWRDSTZOakV5TVRBc0ltbGtJam9pT0RrMFlXWm1NbVF0TURjek55MDVPRGd6TFRBNFpqa3RZbVkxTlRGbE1XWm1abVUwSWl3aVlXbGtJam9pTUNJc0ltNWxkQ0k2SW5SamNDSXNJblI1Y0dVaU9pSnViMjVsSW4wPQp2bWVzczovL2V5SjJJam9pTWlJc0luQnpJam9pNWJtMDZMUzV3cmRXd3JmbXM2TGxoYkJIVE1LM01qWEN0ekl3TUUzQ3QrZXB1dW1Yc2lJc0ltRmtaQ0k2SWpVdU1UZzRMakV3T0M0eU5TSXNJbkJ2Y25RaU9qRTROelF4TENKcFpDSTZJamc1TkdGbVpqSmtMVEEzTXpjdE9UZzRNeTB3T0dZNUxXSm1OVFV4WlRGbVptWmxOQ0lzSW1GcFpDSTZJakFpTENKdVpYUWlPaUowWTNBaUxDSjBlWEJsSWpvaWJtOXVaU0o5CnZtZXNzOi8vZXlKMklqb2lNaUlzSW5Ceklqb2k1WXlGNXB5SXdyZFd3cmZtbDZYbW5LeFB3cmN5Tk1LM01UQXdNRTNDdCtlcHV1bVhzaUlzSW1Ga1pDSTZJamc1TGpNeExqRXlOaTR5TkNJc0luQnZjblFpT2pNd01UYzJMQ0pwWkNJNklqZzVOR0ZtWmpKa0xUQTNNemN0T1RnNE15MHdPR1k1TFdKbU5UVXhaVEZtWm1abE5DSXNJbUZwWkNJNklqQWlMQ0p1WlhRaU9pSjBZM0FpTENKMGVYQmxJam9pYm05dVpTSjkKdm1lc3M6Ly9leUoySWpvaU1pSXNJbkJ6SWpvaTVZeUY1cHlJd3JkV3dyZm52bzdsbTcxUFRNSzNPREhDdHpFd01EQk53cmZucWJycGw3SWlMQ0poWkdRaU9pSTBOUzR4TkRZdU1USXlMamd4SWl3aWNHOXlkQ0k2TkRrek5qRXNJbWxrSWpvaU9EazBZV1ptTW1RdE1EY3pOeTA1T0RnekxUQTRaamt0WW1ZMU5URmxNV1ptWm1VMElpd2lZV2xrSWpvaU1DSXNJbTVsZENJNkluUmpjQ0lzSW5SNWNHVWlPaUp1YjI1bEluMD0Kdm1lc3M6Ly9leUoySWpvaU1pSXNJbkJ6SWpvaTVZV042TFM1d3JkV3dyZm1sNlhtbkt4UHdyY3hNVFBDdHpFd01EQk53cmZuaUlibXU2RWlMQ0poWkdRaU9pSTBOUzQyTnk0MU15NHhNVE1pTENKd2IzSjBJam94TkRjeU1Td2lhV1FpT2lJNE9UUmhabVl5WkMwd056TTNMVGs0T0RNdE1EaG1PUzFpWmpVMU1XVXhabVptWlRRaUxDSmhhV1FpT2lJd0lpd2libVYwSWpvaWRHTndJaXdpZEhsd1pTSTZJbTV2Ym1VaWZRPT0Kdm1lc3M6Ly9leUoySWpvaU1pSXNJbkJ6SWpvaTVZV042TFM1d3JkV3dyZm52bzdsbTcxUFRzSzNORFhDdHpFd01EQk53cmZuaUlibXU2RWlMQ0poWkdRaU9pSXhORGN1TnpndU1UVXVORFVpTENKd2IzSjBJam96T0RZNU1Td2lhV1FpT2lJNE9UUmhabVl5WkMwd056TTNMVGs0T0RNdE1EaG1PUzFpWmpVMU1XVXhabVptWlRRaUxDSmhhV1FpT2lJd0lpd2libVYwSWpvaWRHTndJaXdpZEhsd1pTSTZJbTV2Ym1VaWZRPT0Kc3NyOi8vYkRJNk1UcHZjbWxuYVc0NlkyaGhZMmhoTWpBNmNHeGhhVzQ2WWtSSkx6OXlaVzFoY210elBVeFRNSFJNVXpCMFRGTXdkRXhUTUhSTVV6QjBURk13ZEV4VE1IUk1VekIwVEZNd2RFeFJKbWR5YjNWd1BUWkxWMTgyV1U5dk5VeHBWelUxVjAxV2JFSlAKc3NyOi8vZG1sd09qRTZiM0pwWjJsdU9tTm9ZV05vWVRJd09uQnNZV2x1T21SdGJIY3ZQM0psYldGeWEzTTlOVmx0Y0RWTU1scFBhVUY0VFZSVk5EVmhVM0JQVDFkM2FpMWhXSFJxV0d4cFNXSndhM0E0WjBsRFFXZEpRMEZuU1VOQlowbERRV2RKUVNabmNtOTFjRDAyUzFkZk5sbFBielZNYVZjMU5WZE5WbXhDVHcKc3NyOi8vTVdJMk1Ub3hPbTl5YVdkcGJqcGphR0ZqYUdFeU1EcHdiR0ZwYmpwTlYwa3lUVkV2UDNKbGJXRnlhM005TldFMldUVTNNbEpQYVVKdlpFaFNkMk42YjNaTU0yaHBZekp2TWsxVVVUUk1ibWcxWldrNEptZHliM1Z3UFRaTFYxODJXVTl2TlV4cFZ6VTFWMDFXYkVKUA'

logger = logging.getLogger()
logger.setLevel(level = logging.INFO)
formatter = colorlog.ColoredFormatter('%(log_color)s%(asctime)s [%(levelname)s] %(message)s')
# when设置为: 周(W),天(D),时(H),分(M),秒(S) MIDNIGHT代表0点就新建日志 代表多久分割一个文件
# backupCount: 代表备份的日志个数
th = handlers.TimedRotatingFileHandler(filename=LOG_FILE, when='MIDNIGHT', backupCount=3, encoding='utf-8')
sh = logging.StreamHandler()
th.setFormatter(formatter)
sh.setFormatter(formatter)
logger.addHandler(th)
logger.addHandler(sh)

debug = logging.debug
info = logging.info
warning = logging.warning
error = logging.error


def decode_base64(data):
    missing_padding = 4-len(data)%4
    if missing_padding:
        data += '='*missing_padding
    return base64.b64decode(data)

def get_port():
    pscmd = "netstat -ntl |grep -v Active| grep -v Proto|awk '{print $4}'|awk -F: '{print $NF}'"
    procs = os.popen(pscmd).read()
    procarr = procs.split("\n")
    tt= random.randint(15000,20000)
    if tt not in procarr:
        return tt
    else:
        get_port()

def compute_factor(perfect, latency):
    return perfect*PERFECT_FACTOR + latency*LATENCY_FACTOR

def get_latency(port):
    headers = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36'}
    proxies = {}
    if port != 0:
      proxies['http'] = 'socks5h://127.0.0.1:{}'.format(port)
      proxies['https'] = 'socks5h://127.0.0.1:{}'.format(port)

    start_time = time.time()
    s = requests.Session()
    try:
        s.mount(TEST_CONNECT_URL, HTTPAdapter(max_retries=0))
        r = s.get(TEST_CONNECT_URL, proxies=proxies, headers=headers, verify=True, timeout=(TEST_CONNECT_TIMEOUT,TEST_READ_TIMEOUT), allow_redirects=False, cookies={'':''})
        r.raise_for_status()
        connectivity = True
    except Exception as err:
        warning('test connect error port:{}, message:{}'.format(port, err))
        connectivity = False
    end_time = time.time()
    
    latency_time = end_time - start_time
    return latency_time, connectivity


# 总共测试TEST_CONNECT_TIMES次, perfect是连接失败的次数, latency是平均延迟
def test_connect(port):
    perfect = TEST_CONNECT_TIMES
    sum_r = 0
    for i in range(TEST_CONNECT_TIMES):
        time.sleep(0.1)
        r, p = get_latency(port)
        if p is True:
            sum_r += r
            perfect -= 1
            info('test connect port:{}, latency_time:{}'.format(port, r))
    if perfect != TEST_CONNECT_TIMES:
        times = TEST_CONNECT_TIMES - int(perfect)
        s = sum_r / times
        latency = float(format(s, '0.2f'))
    else:
        latency = 0
    return perfect, latency


# 从订阅地址读取信息,返回主机列表
def get_subscribe():
    info('start getting subscription')
    for i in range(SUBSCRIBE_RETRY_MAX):
        try:
            response = requests.get(SUBSCRIBE_URL, timeout=SUBSCRIBE_TIMEOUT)
            info('get subscription successfully')
            return response.text
        except Exception as err:
            error('get subscription failed, error message:{}'.format(err))
            if i == SUBSCRIBE_RETRY_MAX-1:
                error('reach the maximum number of subscription retries')
                return False

# 处理从网络上获取的订阅信息
def parse_subscribe(text):
    try:
        base64_server_list = str(decode_base64(text), encoding='utf8').split('\n')
        server_list = []
        for server in base64_server_list:
            protocol, server_info = server.split('://')
            if protocol == 'vmess':
                server_info = json.loads(str(decode_base64(server_info), encoding='utf8'))
                if server_info.get('add') and server_info.get('port') and server_info.get('id') and server_info.get('aid') and server_info.get('ps'):
                    real_server_info = {'ps':server_info['ps'],'address':server_info['add'],'port':server_info['port'],'users':[{'id':server_info['id'], 'alterId':int(server_info['aid'])}]}
                    server_list.append(real_server_info)
    except Exception as err:
        error('parse subscription failure')
        return False
    info('parse subscription successfully')
    return server_list

# 输入服务器信息,生成一个配置文件
def generate_config_file(server):
    tmp_name = uuid.uuid4().hex+'.json'
    port = get_port()
    tmp_json = json.loads(TMP_CONFIG_FILE)
    tmp_json['outbounds'][0]['settings']['vnext'].append(server)
    tmp_json['inbounds'][0]['port'] = port
    with open(tmp_name, 'w') as f:
        f.write(json.dumps(tmp_json, ensure_ascii=False, indent=2))
    info('generate config file, tmp_name:{}, address:{}, port:{}, server name:{}'.format(tmp_name, server['address'], port, server['ps']))
    return tmp_name, port


def run_v2ray(server):
    tmp_name, port = generate_config_file(server)
    info('run v2ray, tmp_name:{}, port:{}'.format(tmp_name, port))
    cmd = [V2RAY_PATH, '-config', tmp_name]
    try:
        p = subprocess.Popen(cmd, shell=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.DEVNULL)
        time.sleep(0.8)
        perfect, latency = test_connect(port)
        p.kill()
        os.remove(tmp_name)
    except:
        raise
    info('test connection finished, address:{}, port:{}, server name:{}, perfect:{}, latency:{}'.format(server['address'], server['port'], server['ps'], perfect, latency))
    return server, perfect, latency


def write_best_server(best_server):
    final_json = json.loads(FINAL_CONFIG_FILE)
    final_json['outbounds'][0]['settings']['vnext'].append(best_server)
    with open(V2RAY_CONIG_FILE, 'w') as f:
        f.write(json.dumps(final_json, ensure_ascii=False, indent=2))

def restart_v2ray():
    subprocess.Popen(['sudo', 'systemctl', 'restart', 'v2ray'], shell=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.DEVNULL)
    
def reset_v2ray(server_list):
    proc = multiprocessing.Pool(MAX_SERVER)
    proc_result = []
    for server in server_list:
        r = proc.apply_async(run_v2ray, args=(server,))
        proc_result.append(r)
    proc.close()
    proc.join()

    server_factor_list = []
    for r in proc_result:
        server, perfect, latency = r.get()
        factor = compute_factor(perfect, latency)
        server_factor_list.append([server, factor])
    server_factor_sorted_list = sorted(server_factor_list, key=lambda s:s[1])
    server_sorted_list = list(map(lambda s:s[0], server_factor_sorted_list))
    best_server = server_sorted_list[0]
    info('find best server, best factor:{}, best_server:{}'.format(server_factor_sorted_list[0][1], best_server))
    write_best_server(best_server)
    restart_v2ray()


def main():
    server_list = []
    last_get_subscribe = 0
    while(True):
        info('start testing current connection')
        latency_time, connectivity = get_latency(0)
        if connectivity and latency_time < CHECK_LIMIT:
            info('connectivity is true, latency_time:{}, wait TIME_INTERVAL({}) seconds'.format(latency_time, TIME_INTERVAL))
            time.sleep(TIME_INTERVAL)
            continue
        warning('connectivity is false, start testing current server')
        perfect, latency = test_connect(0)
        factor = compute_factor(perfect, latency)
        info('factor: {}'.format(factor))
        if factor > RESET_FACTOR_LIMIT:
            warning('factor is bigger than RESET_FACTOR_LIMIT({}), start finding a best server and reseting v2ray'.format(RESET_FACTOR_LIMIT))
            if time.time() - last_get_subscribe > SUBSCRIBE_CACHE_TIME:
                server_info = get_subscribe()
                if server_info:
                    last_get_subscribe = time.time()
                elif last_get_subscribe == 0:
                    server_info = DEFAULT_SUBSCRIBE
                    warning('get subscription failed, try to use default subprocess')
                if server_info:
                    tmp_server_list = parse_subscribe(server_info)
                    if tmp_server_list:
                        server_list = tmp_server_list
            if len(server_list) != 0:
                reset_v2ray(server_list)
                info('set new best server successfully, start waiting for new round, wait TIME_INTERVAL({}) seconds'.format(TIME_INTERVAL))
            else:
                error('no server available, start waiting for new round, wait TIME_INTERVAL({}) seconds'.format(TIME_INTERVAL))
        else:
            info('factor is less than or equal to RESET_FACTOR_LIMIT({}), wait TIME_INTERVAL({}) seconds'.format(RESET_FACTOR_LIMIT, TIME_INTERVAL))
        time.sleep(TIME_INTERVAL)


main()
```

##### 使用systemd配置开机启动

1. 创建`/lib/systemd/system/v2ray_auto_change.service`文件
```sh
sudo vim /lib/systemd/system/v2ray_auto_change.service
```
写入
```
[Unit]
Description=V2ray Auto Change Service
After=multi-user.target
Conflicts=getty@tty1.service

[Service]
Type=simple
ExecStart=/usr/bin/python3 /usr/bin/v2ray_auto_change
StandardInput=tty-force

[Install]
WantedBy=multi-user.target
```
2. 重新加载`systemctl daemon`,`.service`文件每次修改后都要重新加载
```sh
sudo systemctl daemon-reload
```

3. 启动v2ray_auto_change
```sh
sudo systemctl enable v2ray_auto_change.service
sudo systemctl start v2ray_auto_change.service
```

## 一键配置系统脚本

首先在本地克隆自动配置项目
```sh
git clone git@github.com:Evolution404/pi_autoconfig.git
```
将整个项目文件夹复制到树莓派里
执行项目里的config.sh开始一键配置,后面需要传入pi用户的新密码和smb服务器的密码
```sh
cd pi_autoconfig
sudo bash config.sh pi_pw smb_pw
```
