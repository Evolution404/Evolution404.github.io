title: cssNotes-背景与边框
date: 2018-07-31 09:42:41
tags:
- 语法
- css
categories:
- 前端
---


### 半透明边框

#### 默认的背景设置
```html
<style>
div{
    width:300px;
    height:300px;
    background: black;
    border: 10px solid hsla(0, 0%, 100%, 0.5);
}
</style>
```
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftsvjaa83fj30hw0i0t8r.jpg)
可以看到边框颜色背景是黑色,说明`div` 背景延伸到了`border`

#### 盒子模型的理解

从外向内分为: 外边距(margin) 边框(border) 内边距(padding) 内容(content)
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftsvdrr9aoj307t04wglg.jpg)

#### 解决方案

使用属性`background-clip`
```css
background-clip: padding-box;
```

|值|描述|
|-|-|
|border-box|背景被裁剪到边框盒
|padding-box|背景被裁剪到内边距框
|content-box|背景被裁剪到内容框

![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftsvmdx80tj30iw0imq30.jpg)
可以发现现在使用的是`body` 的背景颜色`lightblue`


### 多重边框

#### box-shadow使用

|值|描述|
|-|-|
|h-shadow|必需。水平阴影的位置。允许负值。
|v-shadow|必需。垂直阴影的位置。允许负值。
|blur|可选。模糊距离。
|spread|可选。阴影的尺寸。
|color|可选。阴影的颜色。请参阅 CSS 颜色值。
|inset|可选。将外部阴影 (outset) 改为内部阴影。

#### 使用box-shoadow模拟一个边框
```css
div {
    margin: 100px;
    width: 50px;
    height: 50px;
    background: lightblue;
    box-shadow: 0 0 0 10px #655;
}
```
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftsw85zr72j305604mt8j.jpg)

#### 边框的类型

![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftt4cma0e8j312q0hcta0.jpg)

#### 创建多层边框

box-shadow方案
```css
div {
    margin: 100px;
    width: 50px;
    height: 50px;
    background: lightblue;
    box-shadow: 0 0 0 10px #655, 0 0 0 15px deeppink;
}
```

outline方案--只能解决两层边框问题
```css
div {
    margin: 100px;
    width: 50px;
    height: 50px;
    background: lightblue;
    border: 10px solid #655;
    outline: 5px solid deeppink;
}
```

### 灵活的背景定位

#### background图片使用

##### overflow属性

|值|描述|
|-|-|
|visible|默认值。内容不会被修剪，会呈现在元素框之外。|
|hidden|内容会被修剪，并且其余内容是不可见的。|
|scroll|内容会被修剪，但是浏览器会显示滚动条以便查看其余的内容。|
|auto|如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容。|

**visible**
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1ftt694lbdfj30f00pegm3.jpg)

**hidden**
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1ftt69l14rvj30e20c674d.jpg)
隐藏多余内容,不会显示滚动条

**scroll**
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1ftt6297knqg30em0eghdt.gif)

##### background-attachment属性

|值|描述|
|-|-|
|scroll|默认值。背景图像会随着页面其余部分的滚动而移动。|
|fixed|当页面的其余部分滚动时，背景图像不会移动。|

**scroll**
默认属性, 滚动浏览器滚动条背景将滚动,`overflow: scroll` 中将固定
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftt58umhewg31gq12wu1d.gif)

**fixed**
将图片默认固定在浏览器左上角
滚动任何滚动条都不会改变图片位置, 图片只会显示设置图片背景元素的部分

![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftt5kxttfeg30dw0a97wl.gif)

**local**
将背景图完全设置于局部,滚动任何地方图片都会有变动(包括`overflow: scroll`)
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1ftt5utobaag31gq12wu1d.gif)

##### background-positon属性
```css
background-positon: 10px 10px;
```

##### background-origin 与 background-clip的细致解析
两者均只有三种选项
* content-box
* padding-box
* border-box

**针对纯色背景**
比较简单,只能通过`background-clip`进行控制
由于`background-clip`默认值为`border-box` 所以显示为包括边框全部充满

**针对图片背景**
* background-origin
    确定背景图片放置的起始位置
    默认值为`padding-box`
* backgroun-clip
    确定图片显示的起始位置

**思考方式先放置后进行切割,思考origin放置的位置,然后根据clip进行切割就是最终显示结果**

#### 使用calc以及background-position
```css
background-position: calc(100% - 20px) calc(100% - 10px);
```

注意: **calc中的运算符必须两边有空格**


### 边框内圆角

#### 使用嵌套div

```css
.out {
    background: #655;
    padding: .8em;
}

.out>div {
    padding: 1em;
    background: tan;
    border-radius: .8em;
}
```

```html
<div class="out">
    <div>
        hello world hello world hello world hello world hello world hello world
    </div>
</div>
```

外侧设置背景,内部设置圆角,圆角减少的面积显示外部的颜色

#### 使用一个div
```css
div{
    margin: 100px 300px;
    background: tan;
    padding: 1em;
    border-radius: .8em;
    box-shadow: 0 0 0 .5em #655;
    outline: #655 solid .6em;
    border: 100px solid red;
}
```

* box-shadow 三个0加宽度颜色可以模拟实线边框
* outline 以及 box-shadow都是从border开始进行放置,两者起始位置相同
* 描边不跟着圆角走,将来可能会被修正
![](http://evolution404.gitee.io/markdownimg/006tNc79ly1fttdaxpjr8j30c60f074r.jpg)

一般可以取圆角半径的一半即可, 且描边的宽度也有限制


### 条纹背景

```css
div {
    margin: 100px 300px;
    width: 300px;
    height: 300px;
    background: linear-gradient(#fb3 33.3%,
    #58a 0, #58a 66.6%, yellowgreen 0);
    background-size: 100% 45px;

}
```

#### `linear-gradient`中的百分比的理解

linear-gradient 中颜色是两两配对的, 百分比代表着两种颜色进行在a到b百分比之间进行渐变
有几条分界线,就要写*2种颜色

例如:
    `linear-gradient(red 50%, blue 50%);`

    红色从50%开始渐变,到50%完全渐变从蓝色 即生成无限小的渐变区间.
    区间之外的部分由这两种颜色填充

又如:
    `background: linear-gradient(#fb3 33.3%, #58a 0, #58a 66.6%, yellowgreen 0);`

    这种说明黄色从33.3%到33.3完全变成蓝色,蓝色由66.6到66.6变成绿色
    前三分之一由黄色接管, 中间蓝色,最后绿色


#### 四色条纹

```css
background: linear-gradient(red 25%, yellowgreen 25%,yellowgreen 50%, lightblue 50%,lightblue 75%,pink 75%);
```

还可以写成

```css
background: linear-gradient(red 25%, yellowgreen 0,yellowgreen 50%, lightblue 0,lightblue 75%,pink 0);
```

![](http://evolution404.gitee.io/markdownimg/006tNc79gy1fttyh1tn0xj30gs0h0we9.jpg)


#### 垂直条纹, 斜向条纹

##### 垂直条纹:
    最前方加上`to right`即可

##### 斜向条纹

```css
background: linear-gradient(45deg,
#fb3 25%, #58a 0, #58a 50%,
#fb3 0, #fb3 75%, #58a 0);
background-size: 30px 30px;
```
另一种写法

```css
background: repeating-linear-gradient(45deg,
#fb3, #fb3 15px, #58a 0, #58a 30px);
```
这种写法就是确定每种颜色的第一次重复的起始位置,所以双色条纹需要写四次

##### 可维护的渐变色彩

```css
background: #58a;
background-image: repeating-linear-gradient(30deg,
hsla(0, 0%, 100%, .1),
hsla(0, 0%, 100%, .1) 20px,
transparent 0, transparent 40px);
```

![](http://evolution404.gitee.io/markdownimg/006tNc79gy1fttzgmsbtmj30hi0hgmx0.jpg)


transparent  全透明色彩
代表#58a的加上0.1的白色与#58a交替

#### 网格

固定线框宽度
```css
background: #58a;
background-image: linear-gradient(white 1px, transparent 0),
linear-gradient(90deg, white 1px, transparent 0);
background-size: 30px 30px;
```
![](http://evolution404.gitee.io/markdownimg/006tNc79gy1fttzrkjuwuj30hg0hcjr6.jpg)


格子布

```css
background: white;
background-image: linear-gradient(90deg,
rgba(200, 0, 0, .5) 50%, transparent 0),
linear-gradient( rgba(200, 0, 0, .5) 50%, transparent 0);
background-size: 30px 30px;
```

![](http://evolution404.gitee.io/markdownimg/006tNc79ly1fttzsi9ov9j30hk0huwea.jpg)

#### 径向渐变(radial-gradient)

基础使用

```css
background: radial-gradient(lightblue 50%, tan 0)
```

![](http://evolution404.gitee.io/markdownimg/006tNc79gy1ftu0qohltmj30he0howea.jpg)


双重波点阵列

```css
background: #655;
background-image: radial-gradient(tan 30%, transparent 0),
radial-gradient(tan 30%, transparent 0);
background-size: 30px 30px;
background-position: 0 0, 15px 15px;
```
![](http://evolution404.gitee.io/markdownimg/006tNc79gy1ftu0v6tu5rj30i20hqglf.jpg)



### 蚂蚁行军动画

![](http://evolution404.gitee.io/markdownimg/006tNc79ly1ftu249i0tfg30lu0kujrb.gif)

```css
@keyframes ants {
    to {
        background-position: 100%
    }
}

div{
    width: 300px;
    height: 300px;
    margin: 100px 300px;
    padding: 1em;
    border: 1px solid transparent;
    background: linear-gradient(white, white) padding-box,
    repeating-linear-gradient(-45deg,
    black 0, black 25%, white 0, white 50%) 0 / .6em .6em;
    animation: ants 12s linear infinite;
}
```


```css
.div2 {
    padding: 1em;
    border: 1px solid transparent;
    background: linear-gradient(white, white) padding-box,
    repeating-linear-gradient(-45deg, black 0, black .2em, white 0, white .4em) border-box;
    animation: ants 12s linear infinite;
}
@keyframes ants{to {background-position:100em}}
```

* 单位要统一`repeating-linear-gradient`中使用`em` `background-positon` 也要使用`em`
* 实现思路 首先做出斜线黑白交错背景,然后用白色遮住`padding` 及以内
