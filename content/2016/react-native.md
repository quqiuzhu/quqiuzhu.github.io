---
title: React Native
date: 2016-10-30 02:09:53
categories: android
tags: 
- android
---

最近公司开发了一款叫「熊猫洋货」的APP，学习了一些 React Native 的知识，在这里进行一下总结

1. 环境搭建
2. React Native 页面
3. 原生应用集成

<!-- more -->

## 环境搭建
因为我是一名使用 Mac 的 Android 开发者，所以 Mac下的 Android 环境、HomeBrew 包管理器都已具备。只需要装 Node 和 React Native 命令行工具即可。 安装 Node 主要是希望使用其包管理工具 npm 。安装命令如下


```
brew install node
npm install -g react-native-cli
```

在此提醒一下，请注意 HomeBrew 的提示，如果有命令没有安装成功，按照 HomeBrew 的提示操作。


## React Native 页面
React 推荐使用 JSX 语法来写页面，因为其可读性较强。因为 JSX 是一种类 XML 的语法，对于习惯于使用布局文件的 Android 开发者来说并不陌生。 使用 React Component 来开发我们的应用界面

```
class Greeting extends Component {
  render() {
    return (
      <Text>Hello world!</Text>
    );
  }
}
```

通过 XML 能给 Componet 传递属性，Component 内部能够通过 `this.props` 获取到该属性。比如从上面的例子改为从外部接受属性参数的形式。

```
class Greeting extends Component {
  render() {
    return (
      <Text>this.props.words</Text>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Greeting words='Hello world!'/>
      <Greeting words='你好!'/>
    );
  }
}
```

在一个 Component 里面，props 的值是不会变的，如果在 Component 的生命周期内需要改变样式，需要使用 state。 下面该组件一会显示 Hello world!， 一会又显示 你好!

```
class Greeting extends Component {
  constructor(props) {
    super(props);
    this.state = { engish: true };

    setInterval(() => {
      this.setState({ engish: !this.state.engish });
    }, 1000);
  }
  
  render() {
    return (
      <Text>this.state.english ? 'Hello world!' : '你好!' </Text>
    );
  }
}
```

Component 能通过 StyleSheet 指定样式, flexbox 布局进行定位元素位置。 上述页面使用 StyleSheet 

```
class Greeting extends Component {
  render() {
    return (
      <Text style={styles.bigblue}>Hello world!</Text>
    );
  }
}

const styles = StyleSheet.create({
  bigblue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
    flex: 1,
    alignSelf: 'center'
  }
)
```


## 原生应用集成
在 Application 中加入下列代码，并将 React 写成的页面打成 bundle 放到 src/assets 下, 并命名为 index.android.js。

```
 ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
   @Override
   public boolean getUseDeveloperSupport() {
       return false;
   }

   @Override
   public List<ReactPackage> getPackages() {
       return Arrays.<ReactPackage>asList(
               new MainReactPackage(),
               new YourReactPackage()
       );
   }
};

@Override
public ReactNativeHost getReactNativeHost() {
   return mReactNativeHost;
}
```

然后在需要使用 React 的页面使用 ReactRootView 代替，并在该页面维持 ReactInstanceManager 的状态。使用下面的就能展示 React 写的页面了。

```
mReactRootView.startReactApplication(reactInstancemanager, moduleName, bundle);
```

reactInstancemanager 为 Application 中维护的同一个 reactInstancemanager 可以通过 getReactNativeHost.getReactInstanceManager() 获取。

moduleName 为当前页面的模块名

bundle 为 Native 传给 React 的参数


### React 如何调用 Native 方法
可以在 ReactPackage 中返回给 React 一些 Native 实现的 module 实例如下

```
public class YourReactPackage implements ReactPackage {

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(
    		ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new YourModule(reactContext));
        return modules;
    }
}

public class YourModule extends ReactContextBaseJavaModule {

    public YourModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    public YourModule(ReactApplicationContext reactContext, 
    							Context context) {
        super(reactContext);
    }

    @ReactMethod
    public void event(String name){
    }
```

然后在 React 中可以通过 `NativeModules.YourModule` 访问到 Native 方法，比如上面实现的 event 方法。


### Native 如何调用 React 方法
Native 主动与 React 沟通的方式，不是调用 React 方法，而是用事件通知的方式。首先看 Native 如何发通知。

```
public void sendReactEvent(String eventName， WriteableMap params) {
   reactInstanceManager.getCurrentReactContext()
   		.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
			.emit(eventName, params);
}
```

Reac 方面，使用下面的方法监听 Native 发来的事件并作出反应。

```
DeviceEventEmitter.addListener(eventName, (params) => {
	// Do Something
})
```


-- end --