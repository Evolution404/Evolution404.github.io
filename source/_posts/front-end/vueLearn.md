---
title: vueLearn
date: 2018-07-26 17:41:30
tags:
- 框架
- vue
categories:
- 前端
---
## vue中动画
### 使用animate.css

1. 将需要动画的标签放入`<transition></transition>` 标签中

2. 为`transition`标签添加属性 `enter-active-class` 和 `leave-active-class`

3. 在动画标签上添加class `animated` 以及 `show` 其中`show` 是用来自己控制动画时长,例如
```
.show {
    transition: all 0.4s ease;
}

```

创建的动画的一个实例

```html
<style type="text/css" media="screen">
    .show {
        transition: all 0.4s ease;
    }
</style>
<body>
    <div id="app">
        <button @click="toggle">toggle</button> <br>
        <transition enter-active-class="fadeInRight" leave-active-class="fadeOutRight">
            <div class="animated show" v-show="isShow">zyx</div>
        </transition>
    </div>
</body>
<script charset="utf-8">
    var app = new Vue({
        el: "#app",
        data: {
            isShow: true,
        },
        methods: {
            toggle: function() {
                this.isShow = !this.isShow;
            }
        },

    })
</script>
```
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftnica8kwsg31js05kab9.gif)

## 组件

### 定义和注册组件

#### 方法一
定义组件
```javascript
// 定义组件
var login = Vue.extend({
   template:'<h1>登录页面</h1>' 
});
// 注册组件
Vue.component('login', login);
```
使用组件
```html
<div id="app">
    <login></login>
</div>
```

#### 方法二
```javascript
Vue.component('register',{
    template:'<h1>注册界面</h1>',
})
```
使用同上,直接在接管区域内使用`register`标签

#### 方法三,推荐写法

```javascript
Vue.component("account", {
    template: '#account',
})
```
```html
<template id="account">
    <div>
        <a href="#">登录</a>
        <a href="#">注册</a>
    </div>
</template>
```
**注意:在Vue2.0中模板需要使用一个根元素包裹起来**

### 组件中数据的展示
使用数据必须放在一个function中,数据通过该function的返回值来定义
```javascript
data: function() {
    return {
        msg: 'this is a msg',
    };
},
```
这样做可以保证多个组件之间数据的独立性

### 定义和注册子组件
```javascript
Vue.component('account', {
    template: '#account',
    components: {
        "login": {
            template: "<h2>登录子组件</h2>",
        }
    }
})
```
```html
<template id="account">
    <div>
        <h1>账号组件</h1>
        <login></login>
    </div>
</template>
```
定义的子组件可以在父组件中使用

### 组件切换
```html
<div id="app">
    <a href="#" @click="cname='login'">登录</a>
    <a href="#" @click="cname='register'">注册</a>
    <component :is="cname"></component>
</div>
```
使用`component`元素的`:is`属性可以切换当前使用的组件

### 父组件向子组件传值

```javascript
var app = new Vue({
    el: '#app',
    data: {
        id: '1000',
        msg: 'this is a msg',
    },
    components: {
        'children': {
            template: '#children',
            props: ['good'],
        },
    },
});
```
```html
<template id="children">
    <div>
        {{good}}
    </div>
</template>

<div id="app">
    <children :good="msg"></children>
</div>
```

在子组件中定义`props`属性(数组) 其中填写可以绑定的变量名称
在使用子组件的过程中通过`props`中的名称绑定父组件的某个变量,类似函数传参

### 子组件向父组件传值

子组件中通过方法调用 `this.$emit("key", "value")` 语句来发送信息参数
父组件中为子组件绑定`key` 事件,并且该事件的回调函数有默认参数即为发送的`value`

```html
<template id="children">
        <div>
            <button @click="sendData">发送数据</button>
        </div>
    </template>
<div id="app">
    <children v-on:send="getData"></children>
    <div>{{sendData}}</div>
</div>
```

```javascript
var app = new Vue({
    el: '#app',
    data: {
        sendData: '',
    },
    methods: {
        getData: function(input) {
            alert(input);
        }
    },
    components: {
        'children': {
            template: '#children',
            methods: {
                sendData: function() {
                    this.$emit("send", 'hello world');
                }
            }

        }
    }
});
```

### 获取dom对象
使用`ref` 指定dom的名字

```html
<div id="app">
    <button @click="getEl"></button>
    <div ref="mydiv">hello div</div>
    <login ref="mylogin"></login>
</div>
```

```javascript
var app = new Vue({
    el: '#app',
    methods: {
        getEl: function(){
            console.log(this.$refs.mydiv);
            console.log(this.$refs.mylogin.id);
        }
    },
    components: {
        login: {
            template: '<h1>login</h1>',
            data: function(){
                return {
                    id: '222',
                }
            },
        }
    }
})
```

## 路由系统

### 路由加传参的实例
```html
<div id="app">
    <router-link to="/login">登录</router-link>
    <router-link to="/register">注册</router-link>
    <router-view></router-view>
</div>
```

```javascript
var App = Vue.extend({});
var login = Vue.extend({
    template: '<h1>登录</h1>',
});
var register = Vue.extend({
    template: '<h1>注册{{name}}</h1>',
    data: function(){
        return {
            name: '',
        }
    },
    created: function(){
        this.name = this.$route.params.name;
    }
});

var router = new VueRouter({
    routes: [
        {path: '/', redirect:'/login'},
        {path: '/login', component: login},
        {path: '/register/:name', component: register}
    ],
})

var app = new Vue({
    el: '#app',
    router: router,
})
```

### 嵌套路由的实例

```html
<div id="app">
    <router-link to="/account/login">登录</router-link>
    <router-link to="/account/register">注册</router-link>
    <router-view></router-view>
</div>
```

```javascript
var App = Vue.extend({});

var account = Vue.extend({
    template: '<div><h1>账号组件</h1><router-view></router-view></div>',
});

var login = Vue.extend({
    template: '<h1>登录</h1>',
});
var register = Vue.extend({
    template: '<h1>注册{{name}}</h1>',
    data: function() {
        return {
            name: '',
        }
    },
    created: function() {
        this.name = this.$route.params.name;
    }
});

var router = new VueRouter({
    routes: [{
        path: '/account',
        component: account,
        children: [
            {
                path: 'login',
                component: login
            },
            {
                path: 'register/:name',
                component: register
            }
        ]
    }],
})

var app = new Vue({
    el: '#app',
    router: router,
})
```

## watch 与 计算属性computed

### watch的使用

#### watch 监控普通变量
> watch 中对某个变量定义函数,函数会默认传入变化的变量新值和旧值.

```html
<div id="app">
    <input type="text" v-model="firstName" value="" name="" id=""/>
    <input type="text" v-model="lastName" value="" name="" id=""/>
    {{fullName}}
</div>
```

```javascript
var app = new Vue({
    el: '#app',
    data: {
        firstName: "",
        lastName: "",
        fullName: "",
    },
    watch: {
        'firstName': function(newValue, oldValue){
            this.fullName = this.firstName + this.lastName;
        },
        'lastName': function(newValue, oldValue){
            this.fullName = this.firstName + this.lastName;
        }
    }
});
```

#### watch 监控路由对象

`$route`是内置对象

```javascript
var app = new Vue({
    el: '#app',
    router: router,
    watch: {
        '$route': function(newRoute, oldRoute) {
            console.log(newRoute);
            console.log(oldRoute);
        }
    }
});
```

### computed的使用

computed可以创建计算变量,这些变量可以直接通过`{{var}}`使用

```javascript
var app = new Vue({
    el: '#app',
    data: {
        firstName: 'a',
        lastName: 'b',
    },
    computed: {
        fullName: function() {
            return this.firstName + this.lastName;
        }
    }
});
```
