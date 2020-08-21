---
title: js基础
date: 2018-08-18 18:16:25
tags:
- 语法
- javascript
categories:
- 前端
---

### console的用法

```javascript
let name = {
    name: 'zyx',
    sex: 'man',
}
console.log(name)
console.table(name)
console.dir(name)
```

![](http://evolution404.gitee.io/markdownimg/006tNbRwly1fue4620bdxj30dy07gjrb.jpg)

### null undefined
> null表示空,undefined表示一种更深层次的空(未定义)

```javascript
console.log(typeof null) // object
console.log(typeof undefined) //undefined
console.log(typeof []) // object
console.log(typeof '') // string
console.log(null == undefined) // true
console.log(null === undefined) // false
```

### 全局对象

当JavaScript解释器启动时,它将创建一个新的全局对象,并给它一组定义的初始属性
* 全局属性: undefined, infinity, NaN
* 全局函数: isNan(), parseInt(), eval()
* 构造函数: Date(), RegExp(), String(), Object(), Array(*)
* 全局对象: Math, JSON

### 包装对象

```javascript
let s = 'hello'
let ss = new String(s)
s.len = 5
ss.len = 5
console.log(s.len) // undefined
console.log(ss.len) // 5
```

> 在对s.len赋值的时候创建了一个临时对象,并对临时对象进行了操作,下一步临时对象随即销毁
> 在对ss.len赋值时又有ss已经是对象,所以属性被确定下来

**字符串,数字,布尔都是一样的道理**
