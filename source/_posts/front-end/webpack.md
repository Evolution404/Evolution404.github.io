---
title: webpack
date: 2018-07-29 16:32:15
tags:
- webpack
- 工具
categories:
- 前端
---

## 起步

### 0配置使用

1. 全局安装webpack

2. 在当前文件夹下创建`src` 文件夹

3. 在`src` 文件夹下创建`index.js`文件

4. 创建其他依赖文件

5. 执行`webpack` 命令,将自动`dist`文件夹 并生成`main.js`

### 配置文件
创建**webpack.config.js**文件

最基础的配置文件示例
```javascript
module.exports = {
    entry: "./src/index.js", // 指定打包的入口文件
    output: {
        path: __dirname + '/dist',
        filename: 'bulid.js',
    }
};
```

## webpack loader

### 打包css

#### 环境配置
```bash
npm init -y  初始化package.json
npm i install css-loader style-loader --save-dev    安装这两个包,并写入package.json
```

#### webpack配置

**webpack.config.js**
```javascript
module.exports = {
    entry: "./src/index.js", // 指定打包的入口文件
    output: {
        path: __dirname + '/dist',
        filename: 'bulid.js',
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader','css-loader']
            },
        ]
    }
};
```
注意**use中的两个loader的顺序问题**

### 打包sass

需要多安装两个包
```bash
npm i install node-sass sass-loader css-loader style-loader --save-dev
```

配置文件中写法
`use: ['style-loader','css-loader','sass-loader']`

### 打包less

新增的两个包
> less less-loader

配置文件中写法
`use: ['style-loader','css-loader','less-loader']`

### 打包图片等

新增的两个包
> file-loader url-loader 

配置文件写法
```javascript
{
    test: /\.(gif|png|jpg|woff|svg|ttf|eot)$/,
    use: [{
        loader: 'url-loader',
        options: {
            limit: 40000,
        }
    }],
},
```
## 热更新,自动启动

`webpack-dev-server, html-webpack-plugin`

**package.json**
添加
```javascript
"scripts": {
"dev": "webpack-dev-server --inline --hot --open --port 5008"
},
```
通过这个配置可以`npm run dev`自动打开浏览器并热更新

**webpack.config.js**
首部添加
`var htmlwp = require("html-webpack-plugin");`
内部添加
```javascript
plugins: [
    new htmlwp({
        title: '首页',
        filename: 'index.html',
        template: 'webpack.html',
    })
]
```

## es6转es5
安装`babel-core babel-loader babel-preset-es2015 babel-plugin-transform-runtime`

配置**webpack.config.json**
rules中增加节点
```javascript
{
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader",
        options: {
            presets: ["es2015"],
            plugins: ['transform-runtime'],
        }
    },
},
```


## webpack 打包vue

### 安装所需包
```bash
cnpm install vue --save   表示运行阶段需要依赖
cnpm install vue-loader vue-template-compiler babel-plugin-transform-runtime --save-dev  表示开发阶段需要依赖
```

### 文件配置

**.babelrc**
创建文件`.babelrc`
写入
```javascript
{
    presets: ['es2015'],
    plugins: ['transform-runtime'],
}
```

**webpack.config.js**

1. 创建新节点
    ```javascript
    {
        test: /\.vue$/,
        use: 'vue-loader',
    },
    ```
2. 创建新对象

    文件头部写入
    ```javascript
    const { VueLoaderPlugin } = require('vue-loader');
    ```

    plugins节点添加一项
    ```javascript
    plugins: [
        new VueLoaderPlugin(),
        new htmlwp({
            title: '首页',
            filename: 'index.html',
            template: 'webpack.html',
        })
    ]
    ```

### 集成vue-router步骤
```bash
cnpm install vue-router --save  运行阶段依赖
```

**index.js**
```javascript
import Vue from 'vue';
import vueRouter from 'vue-router';
import App from './App.vue';
import login from './components/account/login.vue'
import register from './components/account/register.vue'

Vue.use(vueRouter);  //注册vueRouter


var router = new vueRouter({
    routes: [
        {path:'/login', component:login},
        {path:'/register', component:register}
    ],
})

new Vue({
    el: '#app',
    router,
    render: c => c(App), //es6的函数写法
});
```
**App.vue**
```html
<router-link to="/login">登录</router-link>
<router-link to="/register">注册</router-link>
<router-view></router-view>
```



## 总结

**package.json**
```javascript
{
  "name": "webpack",
  "version": "1.0.0",
  "description": "",
  "main": "webpack.config.js",
  "scripts": {
    "dev": "webpack-dev-server --inline --hot --open --port 5008"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-es2015": "^6.24.1",
    "css-loader": "^1.0.0",
    "file-loader": "^1.1.11",
    "html-webpack-plugin": "^3.2.0",
    "less": "^3.8.0",
    "less-loader": "^4.1.0",
    "node-sass": "^4.9.2",
    "sass-loader": "^7.0.3",
    "style-loader": "^0.21.0",
    "url-loader": "^1.0.1",
    "vue-loader": "^15.2.6",
    "vue-template-compiler": "^2.5.16",
    "webpack": "^4.16.3",
    "webpack-cli": "^3.1.0",
    "webpack-dev-server": "^3.1.5"
  },
  "dependencies": {
    "vue": "^2.5.16"
  }
}
```

**webpack.config.js**
```javascript
var htmlwp = require("html-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: "./src/index.js", // 指定打包的入口文件
    mode: 'development',
    watch: true,
    output: {
        path: __dirname + '/dist',
        filename: 'bulid.js',
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.(gif|png|jpg|woff|svg|ttf|eot)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 40000,
                    }
                }],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new htmlwp({
            title: '首页',
            filename: 'index.html',
            template: 'webpack.html',
        })
    ]
};
```
**.babelrc**
```javascript
{
    presets: ['es2015'],
    plugins: ['transform-runtime'],
}
```



## 拓展功能

### webpack服务器支持手机端进行访问

在**webpack.config.js**中添加节点
```javascript
devServer: {
    host: '0.0.0.0',
    useLocalIp: true,
    open: true,
    openPage: "",
    proxy: {
        "*": {
            target: 'http://xxx',
            secure: false
        }
    }
},
```
