# Webpack 优化--开发体验篇

在日常的开发过程中，webpack 带给我们的体验中，除了构建速度外，还有就是监听功能。

对于监听功能，相信童鞋们一点也不陌生，最经典莫过于重新编写源代码时，webpack 便能自动进行构建，再或者重新编写源代码后，除了自动构建外，还有自动刷新网页以保持代码最新。

**webpack 已内置文件监听变化重新构建的功能，而 webpack-dev-server 则负责刷新浏览器**。

## 使用自动刷新

相信童鞋们对于自动刷新并不陌生，因为在开发过程中会经常遇到过。那么自动刷新又是包含哪些功能？

其实**要实现自动刷新**，必须包含两部分的内容，**分别是文件监听功能和一个用于通知浏览器刷新的内置服务器功能**。在上面已经提到过，文件监听功能交给了 webpack，而内置服务器则交给了 webpack-dev-server。

接下来我们就要从上述两个功能点进行讲解和优化，以提升开发效率。



> 优化——文件监听功能

在 webpack 中开启文件监听功能，有两种方式，分别是

- 在配置文件 webpack.config.js 设置 watch: true；
- 在执行 webpack 命令时带上 --watch 参数；

我们先来看看，是如何在配置文件中配置的。

```javascript
// webpack.config.js
module.exports = {
  watch: true,
  // 监听模式运行时的参数
  watchOptions: {
    // 忽略对匹配到的文件夹进行监听
    ignored: /node_modules/,
    // 监听到文件变化时不会立即重新构建，而是要等300ms，节流，默认值也是300ms
    aggregateTimeout: 300,
    // 每秒钟内询问系统中指定文件有没有发生变化的次数
    poll: 1000
  }
}
```

文件监听功能的工作原理就是，**定时获取源文件的最后编辑时间，每次都存下最新的最后编辑时间，如果发现当前获取的和最后一次保存的最后编辑时间不一致就认为是发生了变化**。

从上述的配置可以看到，当源文件发生变化时，不会立即通知 webpack 重新构建，而是会先缓存下来，收集一段时间的变化后，才会一次性的告诉 webpack。这样做的目的就是防止高频变化引起不停地重新构建，从而导致卡死状态。

那么问题来了，对于多文件列表，webpack 是如何确定需要监听的文件列表呢？

还是最原始的初始化问题，**webpack 在执行时会从配置的 Entry 文件出发，递归解析 Entry 文件所依赖的文件，然后将这些文件一一加入到监听列中去**。

在了解文件监听功能后，我就要回到正题咯，那如何优化呢？

问题点就出在，webpack 在保存文件最新的最后编辑时间时，是需要占用内存的，同时定时检查和周期检查都是需要占用 CPU 以及 I/O。

所以**要优化文件监听功能，就应该从减少需要监听的文件数量和降低检查频率入手**。

1. 使用 watchOptions.ignore 忽略对 node_modules 文件夹的检查，将减少内存和 CPU 的使用；
2. watchOptions.aggregateTimeout 的值越大性能越好，避免频繁重新构建；
3. watchOptions.poll 的值越小越好，降低检查频率；

虽然说对 webpack 文件监听功能来说，的确是一项不错的优化，但是**文件监听只是负责重新构建，还是得自己手动去刷新网页才能获取最新编辑代码**，那么这也就降低项目的灵活性。



> 优化——内置服务器功能

既然说到文件监听功能缺少灵活性，那么有木有方法可以提高其灵活性呢？答案就是内置服务器功能。

**webpack 将内置服务器功能都交给了 webpack-dev-server ，webpack-dev-server 在使用时都会默认自带开启 webpack 的文件监听功能（这样就不必要再去手动添加配置开启文件监听功能啦😄）**。

要控制浏览器刷新，有三种方式，分别是

- **借助浏览器扩展，通过浏览器提供的接口进行刷新**，其中 webstorm 编辑器的 LiveEdit 功能就是使用这种方式的。
- **往开发的网页注入代理（如websocket）**，通过代理通知浏览器进行刷新。
- **将开发的网页装进一个 iframe 中**，通过刷新 iframe 去看到最新效果。

webpack 中 webpack-dev-server 功能默认采取的是第二种方式，当监听到源文件发生改变时，会使用 websocket 通知浏览器进行刷新相应网页。

我们先看看怎么配置哈。

```javascript
module.exports = {
  devServer: {
    // 默认情况下，inline都是为true的
    inline: true
  }
}
```

先回忆一下 devServer.inline 这个配置项，用于控制是否向 Chunk 中注入代理客户端，默认会注入。

**在开启 inline 时，devServer 会向每个输出的 Chunk 中注入代理客户端代码，当我们的项目需要输出很多 Chunk 时，就会导致构建缓慢**。

为什么需要向每个输出的 Chunk 注入代理客户端代码呢？

其实是因为 **devServer 并不知道某个网页是依赖哪些 Chunk，索性就对全部 Chunk 注入一个代理客户端**。

**那该如何优化呢？答案就是关闭这个还不够优雅的 inline 模式啦**😄

**当关闭 devServer 的 inline 模式后，devServer 会默认将网页装进一个 iframe 中去，编辑源代码时也会自动刷新 iframe 中网页内容。**同时你也会发现构建的时间也会大大减少，访问时的地址一般是`http://localhost:8080/webpack-dev-server/`。

当然如果你觉得使用 iframe 的方式不够优雅，但又想保持最优的自动刷新功能时，可以直接向你的模板 HTML 中注入代理客户端的脚本文件，如下：

```javascript
<script src="http://localhost:8080/webpack-dev-server.js"></script>
```

但是要小心的是，在发布到线上前，一定要把这段脚本加载删掉。



## 开启模块热加载

说到模块热加载，其实就是一种模块替换机制，在不刷新网页的情况下能保持代码最新，也是 webpack-dev-server 支持的另一种刷新代码方式。

模块热替换相对于自动刷新有哪些优势？

- **实时预览反应更快**，不需要刷新整个页面，只需要刷新相应模块。
- **保持当前网页的运行状态**，例如在使用 Redux 时，当编写源码时，不会刷新页面，并且当前网页的状态也会保持下来，避免重新加载状态。

先来看看如何配置的。

```javascript
module.exports = {
  devServer: {
    // 告诉webpack开启模块替换模式
    hot: true
  }
}
```

在构建过程中，会发现比自动刷新时多出三个文件，其实这三个文件用于模块热替换的，相比之下热替换需要占用内存会更大一点。

就算开启模块热替换，也会经常遇到某些源文件更改后并不是替换的，而是自动刷新页面的，这又是为啥？

原因很简单，**当子模块发生更新时，更新事件就会像冒泡一样，一层一层地向上传递，直到顶层文件接收了当前变化的模块，即 module.hot.accept(['./AppComponent']) ，这时就会调用相应的 callback 去执行自定义逻辑，当然若顶层并没有接收该模块，就会直接重新刷新网页**。

那么为什么我们并没有接收 css 模块处理，但修改 css 文件时依然会触发热替换呢？

原因就是 **style-loader 会自动注入用于接收 css 的代码**。

那么怎么接收法，我们可以直接在顶层代码中编写。

```javascript
if(module.hot) { // 判断是否开启模块热加载
  module.hot.accept(['./AppComponent'], () => { // 接收模块为./AppComponent
    render(<AppComponent />, document.querySelector('#app')) // 当该模块更新时，会重新render
  })
}
```

另外，可使用 webpack 内置的 NameModulePlugin 功能，相应地输出哪些模块热替换，不然只会输出ID模块进行了热替换，不方便调试。

```javascript
const NameModulePlugin = require('webpack/lib/NameMoudlePlugin')

module.exports = {
  plugins: [
    new NameModulePlugin()
  ]
}
```

















