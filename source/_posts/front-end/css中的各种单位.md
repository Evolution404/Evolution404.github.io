title: css中的各种单位
date: 2018-08-01 19:57
tags:
- 语法
- css
categories:
- 前端
---

## px, em, rem的区别

px: 直接是像素
em: 相对于父元素字号的比例
rem: 相对于根元素的字号比例
> 应该尽可能的多用`em,rem`的写法,这样能够做到缩放不失真

### line-height中各表示的区别

1. px  直接计算像素值
2. %  转换到像素值
3. em 转换到像素值
4. 数值 继承后再进行计算


## vw, vh, vmin, vmax

>vw、vh、vmin和vmax是CSS3中的新单位，是一种视窗单位，也是相对单位。它们的大小都是由视窗大小来决定的，单位1，代表类似于1%

* vw：视窗宽度的百分比 
* vh：视窗高度的百分比 
* vmin：当前较小的vw和vh 
* vmax：当前较大的vw和vh
