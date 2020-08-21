---
title: Leaderf文件搜索bug的调试
date: 2018-10-27 09:51:58
tags:
- 经验
- 技巧
categories:
- vim
---

## 问题详情

直接从application中启动vim与从终端中启动vim显示结果不一致

从application中启动vim leaderf不能正确显示文件列表

## 源码分析

经过层层分析找到`asyncExecutor.py`文件中通过`subprocess.Popen(cmd)`来执行shell命令

这个命令执行结果在大多数命令是一致的, 但是如果是`ag`命令查找文件不会返回结果

最终解决方案 `brew uninstall ag`, 这里究竟为什么直接启动application执行ag命令不返回结果还没有结论

## 经验总结

1. 善于利用CtrlSF
2. 通过频繁进行`print`来进行排错
3. 有机会可以继续掌握插件的编写技巧
4. 最终并没有得到问题的答案, 只是用插件本身的功能替换成了`find`命令
