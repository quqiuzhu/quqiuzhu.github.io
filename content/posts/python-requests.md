---
title: Requests 源代码浅析
date: 2016-09-04 10:16:10
tags:
- python
- server
- http
---


Requests是目前最流行的Python HTTP库，使用者众多，包括Amazon, Google, Twitter等大公司和美国国家安全局等政府机构。在[github][d0386d03]上有2w多的star。Requests的接口简单，符合人的直觉而且功能强大。比如持久 Cookie 的会话, Keep-Alive & 连接池,文件分块上传, 流下载, SSL 认证等。其大部分功能由其内置的[urllib3][856b1aaa]库实现。所以Requests最关心的不是如何实现协议，而是如何设计接口，正如作者[github][2d6b4460]自我介绍，「The only thing I really care about is interface design」。
<!-- more -->

## HTTP基础

#### URL
一个统一资源定位符被分为下面的六段

```
http://user:passwd@httpbin.org:80/basic-auth/user/passwd?name=quqiuzhu#1

<scheme>://<netloc>/<path>;<params>?<query>#<fragment>

<scheme>    http
<netloc>    user:passwd@httpbin.org:80
<path>      basic-auth/user/passwd
<query>     name=quqiuzhu
<fragment>  1
```

其中`<params>`叫做matrix parameters，`<query>`叫query parameters，`<params>`支持较少，关于这两种参数的讨论，请看[stackoverflow][027d218f]。

`<netloc>` 可继续细分为`<auth>`, `<host>`, `<port>`, 一般情况下，没有`<auth>`部分，和`<port>`部分。因为在url中明文传递用户名密码和不安全，而且对外提供服务的网站一般都采用默认端口(HTTP:80, HTTPS:443)。

`<fragment>` 通常用作一个网页的页内分段跳转。

#### HTTP
[bat][537f16be]是一个类似cUrl的API测试工具，执行命令时，其能完整显示整个HTTP协议的传输过程，比如当我对http://httpbin.org/ip做一个GET请求时，其命令为

```
➜  ~ bat http://httpbin.org/ip
```
其构造的请求(Request)如下

```
GET /ip HTTP/1.1
Host: httpbin.org
Accept: application/json
Accept-Encoding: gzip, deflate
User-Agent: bat/0.1.0
```
第一行是请求行，分别是谓词(方法)、路径和协议版本; 其后跟着的是头部信息(Host、Accept、Accept-Encoding 和User-Agent); 如果是POST或者PUT等请求，还可能会有BODY部分。

回复(Response)的文本如下

```
HTTP/1.1 200 OK
Server : nginx
Date : Sun, 04 Sep 2016 11:59:35 GMT
Content-Type : application/json
Content-Length : 32
Connection : keep-alive
Access-Control-Allow-Origin : *
Access-Control-Allow-Credentials : true


{
  "origin": "111.0.186.217"
}
```
第一行是回复行，分别为协议版本，状态码和状态描述; 其后是头部信息; 之后是空行(`\r\n`);再后面跟着的是BODY信息。

以上是一个HTTP请求的基本框架，是其他所有功能的基础。


## urllib3

Requests大部分HTTP协议功能是urllib3实现的，一直看到最后，会发现urllib3最底层是调用了Python标准库的httplib(Python3 http.client)。它实现下面这些功能

* Connection pooling
* File uploads with multipart encoding
* Helpers for retrying requests and dealing with HTTP redirects
* Support for gzip and deflate encoding
* Proxy support for HTTP and SOCKS

#### 连接池
urllib3 对外暴露的结构就两个，PoolManager 和 HTTPConnectionPool(HTTPSConnectionPool)。PoolManager管理了一堆的 ConnectionPool，每一个独立的(scheme, host, port)元祖使用同一个ConnectionPool, (scheme, host, port)是从请求的URL中解析出来的。

PoolManager使用自己实现的RecentlyUsedContainer容器来管理ConnectionPool，一旦
ConnectionPool超过限制，则逐出最远使用的ConnectionPool。ConnectionPool内部使用LifoQueue来管理 HTTPConnection，HTTPSConnection和VerifiedHTTPSConnection。XXXXConnection都继承至httplib的httplib.HTTPConnection或者httplib.HTTPSConnection。

典型使用案例

```
>>> http = urllib3.PoolManager(num_pools=50)
>>> r = http.request('GET', 'http://httpbin.org/ip')
>>> r.data
'{\n  "origin": "111.0.186.217"\n}\n'
```

同样可以使用 ConnectionPool

```
>>> http = urllib3.HTTPConnectionPool('httpbin.org')
>>> r = http.request('GET', 'http://httpbin.org/ip')
>>> r.data
'{\n  "origin": "111.0.186.217"\n}\n'
```

PoolManager 与 ConnectionPool有相似的API，是因为它们有共同的父类RequestMethods

```
class RequestMethods(object):
    def urlopen(self, method, url, body=None, headers=None,
                encode_multipart=True, multipart_boundary=None,
                **kw)
    def request(self, method, url, fields=None, headers=None,
                **urlopen_kw)
    ...
```

#### multipart编码文件上传
urllib3 中POST, PUT, PATCH等方法，可以使用两种Content-Type上传数据，一种是application/x-www-form-urlencoded，一般用来传递非文件数据，还有一种就是multipart/form-data，可以传输数据也可以传输文件。

使用bat命令查看Content-Type为application/x-www-form-urlencoded的请求
```
➜  ~ bat -f=true http://httpbin.org/post name=qiuzhu age=18
```

HTTP请求
```
POST /post HTTP/1.1
Host: httpbin.org
Accept: application/json
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
User-Agent: bat/0.1.0


name=qiuzhu&age=18
```

使用bat上传文件，其Content-Type为multipart/form-data的请求
```
➜  ~ bat -f=true http://httpbin.org/post name=qiuzhu f@f.txt
```

HTTP请求
```
POST /post HTTP/1.1
Host: httpbin.org
Accept: application/json
Accept-Encoding: gzip, deflate
Content-Type: multipart/form-data; boundary=386e4e1c64f
User-Agent: bat/0.1.0


--386e4e1c64f
Content-Disposition: form-data; name="f"; filename="f.txt"
Content-Type: application/octet-stream

text in the f.txt

--386e4e1c64f
Content-Disposition: form-data; name="name"

qiuzhu
--386e4e1c64f--
```
区别在于，application/x-www-form-urlencoded类型的请求会使用urlencode来编码数据，然而multipart/form-data会使用一个边界字符串来区分每一个数据Item，以及请求的起始和结束位置。

filepost模块中的encode_multipart_formdata和fields模块的RequestField都实现了相关功能。使用方式如下

```
>>> file_data = open('/Users/xshare/Desktop/f.txt').read()
>>> http = urllib3.PoolManager()
>>> r = http.request(
        'POST',
        'http://httpbin.org/post',
        fields={'filefield': ('f.txt', file_data)}
)
>>> r.data
```

#### 自动跳转 与 gzip/deflate编码
重试和自动跳转的逻辑很简单，就是检测到重定向状态码(303)之后，重试次数加1，如果超过最大重试次数，则抛出异常。

Retry不仅能实现redirects的计数，而且还有Read和Connect的重试。

自动跳转的逻辑实现在 PoolManager 的 urlopen中，值得注意的是，跳转之后，method为变为GET。

当HTTP Response的Content-Type为gzip/deflate时，对该数据进行编码，使用的库为zlib，这部分的逻辑实现在 response模块的 HTTPResponse中。

[d0386d03]: https://github.com/kennethreitz/requests "Requests: HTTP for Humans"
[856b1aaa]: https://github.com/shazow/urllib3 "urllib3"
[027d218f]: http://stackoverflow.com/questions/2048121/url-matrix-parameters-vs-request-parameters "URL matrix parameters vs. request parameters"
[537f16be]: https://github.com/astaxie/bat "bat"
[2d6b4460]: https://github.com/kennethreitz "kennethreitz"
[c66aa8ab]: http://www.ruanyifeng.com/blog/2016/08/http.html "HTTP 协议入门"
[edd544d1]: https://imququ.com/post/four-ways-to-post-data-in-http.html "四种常见的 POST 提交数据方式"
