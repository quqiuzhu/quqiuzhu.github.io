---
title: Python 学习笔记 迭代器和生成器
date: 2016-04-06 23:08:59
categories: python
tags:
- python
---

## 迭代器
一个迭代器是一个实现了`__iter__()`方法和 `next()`方法的对象，但是我发现这两个并不需要一起实现，就像Java中一样，返回迭代子的对象和迭代子是分离的。 `__iter__()` 只是返回迭代器，真正进行迭代的是实现了 `next()`方法的，所以可以在 `for i in r` 的r中实现一个`__iter__()`方法，然后返回一个实现了`next()`方法的对象
```py
class Itrator(object):
    def __init__(self):
        self.i = 4;
        
    def next(self):
        if self.i:
            self.i -= 1
            return self.i
        else:
            raise StopIteration

class Iterable(object):
    def __iter__(self):
        return Itrator()

for i in Iterable():
    print i
```
<!-- more -->
当然一般上都可以把这两个方法写在同一个类里面，python里和Java是一样的，一个是Iterable，一个是Itrator。

## 生成器
有两种生成器，第一种是产生值的生成器，像下面这样的
```py
def power(values):
    print 'xxxx'
    for value in values:
        yield value
```
第二种种是作为表达式的生成器，这种生成器需要接受外面的输入，像下面这样的
```py
def psychologist():
    print 'plaese tell me your problem'
    while True :
        answer = (yield)
        if answer is not None:
            if answer.endswith('?'):
                print 'what is you question?'
            elif 'good' in ans:
                print 'good good'
            else:
                print 'hahaha'
        else:
            raise StopIteration
```
### 第一种生成器
这种生成器是可以迭代的，因为生成器函数会返回一个生成器对象，而生成器实现了`next` 和 `__iter__`方法，所以是可以迭代的。

另外，由于生成器函数默认会返回一个生成器，所以生成器方法中return 语句不能返回任何东西，否则就会出错。

生成器最重要的一个特性，是可以暂停并保持生成器方法的状态，直到调用下一个生成器方法，这一种特性被用在协同程序中。

一开始调用生成器函数时，除了返回一个生成器对象之外，不会执行任何代码。因此，在上面的power 方法中，即便是 print 'xxxx'语句在 关键字yield之前，也不会执行。这些代码是初始代码，将会在第一个next方法调用的时候执行。

### 第二种生成器
这种生成器需要外面给它传值，有四个方法,分别是 `next()`, `send(val)`, `throw(err)`, `close()`。

`send(val)` 方法给生成器传值，每一次传值就是一次迭代

`next()` 方法等价于 `send(None)`， 因此迭代该生成器，就相当于不断发送None 值，直到遇到 StopIteration 异常。

`close()` 相当于做了一个停止的标记，之后不能再调用 send 和 next 方法，否则会得到 StopIteration 异常，但是可以调用throw方法。 

`throw(err)` 方法会向生成器发出异常，而不是向外发出。要理解这一点并不难，因为这样外面调用者就可以随意停止迭代了。

### 生成器的几个应用
* 协程
* 生成器表达式（类似列表推导）


## itertools
这里面的函数一般都以i开头。

`islice()` 窗口迭代，第一个参数是iterable对象，后面如果只有一个参数，则是stop位置，如果两个参数则是start 和 stop，第三个参数是步长
```py
a = range(10)
list(itertools.islice(a, 4))
Out: [0, 1, 2, 3]
list(itertools.islice(a, 4, None))
Out: [4, 5, 6, 7, 8, 9]
list(itertools.islice(a, 4, None, 2))
Out: [4, 6, 8]
```

`count`,`cycle`,`repeat` 无限迭代，第一个一段整数不断递增或者递减，第二个传入一个可迭代对象，然后就会得到一个循环迭代。repeat函数会一直重复迭代一个元素。
```py
list(itertools.islice(itertools.count(20), 4))
Out: [20, 21, 22, 23]
list(itertools.islice(itertools.count(20,-1), 4))
Out: [20, 19, 18, 17]
list(itertools.islice(itertools.repeat(-1), 4))
Out: [-1, -1, -1, -1]
list(itertools.islice(itertools.cycle([1,2,3]), 4))
Out: [1, 2, 3, 1]
```

`chain`, 传入一组可迭代对象，按顺序迭代，有时候知道是列表等明确的数据类型的时候，是不需要这个函数的，一般也可以先转换，再连接，但又太浪费内存资源了。所以写一个共用库的时候，最后记得用这个。

相似的是`tee`, 传入一个iterable对象，返回多个iterable对象，默认返回两个
```py
l1 = [2,3,9,4,7,1]
l2 = [3,3,3,3,3,3]
list(itertools.chain(l1,l2)))
Out: [2, 3, 9, 4, 7, 1, 3, 3, 3, 3, 3, 3]
i1,i2 = itertools.tee(l1,2)
i1.next()
Out: 2
i2.next()
Out: 2
```

`compress`,`ifilter`,`ifilterfalse` 过滤迭代，`compress`函数传入iterable数据，第二个iterable选择条件，而`ifilter`,`ifilterfalse`，第一个参数是筛选函数，第二个参数是数据。下面是选择征兵青年，输出年龄在18-24岁的人名，用这3个函数分别的完成方式
```py
candidates = [
	(8,'zhangsan'), 
	(21, 'lisi'), 
	(19, 'wangmazi'),
	(40, 'laozi')
]
list(itertools.compress(
	 	(c[1] for c in candidates),
	 	(18 <= c[0] <= 22 for c in candidates)
	 )
)
Out: ['lisi', 'wangmazi']
list(itertools.ifilter(
		lambda x:18 <= x[0] <= 22,
	 	(c for c in candidates)
	 )
)
Out: [(21, 'lisi'), (19, 'wangmazi')]
```
`ifilterfalse`函数与`ifilter`只是条件函数不同，就不列举了。这里可以发现一个轻微的不同，我只要输出名字，但是`ifilter`输出了 candidate 列表。但是如果只传入名字作为参数，又无法判断，只能输入 candidate 列表，因为输入的数据和输出的数据是同源的，返回的就只能是 candidate列表。该例子说明了为什么有了 `ifilter` 还需要 `compress` 的原因，当需要返回的数据不足以作为筛选判断条件的时候，`compress` 就非常有用。

`takewhile`,`dropwhile` 第一个参数是筛选函数，第二个参数是数据。`takewhile` 是一开始就拿，直到条件不满足为止；`dropwhile` 一开始不要，直到条件不满足，然后拿之后的所有数据。所以`takewhile`倾向于拿前面的数据，`dropwhile`倾向于拿后半部分的数据。
```py
list(itertools.takewhile(lambda x: x<5, [1,4,6,4,1]))
Out: [1, 4]
list(itertools.dropwhile(lambda x: x<5, [1,4,6,4,1]))
Out: [6, 4, 1]
```

`izip()`, `izip_longest()` 装包函数，把几个课迭代的对象组合起来，返回元组迭代
```py
list(itertools.izip('ABCD', 'xy'))
Out: [('A', 'x'), ('B', 'y')]
list(itertools.izip_longest('ABCD', 'xy'))
Out: [('A', 'x'), ('B', 'y'), ('C', None), ('D', None)]
list(itertools.izip_longest('ABCD', 'xy', fillvalue = '-'))
Out: [('A', 'x'), ('B', 'y'), ('C', '-'), ('D', '-')]
```

`imap()`, `starmap()` 第一个参数是函数，后面的是传入的数据，返回的是函数的返回值序列 `imap()` 先把后面的一串可迭代对象装包，`starmap()`是后面参数已经装包好了的
```py
list(itertools.imap(operator.add, (2,3,10), (5,2,3)))
Out: [7, 5, 13]
list(itertools.imap(operator.add, (2,3,10), (5,2)))
Out: [7, 5]
```

`groupby()` 将迭代对象变为按连续的key分组，返回是一个迭代对象，该对象为(key, subgroup) 形式。这里只是让key不连续重复，并不会保证key不重复
```py
lst = 'get uuuuuuuuuuuuuuupd'
def group(data):
    for k,g in itertools.groupby(data):
        print k,list(g)
group(lst)
Out: 
g ['g']
e ['e']
t ['t']
  [' ']
u ['u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u']
p ['p']
d ['d']
```

`product()`, `permutations()`, `combinations()` 笛卡尔乘法、排列和组合。笛卡尔乘包含自身与自身的组合，排列不包含，而组合不按顺序来。这个不举例子，可以将一些双重循环变成单循环
