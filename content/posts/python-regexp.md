---
title: Python 学习笔记 正则表达式
date: 2016-04-27 14:24:46
tags:
- python
- magic
---

1.5 版之后，Python 内建支持正则表达式，它提供的正则表达式是 Perl 风格的。

正则表达式（或 RE）是一种小型的、高度专业化的编程语言，经常使用会感受到它的神奇之处。Python 正则表达式被编译成一系列的字节码，然后由用 C 编写的匹配引擎执行的。

本文开始给出一个匹配规则的表格，然后谈谈常用的正则表达式。然后讲了 Python 中 re 模块的函数及其相关的使用方式，最后以实例的形式给出了相关函数的用法。
<!-- more -->
## 正则匹配表
记号|说明
----------- | ------------- 
foo         | 匹配foo这个字符串
foo<font color=red>I</font>bar     | 匹配foo 或者 bar
.           | 匹配任何字符（除了换行符）
^           | 匹配字符串开始
$           | 匹配字符串结尾
*           | 匹配 0 次或更多次
+           | 匹配 1 次或者更多次
?           | 匹配 0 或 1 次
{N}         | 匹配 N 次
{M,N}       | 匹配 M 到 N 次
[...]       | 匹配 方括号里面的单个字符，可省略中间部分[a-z]
[^...]      | 匹配 不在方括号中出现的字符
(*<font color=red>I</font>+<font color=red>I</font>?<font color=red>I</font>{})? | 后面的问号，加在前面任何一个字符上，表示匹配越短越好(非贪婪)
(...)       | 匹配括号中的正则表达式，并保存为子组
\d          | 匹配 [0-9] `\D` 相反
\w          | 匹配 [A-Za-z0-9_] `\W` 相反
\s          | 匹配任何空白 `\S` 相反
\b          | 匹配单词边界 `\B` 相反
\N          | N为一个数字，匹配子组 N
\C          | C为特殊字符，匹配特殊字符 `\.`,`\*`等
\A          | 同 `^`
\Z          | 同 `$`

> 上面的表格中 `|` 以 <font color=red>I</font> 代替

## 常用正则表达式
* 中文字符: `[\u4e00-\u9fa5]`
* HTML标记: `<(\S*?)[^>]*>.*?</\1>|<.*? />`
* Email地址: `\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*`
* 国内电话号码: `\d{3}-\d{8}|\d{4}-\d{7}`
* HTTP_URL: `(https?)://([^/]+)(/?.*)`
* 时间(24h制): `((1|0?)[0-9]|2[0-3]):([0-5][0-9])`
* URL: `^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$`
* QQ号: `[1-9][0-9]{4,}`

## Python 的 re 模块
使用正则表达式，我们通常有下面的几种需求

* 验证是否匹配字符串
* 验证字符串中有正则表达式表示的字符
* 符合正则表达式的字符串提取
* 正则表达式替换
* 字符串分割

因此从 re 包中可以到处的函数如下

* compile(pattern, flags=0)
* match(pattern, string, flags=0)
* search(pattern, string, flags=0)
* findall(pattern, string, flags=0)
* sub(pattern, repl, string, count=0, flags=0)
* subn(pattern, repl, string, count=0, flags=0)
* split(pattern, string, maxsplit=0, flags=0)

一般的处理流程是编译正则表达式，获取一个 regex 对象，然后使用该对象的方法。每个函数对象里面包含的方法和 re 包中包含的一样(除了 compile 函数)。 实际上是 re 模块里面的函数调用了 regex 对象的相应的方法，下面是 re 包中 match 函数的实现，其他函数也是类似的。

```py
def match(pattern, string, flags=0):
    return _compile(pattern, flags).match(string)
```

re 包中的函数是先编译 regex 对象，然后调用其方法的。因为 re 模块有一块缓存区用来保存匹配过的正则表达式，所以速度也不会很慢，但是还是建议使用 regex 对象。

上面的函数都有一个 flags 参数，其实只是用来编译的，因为 re 包中的函数需要先编译再调用其他方法，所以每个函数都有一个 flag 参数。每个 flag 表示的含义如下

```py
# ignore case
I = IGNORECASE = sre_compile.SRE_FLAG_IGNORECASE 

# assume current 8-bit locale
L = LOCALE = sre_compile.SRE_FLAG_LOCALE 

# assume unicode locale
U = UNICODE = sre_compile.SRE_FLAG_UNICODE 

# make anchors look for newline
M = MULTILINE = sre_compile.SRE_FLAG_MULTILINE 

# make dot match newline
S = DOTALL = sre_compile.SRE_FLAG_DOTALL 

# ignore whitespace and comments
X = VERBOSE = sre_compile.SRE_FLAG_VERBOSE 
```

## 例子
`match()` 和 `search()` 如果匹配的话，会返回一个匹配对象，否则会返回 None。匹配对象有 `group()` 与 `groups()` 方法。 `group()` 会返回匹配的字符串， 而`groups()` 返回存在的子组元组的元组，如果不存在匹配的子组，则返回`()`。

```py
g = re.match('foo', 'foo') # 匹配对象
g.group() # 'foo'
g.groups() # ()

g = re.match('foo(\d+)', 'foo2033d') 
g.group() # 'foo2033'
g.groups() # ('2033',)

g = re.match('^foo(\d+)', 'foo2033d') # 同上
g = re.match('^foo(\d+)$', 'foo2033d') # None
g = re.match('foo(\d+)', 'dfoo2033d') # None
```

从上面最后一组的值，可以知道，`re.match` 默认从头开始匹配，但是并不默认一定要完全匹配到字符串末尾，除非使用结束符 `$` 。

`re.search` 与 `re.match`的区别正在于此，`re.search`并不一定要从头开始，比如说上面四组匹配结果如下

```py
g = re.search('foo(\d+)', 'foo2033d') # 匹配成功
g = re.search('^foo(\d+)', 'foo2033d') # 匹配成功
g = re.search('^foo(\d+)$', 'foo2033d') # None
g = re.search('foo(\d+)', 'dfoo2033d') # 匹配成功
```

`re.findall` 跟 `re.search` 与 `re.match` 的区别是什么呢？第一，`re.search` 与 `re.match` 只匹配一次。 第二，`re.findall` 总会返回一个列表，不管匹配不匹配。

```py
g = re.match('foo(\d+)', 'foo2033foo9d')
g.group() # 'foo2033'
g.groups() # ('2033',)

l = re.findall('foo(\d+)', 'foo2033foo9d')
l # ['2033', '9']
l = re.findall('foo\d+', 'foo2033foo9d')
l # ['foo2033', 'foo9']
```

`re.findall` 返回的列表，如果正则表达式有子组，则匹配返回的子组列表，否则返回整个正则表达式的匹配列表。

`re.sub` 与 `re.subn` 是用来做字符串替换的，它们唯一的区别是前面的返回替换了的字符串，后面返回一个替换之后的字符串和替换次数的元组。

```py
r = re.sub('foo(\d+)','*', 'foo2033foo9d')
r # '**d'

r = re.subn('foo(\d+)','*', 'foo2033foo9d')
r # ('**d', 2)
```

`re.split` 使用正则表达式作为分隔符，但有子组和无子组的情况是不一样的，有子组的会分割字符串，但会留下子组的匹配值。

```py
l = re.split('foo(\d+)', 'foo2033foo9d')
l # ['', '2033', '', '9', 'd']

l = re.split('foo\d+', 'foo2033foo9d')
l # ['', '', 'd']
```

