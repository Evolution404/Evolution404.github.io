---
title: c语言函数指针
date: 2018-10-21 22:14:55
tags: 
- 语法
categories:
- c
---

## 定义函数指针

```c
void p() { printf("hello world\n"); }
int main(){
  void (*world)() = p;
  world();
}
```

这样就定义了一个函数指针
> 变化方式: 函数定义的函数名字加上括号, 括号里面加上星号 代表函数的指针

## 回调函数
```c
double Add(double a, double b) { return a + b; }

double callBackMath(double a, double b, double (*f)(double, double)) {
  return (*f)(a, b);
}
int main(){
  printf("%g\n", callBackMath(10, 20, Add));
  // 以下效果相同
  // printf("%g\n", callBackMath(10, 20, &Add));
}
```

这是传入回调函数并进行调用的例子
其中在调用的时候写`Add` 或者 `&Add` 效果相同, 编译器会自动处理 [具体解释](https://stackoverflow.com/questions/6893285/why-do-function-pointer-definitions-work-with-any-number-of-ampersands-or-as)


## 一个示例代码
```c
#include <stdio.h>

double Add(double a, double b) { return a + b; }
double Sub(double a, double b) { return a - b; }
double Mul(double a, double b) { return a * b; }
double Div(double a, double b) { return a / b; }

void p() { printf("hello world\n"); }
void p2() { printf("hello function\n"); }

void callBackP(void (*f)()) { (*f)(); }
double callBackMath(double a, double b, double (*f)(double, double)) {
  return (*f)(a, b);
}

int main(void) {
  void (*world)() = p;
  void (*function)() = p2;
  world();
  function();
  callBackP(p);
  callBackP(p2);
  printf("%g\n", callBackMath(10, 20, Add));
  printf("%g\n", callBackMath(10, 20, Sub));
  printf("%g\n", callBackMath(10, 20, Mul));
  printf("%g\n", callBackMath(10, 20, Div));
  return 0;
}
```
