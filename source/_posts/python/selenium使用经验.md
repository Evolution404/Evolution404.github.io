---
title: selenium使用经验
date: 2018-07-16 15:57:27
tags: 
- 爬虫
- 效率
categories:
- python
---

## 环境配置

### 安装selenium包
```bash
pip3 install selenium
```

### 配置Chrome驱动

[下载链接](http://chromedriver.storage.googleapis.com/index.html)
版本对应
![版本对应](http://evolution404.gitee.io/markdownimg/006tKfTcly1ftbrikdyklj30hq0i874o.jpg)

### 放置路径
**windows**
c:\windows\system32
**mac**
/usr/local/bin

## 使用方法

### 引入selenium并启动浏览器打开地址
```python
from selenium import webdriver
browser = webdriver.Chrome()
browser.get('http://www.baidu.com')
```

### 通过css选择器选择元素
```python
browser.find_element_by_css_selector('#id')
```

### 点击元素避免加载过慢

```python
def clickElement(selector, browser):
    while True:
        try:
            browser.find_element_by_css_selector(slector).click()
            break
        except:
            time.sleep(1)
```

### 执行JavaScript代码

#### 执行语句后必须有分号

```python
browser.execute_script('$("#id").click();')
```

#### 获取某些得不到的值

```python
browser.execute_script('return $("#id").text();')
```

## 自动刷慕课的案例
```python
from selenium import webdriver
import time

# .wrap_popboxes.wrap_popchapter .popboxes_btn a
def login(browser):
    browser.get('http://www.zhihuishu.com/')
    #  点击登录按钮
    browser.find_element_by_css_selector('#login-register > li:nth-child(1) > a').click()
    browser.find_element_by_css_selector('#lUsername').send_keys('yourUserName')
    browser.find_element_by_css_selector('#lPassword').send_keys('yourPassword')
    # 点击登录按钮
    browser.find_element_by_css_selector('#f_sign_up > div > span').click()

def clickElement(selector, browser):
    while True:
        try:
            browser.find_element_by_css_selector(selector).click()
            break
        except:
            time.sleep(1)

def getProgress(browser):
    try:
        text = browser.execute_script('return $(".current_play .progressbar_box_tip span").text();')
        rs = float(text.split('『')[1].split('%')[0])
        return rs
    except:
        return 1



browser = webdriver.Chrome()
login(browser)
time.sleep(3)
browser.find_element_by_css_selector('#course_recruit_studying_ul > li.Stu_courseFocusItem.courseListOn > div.new_stuCourseImgBox.fl > a > img').click()
current_window = browser.current_window_handle
windows = browser.window_handles
for win in windows:
    if current_window != win:
        # 切换窗口
        browser.switch_to.window(win)
time.sleep(5)

clickElement('div.box_popboxes > div.popboxes_btn > a.popbtn_yes', browser)
clickElement('#j-assess-criteria_popup > div.textbox_div > div > a', browser)

while True:
    progress = getProgress(browser)
    if progress == 100:
        browser.execute_script("$('.current_play').nextAll('.lesson').eq(0).click();")
        time.sleep(5)
    # 关闭题目框
    browser.execute_script("$('.popboxes_close.tmui_txt_hidd').click();")
    # 切换速度
    browser.execute_script("$('#vjs_mediaplayer > div.controlsBar > div.speedBox > div > div.speedTab15').click();")
    time.sleep(20)
```
