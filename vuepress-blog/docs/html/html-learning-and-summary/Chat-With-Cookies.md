# 聊聊Cookie

> Cookie一直是一个很值得探究的话题，也是很多人容易混淆的地方，今天就来探究一番Cookie。

废话少说，直入主题。

## Cookie的工作原理

在介绍Cookie之前，我们先来看下Cookie是如何进行工作的：

 1. 首先，先假设当前域名下是没有Cookie的；
 2. 接着，当浏览器发送了一个请求给服务器（原则上这个请求是不带Cookie的）；
 3. 服务器接收到请求后，可以选择性地去设置Cookie响应到客户端；
 4. 浏览器收到响应后，如果响应中带有Cookie，则将Cookie保存下来；
 5. 最后，对于客户端接下来的每一次请求，都会带上这些Cookie并发到服务器上；

**需要注意的一点就是：**

在WebStorage出现之前，Cookie被滥用当做了存储工具。什么数据都放在Cookie中，即使这些数据只在页面中使用而不需要传送到服务端中。

这是以前存储数据的一个弊端，而Cookie标准还是做了一些限制：

 - 每个域名下的Cookie的大小最大为**4KB**；
 - 每个域名下的Cookie数量最多为**20个**（但很多浏览器厂商在具体实现时支持大于20个）；

## Cookie的格式

JS原生的API提供了获取Cookie的方法：```document.cookie```（Attention：这个方法只能获取非HttpOnly类型的Cookie）。

现在就在浏览器上指向上述的代码： 

![document.cookie](http://7xs89l.com1.z0.glb.clouddn.com/document-cookie.png)

由上图可以看出，Cookie就是由一段字符串组成的，而且格式为：**由键值对Key=Value构成，键值对之间由一个分号和一个空格隔开**

## 实践查看cookie过程

在开始之前，需要在本地使用Node搭建一个服务器，我们将使用这个服务器来操作Cookie

```javascript
    // 首先打开命令行工具，执行下面一些命令
    mkdir cookie-demo && cd cookie-demo
    npm init
    npm install express --save
    touch main.js
```

执行完上面命令后，就会看到如下的文件结构

```javascript
    cookie-demo
    |- main.js
    |- node_modules
    |- package.json
```

打开main.js，并在main.js写入一下代码：

```javascript
    const express = require('express');
    const app = express();
    
    app.listen(3000, err=>{
        if(err){
            return console.log(err);
        }
    });
    app.get('/', (req, res)=>{
        res.cookie('name', 'Andraw_lin');
        res.send('<h1>Hello word!</h1>'); 
    });
    
    // 并在命令行中执行
    node main.js
```

在浏览器上打开```localhost:3000```

 - 我们看到```Request Headers```上并没有Cookie这个字段；
 - 但是```Response Headers```则有了Set-Cookie这个字段；

![cookie过程1](http://7xs89l.com1.z0.glb.clouddn.com/cookie-guocheng0.png)

从上图可以看出，服务端的头部会有一个``` Set-Cookie```字段；

然而，当你重新再刷新页面的时候，你会发现刚刚在服务端设置的cookie，在客户端重新请求服务端时会跟着请求头部上一起发送到服务端上，如下图

![cookie过程2](http://7xs89l.com1.z0.glb.clouddn.com/cookie-guocheng1.png)

上图就可以清晰发现在请求的头部多了```Cookie```字段，当然，无论你再刷新多少次，Cookie字段也还是存在在请求头部；

## Cookie的定义

看了上面的介绍的Cookie的过程后，这时候大家应该对Cookie有一定的理解，现在就总结如下：

 - Cookie是浏览器储存在用户电脑上的一小段文本文件；
 - Cookie是纯文本格式，不包含任何可执行的代码；
 - Cookie由键值对构成，由分号和空格隔开；
 - Cookie虽然是存储在浏览器，但是通常由服务器端进行设置；
 - Cookie的大小限制在4KB左右，一般情况下，每个域名下的Cookie数量不超过20个；

## Cookie的属性选项

每个Cookie都有一定的属性，如什么时候失效、要送到哪个域名、哪个路径等等。这些属性都是通过Cookie选项来进行设置，因此Cookie的属性选项主要包括如下：

 - Expries/Max-age;
 - Domain;
 - Path;
 - Secure;
 - HttpOnly;

在设置这些属性时，属性之间需要一个分号和一个空格隔开，代码如下：

```javascript
    "key=name; expires=Thu, 25 Feb 2016 04:18:00 GMT; domain=ppsc.sankuai.com; path=/; secure; HttpOnly"
```


1. Expires/Max-age

   Expires/Max-age都是控制**Cookie失效时刻**的选项。如果没有设置这两个选项，则默认有效期为session，即会话Cookie。这种Cookie在浏览器关闭后就会销毁。
   
   - Expires

     expires选项用来设置Cookie什么时间内有效，是一个时间点，expires其实是Cookie失效日期；
     
     另外，expires必须是GMT格式的时间（可以通过```New Date（）.toGMTString（）```或者```New Date（）.toUTCString（）```来获得）；
     
     重新设置一个main.js
     
     ```javascript
        app.get('/', (req, res)=>{
           // 设置Cookie十秒后失效
           res.cookie('name', 'Andraw_lin', {
               expires: new Date(Date.now() + 100000) 
           });
           res.cookie('age', '23');
           res.send('<h1>test</h1>');
        });
     ```
     
     执行上述代码后，可以看到
     
     ![cookie3](http://7xs89l.com1.z0.glb.clouddn.com/cookie-guocheng20.png)
     
     再到Application中去查看两个cookie的过期时间
     
     ![cookie4](http://7xs89l.com1.z0.glb.clouddn.com/cookie-guocheng21.png)
     
     因此，过了10秒后，再到浏览器的控制台上输出```document.cookie```，会发现只有一个键值对```age=23; ```
     
     当然以后发送请求也不会带上这个失效的Cookie（即name="Andraw_lin"）
     
     
   - Max-age

     expires是http/1.0协议中的选项，在新的http/1.1协议中expires已经由max-age选项代替，两者的作用都是**限制Cookie的有效时间**。
     
     **注意：** expires的值是一个时间点（Cookie失效时刻 = expires），而max-age的值是一个以秒为单位时间段（Cookie失效时刻 = 创建时刻 + max-age）
     
     另外，需要注意的是，**如果同时设置了max-age和expires，则以max-age的时间为准**。
     
     重新设置main.js
     
     ```javascript
        app.get('/', (req, res)=>{
            res.cookie('name0', 'Andraw_lin');
            res.cookie('name1', 'Tom', {
                expires: new Date(Date.now() + 30 * 1000),
                maxAge: 60 * 1000
            });
            res.cookie('name2', 'Jenny', {
                maxAge: 60 * 1000
            });
            res.send("<h1>hello world!</h1>");
        });
     ```
     
     运行上述代码如下
     
     ![cookie4](http://7xs89l.com1.z0.glb.clouddn.com/cookie-guocheng3.png)
     
     通过上图可以发现，当同时设置expires和max-age时，浏览器会自动以max-age的时间为准
     
     
2. Domain和Path

   domain是域名，path是路径，两者加起来就构成了URL，domain和path一起来限制Cookie能被哪些URL访问。
   
   而domain和path则分别被称为Cookie的作用域和作用路径，如果没有设置两个选项，则会使用默认值。domain的默认值为设置该Cookie的网页所在的域名，path默认值为设置该Cookie的网页所在的目录。
   
   **注意：** 只要满足作用域和作用路径，请求就会带上Cookie，就算端口号不一样。
   
   - domain作用域
    
     在讨论作用域之前，我们先来对域名做一个简单的了解。

     > 子域，是相对父域来说的，指域名中的每一个段。各子域之间用小数点分隔开。放在域名最后的子域称为最高级子域，或称为一级域，在它前面的子域称为二级域。
     
     以下图为例，news.163.com和sports.163.com是子域，163.com是父域。
     
     ![作用域](http://7xs89l.com1.z0.glb.clouddn.com/practice-cookie10.png)
     
     当Cookie的domain为news.163.com，那么访问news.163.com的时候就会带上Cookie；
     
     当Cookie的domain为163.com，那么访问news.163.com和sports.163.com就会带上Cookie
     
   - path作用路径

     当Cookie的domain是相同的情况下，也有是否带上Cookie有一定的规则。
     
     ![作用路径](http://7xs89l.com1.z0.glb.clouddn.com/practice-cookie11.png)
     
     需要注意的是，**在子路径内可以访问到父路径的Cookie，反过来就不行**；
     
     看看栗子，先修改main.js
     
     ```javascript
        app.get('/parent', (req, res)=>{
            res.cookie('parent-name', 'parent', {
                path: '/parent'
            });
            res.send('<h1>父路径</h1>')；
        });
        app.get('/parent/childA', (req, res)=>{
            res.cookie('child-name-A', 'childA', {
                path: '/parent/childA'
            });
            res.send('<h1>子路径A</h1>')；
        });
        app.get('/parent/childB', (req, res)=>{
            res.cookie('child-name-B', 'childB', {
                path: '/parent/childB'
            });
            res.send('<h1>子路径B</h1>')；
        });
     ```
     
     运行上述代码
     
     在```localhost:3000/parent```路径下
     
     ![cookie4](http://7xs89l.com1.z0.glb.clouddn.com/cookie-guocheng40.png)
     
     在```localhost:3000/parent/childA```路径下
     
     ![cookie4](http://7xs89l.com1.z0.glb.clouddn.com/cookie-guocheng41.png)
     
     在```localhost:3000/parent/childB```路径下
        
     ![cookie4](http://7xs89l.com1.z0.glb.clouddn.com/cookie-guocheng42.png)
     
3. Secure

   secure选项用来设置Cookie只在确保安全的请求才会发送。
   
   需要注意的是，**只有当请求是HTTPS或者其他安全协议时，包含secure选项的Cookie才能被发送至服务器**。
   
   下面我们设置一个secure类型的cookie：
   
   ```javascript
        document.cookie = "name=Andraw_lin; secure";
   ```
   
   > 有个坑需要注意下：
     如果想在客户端即网页中通过js去设置secure类型的cookie，必须保证网页是https协议的。在http协议的网页中是无法设置secure类型的Cookie的。
     
4. httpOnly

   该选项用来设置Cookie是否能通过js去访问。默认情况下，Cookie不会带httpOnly选项（即为空），所以默认情况下，客户端是可以通过js代码访问（包括读取、修改、删除等）这个Cookie的。当Cookie带httpOnly选项时，客户端无法通过js代码去访问（包括读取、修改、删除等）这个cookie。
   
   **在客户端是不能通过js代码去设置一个httpOnly类型的Cookie，这种类型的Cookie只能通过服务端来设置**。
   
   从上面的介绍中，大家是否会有这样的疑问：**为什么我们要限制客户端去访问Cookie？**
   
   **原因**：如果任何Cookie都能被客户端通过document.cookie获取，那么当我们的网页遭受了XSS的攻击，有一段而已的script脚本插到了网页中，这段script脚本做的事情是：通过document.cookie读取了用户身份验证相关的cookie，并将这些cookie发送到了攻击者的服务器。攻击者就会很容易拿到了用户身份验证信息，于是就可以大摇大摆地冒充此用户访问你的服务器了（因为攻击者有合法的用户身份验证信息，所以会通过你服务器的验证）