**每个weex页面都是单独的**，即JS上下文的所有变量都是只能在该页面下使用，包括**全局变量weex（只能读不可写）**，跨页面时，变量间就无法进行使用。

---

> 全局变量 **weex**

目前，weex全局实例变量**只在Vue框架中暴露**，暂不支持在其他框架使用。具体定义如下：

```javascript
weex = {
  config,
  document,
  requireModule,
  supports
}
```

一、config

weex.config里包含了当前weex页面的所有环境信息，具体如下：

```javascript
weex.config = {
  bundleUrl,		// 当前页面js bundle的URL地址（即vue中定义的路由地址）
  bundleType,		// 表示当前页面使用的是哪种框架（我试了一下，貌似没有这个变量）
  env		// 表示目前处于的平台是哪个
}
```

需注意的是，`weex.config.env`其实跟`global.WXEnviroment`全局变量是等价的。因此

```javascript
global.weex.config.env === global.WXEnviroment
```

环境信息主要包括如下信息：

```javascript
weex.config.env = {
  weexVersion,		// WeexSDK的版本
  appName,				// 目前运用的设备名字
  appVersion,			// 应用的版本
  platform,				// 目前运用的设备平台
  osName,					// 系统的名字
  osVersion,			// 系统的版本
  deviceWidth,		// 设备的宽度
  deviceHeight		// 设备的高度
}
```

二、document

weex.document表示的是当前页面的文档模型对象，可用于创建和操作DOM tree中元素。需注意是，该对象跟我们平时用到的document是不一样的，**一般只能用于Web platform（官方并不推荐使用直接操作DOM，而是运用数据驱动方式）**。另外在IOS和Android端中DOM都是虚构的，即native端是不存在DOM的。

三、requireModule（后续优化，可能还有些疑惑）

weex推荐将一些不依赖UI的**原生功能封装成一个模块**。**主要方便前端实现JS调用native中定义的方法**。当然，weex也会有一些内置模块供我们使用。

```javascript
weex.requireModule(name)		// name: String
// 引入后就是一个对象或Null，对象里会包含Native端中定义并暴露的方法
```

需注意是，name参数需注意大小写问题。这方法也是JS到Native端通信的方式。具体栗子🌰如下：

```javascript
<template>
	<text>HaHa</text>  
</template>

<script>
	const modal = weex.requireModule('modal')
  modal.totast({
		message: 'HeHe',
    duration: 6
  })
</script>
```

四、supports

weex.supports用于检测一个组件或模块是否能够在当前环境下使用。使用如下：

```javascript
weex.supports(type)		// type: String
```

**type必须是component或module**，因此type可以是标签名、模块名或者指定模块中某个方法名。当支持该特性时，返回true，不支持时则返回false，对于参数格式错误或者无法确定是否支持时则直接返回null。举个栗子🌰：

```javascript
// 检测某个组件是否可用（必须带上@component）
weex.supports('@component/slider')		// true（指的是slider标签）
weex.supports('@component/my-app')		// false

// 检测某个模块是否可用（必须带上@module）
weex.supports('@module/stream')		// true
weex.supports('@module/abd')			// false

// 检测某个模块是否包含某个方法（模块都必须带上@module）
weex.supports('@module/dom.getComponentRect')		// true
weex.supports('@module/dom.abc')							 // false

// 无效的输入
weex.supports('div')				// null
weex.supports('module/*')		// null
```

五、isRegisteredModule

weex.isRegisteredModule用于判断一个模块或模块中的方法是否可使用。

```javascript
weex.isRegisteredModule(moduleName, methodName)
// moduleName：模块名称，类型为String（必传）
// methodName：模块中方法名称，类型为String（可传）
```

举个栗子🌰：

```javascript
weex.isRegisteredModule('stream')		// true
weex.isRegisteredModule('stream', 'fetch')		// true
weex.isRegisteredModule('div')		// false
```

六、isRegisteredComponent

weex.isRegisteredComponent用于判断某个特定的组件是否可用。

```javascript
weex.isRegisteredComponent(componentName)
// componentName：组件名称，类型为String（必传）
```

举个栗子🌰：

```javascript
weex.isRegisteredComponent('div')		// true
weex.isRegisteredComponent('navigator')		// false
```

---

> WEEX通信机制

一、WEEX的通信机制原理

（后续补上）参考于[weex 通信原理分析](https://jianli2017.top/wiki/Hybird/weex/weex-conmunication/)

二、JS调用Native方法

1. Native自定义一个新的类继承于WXModule；

2. 供JS调用的方法必须加上`@WXModuleAnno`的注释（@WXModuleAnno主要用于判断当前方法是否为JS的扩展方法，以及是否能够运行在UIThread即UI线程中）。另外，需注意的是，供JS调用的扩展方法必须是`Public`类型。

3. 完成该新类以后，必须在weex的SDK上`WXSDKEngine`进行注册：

   ```javascript
   WXSDKEngine.registerModule("myModule", MyModule.class)
   // 属于JSService
   ```

4. JS调用时，需使用全局方法`weex.requireModule`，引入对应Native端定义的新模块；

举个栗子🌰：

- Native端

  ```java
  public class ToastModule extends WXModule{
      @WXModuleAnno(runOnUIThread = true)
      public void showToast(){
        Toast.makeText(mWXSDKInstance.getContent(),"this is js call native toast",Toast.LENGTH_LONG).show();
      }
  }
  ```

- JS端：

  ```javascript
  created() {
    const toastModule = weex.requiredModule('@weex-module/toastModule')
    // 引入Native端注册模块后，直接调用扩展方法即可
    toastModule.showToast()
  }
  ```

需注意的是，有时候，JS端调用Native端定义的扩展方法时，让Native处理完后需要返回对应的数据回来进行页面的刷新，这时就需要传多一个`Callback`作为第二个参数传给Native端，举个栗子🌰：

- Native端

  ```java
  public class ToastModule extends WXModule{
      @WXModuleAnno(runOnUIThread = true)
      public void showToast(JSCallback callback){
        Toast.makeText(mWXSDKInstance.getContent(),"this is js call native toast",Toast.LENGTH_LONG).show();
        // 调用JS端的回调
        callback.invoke('haha')
      }
  }
  ```

- JS端

  ```javascript
  created() {
    const toastModule = weex.requireModule('@weex-module/toastModule')
    // 传递一个回调过去，让Native端处理完后返回
    toastModule.showToast(res => console.log(res))
  }
  ```

三、Native调用JS方法

1. Native端调用WXSDKInstance暴露的fireEvent方法，fireEvent中参数第一个是JS端一直在监听的事件名称，第二个开始作为JS端监听函数中所需的参数；
2. JS端调用`globalEvent.addEventListener(name, callback)`进行对Native端的处理监听；

Native调用JS的模式就类似于观察者模式，JS端在监听，然后等待Native端的事件发布。举个栗子🌰：

- Native端：

  ```swift
  -(void)refreshWeexPage:(NSNotification *)notif{
      NSDictionary * dic = notif.userInfo;
     //传一个dic到weex
      [weexInstance fireGlobalEvent:@"geolocation" params:dic];
  }
  ```

- JS端：

  ```javascript
  mounted() {
    let self = this,
        globalEvent = weex.requireModule('@weex-module/globalEvent')
    globalEvent.addEventListener('geolocation', res => {
      console.log(res)
    })
  }
  ```

---

> 多页面间通信

weex的多页面机制，每个页面的变量只能在对应的页面中使用，是不能跨页面调用。及时当前页面的全局变量weex，也是不能在其他页面进行使用。因此，**weex中每个页面是独立的**。

为此，若需在不同页面共享某些变量，就要用到`BroadcastChannel`，`BroadcastChannel`可实现跨页面通信。

`BroadcastChannel`定义如下：

```javascript
BroadcastChannel = {
  name: String,							// 自定义广播事件名称
  postMessage: function,		 // 用于发布广播的函数
  onmessage: callback,			 // 用于监听广播的函数
  close: function						// 用于关闭当前定义的事件
}

// onmessage中的callback所带参数用于获取广播的数据
params = {
  type: string,						// 事件的类型
  data									 // 广播的数据
}
```

举个栗子🌰：

```javascript
// 页面A发布广播
const a = new BroadcastChannel('Msg')
a.postMessage('a')

// 页面B收到广播后，做相对应的处理
const b = new BroadcastChannel('Msg')
b.onMessage = function(msg) {
  console.log(msg)		// a
}
```

