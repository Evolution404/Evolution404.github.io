---
title: js简单贪吃蛇
date: 2018-08-27 11:52:47
tags:
- javascript
- 实例
categories:
- 前端
---


**test.js**
```javascript
let $ = selector => document.querySelectorAll(selector)

function Snake(width = 20, height = 20, direction = 'right') {
    this.width = width
    this.height = height
    this.direction = direction
    this.heart = 0
    this.body = [{
            x: 3,
            y: 2,
            color: 'red',
        },
        {
            x: 2,
            y: 2,
            color: 'orange',
        },
        {
            x: 1,
            y: 2,
            color: 'orange',
        }
    ]
}

Snake.prototype.init = function(map) {
    this.map = map
    this.drawBody()
    this.addKeyListener()
}

Snake.prototype.drawBody = function() {
    let map = this.map
    this.removeBody()
    this.body.forEach(item => {
        let div = document.createElement('div')
        div.setAttribute('class', 'snake')
        div.style.position = 'absolute'
        div.style.backgroundColor = item.color
        div.style.width = this.width + 'px'
        div.style.height = this.height + 'px'
        div.style.left = item.x * this.width + 'px'
        div.style.top = item.y * this.height + 'px'
        map.appendChild(div)
    })
}
Snake.prototype.move = function() {
    let body = this.body
    let first = {
        x: body[0].x,
        y: body[0].y,
        color: 'red',
    }
    switch (this.direction) {
        case 'top':
            first.y--
                break
        case 'bottom':
            first.y++
                break
        case 'left':
            first.x--
                break
        case 'right':
            first.x++
                break
    }
    if (first.x > 40 || first.y > 30 || first.x < 0 || first.y < 0) {
        alert('撞墙了')
        return false
    }
    let head = this.body[0]
    for (let i = 0; i < this.body.length; i++) {
        let item = this.body[i]
        if (i !== 0 && item.x === head.x && item.y === head.y) {
            if (this.heart === 0) {
                this.heart++
                alert('哎呦, 你撞到我的心了 饶你一次')
            } else if (this.heart === 1) {
                this.heart++
                alert('这么喜欢我呀, 好吧再放你一次')
            } else {
                alert('啪, 你真的死了')
                return false
            }
        }
    }
    body.pop()
    body[0].color = 'orange'
    body.splice(0, 0, first)
    this.drawBody()
    return true
}

Snake.prototype.removeBody = function() {
    let map = this.map
    while (map.querySelector('.snake')) {
        let block = map.querySelector('.snake')
        block.parentNode.removeChild(block)
    }
}

Snake.prototype.addKeyListener = function() {
    let self = this
    document.onkeydown = function(e) {
        let code = e.keyCode
        switch (code) {
            case 38:
                if (self.direction !== 'bottom') {
                    self.direction = 'top'
                }
                break
            case 40:
                if (self.direction !== 'top') {
                    self.direction = 'bottom'
                }
                break
            case 37:
                if (self.direction !== 'right') {
                    self.direction = 'left'
                }
                break
            case 39:
                if (self.direction !== 'left') {
                    self.direction = 'right'
                }
                break
        }
    }
    this.move()
}

Snake.prototype.eat = function() {
    let bodyLast = this.body[this.body.length - 1]
    let last = {
        x: bodyLast.x,
        y: bodyLast.y,
        color: 'orange',
    }
    this.move()
    this.body.push(last)
}

function Food(width = 20, height = 20, color = 'green') {
    this.width = width
    this.height = height
    this.color = color
    this.element = document.createElement('div')
    this.x = 0
    this.y = 0
}

Food.prototype.init = function(map) {
    if (!this.map) {
        this.map = map
    }
    this.x = parseInt(Math.random() * this.map.offsetWidth / this.width)
    this.y = parseInt(Math.random() * this.map.offsetHeight / this.height)
    this.element.style.position = 'absolute'
    this.element.style.backgroundColor = this.color
    this.element.style.width = this.width + 'px'
    this.element.style.height = this.height + 'px'
    this.element.style.left = this.x * this.width + 'px'
    this.element.style.top = this.y * this.height + 'px'
    this.map.appendChild(this.element)
}

function Game(snake, food) {
    this.snake = snake
    this.food = food
}

Game.prototype.start = function() {
    let self = this
    let moveInterval = setInterval(function() {
        self.collision()
        if (!self.snake.move()) {
            clearInterval(moveInterval)
        }
    }, 100)
}

Game.prototype.collision = function() {
    let [fx, fy] = [this.food.x, this.food.y]
    let shead = this.snake.body[0]
    let [sx, sy] = [shead.x, shead.y]
    console.log(fx, fy, sx, sy)
    if (fx === sx && fy === sy) {
        this.snake.eat()
        this.food.init()
    }
}

let s = new Snake()
s.init($('.map')[0])

let f = new Food()
f.init($('.map')[0])

let g = new Game(s, f)

g.start()
```


**test.html**

```html
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Test</title>
</head>
<style type="text/css" media="screen">
    .map {
        width: 800px;
        height: 600px;
        background: #ccc;
        position: relative;
    }
</style>

<body>
    <div class="map"></div>
</body>
<script src="test.js" charset="utf-8"></script>

</html>
```
