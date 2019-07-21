---
title: Ubuntu Wechat
date: 2019-05-30 
tags: 
- wechat
- tool
---

{{< figure src="https://quqiuzhu-com.oss-cn-beijing.aliyuncs.com/img/2019-05-30-wechat-desktop.png?Expires=1563682493&OSSAccessKeyId=TMP.hY1Rks4nFtEbn2ikYCcCUBXRArhLj38dbXFR1fQhzeTSxf6e49HTUE6K5oc7Qpf2V5wcNuCQ5YqqNiRUFkKFmfCdvTD7z98qY7YwNcghNb6E22XjC4dbM64Pccyv6B.tmp&Signature=N9z1as%2FBqVm%2BTfPGNpbhBeKeBZc%3D" >}}

一直以来，Linux不太适合日常工作，其中一个原因就是微信没有Linux版本。有很多不靠谱的第三方客户端，有这样那样的问题，这里就不推荐了。这里推荐微信的网页版，可以直接浏览器输入网址 [wx.qq.com][wechat]，这样的话微信只是浏览器中的一个 Tab，由于和其他网页混在一起， 不方便找，提供两个解决方案。

#### google-chrome
如果你的机器上装有 Chrome 浏览器， 就装了 `google-chrome` 这个命令行工具，输入下列命令

```bash
google-chrome --app="https://wx.qq.com"
```

可将网页单独作为一个 App 运行在一个进程中， 并且隐藏掉了顶部的搜索框。 在 `Launcher` 上微信网页版和 Chrome 浏览器是两个分开的图标。 但是 Icon 还是一样的，有时候容易混淆。

#### nativefier
你也许听说过 [Electron][electron] 可以通过Web技术开发桌面应用。 推荐一个[工具][nativefier]，可以将任何的的在线网页变成一个桌面应用。首先你需要安装 `Node` 环境，然后安装 `Electron` 和 `Nativefier`。

```bash
npm install electron nativefier -g
```

然后运行下列命令，将微信网页版转换为本地应用，请先下载一张微信的图标，假如保存路径为 /tmp/wechat.png。

```bash
nativefier --name "wechat" --icon "/tmp/wechat.png" "https://wx.qq.com"
```

这样就在当前路径下生成了微信的本地应用， 目录为 `wechat-linux-x64`，执行`./wechat`打开微信应用，打开之后，以后就可以在 Launcher 打开了， 不需要每次都执行命令。

{{< figure src="https://quqiuzhu-com.oss-cn-beijing.aliyuncs.com/img/2019-05-30-wechat-files.png?Expires=1563682577&OSSAccessKeyId=TMP.hY1Rks4nFtEbn2ikYCcCUBXRArhLj38dbXFR1fQhzeTSxf6e49HTUE6K5oc7Qpf2V5wcNuCQ5YqqNiRUFkKFmfCdvTD7z98qY7YwNcghNb6E22XjC4dbM64Pccyv6B.tmp&Signature=y37%2BPDPUD3g62t1%2BRoKqtFYaYmg%3D" >}}


制作脚本，请将 icon 换成你自己的路径

```bash
#!/usr/bin/bash

# install nodejs
sudo apt install nodejs

# install electron
sudo ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" \
npm install -g electron --unsafe-perm=true --allow-root

# install nativefier
sudo ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/" \
npm install -g nativefier --unsafe-perm=true --allow-root

# make wechat app
nativefier --name "wechat" \
--icon "/data/deps/wechat/1200px-WeChat_logo.svg.png" \
"https://wx.qq.com" --unsafe-perm=true --allow-root

# launch wechat
cd wechat-linux-x64
./wechat
```

[wechat]: https://wx.qq.com
[nativefier]: https://github.com/jiahaog/nativefier
[electron]: https://github.com/electron/electron