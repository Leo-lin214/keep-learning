---
layout: post
category: Andraw-lin
title: About Javascript
summary: About Javascript
---

## **Javascript整体总结**

 - [(一) 解决跨域问题](#一-解决跨域问题)
 - [(二) 作用域链](#二-作用域链)
 - [(三) 创建ajax过程](#三-创建ajax过程)
 - [(四) 垃圾回收方法](#四-垃圾回收方法)
 - [(五) 继承方式及优缺点](#五-继承方式及优缺点)
 - [(六) 闭包理解](#六-闭包理解)
 - [(七) 事件处理](#七-事件处理)
 - [(八) get和post区别](#八-get和post区别)
 - [(九) 基本数据类型](#九-基本数据类型)
 - [(十) this使用的场景](#十-this使用场景)
 - [(十一) 了解Node核心](#十一-了解node核心)

### (一) 解决跨域问题

 1. jsonp(json+padding):
    
    动态插入script标签, 通过script标签引入一个js文件, 并在url参数中指定回调函数, 把我们需要的json数据作为函数参数传入;

 2. CORS:
  
    通过服务端设置 Access-Control-Allow-Origin 来进行, 当浏览器检测到相应的设置时, 就可以允许Ajax进行跨域的访问;

 3. 使用HTML5中新引进的window.postMessage方法来跨域传送数据: 
 
    能够兼容几乎所有的浏览器, 目前最后跨域方法;

 4. window.name: 

    window对象有个name属性, 该属性有个特征: 即在一个窗口(window)的生命周期内, 窗口载入的所有的页面都是共享一个window.name的, 每个页面对window.name都有读写的权限, window.name是持久存在一个窗口载入过的所有页面中的;
    
 5. 主域相同的时候使用document.domain:

    将子域和主域的document.domain设为同一个主域. 前提条件: 这两个域名必须属于同一个基础域名;


### (二) 作用域链

保证执行环境里有权访问的变量和函数是有序的，作用域链的变量只能向上访问，变量访问到window对象即被终止，禁止作用域链向下访问变量;

### (三) 创建ajax过程

 1. 创建XMLHttpRequest对象;
 2. 创建一个新的HTTP请求,并指定该HTTP请求的方法、URL及验证信息;
 3. 设置响应HTTP请求状态变化的函数;
 4. 发送HTTP请求;
 5. 获取异步调用返回的数据;
 6. 使用JavaScript和DOM实现局部刷新;
 7. 代码实现:

    ```javascript
     var xmlHttp = new XMLHttpRequest();
     xmlHttp.open('GET','demo.php','true');
     xmlHttp.send();
     xmlHttp.onreadystatechange = function(){
        if(xmlHttp.readyState == 4){
            if(xmlHttp.status>=200 && xmlHttp.status<300 || xmlHttp.status==304){
                alert(xmlHttp.responseText);
            }else{
                alert(xmlHttp.status);
            }
        }
     }
    ```
  

### (四) 垃圾回收方法

 1. 标记清除
    比如函数中声明一个变量，垃圾回收器将其标记为“进入环境”，当变量离开环境的时候（函数执行结束）将其标记为“离开环境”;

 2. 引用计数
 
    当声明了一个 变量并将一个引用类型赋值给该变量的时候这个值的引用次数就加1，如果该变量的值变成了另外一个，则这个值得引用次数减1，当这个值的引用次数变为0的时 候，说明没有变量在使用;

需要注意的是, 在IE中虽然JavaScript对象通过标记清除的方式进行垃圾回收, 但BOM与DOM对象却是通过引用计数回收垃圾的;

### (五) 继承方式及优缺点

 1. 原型继承
 
    有两个缺点: 
    - 对象无法重写引用类型的原型;
    - 子类型无法给超类型传递参数;
    
 2. 借用构造函数继承
 
    缺点: 虽然解决原型继承的两个缺点, 但却没有原型, 则没办法实现复用;

 3. 组合式继承
   
    优点: 把原型继承优点和借用构造函数继承优点结合起来;

```javascript
function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
```

### (六) 闭包理解

 1. 定义

    闭包是在某个作用域内定义的函数，它可以访问这个作用域内的所有变量;
    
 2. 闭包目的

    主要是为了设计私有的方法和变量;
    
 3. 优缺点

    闭包的优点是可以避免全局变量的污染，缺点是闭包会常驻内存，会增大内存使用量，使用不当很容易造成内存泄露;
    
 4. 三大特性

    - 函数嵌套函数;
    - 函数内部可以引用外部的参数和变量;
    - 参数和变量不会被垃圾回收机制回收;
    
### (七) 事件处理

 5. 事件流: 从页面中接收事件的顺序;
 6. 事件流包括三个阶段: 事件捕获阶段,处于目标阶段和事件冒泡阶段;
 7. 事件处理程序的过程: 

    - 当你点击一个元素的时候，浏览器并不知道你所点击的确定元素是哪个，它会从 DOM tree 的最高层一层一层往下找，尽可能地找到这个元素所处的最低一层，这就是我们的捕获阶段;
    - 当浏览器找到这个元素的最低层的时候，就会触发绑定在这个元素上的 handler，这就是我们的第二个阶段，处于目标阶段;
    - 当执行完这个 handler 的时候，浏览器就会根据捕获时的路径，往回走，这时候就会触发绑定在父元素的 handler，这个阶段就是我们的事件冒泡阶段;
    - 例如, 有一个div元素里面加入一个p元素, 在p元素里面加入span元素, 这时候我们在每个元素上都添加一个点击事件处理函数, 当我点击div的时候, 会先触发span事件处理函数, 然后冒泡上去, 触发p元素, 最后再触发div元素;
    
### (八) get和post区别

 1. 存储大小不同.
    
    使用get方式方式发送的数据, 大小一般限制在1KB以下, 而post发送的数据大小没有限制;

 2. 发送数据的方式不同.

    使用get方式发送的数据会追加到URL中发送, 而使用post发送数据时, 数据会作为请求实体内容主体发送到服务器;
    
 3. 缓存不同.

    使用get发送的数据会被浏览器保存缓存中缓存起来, 而使用post方式发送的数据是不会被缓存起来的;
    
 4. 总之一句话, get方式传送数据量小, 处理效率高, 安全性低, 会被缓存, 而post反之;


### (九) 基本数据类型

 1. undefined;
 2. null;
 3. string;
 4. boolean;
 5. number;
 6. symbol(ES6);
 7. 还有引用类型: object;

### (十) this使用的场景

 1. 函数普通调用时, this指向全局变量window;
 2. 函数当成方法调用时, this指向拥有这个方法的对象;
 3. 函数当成构造函数调用时, this指向刚刚分配的新对象;
 4. 通过apply()和call()方法调用时, this指向传进去的第一个对象;


### (十一) 了解Node核心

 1. Node 体系架构: 
 
    主要分为四个部分: 

    - Node Standard Library
      这是我们常用的一些标准库, 例如 Http, Buffer 模块;
    
    - Node Bindings
      沟通 JS 和 C++ 的桥梁, 封装 V8 和 Libuv 的细节, 向上层提供基础 API 服务;
      
    - V8
      V8 是Google开发的 JavaScript 引擎, 提供 JavaScript 的运行环境, 可以说它就是 Node.js 的发动机;
      
    - Libuv
      专门为 Node.js 开发的一个封装库, 提供跨平台的异步 I/O 能力;
      
    架构体系图如下: 
    
    ![NodeJs架构体系图](http://7xs89l.com1.z0.glb.clouddn.com/Know-more-about-Node.jpeg)
    
 2. Node 核心模块
 
    - Global 对象( 全局对象 )

      + process对象: 用于描述当前 NodeJs 进程状态的对象, 提供一个与操作系统的简单接口;
      + console 对象: 用于提供控制台的标准输出;
      + Buffer 对象: 用来处理二进制数据的, 比如图片, mp3, 数据库文件等, Buffer 支持各种编码解码, 二进制字符串互转;
      + setTimeout 和 clearTimeout等定时功能函数;
      
    - EventEmitter
    
      + 定义: EventEmitter 是 Node 中一个实现观察者模式的类, 主要功能是监听和发射消息, 用于处理多模块交互问题;
      + 典型应用: 模块间传递消息; 回调函数内外传递消息; 处理数据流; 观察者模式发射触发机制相关应用;
      
    - Stream
    
      Stream 是基于事件 EventEmitter 的数据管理模式, 由各种不同的抽象接口组成, 主要包括可写, 可读, 可读写, 可转换等几种类型;
      
    - Fs( 文件系统模块 )
      读写一个文件方法: 
      + POSIX式低层读写;
      + 流式读写;
      + 同步文件读写;
      + 异步文件读写;
      
    - Net ( 网络模块 )
    
      Node 全面支持各种网络服务器和客户端, 包括TCP, http/https, UDP, DNS等;
      
 3. Node 中的异步和同步理解

    Node 是单线程的, 异步是通过一次次的循环事件队列[ ( Event Loop ) ](https://github.com/jasonliao/prepare-for-interview/blob/master/JavaScript/event-loop.md)来实现的, 同步则是说阻塞式的 IO , 这在高并发环境会是一个很大的性能问题, 所以同步一般只在基础框架的启动时使用, 用来加载配置文件以及初始化文件等;