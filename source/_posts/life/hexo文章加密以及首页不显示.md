---
title: hexo文章加密以及首页不显示
date: 2018-08-17 22:51:05
tags:
categories:
- life
password: 615598813
notshow: true
---
## 安装

在 hexo 根目录的 package.json 中添加 "hexo-blog-encrypt": "1.1.*" 依赖。
然后执行npm install 命令。
该插件会自动安装

## 快速开始

1. 首先在 _config.yml 中启用该插件:

```markdown
# Security
##
encrypt:
    enable: true
```
2. 在你的文章的头部添加上对应的字段，如 password, abstract, message

```markdown
---
title: hello world
date: 2016-03-30 21:18:02
tags:
    - fdsafsdaf
password: Mike
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---
```
[原文地址](https://www.jianshu.com/p/e4203ee066e5)

## 设置首页不显示

### 使用方法
在对应文章首部设置属性`notshow: true`

### 配置修改方法
路径：Hexo\themes\next\layout\index.swig
修改
```html
{% block content %}
  <section id="posts" class="posts-expand">
    {% for post in page.posts %}
        {{ post_template.render(post, true) }}
    {% endfor %}
  </section>
 
  {% include '_partials/pagination.swig' %}
{% endblock %
```
变成
```html
{% block content %}
  <section id="posts" class="posts-expand">
    {% for post in page.posts %}
        {% if post.notshow != true %}
            {{ post_template.render(post, true) }}
        {% endif %}
    {% endfor %}
  </section>
 
  {% include '_partials/pagination.swig' %}
{% endblock %}
```

[原文地址](https://www.2cto.com/kf/201806/753887.html)
