---
title: js字段校验例子
date: 2018-08-24 23:29:55
tags:
---

```javascript
const personValidators = {
    name(val) {
        return typeof val === 'string'
    },
    age(val) {
        return typeof val === 'number'
    },
}

function validator(target, validator) {
    return new Proxy(target, {
        _validator: validator,
        set(target, key, value, proxy) {
            if (target.hasOwnProperty(key)) {
                let Fva = this._validator[key] // 校验函数
                if (!Fva) return true
                if (Fva(value)) {
                    return Reflect.set(target, key, value, proxy)
                } else {
                    throw Error(`不能设置${value}到${key}`)
                }
            } else {
                throw Error(`key值:${key} 不存在`)
            }
        },
    })
}

class Person {
    constructor(name, age, sex) {
        this.name = name
        this.age = age
        this.sex = sex
        return validator(this, personValidators)
    }
}

let p = new Person('zyx', '19', 'male')
p.name = 19 // 报错
p.sex = 'female'
console.log(p)
```
