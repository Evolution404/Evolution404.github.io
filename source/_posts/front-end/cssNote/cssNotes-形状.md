---
title: cssNotes-形状
date: 2018-08-01 19:18:11
tags:
- css
categories:
- 前端
---

## 自适应的椭圆


### 普通的椭圆
* `border-radius` 属性接受两个属性值来确定圆角的两个半径
* 创建一个自适应的椭圆需要`border-radius`属性的两个值为50%,可以简写成一个50%

```css
div{
    background-color: #fb3;
    width: 500px;
    height: 300px;
    border-radius: 50%;
}
```

### 半椭圆

#### 前提知识

border-radius分别制定一到四个值制定的角
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftv3nijod6j30n40bq75b.jpg)


#### 具体步骤


指定上方两点水平方向半径为一般,竖直方向为100%
下方两点指定为0,因为只要有一个方向为0,另一方向数值便不再生效
```css
div{
    background-color: #fb3;
    width: 500px;
    height: 300px;
    border-radius: 50% / 100% 100% 0 0;
}
```

同样的另一个方向的椭圆可以这么写

```css
div{
    border-radius: 100% 0 0 100% / 50%;
}
```

四分之一椭圆
```css
div{
    border-radius: 100% 0 0 0;
}
```

## 平行四边形

```css
div{
    margin: 100px 200px;
    width:200px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    position: relative;
}

div::before{
    content: '';
    position: absolute;
    top: 0; bottom: 0; left: 0; right: 0;
    background-color: lightblue;
    transform: skewX(-45deg);
    z-index: -1;
}
```
这个技巧的关键在于，我们利用伪元素以及定位属性产生了一个方块， 
然后对伪元素设置样式，并将其放置在其宿主元素的下层。
这种思路同样可以运用在其他场景中，从而得到各种各样的效果。


## 菱形

### 针对正方形的图片

```css
div{
    margin: 100px;
    transform: rotate(45deg);
    overflow: hidden;
    width: 200px;
}

div>img{
    transform: rotate(-45deg) scale(1.42);
    max-width:100%;
}
```
原理:
    外侧旋转45度内侧再旋转-45度
    由于max-width为100%所以设置的是div宽度,然而真正菱形必须让根2宽度
    所以这样会生成八角形, 解决方法使用scale扩大1.42倍

### 裁切路径方案

```css
img {
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
    transition: 1s clip-path;
}

img:hover {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
```
`clip-path` 里面参数就是各个点,最终结果就是将各个点连接起来

