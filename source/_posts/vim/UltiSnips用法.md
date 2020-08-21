---
title: UltiSnips用法
date: 2018-07-13 14:33:00
tags: 
- 效率
categories:
- vim
---

## 基本用法
### 加载原理

在`.vim`路径下新建UltiSnips目录,创建`*.snippets`文件
```
all.snippets
python.snippets
markdown.snippets
```
all针对全局生效,具体文件类型开头只对具体语言生效

### 新建简单snip
#### 格式
```
snippet 关键词 “说明” 设定
内容
endsnippet
```
#### 例子
```
snippet std "use namespace std" b
using namespace std;
endsnippet
```
输入`std<tab>`即可生成`use namespace std;`

* b 代表只有关键词出现在行首的时候，才可以被展开
* A 代表自动展开
* w 代表可以展开这个 “词”，具体 “词” 的定义可以查看 :help iskeyword。直观感觉就是，这个关键词是单独的，和其他文字分开的。比如前后都是空格。
* i 代表可以忽略前后字节，直接展开关键词。（这个设定比 w 要更松）

## 高级用法
### 变量操作
```
snippet class "class" b
class ${1:Class}{
public:
    // constructors, asssignment, destructor
    $1();
    $1(const $1&);
    $1& operator=(const $1&);
    ~$1();
private:
};
endsnippet
```
输入`class`然后输入类名就可以同时更改多处代码值
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ft96ykshvig30wo0oo4qp.gif)
> 变量用法: ${1:default}, 默认`<c-j>`下一个变量输入 `<c-k>`上一个变量输入

#### ${VISUAL}
```python
snippet with "with" b
with ${1:expr}`!p snip.rv = " as " if t[2] else ""`${2:var}:
	${3:${VISUAL:pass}}
$0
endsnippet
```

> 使用流程:选中需要VISUAL填充的内容按`<tab>`输入snip继续按`<snip>`即可生成

### 使用Python代码
```python
global !p
def list_files():
    files = []
    for f in os.listdir('.'):
        if f.endswith(('.cpp', '.h', '.cc')) and not f.startswith('.'):
            files.append(f)
    return ' '.join(files)
endglobal

snippet ls "list source files" iw
`!p snip.rv = list_files()`
endsnippet
```
!p代表使用Python代码,经过测试如果Python代码返回类似$1并不能使用变量输入

### 使用正则表达式
```python
snippet "rep (\d+) (\w+)" "def" r
def ${1:name}:
    ${2:`!p snip.rv=int(match.group(1))*match.group(2)`}
endsnippet
```
后方选项使用`r`,表示启用Python正则表达式模式.表达使用引号包裹起来

### 修改键位映射
```
   g:UltiSnipsExpandTrigger               <tab>
   g:UltiSnipsListSnippets                <c-tab>
   g:UltiSnipsJumpForwardTrigger          <c-f>
   g:UltiSnipsJumpBackwardTrigger         <c-b>
```

### 一个生成a-b数字的示例
```python
snippet "(\d+)-(\d+)([ ,])" "生成数字列表" r
`!p
beginNum = int(match.group(1))
endNum = int(match.group(2))
fillSymbol = match.group(3)

rs = ''
for i in range(endNum-beginNum+1):
	rs = rs+str(beginNum + i) + fillSymbol + ' '
rs = rs[:-2]
snip.rv = rs
`
endsnippet
```
功能: 输入`1-9,` 就会自动填充成`1, 2, 3, 4, 5, 6, 7, 8, 9`
![](http://evolution404.gitee.io/markdownimg/006tKfTcly1ft969apz3xg30xs0kc4be.gif)
