---
title: Python 学习笔记 多进程 multiprocessing
date: 2016-04-14 13:13:04
categories: python
tags:
- python
---
Python 解释器有一个全局解释器锁(PIL)，导致每个 Python 进程中最多同时运行一个线程，因此 Python 多线程程序并不能改善程序性能，不能发挥多核系统的优势，可以通过[这篇文章][hard_problem]了解。

但是多进程程序不受此影响， Python 2.6 引入了 multiprocessing 来解决这个问题。这里介绍 multiprocessing 模块下的进程，进程同步，进程间通信和进程管理四个方面的内容。 这里主要讲解多进程的典型使用，multiprocessing 的 API 几乎是完复制了 threading 的API， 因此只需花少量的时间就可以熟悉 threading 编程了。
<!-- more -->
## Process
先来看一段代码

```py
from multiprocessing import Process, current_process
def func():
    time.sleep(1)
    proc = current_process()
    proc.name, proc.pid

sub_proc = Process(target=func, args=())
sub_proc.start()
sub_proc.join()
proc = current_process()
proc.name, proc.pid
```

这是在主进程中创建子进程，然后启动(start) 子进程，等待(join) 子进程执行完，再继续执行主进程的整个的执行流程。

那么，一个进程应该是用来做什么的，它应该保存一些什么状态，它的生命周期是什么样的呢？

一个进程需要处理一些不同任务，或者处理不同的对象。创建进程需要一个 function 和相关参数，参数可以是dict `Process(target=func, args=(), kwargs = {})`，`name` 可以用来标识进程。

控制子进程进入不同阶段的是 `start()`, `join()`, `is_alive()`, `terminate()`, `exitcode` 方法。这些方法只能在创建子进程的进程中执行。

## 进程同步
### Lock
锁是为了确保数据一致性，比如读写锁，每个进程给一个变量增加 1 ，但是如果在一个进程读取但还没有写入的时候，另外的进程也同时读取了，并写入该值，则最后写入的值是错误的，这时候就需要锁。

```py
def func(lock):
    lock.acquire()
    # do mysql query select update ...
    lock.release()
       
lock = Lock()
for i in xrange(4):
    proc = Process(target=func, args=(lock))
    proc.start()
```

Lock 同时也实现了 ContextManager API, 可以结合 with 语句使用, 关于 ContextManager, 请移步 [Python 学习实践笔记 装饰器 与 context][context] 查看。

### Semaphore
Semaphore 和 Lock 稍有不同，Semaphore 相当于 N 把锁，获取其中一把就可以执行了。 信号量的总数 N 在构造时传入，`s = Semaphore(N)`。 和 Lock 一样，如果信号量为0，则进程堵塞，直到信号大于0。

### Pipes
Pipe 是在两个进程之间通信的工具，Pipe Constructor 会返回两个端

```py
conn1, conn2 = Pipe(True)
```

如果是全双工的(构造函数参数为True)，则双端口都可接收发送，否则前面的端口用于接收，后面的端口用于发送。

```py
def proc1(pipe):
   for i in xrange(10000):
       pipe.send(i)

def proc2(pipe):
    while True:
        print "proc2 rev:", pipe.recv()

pipe = Pipe()
Process(target=proc1, args=(pipe[0],)).start()
Process(target=proc2, args=(pipe[1],)).start()
```

Pipe 的每个端口同时最多一个进程读写，否则数据会出各种问题

### Queues
multiprocessing.Queue 与 Queue.Queue 非常相似。其 API 列表如下

* qsize()
* empty()
* full()
* put()
* put_nowait()
* get()
* get_nowait()
* close()
* join_thread()
* cancel_join_thread()

当 Queue 为 Queue.Full 状态时，再 put() 会堵塞，当状态为 Queue.Empty 时，再 get() 也是。当 put() 或 get() 设置了超时参数，而超时的时候，会抛出异常。

Queue 主要用于多个进程产生和消费，一般使用情况如下

```py
def producer(q):
    for i in xrange(10):
        q.put(i)

def consumer(q):
    while True:
        print "consumer", q.get()

q = Queue(40)
for i in xrange(10):
    Process(target=producer, args=(q,)).start()
Process(target=consumer, args=(q,)).start()
```
十个生产者进程，一个消费者进程，共用同一个队列进行同步。

有一个简化版本的 multiprocessing.queues.SimpleQueue, 只支持3个方法 empty(), get(), put()。

也有一个强化版本的 JoinableQueue, 新增两个方法 task_done() 和 join()。 task_done() 是给消费者使用的，每完成队列中的一个任务，调用一次该方法。当所有的 tasks 都完成之后，交给调用 join() 的进程执行。

```py
def consumer(q):
    while True:
        print "consumer", q.get()
        q.task_done()

jobs = JoinableQueue()
for i in xrange(10):
        jobs.put(i)

for i in xrange(10):
    p = Process(target=consumer, args=(jobs,))
    p.daemon = True
    p.start()

jobs.join()
```

这个 join 函数等待 JoinableQueue 为空的时候，等待就结束，外面的进程可以继续执行了，但是那10个进程干嘛去了呢，他们还在等待呀，上面是设置了 `p.daemon = True`, 子进程才随着主进程结束的，如果没有设置，它们还是会一直等待的呢。

Lock、Pipe、Queue 和 Pipe 需要注意的是：尽量避免使用 Process.terminate 来终止程序，否则将会导致很多问题, 详情请移步[python 官方文档][multiprocessing]查看。

## 进程间数据共享
前一节中, Pipe、Queue 都有一定数据共享的功能，但是他们会堵塞进程, 这里介绍的两种数据共享方式都不会堵塞进程, 而且都是多进程安全的。

### 共享内存
共享内存有两个结构，一个是 `Value`, 一个是 `Array`，这两个结构内部都实现了锁机制，因此是多进程安全的。 用法如下：

```py
def func(n, a):
    n.value = 50
    for i in range(len(a)):
        a[i] += 10

num = Value('d', 0.0)
ints= Array('i', range(10))

p = Process(target=func, args=(num, ints))
p.start()
p.join()
```
Value 和 Array 都需要设置其中存放值的类型，d 是 double 类型，i 是 int 类型，具体的对应关系在Python 标准库的 sharedctypes 模块中查看。

### 服务进程 Manager
上面的共享内存支持两种结构 Value 和 Array, 这些值在主进程中管理，很分散。 Python 中还有一统天下，无所不能的 Server process，专门用来做数据共享。 其支持的类型非常多，比如list, dict, Namespace, Lock, RLock, Semaphore, BoundedSemaphore, Condition, Event, Queue, Value 和 Array 用法如下：

```py
from multiprocessing import Process, Manager

def func(dct, lst):
    dct[88] = 88
    lst.reverse()

manager = Manager()
dct = manager.dict()
lst = manager.list(range(5,10))

p = Process(target=func, args=(dct, lst))
p.start()
p.join()
print dct, '|', lst
Out: {88: 88} | [9, 8, 7, 6, 5]
```
一个 Manager 对象是一个服务进程，推荐多进程程序中，数据共享就用一个 manager 管理。

## 进程管理
如果有50个任务要执行, 但是 CPU 只有4核, 你可以创建50个进程来做这个事情。但是大可不必，徒增管理开销。如果你只想创建4个进程，让他们轮流替你完成任务，不用自己去管理具体的进程的创建销毁，那 Pool 是非常有用的。

Pool 是进程池，进程池能够管理一定的进程，当有空闲进程时，则利用空闲进程完成任务，直到所有任务完成为止，用法如下

```py
def func(x):
    return x*x

pool = Pool(processes=4)
print pool.map(func, range(8))
```
Pool 进程池创建4个进程，不管有没有任务，都一直在进程池中等候，等到有数据的时候就开始执行。
Pool 的 API 列表如下：

* apply(func[, args[, kwds]]) 
* apply_async(func[, args[, kwds[, callback]]])
* map(func, iterable[, chunksize])
* map_async(func, iterable[, chunksize[, callback]])
* imap(func, iterable[, chunksize])
* imap_unordered(func, iterable[, chunksize])
* close()
* terminate()
* join()

### 异步执行
apply_async 和 map_async 执行之后立即返回，然后异步返回结果。 使用方法如下

```py
def func(x):
    return x*x

def callback(x):
    print x, 'in callback'
    
pool = Pool(processes=4)
result = pool.map_async(func, range(8), 8, callback)
print result.get(), 'in main'
Out:
[0, 1, 4, 9, 16, 25, 36, 49] in callback
[0, 1, 4, 9, 16, 25, 36, 49] in main
```

有两个值得提到的，一个是 callback，另外一个是 multiprocessing.pool.AsyncResult。 callback 是在结果返回之前，调用的一个函数，这个函数必须只有一个参数，它会首先接收到结果。callback 不能有耗时操作，因为它会阻塞主线程。

AsyncResult 是获取结果的对象，其 API 如下

* get([timeout])
* wait([timeout])
* ready()
* successful()

如果设置了 timeout 时间，超时会抛出 multiprocessing.TimeoutError 异常。wait 是等待执行完成。 ready 测试是否已经完成，successful 是在确定已经 ready 的情况下，如果执行中没有抛出异常，则成功，如果没有ready 就调用该函数，会得到一个 AssertionError 异常。

### Pool 管理
这里不再继续讲 map 的各种变体了，因为从上面的 API 一看便知。

然后我们来看看 Pool 的执行流程，有三个阶段。第一、一个进程池接收很多任务，然后分开执行任务；第二、不再接收任务了；第三、等所有任务完成了，回家，不干了。

这就是上面的方法，close 停止接收新的任务，如果还有任务来，就会抛出异常。 join 是等待所有任务完成。 join 必须要在 close 之后调用，否则会抛出异常。terminate 非正常终止，内存不够用时，垃圾回收器调用的就是这个方法。


[hard_problem]: http://www.oschina.net/translate/pythons-hardest-problem
[context]: http://quqiuzhu.com/2016/python-decorator-and-context
[multiprocessing]: https://docs.python.org/2/library/multiprocessing.html
[sharedctypes]: http://pydoc.net/Python/multiprocessing/2.6.2.1/multiprocessing.sharedctypes/