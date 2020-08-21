---
title: js的async/await和promise
date: 2019-05-22 09:12:38
tags:
- javascript
categories:
- 前端
---

## 从一道题目开始
```javascript
async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
}

async function async2() {
    console.log("async2");
}

console.log("script start");

setTimeout(function() {
    console.log("setTimeout");
}, 0);

async1();

new Promise(function(resolve) {
    console.log("promise1");
    resolve();
}).then(function() {
    console.log("promise2");
});

console.log("script end");
```

**答案**
![](https://raw.githubusercontent.com/Evolution404/picgo-img/master/20190522092058.png)

## async和awiat讲解

[理解 JavaScript 的 async/await](https://segmentfault.com/a/1190000007535316)
