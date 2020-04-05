# Koa 源码思考和学习

众所周知，Koa 和 Express 是 Nodejs 里常用到的两个 HTTP 库，并且它们两个是由同一个团队进行编写，其中 Express 沿用的是回调函数模式，Koa 则跟上 ECMAScript 发展，使用生成器来编写，到了 Koa 2.0 后则直接用上了 async/await，可以说 Koa 更加优于我们的编写。🤔

最重要的一点，**Koa 和 Express 都是以中间件作为核心**，因此很多功能都是依赖社区实现和补充。Koa 内部实现很简单，主要包括了**对 Context、Request 和 Response 的封装**、**中间件的组合**两大块内容。

接下来我们就来看看 Koa 2.0 源码实现。当然如果有兴趣的，可以直接去[Koa的github网址观看源码](https://github.com/koajs/koa/blob/master/lib/application.js)。



## 先从 new Koa() 开始

如果你用过 Koa，肯定在编写入口文件时，必不可少的一句话就是`const app = new Koa()`，其实就是创建一个 Koa 实例，那么问题来了，Koa 构造函数都有哪些内容，不妨先来看看。

```js
// ...
constructor(options) {
	super();
  options = options || {};
  this.proxy = options.proxy || false; // 是否允许代理
  this.subdomainOffset = options.subdomainOffset || 2; // 从hostname解析子域的偏移起点，比如地址tobi.ferrets.example.com，偏移量为2时则为tobi.ferrets
  this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For'; // 代理头部字段
  this.maxIpsCount = options.maxIpsCount || 0;
  this.env = options.env || process.env.NODE_ENV || 'development'; // 当前运行环境
  if (options.keys) this.keys = options.keys;
  this.middleware = []; // 重点！！！用于存储中间件的数组
  this.context = Object.create(context); // Koa封装好的上下文
  this.request = Object.create(request); // Koa封装好的Request对象
  this.response = Object.create(response); // Koa封装好的Response对象
  if (util.inspect.custom) {
    this[util.inspect.custom] = this.inspect; // 赋予Koa的白名单属性，即创建实例后可访问属性
  }
}
// ...
```

咋一看，其实基本都是一些代理配置和当前运行环境设置，其中**`middleware`属性则是用于存储中间件处理函数的数组**，另外**`context`属性、`request`属性、`response`属性就是 Koa 单独封装好的三个属性**，更好滴用于交互和处理。

紧接着，我们先看看下面这个简单🌰：

```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx) => {
  ctx.body = 'haha'
})
```

那么`app.use`这个 API 主要是做些什么事情呢？不妨直接跟你说，就是将中间件函数推进内部的`middleware`数组中进行保存用的。先来看看源码的实现。

```js
/**
 * Use the given middleware `fn`.
 *
 * Old-style middleware will be converted.
 *
 * @param {Function} fn
 * @return {Application} self
 * @api public
 */
use(fn) {
  if (typeof fn !== 'function') throw new TypeError('middleware must be a function!'); // 判断传入的参数是否为函数，否则直接抛出异常
  if (isGeneratorFunction(fn)) { // 判断传入的参数是否为生成器函数
    deprecate('Support for generators will be removed in v3. ' +
              'See the documentation for examples of how to convert old middleware ' +
              'https://github.com/koajs/koa/blob/master/docs/migration.md');
    fn = convert(fn); // 使用koa-convert直接包装生成器函数
  }
  debug('use %s', fn._name || fn.name || '-');
  this.middleware.push(fn); // 将中间件处理函数直接放到内部数组中进行保存
  return this; // 最终返回当前Koa实例
}
```

首先明确一点的是，`app.use`该 API 中传入的参数必须是函数，除此之外，**当传入的参数是生成器函数，那么就是需要使用`koa-convert`包装一层变成 Promise 中间件**，具体可看看其[github地址](https://github.com/koajs/convert)，其实也是为了能够使 Koa 2.0 能够向前兼容，由于 Koa 1.x 用的就是生成器函数处理中间件。

到了最后，就是直接将中间件处理函数一一存储到 Koa 实例的内部 middleware 属性中，便于后面使用。



##app.listen() 后面究竟发生了什么

如果你编写过原生 Node，估计对下方这坨代码并不陌生。

```js
const http = require('http')
const host = 'localhost'
const port = 3000
const server = http.createServer((req, res) => {
  res.status = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('haha...')
})
server.listen(port, host, () => {
  console.log('The server is started...')
})
```

上述就是直接创建一个 http 服务器，接着设置相应的返回状态以及内容。

但是，从 Koa 本身的构造器中可以看到，它并没有设置任何的服务器相关内容，那么会在哪里？其实 Koa 都是自己封装到一个`listen`方法中，我们就来看看。

```js
/**
 * Shorthand for:
 *
 *    http.createServer(app.callback()).listen(...)
 *
 * @param {Mixed} ...
 * @return {Server}
 * @api public
 */
listen(...args) {
  debug('listen');
  const server = http.createServer(this.callback()); // 直接通过http.createServer创建一个服务器
  return server.listen(...args); // 根据传入的参数初始化http服务器
}
```

可以看到的是，Koa 已经为每一个实例都带了一个`listen`方法来创建一个相应的 http 服务器。那么重点来了，可以看到如果**使用`app.listen`创建一个服务器时，都会调用 Koa 当前实例的`this.callback`方法，好明显，该方法执行完后肯定返回一个回调，就是用于处理请求的**。那么我们就来看看该方法是做些什么事情的。

```js
/**
 * Return a request handler callback
 * for node's native http server.
 *
 * @return {Function}
 * @api public
 */
callback() {
  const fn = compose(this.middleware); // 重点！！！通过koa-compose组合所有中间件函数

  if (!this.listenerCount('error')) this.on('error', this.onerror); // 全局监听错误事件

  const handleRequest = (req, res) => { // 封装好的处理请求的函数
    const ctx = this.createContext(req, res);
    return this.handleRequest(ctx, fn);
  };

  return handleRequest;
}
```

看到这里，也许你会看的有点模糊，compose 是啥？this.createContext 和 this.handleRequest 这两个方法又是干嘛的？先不要急，目前我们就可以知道的就是，**最终放进`http.createServer`中的回调函数就是下面这个：**

```js
(req, res) => { // 封装好的处理请求的函数
  const ctx = this.createContext(req, res);
  return this.handleRequest(ctx, fn);
}
```

好了，接下来就到我们的重头戏啦。先介绍一下 compose 这个方法，究竟何方神圣！😄



## 中间件处理函数的组合

在开始之前，我先简单介绍一下著名的 Koa 中间件的洋葱模型图（来自网图，如侵权可删除）。
![Koa中间件的洋葱模型图](https://user-images.githubusercontent.com/15081323/78218999-4e6e1900-74f1-11ea-923f-246457adf2d1.png)

**类似于 JavaScript 的 DOM 事件流处理方式，先从外层走到最内层，接着再从内层走到外层**。简单来说，就是按任务优先级来进行划分处理，先将任务优先级最高的进行处理，然后再处理任务优先级低。

也许你会好奇是如何实现从外到内，然后又从内到外的，在 Koa 2.0 中这一切都是通过 **async/await** 实现的，我们先来看看下面简单的🌰：

```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
	console.log(1)
  await next()
  console.log(11)
})
app.use(async (ctx, next) => {
  console.log(2)
  await next()
  console.log(22)
})
app.use(async (ctx, next) => {
  console.log(3)
  await next()
  console.log(33)
})
app.listen(3000)

// 输出结果为
// 1
// 2
// 3
// 33
// 22
// 11
```

既然是使用 async/await 实现，那总得需要把他们这些中间件回调函数都整合起来吧？没错，这就得益于`koa-compose`的处理，其实`koa-compose`在源码上的实现很简单，就是一个`compose`方法，我们就来看看它是如何实现。

```js
/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!') // 判断传入的中间件是否为一个数组
  for (const fn of middleware) { // 遍历数组，逐个元素判断是否为函数
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0) // 开始执行流程
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i] // 每次执行都拿当前遍历到的中间件函数出来
      if (i === middleware.length) fn = next // 当遍历的位置是最后一个时，那么中间件函数就是为空
      if (!fn) return Promise.resolve() // 当中间件函数为空时，直接执行Promise.resolve方法
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1))); // 每次遍历都会返回一个Promise，并且在返回之前会执行当前遍历到的中间件函数
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

在上述代码中，可以看到蕴含很多知识点在这里面。首先就是运用了闭包存储了当前遍历的位置 index，因此在调用`compose`方法时，实质返回的就是`Promise.resolve(fn(context, dispatch.bind(null, i + 1)))`，在返回的过程中也会立马执行了当前遍历到的中间件函数。

在这里，也许你在看代码的时候会有疑惑，**Promise.resolve 里面第二个参数是`dispatch.bind(null, i + 1)`，这明显只是返回了一个`this`指向`windows`的函数鸭，那什么时候开始执行？**

这个问题当时我也是感到迷惑地方，后面再结合上面`async/await`代码一看，结果就很明显，答案就在`await next()`里面，其中`next`函数就是`dispatch.bind(null, i + 1)`，这样一来又会重复`dispatch`过程。

总结一下，**`compose`函数执行的是一个`dispatch`过程，所谓`dispatch`过程，就是将当前的中间件函数执行，其中`context`上下文作为中间件函数的第一个参数，`dispatch.bind(null, i + 1)`返回的绑定函数作为第二个参数，当执行`await next()`时会重新执行`dispatch`过程（即递归过程），最终使用`Promise.resolve`包转好返回**。





## 上下文 context 的封装

我们接着回到上述这段 callback 的代码。如下：

```js
/**
 * Return a request handler callback
 * for node's native http server.
 *
 * @return {Function}
 * @api public
 */
callback() {
  const fn = compose(this.middleware); // 重点！！！通过koa-compose组合所有中间件函数

  if (!this.listenerCount('error')) this.on('error', this.onerror); // 全局监听错误事件

  const handleRequest = (req, res) => { // 封装好的处理请求的函数
    const ctx = this.createContext(req, res);
    return this.handleRequest(ctx, fn);
  };

  return handleRequest;
}
```

上面我已经讲了 compose 的源码实现，那么下面就要来到`handleReques`函数，该函数也是最终作为`http.createServer()`的回调函数。

先来看下`createContext`函数，好明显，看字面意思的话，该函数就是创建一个上下文 context 的意思。

```js
/**
 * Initialize a new context.
 *
 * @api private
 */

createContext(req, res) {
  const context = Object.create(this.context); // 将封装好的context作为原型对象
  const request = context.request = Object.create(this.request); // 将封装好的request对象作为context.request对象的原型对象
  const response = context.response = Object.create(this.response); // 将封装好的response对象作为context.response对象的原型对象
  context.app = request.app = response.app = this; // 将当前koa实例保存到context.app中
  context.req = request.req = response.req = req; // 将Node原生的req对象保存到context.req中
  context.res = request.res = response.res = res; // 将Node原生的res对象保存到context.res中
  request.ctx = response.ctx = context; // 将当前封装好的context对象保存到request.ctx和response.ctx上
  request.response = response; // 将封装好的response保存到request.response中
  response.request = request; // 将封装好的request保存到response.request中
  context.originalUrl = request.originalUrl = req.url; // 将当前请求的url保存到reqeust.originalUrl和context.originalUrl中
  context.state = {};
  return context;
}
```

可以看到，在原有封装好的`context`情况下，将 Koa 封装好的`this.request`和`this.response`对象保存一份到`context`上下文下。

当然需要额外注意的是，**`this.request`和`this.response`都是 Koa 对请求和响应的封装，而`req`和`res`则是 Node 原生的 request 对象和 response 对象**。

总结一下，**每当请求进入 HTTP 服务器时，都会在原封装好的`context`对象下添加`reuquest`和`response`，然后返回一个`context`对象（即没接受一个请求时，都会新创建一个`context`对象）**。



## 处理服务器所接收的请求

到了这里，相信你应该知道要讲的就是`handleRequest`方法，该方法就是最终处理请求和响应的。先来看源码吧。

```js
/**
 * Handle request in callback.
 *
 * @api private
 */

handleRequest(ctx, fnMiddleware) {
  const res = ctx.res; // 先缓存Node上原生的response对象
  res.statusCode = 404; // 默认状态为404
  const onerror = err => ctx.onerror(err); // 定义错误处理
  const handleResponse = () => respond(ctx); // 定义最终返回给客户端的内容处理
  onFinished(res, onerror); // HTTP 请求关闭、完成或错误时执行相应回调
  return fnMiddleware(ctx).then(handleResponse).catch(onerror); // 按需执行相应的中间件函数，并在最后处理好返回给客户端
}
```

可以看到，源码很简单，对于返回给客户端的内容处理都封装在`response`方法里面（这里暂不讨论，其实实现就是根据情况在res.end方法中返回）。

然而，你会发现有一个方法`onFinished`很奇怪，它究竟是干嘛的？

其实它就是**当 HTTP 在请求关闭、完成或错误的过程中，发现存在监听到的事件发生时，就会立马执行，这样一来就不需要在每一个过程中都编写一遍**。好比如上述的，使用 onerror 事件作为处理回调，明显的，当在请求关闭、完成或错误的过程中发现有错误发生时，便会调用一次 onerror 事件。

到了最后，按序执行相应的中间件函数，并处理好的结果作为`respond`方法的参数，当然最后也是会将处理好的结果返回到客户端中。



## 总结

**Koa 源码的核心在于中间件的处理，即洋葱模型。通过执行`compose`方法来递归执行`dispatch`方法，每递归一次就执行一次当前的中间件处理，执行完后，使用`Promise.resolve`包装一层并将结果返回**。

另外的话，也少不了对`context`对象、`request`对象、`response`对象的封装。





































































