---
title: js监听对象改变
date: 2018-09-03 21:57:27
tags:
- 源码分析
categories:
- 前端
---

### 源码
```javascript
const OP = Object.prototype
/*
 *  需要重写的数组方法 OAR 是 overrideArrayMethod 的缩写
 */
const OAM = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

class Observe {
    constructor(obj, callback) {
        if (OP.toString.call(obj) !== '[object Object]') {
            console.error('This parameter must be an object：' + obj)
        }
        this.callback = callback
        this.observe(obj)
    }
    observe(obj, path) {
        if (OP.toString.call(obj) === '[object Array]') {
            this.overrideArrayProto(obj, path)
        }

        let self = this
        Object.keys(obj).forEach((key, index, array) => {
            let oldVal = obj[key]
            let pathArray = path && path.slice(0)
            if (pathArray) {
                pathArray.push(key)
            } else {
                pathArray = [key]
            }

            Object.defineProperty(obj, key, {
                get: function() {
                    return oldVal
                },
                set: function(newVal) {
                    if (newVal !== oldVal) {
                        if (OP.toString.call(newVal) === '[object Object]' || OP.toString.call(newVal) === '[object Array]') {
                            self.observe(newVal, pathArray)
                        }
                        self.callback(newVal, oldVal, pathArray)
                        oldVal = newVal
                    }
                },
            })
            if (OP.toString.call(oldVal) === '[object Object]' || OP.toString.call(oldVal) === '[object Array]') {
                this.observe(oldVal, pathArray)
            }
        })
    }
    overrideArrayProto(array, path) {
        // 保存原始 Array 原型
        let originalProto = Array.prototype
        let overrideProto = Object.create(Array.prototype)
        let self = this
        let result
        Object.keys(OAM).forEach(function(key, index, array) {
            let method = OAM[index]
            let oldArray = []
            // 使用 Object.defineProperty 给 overrideProto 添加属性，属性的名称是对应的数组函数名，值是函数
            Object.defineProperty(overrideProto, method, {
                value: function() {
                    oldArray = this.slice(0)
                    var arg = [].slice.apply(arguments)
                    result = originalProto[method].apply(this, arg)
                    self.observe(this, path)
                    self.callback(this, oldArray, path)
                    return result
                },
                writable: true,
                enumerable: false,
                configurable: true,
            })
        }, this)
        array.__proto__ = overrideProto
    }
}

function callback(newVal, oldVal, path) {
    console.log(`${newVal}------${oldVal}`)
    console.log('path:' + path)
}

let test = {
    arr: [1, 2, 3, 4],
    ob: {
        a: 'a',
        b: 'b'
    }
}

let t = new Observe(test, callback)

test.arr.push(0)
```
