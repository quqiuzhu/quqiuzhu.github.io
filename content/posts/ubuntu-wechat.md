---
title: Ubuntu Wechat
date: 2019-05-30 
tags: 
- wechat
- tool
---

一直以来，Linux不太适合日常工作，其中一个原因就是微信没有Linux版本。有很多不靠谱的第三方客户端，有这样那样的问题，这里就不推荐了。这里推荐微信的网页版，可以直接浏览器输入网址 [wx.qq.com][wechat]，这样的话微信只是浏览器中的一个 Tab，由于和其他网页混在一起， 不方便找，提供两个解决方案。

#### google-chrome
如果你的机器上装有 Chrome 浏览器， 就装了 `google-chrome` 这个命令行工具，输入下列命令

```bash
google-chrome --app="https://wx.qq.com"
```

可将网页单独作为一个 App 运行在一个进程中， 并且隐藏掉了顶部的搜索框。 在 `Launcher` 上微信网页版和 Chrome 浏览器是两个分开的图标。 但是 Icon 还是一样的，有时候容易混淆，看另外的解决方案解决这个问题。

#### nativefier
你也许听说过 [Electron][electron] 可以通过Web技术开发桌面应用。 推荐一个[工具][nativefier]，可以将任何的的在线网页变成一个桌面应用。首先你需要安装 `Node` 环境，然后安装 `Electron` 和 `Nativefier`，为适应中国网络环境，可以切换为淘宝NPM源。

```bash
npm --registry https://registry.npm.taobao.org install electron nativefier -g
```

然后运行下列命令，将微信网页版转换为本地应用，请先下载一张微信的图标，假如保存路径为 /tmp/wechat.png。

```bash
nativefier --name "wechat" --icon "/tmp/wechat.png" "https://wx.qq.com"
```

这样就在当前路径下生成了微信的本地应用， 目录为 `wechat-linux-x64`，执行下列命令打开微信应用。

```bash
cd wechat-linux-x64
./wechat
```

打开之后，以后就可以在 Launcher 打开了， 不需要每次都执行命令。这个应用比那些第三方客户端更靠谱，因为它是加载微信最新的网页，网页版能用，它就能用。

[wechat]: https://wx.qq.com
[nativefier]: https://github.com/jiahaog/nativefier
[electron]: https://github.com/electron/electron