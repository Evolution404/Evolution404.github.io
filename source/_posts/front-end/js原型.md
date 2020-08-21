---
title: js原型
date: 2019-05-18 22:39:46
tags:
- javascript
categories:
- 前端
---

## 示例代码
```js
function Foo(){}
let f1 = new Foo()
```

## 原型图
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190518223924.jpg)

## 对象的分类
1. 普通对象
2. 函数对象
  所有的函数类型
3. prototype对象
  由函数对象的`prototype`属性指向的对象
  原型链就是一条由prototype对象组成的链表, 头节点是`Object.prototype`
  prototype对象的`__proto__`属性用来连接上一级原型
  prototype对象的`constructor`属性用来表示该原型的构造函数

## 三种属性解释
总共有三种属性 `prototype`,`__proto__`,`constructor`

**所有的对象都有`__proto__`和`constructor`**
**只有构造函数有`prototype`**

**prototype**
这是函数对象的独有属性, 它指向本身的prototype对象

**__proto__**
这是所有对象都有的属性, 用来指向它自己原型的prototype对象

**constructor**
所有对象都有的属性, 以下是关于`constructor`的解释
`constructor`和`prototype`一样也构成一个链, 这个链的终点是`Function`, `Function`的`constructor`也是`Function`
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190520194906.png)


## 对Object对象的分析
显然Object是一个函数所以是函数对象,拥有上述三个属性, 对这三个属性分别进行分析

**prototype**
指向`Object`的prototype对象

**__proto__**
指向Object的原型的prototype对象,Object是一个函数所以它的原型是`Function`
所以`__proto__`指向`Function.prototype`

**constructor**
指向Object的原型方法显然就是`Function`
