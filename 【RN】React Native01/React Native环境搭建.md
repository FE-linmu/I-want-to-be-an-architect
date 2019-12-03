## React Naitve 

<img src="./assets/logo.jpg" style="float:right;width:120px;margin-top:-48px;" />

[TOC]

## 1.环境搭建

### Mac

**IOS**：必须安装的依赖有：Node、Watchman 和 React Native 命令行工具以及 Xcode。

虽然你可以使用`任何编辑器`来开发应用（编写 js 代码），但你仍然必须安装 Xcode 来获得编译 iOS 应用所需的工具和环境。

### Node, Watchman

我们推荐使用[Homebrew](http://brew.sh/)来安装 Node 和 Watchman。在命令行中执行下列命令安装：

```
brew install node
brew install watchman
```

如果你已经安装了 Node，请检查其版本是否在 v8.3 以上。安装完 Node 后建议设置 npm 镜像以加速后面的过程（或使用科学上网工具）。

> 注意：不要使用 cnpm！cnpm 安装的模块路径比较奇怪，packager 不能正常识别！

```
npm config set registry https://registry.npm.taobao.org --global
npm config set disturl https://npm.taobao.org/dist --global
```

[Watchman](https://facebook.github.io/watchman)则是由 Facebook 提供的监视文件系统变更的工具。安装此工具可以提高开发时的性能（packager 可以快速捕捉文件的变化从而实现实时刷新）。

### Yarn、React Native 的命令行工具（react-native-cli）

[Yarn](http://yarnpkg.com/)是 Facebook 提供的替代 npm 的工具，可以加速 node 模块的下载。React Native 的命令行工具用于执行创建、初始化、更新项目、运行打包服务（packager）等任务。

```
npm install -g yarn react-native-cli
```

安装完 yarn 后同理也要设置镜像源：

```
yarn config set registry https://registry.npm.taobao.org --global
yarn config set disturl https://npm.taobao.org/dist --global
```

安装完 yarn 之后就可以用 yarn 代替 npm 了，例如用`yarn`代替`npm install`命令，用`yarn add 某第三方库名`代替`npm install 某第三方库名`。

### Xcode&&Xcode命令行工具

React Native 目前需要[Xcode](https://developer.apple.com/xcode/downloads/) 9.4 或更高版本。你可以通过 App Store 或是到[Apple 开发者官网](https://developer.apple.com/xcode/downloads/)上下载。这一步骤会同时安装 Xcode IDE、Xcode 的命令行工具和 iOS 模拟器。

启动 Xcode，并在`Xcode | Preferences | Locations`菜单中检查一下是否装有某个版本的`Command Line Tools`。Xcode 的命令行工具中包含一些必须的工具，比如`git`等。

![GettingStartedXcodeCommandLineTools](./assets/GettingStartedXcodeCommandLineTools.png)



-----------------------------------------------------

**Android**：必须安装的依赖有：Node、Watchman 和 React Native 命令行工具以及 JDK 和 Android Studio，

虽然你可以使用`任何编辑器`来开发应用（编写 js 代码），但你仍然必须安装 Android Studio 来获得编译 Android 应用所需的工具和环境。

### Java Development Kit

React Native 需要 Java Development Kit [JDK] 1.8（暂不支持 1.9 及更高版本）。你可以在命令行中输入

> `javac -version`来查看你当前安装的 JDK 版本。如果版本不合要求，则可以到 [官网](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)上下载。

### Android 开发环境

如果你之前没有接触过 Android 的开发环境，那么请做好心理准备，这一过程相当繁琐。请`万分仔细`地阅读下面的说明，严格对照文档进行配置操作。

> 译注：请注意！！！国内用户`必须必须必须`有稳定的翻墙工具，否则在下载、安装、配置过程中会不断遭遇链接超时或断开，无法进行开发工作。某些翻墙工具可能只提供浏览器的代理功能，或只针对特定网站代理等等，请自行研究配置或更换其他软件。总之如果报错中出现有网址，那么 99% 就是无法正常翻墙。

#### 1. 安装 Android Studio

[首先下载和安装 Android Studio](https://developer.android.google.cn/studio)，国内用户可能无法打开官方链接，请自行使用搜索引擎搜索可用的下载链接。安装界面中选择"Custom"选项，确保选中了以下几项：

```
Android SDK``Android SDK Platform``Performance (Intel ® HAXM)` ([AMD 处理器看这里](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html))`Android Virtual Device
```

然后点击"Next"来安装选中的组件。

> 如果选择框是灰的，你也可以先跳过，稍后再来安装这些组件。

安装完成后，看到欢迎界面时，就可以进行下面的操作了。

#### 2. 安装 Android SDK

Android Studio 默认会安装最新版本的 Android SDK。目前编译 React Native 应用需要的是`Android 9 (Pie)`版本的 SDK（注意 SDK 版本不等于终端系统版本，RN 目前支持 android4.1 以上设备）。你可以在 Android Studio 的 SDK Manager 中选择安装各版本的 SDK。

你可以在 Android Studio 的欢迎界面中找到 SDK Manager。点击"Configure"，然后就能看到"SDK Manager"。

![Android Studio Welcome](https://reactnative.cn/docs/assets/GettingStartedAndroidStudioWelcomeMacOS.png)

> SDK Manager 还可以在 Android Studio 的"Preferences"菜单中找到。具体路径是**Appearance & Behavior** → **System Settings** → **Android SDK**。

在 SDK Manager 中选择"SDK Platforms"选项卡，然后在右下角勾选"Show Package Details"。展开`Android 9 (Pie)`选项，确保勾选了下面这些组件（重申你必须使用稳定的翻墙工具，否则可能都看不到这个界面）：

- `Android SDK Platform 28`
- `Intel x86 Atom_64 System Image`（官方模拟器镜像文件，使用非官方模拟器不需要安装此组件）

然后点击"SDK Tools"选项卡，同样勾中右下角的"Show Package Details"。展开"Android SDK Build-Tools"选项，确保选中了 React Native 所必须的`28.0.3`版本。你可以同时安装多个其他版本。

最后点击"Apply"来下载和安装这些组件。

#### 3. 配置 ANDROID_HOME 环境变量

React Native 需要通过环境变量来了解你的 Android SDK 装在什么路径，从而正常进行编译。

具体的做法是把下面的命令加入到`~/.bash_profile`文件中：

> 译注：~表示用户目录，即`/Users/你的用户名/`，而小数点开头的文件在 Finder 中是隐藏的，并且这个文件有可能并不存在。可在终端下使用`vi ~/.bash_profile`命令创建或编辑。如不熟悉 vi 操作，请点击[这里](http://www.eepw.com.cn/article/48018.htm)学习。

```
# 如果你不是通过Android Studio安装的sdk，则其路径可能不同，请自行确定清楚。
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
```

> 如果你的命令行不是 bash，而是例如 zsh 等其他，请使用对应的配置文件。

使用`source $HOME/.bash_profile`命令来使环境变量设置立即生效（否则重启后才生效）。可以使用`echo $ANDROID_HOME`检查此变量是否已正确设置。

> 请确保你正常指定了 Android SDK 路径。你可以在 Android Studio 的"Preferences"菜单中查看 SDK 的真实路径，具体是**Appearance & Behavior** → **System Settings** → **Android SDK**。

[
](https://reactnative.cn/docs/getting-started.html#%E5%88%9B%E5%BB%BA%E6%96%B0%E9%A1%B9%E7%9B%AE-1)

### windows

​	IOS:建议使用苹果系统的电脑，或者自行安装使用黑苹果系统

​	Android:必须安装的依赖有：Node、React Native 命令行工具、Python2 以及 JDK 和 Android Studio。

虽然你可以使用`任何编辑器`来开发应用（编写 js 代码），但你仍然必须安装 Android Studio 来获得编译 Android 应用所需的工具和环境。

### Node, Python2, JDK

我们建议直接使用搜索引擎搜索下载 Node 、Python2 和[Java SE Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

注意 Node 的版本必须高于 8.3，Python 的版本必须为 2.x（不支持 3.x），而 JDK 的版本必须是 1.8（目前不支持 1.9 及更高版本）。安装完 Node 后建议设置 npm 镜像以加速后面的过程（或使用科学上网工具）。

> 注意：不要使用 cnpm！cnpm 安装的模块路径比较奇怪，packager 不能正常识别！

```
npm config set registry https://registry.npm.taobao.org --global
npm config set disturl https://npm.taobao.org/dist --global
```

### Yarn、React Native 的命令行工具（react-native-cli）

[Yarn](http://yarnpkg.com/)是 Facebook 提供的替代 npm 的工具，可以加速 node 模块的下载。React Native 的命令行工具用于执行创建、初始化、更新项目、运行打包服务（packager）等任务。

```
npm install -g yarn react-native-cli
```

安装完 yarn 后同理也要设置镜像源：

```
yarn config set registry https://registry.npm.taobao.org --global
yarn config set disturl https://npm.taobao.org/dist --global
```

安装完 yarn 之后就可以用 yarn 代替 npm 了，例如用`yarn`代替`npm install`命令，用`yarn add 某第三方库名`代替`npm install 某第三方库名`。

### Android 开发环境

如果你之前没有接触过 Android 的开发环境，那么请做好心理准备，这一过程相当繁琐。请`万分仔细`地阅读下面的说明，严格对照文档进行配置操作。

> 译注：请注意！！！国内用户`必须必须必须`有稳定的翻墙工具，否则在下载、安装、配置过程中会不断遭遇链接超时或断开，无法进行开发工作。某些翻墙工具可能只提供浏览器的代理功能，或只针对特定网站代理等等，请自行研究配置或更换其他软件。总之如果报错中出现有网址，那么 99% 就是无法正常翻墙。

#### 1. 安装 Android Studio

[首先下载和安装 Android Studio](https://developer.android.google.cn/studio)，国内用户可能无法打开官方链接，请自行使用搜索引擎搜索可用的下载链接。安装界面中选择"Custom"选项，确保选中了以下几项：

```
Android SDK``Android SDK Platform``Performance (Intel ® HAXM)` ([AMD 处理器看这里](https://android-developers.googleblog.com/2018/07/android-emulator-amd-processor-hyper-v.html))`Android Virtual Device
```

然后点击"Next"来安装选中的组件。

> 如果选择框是灰的，你也可以先跳过，稍后再来安装这些组件。

安装完成后，看到欢迎界面时，就可以进行下面的操作了。

#### 2. 安装 Android SDK

Android Studio 默认会安装最新版本的 Android SDK。目前编译 React Native 应用需要的是`Android 9 (Pie)`版本的 SDK（注意 SDK 版本不等于终端系统版本，RN 目前支持 android4.1 以上设备）。你可以在 Android Studio 的 SDK Manager 中选择安装各版本的 SDK。

你可以在 Android Studio 的欢迎界面中找到 SDK Manager。点击"Configure"，然后就能看到"SDK Manager"。

![Android Studio Welcome](https://reactnative.cn/docs/assets/GettingStartedAndroidStudioWelcomeWindows.png)

> SDK Manager 还可以在 Android Studio 的"Preferences"菜单中找到。具体路径是**Appearance & Behavior** → **System Settings** → **Android SDK**。

在 SDK Manager 中选择"SDK Platforms"选项卡，然后在右下角勾选"Show Package Details"。展开`Android 9 (Pie)`选项，确保勾选了下面这些组件（重申你必须使用稳定的翻墙工具，否则可能都看不到这个界面）：

- `Android SDK Platform 28`
- `Intel x86 Atom_64 System Image`（官方模拟器镜像文件，使用非官方模拟器不需要安装此组件）

然后点击"SDK Tools"选项卡，同样勾中右下角的"Show Package Details"。展开"Android SDK Build-Tools"选项，确保选中了 React Native 所必须的`28.0.3`版本。你可以同时安装多个其他版本。

最后点击"Apply"来下载和安装这些组件。

#### 3. 配置 ANDROID_HOME 环境变量

React Native 需要通过环境变量来了解你的 Android SDK 装在什么路径，从而正常进行编译。

打开`控制面板` -> `系统和安全` -> `系统` -> `高级系统设置` -> `高级` -> `环境变量` -> `新建`，创建一个名为`ANDROID_HOME`的环境变量（系统或用户变量均可），指向你的 Android SDK 所在的目录（具体的路径可能和下图不一致，请自行确认）：

![ANDROID_HOME Environment Variable](https://reactnative.cn/docs/assets/GettingStartedAndroidEnvironmentVariableANDROID_HOME.png)

SDK 默认是安装在下面的目录：

```powershell
c:\Users\你的用户名\AppData\Local\Android\Sdk
```

你可以在 Android Studio 的"Preferences"菜单中查看 SDK 的真实路径，具体是**Appearance & Behavior** → **System Settings** → **Android SDK**。

你需要关闭现有的命令符提示窗口然后重新打开，这样新的环境变量才能生效。

#### 4. 把 platform-tools 目录添加到环境变量 Path 中

打开`控制面板` -> `系统和安全` -> `系统` -> `高级系统设置` -> `高级` -> `环境变量`，选中**Path**变量，然后点击**编辑**。点击**新建**然后把 platform-tools 目录路径添加进去。

此目录的默认路径为：

```powershell
c:\Users\你的用户名\AppData\Local\Android\Sdk\platform-tools
```

[
](https://reactnative.cn/docs/getting-started.html#%E5%88%9B%E5%BB%BA%E6%96%B0%E9%A1%B9%E7%9B%AE-1)

## 5.真机调试



推荐开发环境：Mac系统 + 一部廉价的安卓手机



在 Android 设备上运行应用

### 1. 开启 USB 调试

在默认情况下 Android 设备只能从应用市场来安装应用。你需要开启 USB 调试才能自由安装开发版本的 APP。

首先，确定[你已经打开设备的 USB 调试开关](https://www.baidu.com/s?wd=%E6%89%93%E5%BC%80usb%E8%B0%83%E8%AF%95)。

### 2. 通过 USB 数据线连接设备

Let's now set up an Android device to run our React Native projects. Go ahead and plug in your device via USB to your development machine.

下面检查你的设备是否能正确连接到 ADB（Android Debug Bridge），使用`adb devices`命令：

```
$ adb devices
List of devices attached
emulator-5554 offline   # Google emulator
14ed2fcc device         # Physical device
```

在右边那列看到**device**说明你的设备已经被正确连接了。注意，你每次只应当**连接一个设备**。

> 译注：如果你连接了多个设备（包含模拟器在内），后续的一些操作可能会失败。拔掉不需要的设备，或者关掉模拟器，确保 adb devices 的输出只有一个是连接状态。



在真机调试中其实也没啥难度，就记录一下几个要点：

- 把手机摇一摇，能调出开发者界面
- 拖着USB线摇晃太麻烦了，直接输入命令就可以调出开发者界面：`adb shell input keyevent 82`，这个比较实用。
- 点击进入Dev Settings
  点击Debug server host for device。
  输入你电脑的IP地址和端口号（譬如10.0.1.1:8081）
- 在电脑上打开chrome输入：<http://localhost:8081/debugger-ui> 能够在电脑上看到调试信息的输出。

### 3. 运行应用

现在你可以运行`react-native run-android`来在设备上安装并启动应用了。

在输入此命令前，要先打开模拟器，或连接真机，第一次启动非常慢，需要下载gradle，也可以手动下载gradle安装。

![14_26_28__04_09_2019](assets/14_26_28__04_09_2019.jpg)



![14_36_24__04_09_2019](assets/14_36_24__04_09_2019.jpg)

