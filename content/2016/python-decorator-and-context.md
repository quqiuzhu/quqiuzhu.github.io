---
title: Python 学习笔记 装饰器 与 context
date: 2016-04-07 12:17:58
categories: python
tags:
- python
---

## 装饰器
Python中函数是一等公民，装饰器的作用就是接收一个函数，返回其增强版本的函数。例如:
```py
def decorator(function):
    def _mydecorator(*args, **kw):
        print 'do something before'
        res = function(*args, **kw)
        print 'do somthing after'
        return res
    return _mydecorator

@decorator
def function():
    print 'function executing'

function()

输出：
do something before
function executing
do somthing after
```
<!-- more -->
装饰器是语法糖，因此装饰器可以用其他一般的语句来实现，我们将上面例子中的`function`定义部分作出下面改动
```py
def function():
    print 'function executing'
    
function = decorator(function)
```
实现同样的功能，所以装饰器一点也不厉害，就是函数调用加上赋值运算的语法糖。

上面的是无参数的装饰器，如果是有参数的装饰器，则这么来实现
```py
def otherdecorator(args1, args2):
    def _otherdecorator(function):
        def __otherdecorator(*args, **kw):
            print 'do something before with args %s, %s' % (args1, args2)
            res = function(*args, **kw)
            print 'do something after with args %s, %s' % (args1, args2)
            return res
        return __otherdecorator
    return _otherdecorator

@otherdecorator('name', 'age')
def function():
    print 'function executing'
    
function()
输出：
do something before with args name, age
function executing
do something after with args name, age
```
有参数的函数的定义相当于
```py
def function():
    print 'function executing'

function = otherdecorator('name', 'age')(function)
```

装饰器还有类的实现方式，类实现`__call__`方法的时候可以被调用，这里不再多讲。

应用

* 参数检查
* 缓存
* 代理

## context
### with 语句的使用
python 上下文跟 with 语句的使用有关。一般的用法如下
```py
with open(filename) as f:
    for line in f:
        print line
        raise ValueError()
```
如果在语句体中发生异常，文件也将正常关闭，主要是因为 with 语句与 context_manager 的交互。 context_manager 是实现了 `__enter__()` 和 `__exit__()` 方法的对象。 with 语句保证在语句体重发生异常时，`__exit__()` 方法 也会被调用，从而使程序正确退出上下文。

上面的代码中，`open(filename)` 返回的是一个 context_manager， 而  `as f` 这个 f 被赋值的是 `context_manager.__enter__()` 的返回结果。

但是有时候又会发现，不用with语句也可以直接使用，比如 `f = open(filename)` 。这是因为 python 的文件对象实现了 `__enter__()` 和 `__exit__()` 方法， 文件对象本身也是 context_manager， 其 `__enter__()` 返回的是自身。

### contextlib
有一个装饰器 `contexmanager`， 一个 `closing()` 函数和 `nested()` 函数。

`contexmanager` 是用来帮助我们自定义 contexmanager 的, 其中 yield 语句前一部分在 `__enter__()` 中执行，yield 语句 执行 with 语句体, yield 语句后的部分在 `__exit__()` 中执行。

```py
@contextmanager
def cm():
    print 'do something before'
    yield
    print 'do something after'
```
很容易想出来 `contextmanager` 装饰器的实现方式，这里不再多讲。

`closing(that)` 函数是一个 `contextmanager`，不是装饰器，它的作用就是最终会调用 that 的 close 方法，如果不想自己实现上下文管理器，但是也要支持上下文管理器的功能的话，就只需要实现 close 方法，然后使用 `with closing(that) as f` 就好了。

`nested()` 函数用来解决嵌套with语句的问题，可以这样使用
```py
with nested(A(), B(), C()) as (X, Y, Z):
	  pass
```
如果细节了解不清楚，建议看 IBM 的[文章][1]

[1]: https://www.ibm.com/developerworks/cn/opensource/os-cn-pythonwith/
