---
title: Python 学习笔记 高性能容器 collections
date: 2016-04-17 20:54:06
tags:
- python
---

Python 支持四种内建的集合类型 dict, list, set 和 tuple, 这些类型覆盖了大多数的使用场景。作为补充，collections 提供了几种高性能容器数据类型，Counter, deque, defaultdict 和 OrderedDict，以及 namedtuple() 函数。
<!-- more -->
## Counter
先不忙讲 Counter 怎么用，先想想如果你来实现一个计数器，应该怎么实现，有哪些功能。我列一下，至少有 3 个功能。

1. 接收要统计的数据
2. 更新统计数据
3. 获取统计结果

其中 1 和 3 都涉及和 Python 内建类型之间的转换，2 涉及 Counter 之间的交互。

#### 接收要统计的数据
数据一般是从构造函数传入，参数可以为 iterable 对象，也可以是 mapping 或者关键字参数。 

```py
c = Counter('quqiuzhu')
c = Counter({'qu': 1, 'qiu': 2, 'zhu': 3})
c = Counter(qu=1, qiu=2, zhu=3)
``` 
上面的例子看起来好像是 Counter 里面的 key 必须是字符串类型，value 必须是 int 类型的，实际上并没有这样的限制。比如可以像这样

```py
cc = Counter({'qu': 1, 4: 2, 'zhu': 'str'})
```
不过在 Counter 之间计算的时候会有一些问题，比如两个 Counter 相加的时候。

#### 更新统计数据
单个数据的更新和访问，支持下标访问，如果 Counter 中没有该记录，则返回 0。

```py
c['quqiuzhu.com'] # 0
c['quqiuzhu.com'] = 10 # 10
```

批量更新有两个方法，`subtract([iterable-or-mapping])` 和 `update([iterable-or-mapping])`，参数可以是 iterable, dict, 关键字参数或者 Counter 对象。 `subtract` 方法对 key 相同的 value 简单的应用减法运算，如果 value 不支持减法运算的话，就会出错，比如上面提到的，value 为 字符串的情况。

Counter 之间也可以进行 +, -, |, & 运算，和你想象中的一样，都是相同 key 的 value 值之间的运算。

#### 获取统计结果
`most_common([n])` 获取计数最多的 n 个 (key, value)的列表，`items()` 返回所有的，`elements()` 获取统计计数大于等于 2 的。

可以使用 set, list, dict 转为相应类型。 

## deque
实现了双端队列的 API, 当队列为定长队列时，如果队列 isFull，则丢弃另一端的 items。

* append(x)
* appendleft(x)
* extend(iterable)
* extendleft(iterable) 其中 iterable item 顺序会反过来
* pop()
* popleft()
* clear()
* count(x)
* remove(x)
* reverse() 原地反转, 返回None
* rotate(n)

支持随机访问，但性能不是很好。有只读属性 maxlen, 支持函数操作 len(d), reversed(d), copy.copy(d), copy.deepcopy(d)

## defaultdict 与 OrderedDict
该结构扩展自内建类型 dict 。给所有新的 key 一个默认值，该默认值来自于参数 default_factory。
用法如下:

```py
d = defaultdict(list)
d['k'] # []
```
由于当前没有 key 'k', 所以 defaultdict 调用 default_factory 函数，创建了一个默认值。 这里的 default_factory 是 list 函数。

OrderedDict items 是按照顺序存放的，用来做相等性检测是很好的。

```py
d = {'banana': 3, 'apple':4, 'pear': 1, 'orange': 2}
OrderedDict(sorted(d.items(), key=lambda t: t[0]))
```
可以指定排序函数

## namedtuple()
这是非常经典，非常有意思的一个函数，其简单用法如下：

```py
Point = namedtuple('Point', ['x', 'y'])
```

这个 Point 是一个类，该类增强了内建的 tuple 类型。 使其支持一般的 tuple操作，也同时支持名称访问，上面的代码，其实现为

```py
class Point(tuple):
    'Point(x, y)'

    __slots__ = ()

    _fields = ('x', 'y')

    def __new__(_cls, x, y):
        'Create a new instance of Point(x, y)'
        return _tuple.__new__(_cls, (x, y))

    @classmethod
    def _make(cls, iterable, new=tuple.__new__, len=len):
        'Make a new Point object from a sequence or iterable'
        result = new(cls, iterable)
        if len(result) != 2:
            raise TypeError('Expected 2 arguments, got %d' % len(result))
        return result

    def __repr__(self):
        'Return a nicely formatted representation string'
        return 'Point(x=%r, y=%r)' % self

    def _asdict(self):
        'Return a new OrderedDict which maps field names to their values'
        return OrderedDict(zip(self._fields, self))

    def _replace(_self, **kwds):
        'Return a new Point object replacing specified fields with new values'
        result = _self._make(map(kwds.pop, ('x', 'y'), _self))
        if kwds:
            raise ValueError('Got unexpected field names: %r' % kwds.keys())
        return result

    def __getnewargs__(self):
        'Return self as a plain tuple.   Used by copy and pickle.'
        return tuple(self)

    __dict__ = _property(_asdict)

    def __getstate__(self):
        'Exclude the OrderedDict from pickling'
        pass

    x = _property(_itemgetter(0), doc='Alias for field number 0')

    y = _property(_itemgetter(1), doc='Alias for field number 1')
```

其内部实现为 String 定义模板加上 `exec class_definition in namespace` 来实现。有兴趣的可以查看其源代码。

新建一个 namedtuple 条目

```py
p = Point(11, 22)
p.x # 11
```

总结以上，其 API 列表为

* somenamedtuple._make(iterable)
* somenamedtuple._asdict()
* somenamedtuple._replace(kwargs)

## ABC 集合抽象基类
下面的表格摘自 [Python 官方文档][python]

![][image]

[python]: https://docs.python.org/2/library/collections.html
[image]: http://quqiuzhu.com/images/python_abc.png

