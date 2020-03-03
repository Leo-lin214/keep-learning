# Webpack之模块化优化

开发中，模块化可以防止变量和方法被污染，只需要关注一部分的逻辑实现，有效地减少了与全局的耦合，也便于后期的维护和拓展

当然，相信了解过前端模块化发展历史的童鞋，都应该听过`IIFE`、`AMD`、`CommonJS`等等，它们都是能够实现模块化的规范，直到`ES2015`出来后，才正式把模块化纳入其标准中。在谈到今天主题前，我们先简单讲解一下上面几种模块化方式的实现以及区别，对于后面将要讲到的`webpack模块化优化`有一定帮助。


IIFE
---

在各种模块化规范出来之前，`ES5`是不支持模块化开发，但当时也有一些大牛们为了更好地避免函数的`副作用`和封装，就开始巧妙地想到了使用`IIFE`来实现模块化（注：JS本身是不存在块级作用域）：

![IIFE实现模块化](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/IIFE-modules.png)

可以看到，在原来的`ES5`基础上可以封装部分逻辑模块，也就是一个简单的`闭包行为`，避免内部变量收到外部环境的影响。

但是，缺陷也是很明显滴暴露出来，它无法实现模块间的依赖，同时代码是分配到主流程中，对于后期的维护和修改带来了困难。

CommonJS
---

`CommonJS规范`实现的是同步加载方式，常用于服务端，其终极目标是提供一个类似Python，Ruby和Java模块化标准库。

为此，`NodeJS`的出现，也就正式标志着`Javascript模块化编程`诞生。在服务端，模块需要与操作系统或者应用程序进行互动，而`NodeJS的模块系统`就是参照`CommonJS规范`进行编写的。

该规范指出，需通过`exports`或者`module.exports`（注：这两个导出方法的使用区别，有兴趣的童鞋可以看看[阮一峰对于该API的讲解](http://javascript.ruanyifeng.com/nodejs/module.html#toc2)）来导出对外的变量或接口，通过`require方法`导入其他模块的输出到当前模块作用域中。直接上栗子：

![CommonJS模块化规范](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/CommonJS-png.png)

这时候，也许有童鞋会提出疑问，那么`CommonJS`能用于客户端吗？

答案是肯定的。由于客户端由于缺少四个Node.js环境的变量：`module、exports、require、global`，导致客户端无法使用`CommonJS规范`。为此，需第三方工具或库（例如[require1k](https://github.com/Stuk/require1k)、[tiny-browser-require](https://github.com/ruanyf/tiny-browser-require)等等）才能让客户端实现`CommonJS规范`。

AMD
---

鉴于`ES5`内部通过`IIFE`实现的模块化无法真正意思上（类似Java、Python等）的模块化，因此有些大牛们就提出了适用于客户端的`AMD规范`，它可以异步引入模块，同时模块可以很好地将某些逻辑功能封装在一个文件中以便主流程需要时引入。其中`RequireJS`库很好滴实现了`AMD规范`，直接上例子：

![AMD模块化规范](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/AMD-png.png)

[RequireJS API](https://requirejs.org/)暴露了`require`和`define`两个全局方法，对于主流程或者模块中需要依赖其他模块时，都可以传进`require`和`define`两个全局方法第一个参数中。同时，我们可以看到，`AMD规范`实现的是异步加载模块方式（多个模块引入时会并行加载，有效滴加快执行效率并且无阻塞页面的加载）。对于每个模块只需要做该模块该做的事情即可，模块与主流程之间有效地减低了耦合度。

CMD
---

`CMD规范`也叫通用模块定义(Common Module Definition)，实现的也是异步加载模块方式，`SeaJS库`就很好滴实现该规范，它主要具有以下特点：

 - 使用上：和`AMD规范`类似，都是使用`require`和`define`两个全局方法，但使用`require`方法时却是同步执行模块代码的，这和`CommonJS规范`很类似；
 - 实现上：`CMD规范`核心是提前加载，延迟执行，而`AMD规范`核心是提前加载，提前执行，当然`CommonJS规范`核心则是延迟加载，延迟执行；

需要注意的是，`CMD规范`使用`require`方法的原因是因为在提前加载模块过程中，会把加载下来的模块保存在内存中，以至于客户端执行主流程按需引入模块时是同步执行内存中保存的模块。（有兴趣的童鞋，可以看看这边文章——[SeaJS是如何工作的](http://tinyambition.com/HelloSea.js/how-seajs-works.html)）
  
在我看来，`CMD规范`的懒执行机制可有效地提高页面交互性能，因为在页面交互过程完成前不需要执行其他暂时没用到的模块（当然这只是我个人观点，如果有童鞋有不同的看法，可以在评论区上写上来一起探讨学习一下，对于性能对比上，童鞋们也可以看看[SeaJS的github上关于AMD和CMD对比，挺有趣的](https://github.com/seajs/seajs/issues/588)）。而这种机制，也对于下面我要提到`webpack模块化优化`密切相关。

现在就直接上一个`SeaJS`栗子领略一下`CMD规范`（有兴趣的童鞋，也可以看下[SeaJS的API](https://seajs.github.io/seajs/docs/#quick-start)）：

![SeaJS实现CMD规范](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/CMD-png.png)

UMD
---

`UMD规范`可以看成是一种方案，用于解决前后端跨平台模块加载，支持`AMD规范`和`CommonJS规范`。说白了，就是致力于用一种实现方式能够把模块加载兼容前后端。

话不多说，有兴趣的童鞋可以看看[UMD的官方介绍和栗子](https://github.com/umdjs/umd)。下面也用一个简单的栗子来领略`UMD规范`的写法：

![UMD的写法](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/UMD-png.png)

可以看到，`UMD规范`实现方式就是先判断是否支持`AMD规范`，然后再判断是否支持`CommonJS规范`，当两者均不支持时则直接把模块定义在全局对象上

ES6 Module
---

由于`ES5`缺少模块化加载理念，因此在`ES6`中正式把模块化加载纳入其标准

`ES6`中模块是在编译时输出接口，而上面提到的各种模块加载规范都是在运行时输出接口，可以看到，`ES6 Module`在一定程度上对性能进行了优化。有兴趣的童鞋可以看看[阮一峰的对ES6 Module的介绍](http://es6.ruanyifeng.com/#docs/module)。下面就举个栗子：

![ES6 Module栗子](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/ES6-module-png.png)

目前，客户端基本都是使用`ES6 Module`模块加载方式来对模块进行加载，而对于`Node`服务端尚在逐渐向该模块加载方式靠拢，但是大部分情况下依然还是使用`CommonJS规范`。

相信大家看完上面模块加载的各种实现方式，都应该对模块化有一定的了解。好啦，下面就进入今天的主题，在`Webpack`中可以怎样去对`Application`中模块化进行优化呢？

遇到的问题
---

在日常模块化开发中，一个页面会有很多个组件所构成，而这些组件是需要我们按需引入的，毫无疑问，现在我们以`Vue`作为栗子，项目结构**（下面只展示主要的目录和文件，至于其他目录和文件就不展示了）**如下：

```javascript
|- src
|--- components
|------ message.vue      // 详细信息框组件
|------ main.vue         // 首页需要的组件  
|------ goods.vue        // 商品页面组件
|--- router
|------ index.js         // 路由文件
|--- App.vue             // 入口vue文件
```

正常情况下，我们是这样编写页面的：

**App.vue**
![入口vue文件](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/app-vue.png)

**index.js 路由文件**
![路由文件](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/static-index-js.png)

**main.vue 首页组件**
![首页组件](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/main-vue.png)

**goods.vue 商品页面组件**

![商品页面组件](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/goods-vue.png)

**message.vue 商品信息组件**

![商品信息组件](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/message-vue.png)

上面的栗子，运行时在网址上输入`localhost:8080/#/`会直接使用`Main.vue`首页组件，当输入`localhost:8080/#/goods`时会展示`goods.vue`商品组件，点击按钮会直接展示`message.vue`详细信息组件。

到这里，我会想问，上面的简单`SPA`栗子是否还有更加优化的方案？倘若我想加快首页加载的速度以使用户有个更好的体验，该如何处理？

对于上面的问题，我们会经常遇到，各位童鞋也可以各抒己见在评论区说说自己的看法。在这里，就不卖关子，换作是我，首先想到要下手的就是`Webpack`，而这也是今天所要提及的核心内容：`用Webpack如何更好地优化复杂程序的模块化`。

Dynamic Import
---

目前尝处于`stage 3`阶段的[ECMAScript提案的import()语法](https://github.com/tc39/proposal-dynamic-import)，相信很多童鞋都有了解过或听过，那它究竟是干嘛的？按照官方的说法就是：
> ECMAScript modules are completely static, import() enables dynamic loading of ECMAScript modules.

简单滴说，就是目前模块加载都是静态加载的，而import()可让我们按需加载对应模块。那么问题来了，上面栗子也是按需加载，首页只需要`Main`首页组件，而商品页面也只加载了`goods`和`message`组件。那么再细心看看，上面的栗子是不是真的做到了`按需加载`？

答案是否定的，正如我上面提及的`ES6 Module`是在编译阶段就输出接口，因此当我们使用`Webpack`打包后，所有需要的模块都会打进一个`js文件`中。因此，首页在加载过程中，就需要加载完整个`js文件`才能让用户进行体验效果，当然我们都知道，这个`js文件`也有一些模块逻辑是我们暂时并不需要用到，而这也恰好是我们接下来要处理的问题。

`import()`语法的出现，再结合`webpack 4`（也可以选择`webpack 3`），就可以很优雅地处理上述问题。当然也少不了`babel`的转化。下面就是处理实现：

**webpack.config.js 部分配置**

![webpack module关键配置](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/webpack-babel-import-png.png)

再将路由文件进行修改后如下：

![动态引入--路由文件](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/dynamic-index-js.png)

可以看到，当我们再次访问`localhost:8080/#/`时，会发现加载`js文件`比之前小了，而且最重要的该文件里是没有`Goods`商品组件代码的。当再访问`localhost:8080/#/goods`时，会异步从服务端加载`0.js`文件，而改文件是包含`Goods`商品组件代码的。由此可见，不仅减少了主流程`js`文件的大小，加快页面的加载体验，而且还可以按需异步下载必要的模块文件。

好了，到了这里，如果我想再优化一下有`Goods`商品组件中`Message`详细信息组件，因为它是只有在点击按钮才去加载的，那我们是不是也可以让其进行懒加载，让`localhost:8080/#/goods`下的页面加载更加快？

答案是肯定的，但是需要用到`Vue`中`component`语法，事不宜迟，我们就来动手改改看：

**goods.vue 商品页面组件**

![商品页动态引入信息组件](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/dynamic-goods-vue.png)

当我们再去访问`localhost:8080/#/goods`时，会发现`js文件`也比之前少了`Message`详细信息组件代码，加快加载体验，同时点击按钮后，会动态引入`1.js`文件，这也是从服务端异步引入加载`Message`详细信息组件。

这时候，也许会有童鞋提测疑问，当关闭`Message`详细信息组件弹窗时，再重新点击按钮，就需要重新`render`，那这样岂不是需要消耗一定的性能？答案是肯定会有所损耗，那么如果想优化它，可以怎么做？很简单，只需要使用`Vue API`暴露的`<keep-alive>组件`来包裹我们的`<component>`即可，这样就会有效滴把组件保存在内存中，下次访问时可直接从内存中读取。

至此，也许有童鞋又会提出疑问，上面`0.js`文件和`1.js`文件到底是什么鬼？再耐心点往下看，说不定有你想要的惊喜哈哈🙊

Magic Comments
---

上面之所以会出现`0`和`1`，原因是因为对于动态引入`import()`不指定模块名称`chunkName`时，`Webpack`会默认从0到n来按序命名接下来动态引入的文件。

但是，对于这些数字0或者n，我们是无法知道该动态引入的`js文件`是属于哪一个模块，为此`Webpack`也为我们提供了`Magic Comments`，以此可以自定义模块名称。

下面就拿上面路由文件动态引入作为栗子，使用上很简单：

![webpackChunkName指定模块名称](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/webpack-chunk-name-module.png)

这时候，从`localhost:8080/#/`中访问`localhost:8080/#/goods`时，会发现加载不是`0.js`，而是`goods.js`，这样就会很容易知道哪些模块是动态引入的。当然有兴趣的童鞋，也可以想想指定`Message详细信息组件`动态引入时的`chunkName`。

至此，上面讲到的方案，可以有效滴优化我们现有阶段的模块化开发，当然童鞋们也可以尝试一下。

Extension
---

其实，在我看来，还可以更深入点优化一下。就拿上面的`Goods`商品组件，当点击按钮时，如果加载的模块比较大，用户就不得不去等待加载完整个`message.js`文件才能展示弹窗出来（当然这样的情况出现不是特别多，由于打包后的js文件一般都会存放到cdn上，而请求时会采取就近原则加载，这也有效避免这个问题，但我们还是可以探讨一下这个问题可以使用什么方式避免）。为此我们有木有方案可以将这个时延有效滴去掉？在这里我就不卖关子，在`Webpack 4.6`中，指出明确支持`prefetching and preloading`，而这两个东西恰好就是可以解决我们刚刚要面对问题。

Preload And PreFetch
---

`Preload`是预加载，`PreFetch`是预测将要加载的模块，这两者都是`link`标签下的属性。有兴趣的童鞋，可以看看[关于这两者在客户端执行的优先级](https://juejin.im/post/58e8acf10ce46300585a7a42)

简单来说，`Preload`优先级为`Height`，而`PreFetch`则为`Low`。这两者是有区别的：

 - `preload`：主要是用于当前页面的预加载，会和主文件`bundle.js`并行下载，且优先获取，可用于预加载某些必要模块
 - `prefetch`: 主要是用于下一步操作或者页面，会在浏览器空闲时间才去下载，优先级最低
 
另外，需要说明的是，`preload`和`prefetch`**目前对于现有的浏览器的支持程度并不是那么的友好**。具体可以看看两个兼容性：[Preload的兼容性](https://caniuse.com/#search=preload)和[Prefetch的兼容性](https://caniuse.com/#search=prefetch)

虽然兼容性不是那么友好，**`preload`和`prefetch`都是申明性质的，所以就算不支持，也不會影响现有页面的任何功能**

看到这里，估计大家应该也可以想到，使用`prefetch`可以解决我们上面遇到的时延等待问题，那么具体怎么写？在这里，我们还需要借助`Webpack`的`preload-webpack-plugin`插件，配置编写如下：

**webpack.config.js 部分配置**

![prefetch使用](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/prefetch.png)

这时候，就要在`Webpack 4.6+`版本上，修改商品页组件如下：

**goods.vue 商品页面组件**

![prefetch--message组件](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/webpack%E6%A8%A1%E5%9D%97%E5%8C%96%E4%BC%98%E5%8C%96/prefetch-goods-vue.png)

可以看到，只需要加上`webpackPrefetch: true`的注释再结合`preload-webpack-plugin`插件即可把动态引入的模块进行`Prefetch`。

当我们再次访问`localhost:8080/#/goods`时，会发现，加载完主流程的`js文件`后，然后在浏览器的空闲时间，就会自动加载`message.js文件`，并且可以看到其优先级为`Low`的。另外，我们也可以看到在`<head>`标签，是通过`<link>`标签使用`rel="prefetch"`来加载`message.js文件`。这时候再点击按钮，就会不再需要等待时延直接加载`Message组件`。

至于上述运行的效果图，我就不截图了，有兴趣的童鞋可以亲自去尝试验证一下，这样才能有更加深刻的印象。如有不便，在这里我就说声不好意思哈🙈

对于`Webpack模块化加载优化`，也许还会有一些更好更优的方案，也欢迎👏大神们在评论区分享分享来一起学习。而上述的优化方案，其实在日常的模块化开发中是可以使用到的，不过还请大家要结合自己需求的应用场景分析再来优化，一旦使用不当，优化也许就是一个消耗性能的体验。