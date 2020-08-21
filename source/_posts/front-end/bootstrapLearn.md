---
title: bootstrapLearn
date: 2018-07-21 21:15:36
tags:
- bootstrap
categories:
- 前端
---

## 基础知识

### 必备meta标签

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```
在移动设备浏览器上，通过为视口（viewport）设置 meta 属性为 user-scalable=no 可以禁用其缩放（zooming）功能。这样禁用缩放功能后，用户只能滚动屏幕，就能让你的网站看上去更像原生应用的感觉。注意，这种方式我们并不推荐所有网站使用，还是要看你自己的情况而定！

### html文档类型

```html
<!DOCTYPE html>
```
设置文档类型为html5

## 全局css样式

### 容器,container
可以自动调整元素大小,最常用的包含组件

### 栅格系统

#### 基础使用
建议使用`col-md-*`

共有`col-xs col-sm col-md col-lg`
从左向右元素换行所需要的屏幕宽度越大,其中`col-xs`代表不换行

#### 偏移
> 使用`col-md-offset-*`使得元素中间进行偏移

```html
<div class="container">
    <div class="row">
        <div class="col-md-4">
            <div class="color">

            </div>
        </div>
        <div class="col-md-4 col-md-offset-4">
            <div class="color">

            </div>
        </div>
    </div>
</div>
```

> pull-left pull-right

右浮动,左浮动
控制元素靠左还是靠右


### 排版

1. 标题
2. 段落
3. mark标记
4. del删除线
5. s删除线
6. ins下划线
7. 文本对齐
    * text-left
    * text-right
    * text-center

8. 表格
    * table
    * table-striped
    * table-bordered
    * table-hover
    * 颜色 info success active warning danger

### 按钮

#### 常用class
```html
<button class="btn btn-default">按钮</button>
<button class="btn btn-primary">按钮</button>
<button class="btn btn-success">按钮</button>
<button class="btn btn-info">按钮</button>
<button class="btn btn-warning">按钮</button>
<button class="btn btn-danger">按钮</button>
<button class="btn btn-link">按钮</button>
```

七种样式的按钮
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1ftj0d5fk8vj30nq03q3yw.jpg)

使用 `.btn-lg`、`.btn-sm` 或 `.btn-xs` 就可以获得不同尺寸的按钮。

`.btn-block` 使得button变成块级标签,**独占一行**

disabled 禁用标签---注意这是添加**属性**不是添加class

```html
<button class="btn btn-default" disabled>按钮</button>
```

#### 可以使用按钮属性的标签

* button
* a
* input

### 图片

```html
<img src="..." alt="..." class="img-rounded">
<img src="..." alt="..." class="img-circle">
<img src="..." alt="..." class="img-thumbnail">
```
三种图片的样式

### 辅助类
#### 文本颜色
字体颜色
```html
<p class="text-muted">hello world</p>
<p class="text-primary">hello world</p>
<p class="text-success">hello world</p>
<p class="text-info">hello world</p>
<p class="text-warning">hello world</p>
<p class="text-danger">hello world</p>
```
背景颜色, 注意没有`bg-muted`
```html
<p class="bg-primary">hello world</p>
<p class="bg-success">hello world</p>
<p class="bg-info">hello world</p>
<p class="bg-warning">hello world</p>
<p class="bg-danger">hello world</p>
```

#### 小组件
关闭按钮,更多

> 元素居中 使用`center-block`

显示`show` 隐藏`hide`

### 响应式工具
### 表单
#### 基本样式
```html
<form action="" method="get" accept-charset="utf-8">
    <div class="form-group">
        <label for>用户名:</label>
        <input class="form-control" type="text">
    </div>
    <div class="form-group">
        <label for>密码:</label>
        <input class="form-control" type="text">
    </div>
</form>
```

form下方使用`form-group` 里面有一个`lable`以及一个输入框


## 组件
### 下拉菜单

```html
<div class="dropdown">
    <button class="btn btn-primary" data-toggle='dropdown'>更多<span class="caret"></span></button>
    <ul class="dropdown-menu">
        <li><a href="#">good</a></li>
        <li><a href="#">good</a></li>
        <li><a href="#">good</a></li>
        <li><a href="#">good</a></li>
        <li><a href="#">good</a></li>
    </ul>
</div>
```

1. 外部包有`.dropdown`
2. 内部`button` 有 `data-toggle` 属性
3. 下方`ul>li` 有`dropdown-meun` 的类


### 按钮组
```html
<div class="btn-group">
    <button class="btn btn-primary">good</button>
    <button class="btn btn-primary">good</button>
    <button class="btn btn-primary">good</button>
    <button class="btn btn-primary">good</button>
</div>
```
#### 按钮工具箱
```html
<div class="btn-toolbar">
    <div class="btn-group">
        <button class="btn btn-primary">good</button>
        <button class="btn btn-primary">good</button>
        <button class="btn btn-primary">good</button>
        <button class="btn btn-primary">good</button>
    </div>
</div>
```


### 导航

```html
<ul class="nav nav-tabs">
    <li class='active'><a href="#">good</a></li>
    <li><a class="" href="#">good</a></li>
    <li><a class="" href="#">good</a></li>
    <li><a class="" href="#">good</a></li>
</ul>
```
```javascript
$('li').mouseenter(function() {
    $("li").removeClass("active");
    $(this).addClass("active");
})
```
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1ftk2mgihdeg30r006yad6.gif)

导航条顶部的效果

### 导航条

> 三个部分: 左侧,中部,右侧 中部可以作为合并区
