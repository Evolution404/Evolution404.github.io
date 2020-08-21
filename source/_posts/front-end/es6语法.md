---
title: es6语法
date: 2018-07-30 10:51:47
tags:
- 语法
- javascript
categories:
- 前端
---

### 解构赋值

#### 默认值

```javascript
let [a, b, c = 3] = [1, 2]
console.log(a, b, c)
```
#### 变量交换
```javascript
let [a, b, c = 3] = [1, 2];
[b, c, a] = [a, b, c]
console.log(a, b, c)
```
> 这种写法已经非常类似于Python, **注意由于第二句方括号开头,前一句必须加分号**

#### 对象的解构
```javascript
let { partTwo, partOne, } = { 'partOne': '1', 'partTwo': '2', }
console.log(partOne, partTwo)
```
> 从上可以看出解构的结果是根据变量名对应键名来进行赋值

### 字符串操作
#### 字符串模板
```javascript
let title1 = 'a'
let title2 = 'b'

console.log(`title1:${title1},title2:${title2}`)
```
必须使用反引号包起来

#### 字符串补白
可以用来处理时间和日期

```javascript
console.log('1'.padStart(2, '0'))
```
使长度不足2的字符串前面补0

### 数组操作
#### find 与 filter
```javascript
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(arr.find(item => item > 3)) // 4
console.log(arr.findIndex(item => item > 3)) // 3
console.log(arr.filter(item => item > 3)) // [4, 5, 6, 7, 8, 9]
```

#### includes
> 特点: 可以进行NaN的检测

```javascript
console.log(arr.indludes(NaN))
```
NaN不能进行相等比较但是如果数组中存在NaN将会返回true


### 对象的写法

```
es5: {add:add,sub:sub}
es6: {add,sub}
```

当对象属性名称和变量同名时可以这么写


### 对象的方法写法
```
es5: {add:function(){},sub:function(){}}
es6: {add(){},sub(){}}
```

### 导出的形式

```
es5:
    modules.exports = function(){}
    exports.add = function(){}
es6:
    export default{
        add(){}
    }

    export function() add(){}
```

#### es6 模块导出
导出写法
```javascript
export default{
    add, substract
}
```

导入写法
```javascript
import calc from './calc.js'
```

使用方法
```javascript
calc.add()
calc.substract()
```

#### es6 按需导出

导出写法
```javascript
export function add (x,y){
    console.log(x+y);
}

export function substract (x,y){
    console.log(x-y);
}
```
导入写法
```javascript
import {add,substract} from './calc.js'
```

### 箭头函数

常规写法
```javascript
[2,1,3].sort(function(x,y){return y-x;});
```
箭头函数写法
```javascript
[2,1,3].sort((x,y)=>{return y-x;})
```

### 字符串相关

#### startsWith 以及 endsWith
这两个函数用于检查字符串首尾是否是指定的值
```javascript
let str = 'hello'
console.log(str.startsWith('h'))
console.log(str.endsWith('o'))
```

输出`true true`

#### 字符串模板
```javascript
let title = '标题'
let content = '内容'
let str = `<div>
            <h1>${title}</h1>
            <p>${content}</p>
          </div>`
console.log(str)
```

使用`${param}` 插入一个变量

### es6面向对象

#### 构造函数以及类方法的写法
```javascript
class User {
    constructor(name, pass) {
        this.name = name
        this.pass = pass
    }
    showName() {
        console.log(this.name)
    }
    showPass() {
        console.log(this.pass)
    }
}

let user = new User('zyx', '666')
user.showName()
user.showPass()
```
`constructor` 构造器,就是构造函数
类的方法直接写入类中即可

#### 继承

```javascript
class VipUser extends User {
    constructor(name, pass, level) {
        super(name, pass)
        this.level = level
    }
    showLevel() {
        console.log(this.level)
    }
}

let vu = new VipUser('zyx', '666', 12)
vu.showName()
vu.showPass()
vu.showLevel()
```

### promise

### generator

