---
title: Python 学习笔记 描述符
date: 2016-04-24 22:21:25
categories: python
tags:
- python
---
许多做 C++ 和 Java 的朋友在看 Python 的时候，或许会问，Python 中没有 `private`, `protected`, `public` 等关键字，是怎么控制变量访问的呢？Python 中有没有静态变量，实例变量呢？ 

Python 没有静态变量和实例变量的区别，只有属性。类的属性还是对象的属性没有任何不同，因为类也是一种对象。Python 中类的属性还包含了类中的方法，而控制属性访问的正是描述符。

本文将详细叙述描述符协议、描述符的实现方式、属性及属性访问顺序等主题。
<!-- more -->
## 描述符协议
一个实例 instance 有一个属性 x，对属性 x 有三种操作。 访问 `y = instance.x`， 赋值 `instance.x = 20` 和 删除 `del instance.x`，描述符正是对这三种操作进行控制。 

描述符协议有 3 个方法，只要实现 `__get__` 或者 `__set__` 方法就可以算是一个描述器。实现了 `__set__` 方法的描述器是数据描述器，实现了 `__get__` 方法，但是没有实现 `__set__` 方法的是非数据描述符。两种描述符在属性访问时的优先级不同，后面会讲。

```py
descr.__get__(self, inst, type=None) --> value
descr.__set__(self, inst, value) --> None
descr.__delete__(self, inst) --> None
```

描述符协议调用者是属性，所以参数 self 是指属性，inst 指的是实例。

## 描述符实现方式
有三种典型的方式来实现描述符，类、property() 和 property 装饰器 

### 类

```py
class NameDescripter(object):
    def __init__(self):
        self._name = ''

    def __get__(self, instance, inst_type):
        print '__get__', self._name
        return self._name

    def __set__(self, instance, value):
        print '__set__', self._name
        self._name = value

    def __delete__(self, instance):
        print '__delete__', self._name
        self._name = ''

class Person(object):
    name = NameDescripter()
    
user = Person()
user.name = 'quqiuzhu' 
out: __set__
user.name  
out: __get__ quqiuzhu
del user.name
out: __delete__ quqiuzhu
user.name
out: __get__
```

### property()
property() 定义如下:

```py
property(fget=None, fset=None, fdel=None, doc=None) -> property attribute
```
用该函数实现上一节的 Person name 属性

```py
class Person(object):
    def __init__(self):
        self._name = ''

    def __get_name(self):
        print '__get__', self._name
        return self._name

    def __set_name(self, value):
        print '__set__', self._name
        self._name = value

    def __del_name(self):
        print '__delete__', self._name
        self._name = ''
    name = property(__get_name, __set_name, __del_name)
```

### property 装饰器

```py
class Person(object):
    def __init__(self):
        self._name = ''
        
    @property
    def name(self):
        print '__get__', self._name
        return self._name

    @name.setter
    def name(self, value):
        print '__set__', self._name
        self._name = value

    @name.deleter
    def name(self):
        print '__delete__', self._name
        self._name = ''
```

## 方法描述符
方法是一种特殊的属性，其描述符实现原理如下

```py
class Function(object):
    . . .
    def __get__(self, obj, objtype=None):
        "Simulate func_descr_get() in Objects/funcobject.c"
        return types.MethodType(self, obj, objtype)
```

Python 中 `.` 是 `getattr()` 函数的语法糖。所以方法调用 `object.func()` 相当于 `getattr(object, 'func') 然后调用 __call__()`。当然，获取属性的方式不只是 `getattr(object, 'func')` 那么简单，获取属性是一连串的序列的判断和调用，下面会讲。

## 属性
属性的查找遵循LEGB原则：Local，Enclosing，Global以及Builtin。现在实例中找，找不到就去类中找，再去父类中找，一直找到 object 还找不到就去。

上面只是罗列一些点，但并没有展开，强烈推荐三篇参考的文章，比 Python Expert Programming 写得清晰很多。

### 参考
[1]  [Python 描述符简介][ibm]
[2]  [Python 描述器引导(翻译)][intro]
[3]  [Python 中的attributes][attribute]

[ibm]: https://www.ibm.com/developerworks/cn/opensource/os-pythondescriptors/
[intro]: http://pyzh.readthedocs.org/en/latest/Descriptor-HOW-TO-Guide.html
[attribute]: http://wlwang41.github.io/content/python/python%E4%B8%AD%E7%9A%84attributes.html