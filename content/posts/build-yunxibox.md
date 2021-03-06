---
title: 打造一款直播硬件
date: 2017-06-04 15:26:03
tags:
comment: true
---

离上次写博客已经过去6个月了， 这段时间我一直在做一款直播硬件「云犀BOX」，现在产品已经日臻完善，开始对外销售了。在我们公司[云犀直播]的官网上可以看到它的一些介绍。

<!-- more -->

与一般的手机直播不一样，我们追求的是专业级的高质量的直播。 手机摄像头因为诸多限制，应用在稍微大一些的场景的话效果会差很多。 专业直播的应用场景一开始是一些电视媒体，体育赛事直播等。在我们发布「云犀BOX」之前，专业直播是比较困难，花费人力和财力的事情。 一般专业直播的流程是这样的:

> A公司要准备一场发布会直播，它先去找企业直播服务公司B建立一个直播活动(直播间)，设置好直播间的封面，和其他一些公司宣传的内容。 之后B公司派员工C到直播现场执行直播，员工C带上摄像机、upmost(视频采集卡)和笔记本电脑，摄像机连接视频采集卡，视频采集卡连接到电脑，配置电脑上的OBS(专业直播软件)，设置好RTMP推流地址，然后开始直播。

对于需求方和提供直播服务的公司来说，人都是一个瓶颈。近两年来，直播作为一种内容形式被广泛接受，一些公司已经用直播作为其日常与用户沟通的渠道，比如「得到」的周会直播。这些公司和团体并没有专业的知识，搭建一个公司的直播频道的有可能只是初入职场的一个运营实习生，所以直播应该更加简单，让普通人第一次上手就会用。

所以我们做了这款「云犀BOX」，只需要一个摄像机，一根HDMI线，一个比手机稍大的「云犀BOX」连上之后点击开始直播就好了。摄像机和「云犀BOX」可以通过热靴云台连在一起，如果扛摄像机直播的话也会非常方便。

「云犀BOX」是由完全自主研发的一款产品，能自己做的都自己做了，包括直播推流SDK、板卡设计、外观设计等，当然也包含了里面的软件，我们就此申请了3款专利。

其中软件部分最核心的是推流SDK，我们花了很长时间优化，前三个月一直在搞推流SDK，后面也一直有优化。其实各个视频云平台都有推流SDK，比如七牛、阿里云。为了能够针对我们的硬件进行优化，我们选择重新实现，现在推流的流畅性与稳定性比平均水平高很多的。

硬件部分，从包装到电源板卡芯片，任何可能出错的地方都出错过，不可能出错的地方也出错过，因此推出时间比我们预想的要迟一个半月左右。即便这样，这款硬件能在半年内做出来并上市，让我感受到了中国硬件产业链的成熟。

人工智能时代，科技公司不应该只玩软件了，还需要会玩硬件和算法的。

[云犀直播]: http://yunxi.tv/site/box
