# Web中的路由

不管在前端开发还是后端开发中，都会经常接触到路由概念，那么今天就来谈谈 Web 中的路由。

## 路由的定义

简单来说，路由就是URL到函数的映射，举个栗子：

```javascript
    /article     =>    getArticle()
    /article/1   =>    getArticlePage()
```

当用户试图在某个网站内访问这两个路径的时候, 都会分别调用对应的函数 getArticle() 和 getArticlePage() 来获取文章以及对应页数的文章;

## route和router区别

看完上面, 也许这时候会有人提出, 那么既然都是路由, route和router有什么区别? 

首先, route就是一条路由, 就是可以把一个URL路径对应一个函数, 而上面举的栗子刚刚好就是两个route即两个路由;

而router则可以通俗地理解为一个容器，它主要负责管理一组route, 简单地来理解, route只是进行URL和函数的映射, 当接收到一个URL之后, 服务器就会去路由表中查找相应的函数, 这个过程就是由router来处理的;

## 服务端路由

对于服务端来说, 当接收到客户端发来的HTTP请求时, 会根据对应的URL, 在路由表中找到对应的函数, 然后执行对应的callback, 并将对应的响应结果返回给客户端. 所以, 当访问静态资源时, 所有的URL映射函数可以理解为一个文件的读取操作, 当访问动态数据时, 则可以理解为一个数据库的增删查改操作或者其他数据处理等等;

拿express举个栗子: 

```javascript
    app.get('/', (req, res)=>{
        res.sendFile('index.html');
    });
    app.get('/article', (req, res)=>{
        db.find(...).then(data=>res.send(data));
    });
```

当访问"/"时，会直接返回一个index.html文件到客户端进行对应的渲染(访问静态资源);

当访问"/article"时, 会直接从数据库中进行查询并返回对应的数据到客户端中(访问动态数据);

## 客户端路由

对于客户端而言, 路由的映射函数可以理解为对DOM元素的显示以及隐藏, 因此在访问不同的URL路径的时候, 可以加载不同的组件进行显示;

而客户端的路由一般可以通过以下两个方案实现: 

- 基于hash实现
- 基于H5的history API实现

(1) 基于hash的实现

在H5的history API出现之前, 前端的路由都是通过hash来实现的, 它有一个好处就是可以兼容低版本的浏览器;

当访问一个网站内的网站时, 这时候则需要这样进行访问URL: 

```javascript
    /#/article
```

web服务器并不会解析hash, 也就是说#后的内容web服务器都会自动忽略, 但是js是可以通过window.location.hash来读取到的, 读取到路径加以解析之后就可以相应不同的组件内容;

(2) 基于H5的history API实现

history API可以用来操作浏览器的session history(会话历史), 基于history实现的路由可以直接按照平常来进行访问: 

```javascript
    /article
```

当直接访问http://andraw_lin.com/时候, 两者的行为是一致的, 都是返回了index.html文件;

当从http://andraw_lin.com/跳转到http://andraw_lin.com/#/foobar或者http://andraw_lin.com/foobar的时候, 也都是一致的吗因为此时已经加载了页面以及脚本文件, 所以路由跳转正常;

当直接访问http://andraw_lin.com/#/foobar的时候, 实际上服务器发起的请求是http://andraw_lin.com, 因此会先加载页面以及脚本文件, 接下来才会开始进行获取路由, 进行对应的跳转, 跳转正常;

当直接访问http://andraw_lin.com/foobar的时候, 实际上服务器发起的请求是http://andraw_lin.com/foobar, 然而服务端只能匹配/而无法匹配/foobar, 除非对服务器进行改造路由表函数, 否则直接返回404页面;

所以如果使用了基于History API的路由，需要改造服务器端, 使得访问/foobar的时候也能返回index.html文件，这样当浏览器加载了页面及脚本之后，就能进行路由跳转了。

## 动态路由

上面提到的都是静态路由, 即URL是固定的, 但有时候我们却需要在路径中传入参数, 例如, 获取某篇文章, 我们不可能为每一篇文章都创建一个路由, 而应该是在通过捕获路径中的参数来实现, 举个栗子: 

```javascript
    app.get('/article/:id', (req, res) => {
        ...
    });
```

上面就是根据不同的id获取不同文章;

## 严格路由

在很多情况下, 会遇到/foobar和/foobar/的情况, 它们看起来非常相似, 然而实际上却有所区别, 具体行为也是视服务器设置而定;

在Flask文档中, 末尾有斜线的路径，类比于文件系统的一个目录；末尾没有斜线的路径，类比于一个文件。因此访问/foobar的时候，可能会重定向到/foobar/，而反过来则不会;

如果使用的是Express，默认这两者是一样的，也可以通过app.set来设置strict routing，来区别对待这两种情况.