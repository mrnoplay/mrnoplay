
![不玩家顶栏横幅](https://i.loli.net/2020/07/20/W1JLTH9lCdG6bDe.png)

<div style="text-align:center;"><a href="https://github.com/scris/mrnoplay/blob/master/README.md">English Version</a></div>

### 这是什么

在学习生活的过程中，按时保质保量把事情做成是非常重要的，但是因为这样那样的原因，有时难以或无法完成任务。怎么办呢？这就需要效率软件了。原有的效率软件大多数都专注于提高工作时的效率，但是休息的时候玩得停不下来，才是对计划的最大威胁！
        
你大概率也曾有这样的一天：想着玩5分钟，但是结果一个上午没了，你想着下午一定要好好努力，打开电脑想要把ppt做了，结果ppt是做完了，但是做完之后你又看了2个小时的新闻，再看一眼时间，马上要吃晚饭了……

你有足够好的效率工具让你专心工作，但没有工具保证不因过度娱乐使计划破产。你需要 Mr Noplay, 让时间可控。


### 下载

对于你的 Win7+ 或 macOS 设备，请[去官网下载](https://mrnoplay.scris.top/)对应版本。

你还可以通过<a href="https://www.softpedia.com/get/Gaming-Related/Mr-Noplay.shtml">Softpedia</a> <img src="https://i.loli.net/2020/07/18/MZ7pH5ys4QmwLbi.png" width="30" height="29" />  或[蓝奏云](https://www.lanzous.com/b01n0vl3a)（密码 3n6k）下载，或尝试[仅包含部分功能的网页版](https://webmrnoplay.scris.top/).

如果你确实有使用 Linux 版的需求，请联系我或自行编译。Android 版和 iOS 版目前属于远期规划。

有任何问题，请提出 issue 或通过电子邮件联系我。地址：`tianze%scris.top` (% → @)

### 功能

- 美观现代的用户界面
- Win + macOS 双系统支持
- English + 简体中文 双语言支持
- 合理有效的时间管理逻辑
- 进入应用先进入“展台模式”，全屏不能离开，促进列出计划
- 超时过多后自动关机，防止超时时间不可控
- 暂停、继续（暂停期间全屏不可退出）
- 超时一定时间后，进行惩罚（恼人声音等）促进用户停止
- “今日视图”设置一天的最大可玩时间
  - **提示** 达到“今日视图”时间限额后，就不能继续使用电脑了（除非有急事，可以用R点兑换更多时间），所以建议一直设置“今日视图”时间限额
- “R点”积分系统
- 支持开机自启
- 支持“控制模式”，设置后必须输入密码才能更改设置和退出 Mr Noplay 不玩家
  - **提示** 可以让信任的身边人帮忙输入“控制模式”密码
- 教程
- 允许设置默认时间

### 版权说明

Copyright (c) 2019-2020 **[Tianze Ds Qiu](https://ds.scris.top/)** and other contributors. All rights reserved.

我们遵循 MPL v2.0 协议.

有关我们使用的包等更多信息，请查阅 Fossa。（英文）

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fscris%2Fmrnoplay.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fscris%2Fmrnoplay?ref=badge_large)

### 语言

- 简体中文
- English
- 如果有其他语言的需求，请开一个 issue。

### 构建操作

```shell
# 获取依赖
yarn
cd electron
yarn

# 浏览器开发模式（适合调试界面样式）
yarn run dev

# 桌面端编译（通过 electron）
yarn run electron-mac
yarn run electron-win

# 网页版编译 (文件在 ../mrnoplay.web/)
yarn run web
```

### 屏幕截图

![不玩家屏幕截图](https://i.loli.net/2020/07/18/nxjyPUsJuClo67i.png)
