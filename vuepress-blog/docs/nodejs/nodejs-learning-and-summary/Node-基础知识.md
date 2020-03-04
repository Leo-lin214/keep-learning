# Nodejs 知识点总结

- [回调函数](#回调函数)
- [事件循环](#事件循环（event-loop）)
- [EventEmitter](#EventEmitter)
- [Node的多进程](#Node的多进程)
- [Node的内存分配机制](#Node的内存分配机制)
- [Buffer模块](#Buffer模块)
- [Stream模块](#Stream模块)

## 回调函数

Nodejs中异步编程的最直接实现，在于回调。但不能说回调后程序就是异步的。

1. 阻塞代码（同步）

   ```javascript
   const fs = require('fs')
   let data = fs.readFileSync('input.txt')
   console.log(data.toString())
   console.log('同步')
   
   // 输出结果是：
   // 'haha'
   // '同步'
   ```

2. 非阻塞代码（异步，即异步编程的直接体现）

   ```javascript
   const fs = require('fs')
   let data = ''
   fs.readFile('input.txt', function(err, res) {
     if (err) {
   		console.log(err)
     }
     data = res.toString()
   })
   console.log('异步')
   
   // 输出结果是：
   // '异步'
   // 'haha'
   ```

3. 针对Nodejs的异步编程解决方案，有很多，包括ES6的promise、generator以及ES2017的async / await，详见[Node.js异步漫谈](https://segmentfault.com/a/1190000012571381)

## 事件循环（Event Loop）

对于事件循环，浏览器和Node在大体思想上都是基本类似（都是等待主线程空闲后，再去事件队列中按顺序执行对应的回调），但是在实现上却是大相径庭（即浏览器和Node的事件队列阶段不一致）。

一、浏览器事件循环

1. 基本过程

   - JavaScript在执行时，会沿着主线程一步一步向下走，当遇到一个方法时，会先为该方法创建一个执行环境（即执行上下文this），由于JS是单线程，会把该方法放到一个执行栈来执行。

   - 遇到方法内部的同步代码，会继续按序执行，但执行完后，会回到上一个方法的执行环境中去（如果方法中无方法调用，则上一个方法的执行环境即是全局作用域）。

   - 遇到方法内部或全局作用域下的异步代码，浏览器不会等待该代码执行完再继续下去，而是先把该事件进行挂起（即Pending状态），然后继续执行执行栈中代码，当异步事件有结果返回后，浏览器就会把该异步事件添加至一个事件队列中（该过程不会影响原执行栈中代码的执行）。直到JS主线程执行完后（即主线程空闲时），才会循环遍历事件队列中的事件，按序执行其回调函数callback。

2. 事件队列详细过程

   事件队列上，可大体分为两类：微任务（micro task）和宏任务（macro task）。

   - 微任务：常见的HTTP请求、promise、事件监听；
   - 宏任务：常见的定时器setTimeout、setInterval；

   在循环遍历事件队列时，会优先处理微任务，再处理宏任务，因此，如下代码：

   ```javascript
   setTimeout(() => { console.log(1) }, 0)
   
   new Promise((resolve, reject) => {
     console.log(2)
     resolve(3)
   }).then((res) => { console.log(res) })
   
   // 输出结果为：
   // 2
   // 3
   // 1
   ```

   可以看到，在处理完微任务后，再依次处理宏任务。

二、Node事件循环

Node环境下，会使用chrome的V8 JavaScript引擎来对js代码进行解析，解析后会调用对应的Node API，而这些Node API则是由Libuv引擎进行驱动，因此Node事件循环也是由Libuv实现。

同样的，和浏览器事件循环一致，遇到异步编程时，会将其放入一个事件队列中，等待主线程执行完后再去遍历事件队列执行对应的回调。

1. Libuv实现的事件循环阶段：

   - **timers**：执行定时器队列中的回调，如setTimeout、setInterval；
   - **I/O callbacks**：执行所有的I/O错误相关操作，除了定时器回调、close事件以及setImmediate回调；
   - **idle prepare**：可当成是一个空闲状态，或即将进入下一轮的轮询中，供内部使用，可不需理会；
   - **poll**：执行I/O操作事件，同时重复轮询事件队列，观察哪些事件可以执行。
   - **check**：执行setImmediate回调；
   - **close callback**：执行 Socket 的 close 事件回调；

   需注意的是，Nodejs代码由V8引擎解析传入Libuv引擎后，会先进入**poll阶段**，这个阶段主要做两件事：

   - 执行I/O回调，即所有的I/O操作回调，例如读取文件、创建服务器等；

   - 一旦poll queue为空时，会**同时**进入以下两个阶段：

     + 观察timers阶段下队列中是否有到期的定时器，若有，则执行对应的回调；
     + 观察check阶段下队列中是否有setImmediate，若有，则执行对应的回调；

     执行顺序不能确定，受运行环境所影响；只有一种情况是可以确定其执行顺序的，当两者同时在异步I/O中执行时，则setImmediate会优先于setTimeout：

     ```javascript
     var fs = require('fs')
     fs.readFile('test.txt', () => {
       setTimeout(() => { console.log(1) }, 0)
       setImmediate(() => { console.log(2) })
     })
     
     // 输出结果为：
     // 2
     // 1
     ```

2. process.nextTick

   独立于Event Loop之外的，拥有自身的队列。主要是当前阶段结束到下一个阶段到来前执行其回调，可以说是两个阶段之间的另外一个新的队列。看栗子🌰：

   ```javascript
   var http = require('http');
   
   function compute() {
     // performs complicated calculations continuously
     // ...
     process.nextTick(compute);
   }
   
   http.createServer(function(req, res) {
     console.log(1);
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.end('Hello World');
   }).listen(5000, '127.0.0.1');
   
   compute();
   ```

   上述例子，当在浏览器上打上`localhost:5000`后，由于下一个阶段poll queue即将到来，因此会先执行process.nextTick()，但是由于上述一直处于死循环中，导致正在等待处理的poll queue事件一直等待，直到‘饿死’状态。因此使用process.nextTick一定要恰当，不当会导致程序处于死循环中。

参考链接：

- [浏览器与Node的事件循环(Event Loop)有何区别?](https://blog.fundebug.com/2019/01/15/diffrences-of-browser-and-node-in-event-loop/)
- [JavaScript运行机制深入浅出学习](https://zhuanlan.zhihu.com/p/33125763)
- [详解JavaScript中的Event Loop（事件循环）机制](https://zhuanlan.zhihu.com/p/33058983)

## EventEmitter

对于上述提到的事件循环，有一点需要注意的是，无论是浏览器环境还是Node环境，**事件绑定一般都是异步进行，例如on、addEventListener等绑定事件**，但是**触发事件执行回调的过程则是同步进行的**，举个栗子：

```javascript
let event = require('events')
let eventEmitter = new event.EventEmitter()
eventEmitter.on('haha', () => { console.log(1); })
eventEmitter.emit('haha')
console.log(2);

// 输出结果为：
// 1
// 2
```

可以看到，当绑定事件时，会执行一个线程绑定，并把回调放到事件队列中。由于主线程立马触发了`haha`事件，因此在事件循环过程中立马执行了，然后再到输出了数字2。

事件触发过程都会被认为是一个同步过程，但对于绑定事件过程，由于绑定时间是很短暂的，几乎可以忽略不计，因此也会有部分人认为这也是一个同步过程，但其实是一个异步过程，只是时间会特别的短暂。

我们都知道，Node中基本所有的API都是基于EventEmitter的，例如`fs.readStream`、`http.createServer`等等。

而EventEmitter采用的是观察者模式，虽知道的是，events模块只提供了一个对象: `events.EventEmitter`，其核心就是事件触发和事件监听功能的封装。举个栗子🌰：

```javascript
let event = require('events')
let eventEmitter = new event.EventEmitter()
eventEmitter.on('haha', () => { console.log(1); })
eventEmitter.emit('haha')
```

## Node的多进程

众所周知，Node是**单进程单线程**，为此能够拥有**非阻塞、事件驱动**的优点。但是当遇到请求特别多时或者处理复杂的逻辑任务等等问题时，主线程都需要耗费很长时间来等待完成，就会不可避免导致线程无法进行下去。（需注意的是，Node的线程是包含JS引擎线程、setTimeout及setInterval工作线程、ajax工作线程等等，而**单线程指明的是JS引擎线程**）

在一个多核计算机上，单进程的Node明显无法有效滴利用计算机资源，因此就需要进行多进程有效滴利用计算机CPU资源，同时也能很好滴解决对于需要处理复杂逻辑任务或多请求所带来的阻塞行为。

一、child_process模块

使用child_process模块可实现Node的多进程，主要包含有四个方法：**spawn、exec、execFile、fork**。都是用于创建子进程的方法，在使用上会有一定的区别（需注意的是，创建子进程返回的是一个child_process实例，因此可以监听如exit、disconnect、error、close、message事件）。

- exit：当子进程退出时会触发；
- disconnect：父进程调用child.disconnect()时触发；
- error：当创建或处理事务异常时会触发，或执行`kill`命令时触发完；
- close：当子进程的stdio流关闭时触发，与exit的区别在于，当多进程共享同一stdio流时，某个进程退出时并不意味着stdio流被关闭；
- message：当子进程执行process.send()时触发，父子间通信的内部机制；

child_process能够使我们在子进程中操作一些操作系统相关命令，最后执行完后，再通知到父进程来进行善后工作。

1. spawn

   创建一个新的子进程，并执行传递进去的指令。格式如何：

   ```javascript
   spawn('操作系统的命令', [命令的参数], {options})
   
   options主要用到的属性是：
   - stdio: 用于控制子进程的标准输入可写流（stdin）、标准输入可读流（stdout）、标准输入错误流（stderr），父进程刚好相反
   - env: 环境变量键值对
   - detached: 用于分离子进程和父进程
   - cwd: 子进程的当前工作目录
   - shell: 是否需要使用shell命令
   ```

   接下来，直接上栗子🌰：

   ```javascript
   const { spawn } = require('child_process')
   const child = spawn('ls', ['.'])
   child.stdout.on('data', data => { console.log(`stdout: \n${data}`) })
   child.stderr.on('data', data => { console.log(`stderr: \n${data}`) })
   child.on('close', data => { console.log(`close: ${data}`) })
   child.on('exit', data => { console.log(`exit: ${data}`) })
   ```

   执行的结果就是，会根据命令`ls .`输出该目录下所有文件名，接着在可读流`stdout`监听中输出对应的数据。执行完对应命令后，会**先退出进程再关闭进程**。当输出的值为0时代表成功退出或关闭，而1代表的是失败。

2. exec

   与spawn的区别在于，能直接使用`shell`语法，并且会将命令的输出放到一个缓冲区中，然后再将整个输出值传递到一个回调中，而spawn直接操作的基本单位是流。格式和spawn类似，只是不需要命令的参数一项：

   ```javascript
   exec('shell命令', {options}, callback)
   ```

   直接上栗子🌰：

   ```javascript
   const { exec } = require('child_process')
   const child = exec('ls', (err, stdout, stderr) => { console.log(stdout) })
   child.on('close', data => { console.log(`close: ${data}`) })
   child.on('exit', data => { console.log(`exit: ${data}`) })
   ```

   执行完后，结果会直接在callback中输出，需要注意的是，会先执行退出子进程exit，然后再会事件循环到到callback中，最后才会关闭整个进程的。

3. execFile

   与exec类似，区别在于操作的不是命令，一般是一个shell脚本文件，同样也是不基于stream流的。**execFile可以说是对spawn的封装**，用法类似，**execFile内部还是使用spawn实现的**。

   ```javascript
   const { execFile } = require('child_process')
   const child = execFile('node', ['test.js'], (err, stdout, stderr) => { console.log(stdout) })
   
   // 当然使用spawn也是可以的，但是最终返回的结果是以流的方式返回
   const { spawn } = require('child_process')
   const child = spawn('node', ['test.js'])
   child.stdout.on('data', data => { console.log(data) })		// 最终输出的结果是一串stream流格式的值，当然如果前面使用的字符串，例如上面的例子，Node会强制帮转换成对应的字符串的形式
   ```

   由于exec方法执行的是一段`shell`脚本，因此若是`rm -f`危险命令时，也会直接执行。而spawn和execFile不能直接操作`shell`脚本，当在参数项里带有如`[';rm -f']`时，会自动检测到错误并且终止运行，直接抛出异常。因此就**安全性来考虑的话：spawn > execFile > exec**

4. fork

   spawn方法的变体，默认打开父子进程自带的通信机制（IPC管道），即对options选项中的stdio设置IPC管道。所谓的IPC管道，即父子进程间通信使用的是监听message事件，使用send方法来广播消息。

   需注意的是，fork的第一个参数是指代一个模块（或文件路径），格式如何：

   ```javascript
   fork('模块名（或文件路径）', [ 引入模块时多加入的参数数组 ], { option })
   
   - 参数数组和option两项跟原来的spawn是类似的
   ```

   直接上栗子🌰：

   ```javascript
   // main.js
   const { fork } = require('child_process')
   const child = fork('./child.js')
   child.on('close', data => { console.log(data) })
   child.on('message', data => { console.log(data) })			// 用于等待child.js中处理完后能够返回结果
   
   // child.js
   let n = 1
   // ...很复杂的处理逻辑，处理完后能够通知到父进程处理后的结果
   process.send(n)
   ```

   执行完后，父进程在监听message事件，最终在回调中能够获取到子进程处理完并且发送回来的的结果n。

二、父子进程间的通信机制

Node多进程间是独立的，因此子进程在处理完一些事务后，有必要告知父进程已经处理完并处于空闲状态，这时候父进程就会再次分配一些新的任务给子进程处理，从而在每个进程间达到一种分配平衡状态。

1. Pipe管道通信

   适用于**不用进程间**的管道传输。以**Stream流**的形式在父子进程进行传输。直接上栗子🌰：

   ```javascript
   // 同一个文件下的例子
   const { spawn } = require('child_process')
   const child = spawn('wc')
   process.stdin.pipe(child.stdin)
   child.stdout.on('data', data => { console.log(data) })
   // 上述代码执行后，随意输入一个字符，按CTRL + D后，输入的字符会直接作为wc命令后面的参数w
   
   // 不同文件下的例子
   // parent.js
   const { spawn } = require('child_process')
   const child = spawn('node', ['child.js'])
   process.stdout.pipe(child.stdin)
   child.stdout.on('data', data => { console.log(data) })
   // child.js
   process.stdin.on('data', data => {
     let msg = `${data}, this is child message`
     process.stdout.write(msg)
   })
   // 上述例子执行后，在parent.js下会输出你打出信息+', this is child message'
   ```

   需特别说明的是，父进程的stdin、stdout和子进程是相反的，**process的stdin代表可读流，stdout代表可写流，而child的stdin代表可写流，stdout代表可读流**。

2. stdin/stdout传递json

   父子进程间最直接的通信方式，就是使用stdin/stdout方式。上述的不同文件下的栗子中，子进程向父进程发送通知就是通过这种方式发送的。

   一般使用这种方式时，其实就是同一个进程间的发送—接收而已。直接上栗子🌰：

   ```javascript
   // 同一个文件下的例子
   const { spawn } = require('child_process')
   const child = spawn('node')
   child.stdin.write('haha')
   child.stdout.on('data', data => { console.log(data) })
   process.stdout.write('hehe')
   process.stdin.on('data', data => { console.log(data) })
   // 执行上述代码后，只能看到输出hehe，因为控制台展示一般都系主进程而非子进程
   
   // 不同文件下的例子
   // parent.js
   const { spawn } = require('child_process')
   const child = spawn('node', ['child.js'])
   child.stdin.write('haha')
   child.stdout.on('data', data => { console.log(data) })
   // child.js
   process.stdin.on('data', data => {
     let msg = `${data}, this is child message!`
     process.stdout.write(msg)
   })
   ```

   上述不同文件下的例子，可以看到，其实就是child进程间的通信而已，只是child进程注册到了父进程，因此在父进程能够在监听data的回调中能够接受到子进程操作完后的信息。

3. 原生IPC通信

   作为最常用的父子进程间通信方式，`fork`方法默认打开该配置，而`spawn`方法若想使用该方式，则需在配置项stdio配置IPC即可。直接上栗子🌰：

   ```javascript
   // 不同文件下的例子
   // parent.js
   const { fork } = require('child_process')
   const child = fork('./child.js')
   child.on('message', data => { console.log(` ${data}`) })
   // child.js
   process.send('haha')
   ```

   可以看到，最好的结合就是使用fork方法，默认打开IPC管道。

4. sockets机制

   使用网络完成进程间的通信，不仅能跨进程，还能跨机器。

   直接上一个网上的栗子🌰，使用的是[node-ipc](https://www.npmjs.com/package/node-ipc)模块：

   ```javascript
   // server
   const ipc=require('../../../node-ipc');
   
   ipc.config.id = 'world';
   ipc.config.retry= 1500;
   ipc.config.maxConnections=1;
   
   ipc.serveNet(
       function(){
           ipc.server.on(
               'message',
               function(data,socket){
                   ipc.log('got a message : ', data);
                   ipc.server.emit(
                       socket,
                       'message',
                       data+' world!'
                   );
               }
           );
   
           ipc.server.on(
               'socket.disconnected',
               function(data,socket){
                   console.log('DISCONNECTED\n\n',arguments);
               }
           );
       }
   );
   ipc.server.on(
       'error',
       function(err){
           ipc.log('Got an ERROR!',err);
       }
   );
   ipc.server.start();
   
   // client
   const ipc=require('node-ipc');
   
   ipc.config.id = 'hello';
   ipc.config.retry= 1500;
   
   ipc.connectToNet(
       'world',
       function(){
           ipc.of.world.on(
               'connect',
               function(){
                   ipc.log('## connected to world ##', ipc.config.delay);
                   ipc.of.world.emit(
                       'message',
                       'hello'
                   );
               }
           );
           ipc.of.world.on(
               'disconnect',
               function(){
                   ipc.log('disconnected from world');
               }
           );
           ipc.of.world.on(
               'message',
               function(data){
                   ipc.log('got a message from world : ', data);
               }
           );
       }
   );
   ```

5. 中间层redis机制（第三方配置，类似Vue中的vuex）

   redis自带发布—订阅模式，使用的场景有一对一、一对多，但**不会关注消息的可靠性场景。**

   **----------------------------还没深入学习，后面补上---------------------------**

参考通信机制链接有：

- [Nodejs进程间通信](http://www.ayqy.net/blog/nodejs%E8%BF%9B%E7%A8%8B%E9%97%B4%E9%80%9A%E4%BF%A1/#articleHeader5)
- [Node.js 子进程：你需要知道的一切](https://zhuanlan.zhihu.com/p/36678971)

三、cluster模块

cluster意为集成，主要集成两方面的内容：

- 集成`child_process.fork`方法创建子进程，默认采用IPC通信方式；
- 集成根据多核CPU创建子进程后，能够**自动控制负载均衡**的方式；

先看一个官方栗子🌰：

```javascript
const cluster = require('cluster')
const http = require('http')
const cpuNum = require('os').cpus().length
if (cluster.isMaster) {		// 可判断是主进程还是子进程
	console.log(`主进程 ${process.pid} 正在运行`)
  // 主进程下创建子进程
  for (let i = 0; i < cpuNum; i++) {
    cluster.fork();
  }
  // 主进程监听进程退出事件
  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`)
  })
} else {
  // 工作进程可共享主进程中任何TCP连接，这个例子就是共享主进程中一个HTTP服务器
  http.createServer((req, res) => {
    res.writeHead(200)
    res.end('Hello\n');
  }).listen(8000)
  console.log(`工作进程 ${process.pid} 已启动`)
}
```

使用cluster模块，主进程能够使用**调度轮询算法**在**循环的基础上**通过所有可用的进程，将**负载均匀地分布**。

1. cluster运行效率

   在普通单进程下，当请求特别多时，一旦中间出现问题就会导致后面请求一直等待状态，而cluster可让我们的Node根据主机CPU来进行负载均衡。以下对比单进程和clsuter模块的效率：

   - 普通单进程

     ```javascript
     // js代码
     const http = require('http')
     http.createServer((req, res) => {
       for(let i = 0; i < 1e7;i++) {} // 无限循环拖延
       res.end(`handled by process.${pid}`);
     }).listen(8000)
     
     // 测试命令（使用apache基准测试工具），看看实际单进程下10秒200个请求能够处理多少个
     ab -c200 -t10 http://localhost:8080/
     ```

     测试效果图：

     ![](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/Nodejs/%E5%8D%95%E8%BF%9B%E7%A8%8B%E4%B8%8B%E8%AF%B7%E6%B1%82%E6%B5%8B%E8%AF%95%E5%9B%BE.png)

     可以睇到，单进程下，如果是处理高复杂度的计算，在10秒内只能处理105个请求。

   - cluster模块多进程

     ```javascript
     // js代码
     const cluster = require('cluster')
     const http = require('http')
     const pid = process.pid
     const cpuNum = require('os').cpus().length
     if (cluster.isMaster) {
       for(let i = 0; i < cpuNum; i++) {
         cluster.fork()
       }
     } else {
       http.createServer((req, res) => {
         for(let i = 0; i < 1e7;i++) {} // 无限循环拖延
         res.end(`handled by ${pid}.`)
       }).listen(8000)
     }
     ```

     测试效果图：

     ![](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/Nodejs/cluster%E6%A8%A1%E5%9D%97%E4%B8%8B%E8%AF%B7%E6%B1%82%E6%B5%8B%E8%AF%95%E5%9B%BE.png)

     可以看到多进程下，处理的请求刚好为200个，明显比单进程的效率会高很多。

2. cluster多进程间通信

   使用`cluster.workers`可获取所用工作进程对象的列表，然后按照以下方式即可通信：

   ```javascript
   // 父进程
   Object.values(cluster.workers).forEach(worker => {
     worker.send('hello worker', worker.id)
   })
   
   // 子进程
   process.on('message', msg => { console.log(msg) })
   ```

3. 自动重启

   当一个工作进程在运行过程中报错，最终终止时，就需要重新一个子进程来维护整个Node环境的运行，但这个过程不需我们手动创建，应需自动重启创建子进程。

   任何一个工作进程挂掉时，都会调用disconnect方法，这种情况下，该工作进程下的`exitedAfterDisconnect`就会相对应的设置为true。直接上栗子🌰：

   ```javascript
   cluster.on('exit', (worker, code, signal) => {
     if (code !== 0 && !worker.exitedAfterDisconnect) {
    		console.log(`工作进程${worker.pid}已崩溃，正重新创建新的工作进程`)
       cluster.fork()
     }
   })
   ```

4. 负载均衡

   Node中原生子进程采用负载均衡默认是􏰧操作系统的抢占式策略，主要是根据工作进程对应的**CPU的繁忙程度**来分配工作。

   **在Node中，进程的繁忙程度主要是由CPU和I/O两部分构成**。因此单纯地根据CPU的繁忙程度来分配对Node来说是不一定合理，因为可能存在I/O繁忙而CPU空闲的状况，就会容易导致一个进程处理过多的任务。因此在v.0.11版本的Node中，提供了一种方案叫**Round-Robin（轮叫调度）**，分发的􏸚􏸛是在N个工作􏰅程中，每􏲓次选择第`􏰋􏸩􏰁i = (i + 1) mod n`个􏰅进程来发送连接。启用只需：

   ```javascript
   // 启用Round-Robin
   cluster.schedulingPolicy = cluster.SCHED_RR 
   // 不启用Round-Robin
   cluster.schedulingPolicy = cluster.SCHED_NONE
   ```

**总结：cluster模块的工作原理，就是请求并发处理，并充分利用计算机的多核处理优势**。

参考链接：

- [Node.js 集群（cluster）：扩展你的 Node.js 应用](https://zhuanlan.zhihu.com/p/36728299)
- [cluster工作原理](http://zhenhua-lee.github.io/nodejs/cluster.html)
- [深入解析child_process模块和cluster模块](https://github.com/forthealllight/blog/issues/24)



## 内存分配

一、V8内存限制

众所周知，V8引擎存在内存限制，主要是由于其内部的垃圾回收机制所控制的～。在运行Node环境时，通过参数`—max-old-space-size`和`--max-new-space-size`可进行调整V8引擎内部的内存限制大小。

```javascript
node --max-old-space-size=1700 index.js		// 单位为MB
node --max-new-space-size=1024 index.js		// 单位为MB
```

默认配置下，64G的V8约需1.4G内存，而32位系统则是0.7GB。

二、V8垃圾回收机制

V8中将内存会分为新生代和老生代，分别对应上面的`max-new-space-size`和`max-old-space-size`。

- 新生代：存储的对象一般是**存活时间较短**的对象；
- 老生代：存储的对象一般是**存活时间较长或常驻内存**的对象；

需要注意的是，**在新生代中使用的垃圾回收机制，和老生代中使用的是不一致的**。

- 新生代垃圾回收机制

  采用的是**Scavenge算法**，而实现其算法则主要使用**Cheney算法**（复制的方式实现的垃圾回收机制）。Cheney算法主要步骤如下：

  + 首先将堆内存（所谓堆内存，即V8下分配的内存空间）一分为二，分别为使用的空间（From空间）、闲置的空间（To空间）；
  + 分配对象时，会在From空间进行分配。而进行垃圾回收时，则会直接检查From空间中对象，对于能够存活下来的对象会直接复制到To空间，无法存活的对象会直接释放掉；
  + 走完一遍复制过程后，会把From空间和To空间的角色进行互换，再下一次的垃圾回收检查时，会重走一遍步骤2中的流程；

  可以看到**整个Cheney算法流程就是上述步骤中的2和3中不停循环**。

  需要注意的是，Scavenge算法除了包含上述的步骤外，还会包含两个流程：

  - 在From空间中复制过程中，若发现该对象已经被复制过一遍了并且还是活对象时，会直接把该对象挪去老生代内存空间中；
  - 在From空间中复制过程中，一旦超出To空间的25%时，也会直接把该对象移向老生代内存空间中；

  因此，**Scavenge算法**在新生代中存活的对象不会很多，很多情况下只需执行释放非存活对象即可，效率也会很高完成。但是**缺陷就是需要使用新生代内存的一半来进行内存分配**。

- 老生代垃圾回收机制

  由于老生代基本都是存活的对象，因此**Scavenge算法**并不适合该内存空间中的垃圾回收。主要采用**Mark-Sweep和Mark-Compact相结合**的方式来进行垃圾回收。

  - Mark-Sweep：即为标记清除法。会遍历老生代内存中对象，对于要存活的对象会标上一个标记，而非存活的对象则不会进行标记。因此在垃圾回收时，只会释放没有被标志的对象。很明显，由于非存活的对象占比会很少，因此该算法特别适合老生代内存空间中对象，效率会高；

    ![](http://pr0i7g1w3.bkt.clouddn.com/mark_compact.png)

    ![mark_compact](/Users/andraw-lin/Mine/Personal/FE_Images/Nodejs/mark_compact.png)

  - Mark-Compact：即为标记整理法。大部分情况下，老生代使用Mark-Sweep方法即可，但是由于Mark-Sweep标记后的对象是不不连续的，因此在老生代中分配一个大对象时，因为**空间的不连续导致会触发一次垃圾回收（这一次的垃圾回收是不必要的）**。该算法就是在标记完存活对象后，会将存活对象向内存的一个端进行移动，这样就会很好滴让存活对象在一端，非存活对象在另一端，对后续处理也会简便很多。

    ![](http://pr0i7g1w3.bkt.clouddn.com/mark_compact_new.png)
    
    ![mark_compact_new](/Users/andraw-lin/Mine/Personal/FE_Images/Nodejs/mark_compact_new.png)
  
  **老生代垃圾回收一般情况下只会使用标记清除算法，只有在无法进行分配大对象时，就会触发执行标记整理算法**。

新生代和老生代内存空间使用的垃圾回收机制，都会阻塞JavaScript进程的运行，为此对于一些逻辑处理都会等待整个垃圾回收完后才会进行（也叫全阻塞）。为此推出了**增量算法（Incremental）**。主要考虑老生代的算法，因为新生代中存活对象小而且占用空间小，执行**Scavenge算法**可以很高效率完成任务。

在老生代中进行标记时，**增量算法**会把原来一口气标记的过程进行分段处理，分成一段一段的，然后进行一段的标记后，会先执行一会的JavaScript主线程中逻辑，接下来再执行下一段的标记，如此循环直到垃圾回收结束。



参考链接：

- [V8垃圾回收机制](https://github.com/kaola-fed/blog/issues/230)
- [Node内存基础知识](https://foio.github.io/node-memory/)



## Buffer模块

Buffer模块用于存储二进制数据，属于Node中的堆外存，即不受V8内存分配限制的影响。而且Buff模块是典型的Javascript与C++结合的模块，性能部分由C++实现，非性能部分则由Javascript实现。

![Buffer](http://pr0i7g1w3.bkt.clouddn.com/Buff%E7%BB%93%E6%9E%84.png)

![Buff结构](/Users/andraw-lin/Mine/Personal/FE_Images/Nodejs/Buff结构.png)

一、8KB池

Node在创建一个Buffer实例时，当申请的空间大于4KB时，会直接调用内部的`createUnsafeBuffer()`方法创建一个Buffer。

当然，若申请的空间大于0小于等于4KB时，则会在当前的8KB SLAB上创建对应的Buffer实例，一旦当前的8KB SLAB上无法容纳时，会创建一个新的8KB SLAB来容纳该空间，因此上一次的8KB SLAB剩余的空间就无法被使用，导致内存浪费。（Node使用**Buffer.poolSize**代表8KB池）

二、Buffer模块API

Node创建Buffer实例主要有：

- new Buffer();（已不推荐使用，由于会泄露内存中潜在的敏感信息，可以看看这篇文章[这里](https://github.com/ChALkeR/notes/blob/master/Buffer-knows-everything.md)。貌似新版本已经默认使用0进行填充）
- Buffer.alloc();
- Buffer.allocUnsafe();（同样存在会泄露内存中潜在的敏感信息，但是在语义上表明的明确）
- Buffer.from();

上述的API在使用过程中，都会调用两个内部函数中的一个，分别是`createBuffer`和`allocate`，只有`allocate`方法是经过8KB池的，直接睇睇源码：

```javascript
// lib/buffer.js
// ...

Buffer.poolSize = 8 * 1024;
var poolSize, poolOffset, allocPool;

function createPool() {
  poolSize = Buffer.poolSize;
  allocPool = createBuffer(poolSize, true);
  poolOffset = 0;
}
createPool();

function createBuffer(size, noZeroFill) {
  flags[kNoZeroFill] = noZeroFill ? 1 : 0;
  try {
    const ui8 = new Uint8Array(size);
    Object.setPrototypeOf(ui8, Buffer.prototype);
    return ui8;
  } finally {
    flags[kNoZeroFill] = 0;
  }
}

function allocate(size) {
  if (size === 0) {
    return createBuffer(size);
  }
  if (size < (Buffer.poolSize >>> 1)) {
    if (size > (poolSize - poolOffset))
      createPool();
    var b = allocPool.slice(poolOffset, poolOffset + size);
    poolOffset += size;
    alignPool();
    return b;
  } else {
    return createBuffer(size, true);
  }
}
```

**Buffer.poolSize >>> 1**的意思就是右移一位，即Buffer.poolSize除以2向下取整的值。上述的allocate中，判断当申请的空间小于4KB时，会直接使用8KB池，否则会直接使用createBuffer方法来创建一个Buffer实例。

1. **Buffer.alloc(size[, fill[, encoding]])**

   size就是申请空间大小，fill代表默认初始化的值（默认值为0），encoding表示存入到Buffer中字符串编码

   ```javascript
   const buf1 = Buffer.alloc(10);
   console.log(buf1);	// <Buffer 00 00 00 00 00 00 00 00 00 00>
   const buf2 = Buffer.alloc(10,'hello');
   console.log(buf2);	// <Buffer 68 65 6c 6c 6f 68 65 6c 6c 6f>
   const buf3 = Buffer.alloc(10,'hello','base64');
   console.log(buf3);	// <Buffer 85 e9 65 85 e9 65 85 e9 65 85>
   ```

2. **Buffer.allocUnsafe(size)**

   同`new Buffer(size)`一致，都不会默认填充，会容易导致内存信息泄露（不过新版本的Node已经将new Buffer创建的实例默认使用0进行填充）。为此避免信息泄露，一般都会结合`fill`方法进行填充

   ```javascript
   const buf1 = Buffer.allocUnsafe(10)
   buf1.fill('haha')
   console.log(buf1)		// <Buffer 68 61 68 61 68 61 68 61 68 61>
   ```

3. **Buffer.from(value, [...])**

   from中的参数会分为四种情况：

   - 16进制的数组。会将数组转化为buffer，否则会直接进行转换

     ```javascript
     const buf = Buffer.from([1, 2, 3, 2.1, 17])
     console.log(buf)	// <Buffer 01 02 03 02 11>
     ```

   - 字符串。会直接将字符串转化为buffer

     ```javascript
     const buf = Buffer.from('haha')
     console.log(buf)	// <Buffer 68 61 68 61>
     ```

   - buffer实例。会将buffer实例中值直接复制到新创建的buffer实例中

     ```javascript
     const buf1 = Buffer.from('hehe')
     const buf2 = Buffer.from(buf1)
     console.log(buf1)		// <Buffer 68 65 68 65>
     console.log(buf2)		// <Buffer 68 65 68 65>
     ```

   - ArrayBuffer实例。**—待续（原谅我还没理解ES6）**

另外需要注意的是，只要满足以下情况才会走内部8KB池：

- 通过 `Buffer.allocUnsafe`，`Buffer.concat`，`Buffer.from`（参数不为一个 [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 实例）和 `new Buffer`（参数不为一个 [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 实例）创建；
- 传入的数据大小不为0并且小于或等于4KB；

参考链接：

- [通过源码解析 Node.js 中 Buffer 的 8KB 池分配规则和固定位数字的读写](https://github.com/DavidCai1993/my-blog/issues/30)
- [浅谈Node.js：Buffer模块](https://www.jb51.net/article/99163.htm)
- [深入理解Node中的buffer模块](https://www.jb51.net/article/115281.htm)



## Stream模块

Node中在读取一个文件时，例如调用`fs.readFile()`方法，会直接读取一个文件内容，读取完后，才会去调用callback执行后续的操作。这里会有个问题，当文件很庞大时，可能存有几G内容（开玩笑😝），这时候如果要是等到读取完，可能内存就会爆仓了，后续操作就会无法进行了。为此，流的出现就是解决这个事情的，**以段作为单位**，**读到一段就立马处理，并不需要等到读取完才去执行后续操作**，极大地提高工作效率。

一、流的定义

Node中，Buffer用于缓存数据（即使用一块内存来存储数据），而流就是用于处理系统缓存的一种方式。操作系统采用数据块的方式读取数据，没收到一次数据，就会立马存入缓存。

**流在读取到一块内容时，接收到数据就会立马进行后续处理，用过的内容会立马被GC掉，占内存空间也会很少**。另外，stream模块在Node中会被多个核心模块使用，例如请求流、响应流、文件流以及socket流底层都是使用stream来封装实现的，再比如console.log都是通过stream实现的。

二、Node处理缓存的方式

1. 传统读取完再做后续处理方式。例如调用`fs.readFile()`方法，就会一次性读取完一个文件内容，保存到缓存中后，再去调用Callback的后续处理；

2. 数据流的方式。例如调用`fs.createReadStream`方法来读取，没拿到一段数据（chunk），就会立马执行Callback中的后续处理，有效滴避免了缓存数据过多而内存爆仓的问题；（类似于生产者和消费者问题）

   ![生产者和消费者问题](http://pr0i7g1w3.bkt.clouddn.com/creater-and-consumer.jpg)

三、流的类型

Stream模块主要分为四种类型：

- Readable：可读的流，如`fs.createReadStream()`;
- Writable：可写的流，如`fs.createWriteStream()`;
- Duplex：可读可写的流，**可读流和可写流之间是无关联的**，如`net.Socket`;
- Transform：读写过程中可修改和变换数据，可读流与可写流之间有关联的Duplex流（即Duplex流的基础上的一个升级），如`zlib.createDeflate()`;

接下来进行一个简单的阐述：

1. Readable

   可读流主要分为两种模式，分别是Flow Mode（流动模式）和Pause Mode（暂停模式）。

   - Flow Mode

     流动状态下，数据流就会像水一样流向消费者。整个过程可以看成是一个缓存池的一个内部循环，一旦缓存池中有数据就会直接读取，进而避免了缓存池的内存爆仓，示例图如下：

     ![Readable的流动模式](http://pr0i7g1w3.bkt.clouddn.com/readable-flow-mode.jpg)

     ![readable-flow-mode](/Users/andraw-lin/Mine/Personal/FE_Images/Nodejs/readable-flow-mode.jpg)

     Flow Mode主要通过监听data事件来实现，一旦发现缓存池中有数据就会直接返回。当调用resume方法时，会重新在缓存池中进行一次遍历，然后需要终止就可以直接调用pause方法即可，这样资源想再次push时就会直接返回false，说明消费者已经主动调用pause方法进行终止。代码如下：

     ```javascript
     const Readable = require('stream').Readable
     let myReadable = new Readable(), i = 10
     myReadable._read = function() {
       this.push(i-- > 0 ? i.toString() : null)
     }
     myReadable.on('data', data => { console.log(data) })
     ```

     可以看到，push方法里会一直进行遍历作为参数传进去的数据资源，直到遇到null就会终止。每次push成功都会触发data事件来进行读取。

   - Pause Mode

     暂停模式与流动模式唯一的区别，就是每次push进去的数据会先存在缓存池并且触发一次readable事件，直到消费者调用read()方法才去读取缓存中的资源。示例图如下：

     ![Readable的暂停模式](http://pr0i7g1w3.bkt.clouddn.com/readable-pause-mode.jpg)

     ![readable-pause-mode](/Users/andraw-lin/Mine/Personal/FE_Images/Nodejs/readable-pause-mode.jpg)

     Pause Mode明显的区别就是不会主动推送数据到消费者手上，只有等待消费者直接调用read方法才会直接拿到相对应的数据，举个栗子🌰：
     
     ```javascript
     const Readable = require('stream').Readable
     let myReadable = new Readable(), i = 10
     myReadable.setEncoding('utf8')
     myReadable._read = function() {
       this.push(i-- > 0 ? i.toString() : null)
     }
     myReadable.on('readable', () => {
       let chunk
       while(null !== (chunk = myReadable.read())) {
         console.log(chunk)
       }
   })
     ```
     
     可以看到，数据到达缓存池后就会主动触发一次readable事件，然后就开始等待消费者直接调用read()方法才去输出资源。

   另外，需要注意的是，**可读流必须重写_read方法**，还可以使用`_readableState.buffer`来查看缓存池中缓存了多少资源。

2. Writable

   可写流在原理上跟可读流基本一致，当缓存池判断到生产者写入的东西超出highWatermark阈值时，就会终止生产者写入，直到资源主动发出一个drain消息，才会允许生产者重新写入数据，示例图如下：

   ![Writable stream](http://pr0i7g1w3.bkt.clouddn.com/writable-stream.jpg)

   Writable stream必须重写_write方法，举个栗子：

   ```javascript
   const Writable = require('stream').Writable
   let myWritable = new Writable()
   myWritable._write = function(chunk, encoding, callback) {
     console.log(chunk.toString())
   }
   myWritable.write('haha')
   ```

   若遇到阈值情况，就需要主动发送drain消息才会让生产者重新写入数据。主动发送drain消息，即使用`myWritable.once('drain', write)`，其他write就是自己封装的写入方法。

3. Duplex

   Duplex stream实际上是继承了Readable流，然后拥有Writable Stream的方法。需要注意的是，此刻的Read Stream与Writable Stream是不会有任何联系的，相当于各自工作。示例图如下：

   ![Duplex stream](http://pr0i7g1w3.bkt.clouddn.com/Duplex-stream.jpg)

   因此Duplex stream只是Readable stream和Writable Stream的结合，再上一个栗子🌰：

   ```javascript
   const Duplex = require('stream').Duplex
   let myDuplex = new Duplex(), i = 10
   // Readable
   myDuplex._read = function() {
     this.push(i-- > 0 ? i.toString() : null)
   }
   myDuplex.on('data', data => { console.log(data) })
   // Writable
   myDuplex._write = function(chunk, encoding, callback) {
     console.log(chunk)
   }
   myDuplex.write('haha')
   ```

   Duplex stream也叫双工流，但是Readable stream与Writable stream不会有任何的联系，只会关注各自的工作。

4. Transform

   Transform stream可以说是在Duplex stream基础上一个升级，可将Duplex stream中的Readable直接链接到Writable中去，常见的处理还包括Gzip压缩、解压等。示例图如下：

   ![Transfrom-stream](http://pr0i7g1w3.bkt.clouddn.com/transform-stream.jpg)

   可以看到，通过Transform stream做一个中间转化处理后，将原来写入的资源直接Push到了缓存池中，然后再按常规Readable stream返回的监听data事件的callback中去，直接上栗子🌰：

   ```javascript
   const Transform = require('stream').Transform
   let myTransform = new Transform()
   myTransform._transform = function(chunk, encoding, callback) {
     this.push(chunk.toString())
   }
   myTransform.write('haha')
   myTransform.on('data', data => {
     console.log(data.toString())
   })
   ```

   Transform stream也叫转化流，主要重写转化方法_transform即可将Writable stream与Readable stream相结合。

5. Pipe

   使用pipe方法同样可以实现管道流和链式流。就像上层的水流通过pipe管道流到下层的水流中去，示例图如下：

   ![Pipe实现管道流和链式流](http://pr0i7g1w3.bkt.clouddn.com/pipe-stream.jpg)

   可以看到，pipe就是一个管道，让stream一直流下去，进而实现管道流和链式流，直接上栗子🌰：

   ```javascript
   const fs = require('fs')
   const zlib = require('zlib')
   let readerStream = fs.createReadStream('input.txt.gz')
   let writerStream = fs.createWriteStream('output.txt')
   // 读取input.txt.gz压缩文件内容，通过zlib解压后，然后直接写入到output.txt文件中
   readerStream.pipe(zlib.createGunzip()).pipe(writerStream)
   ```

相关链接：

- [深入理解node stream机制及其实现原理](<https://zhuanlan.zhihu.com/p/33566071>)
- [深入理解 Node.js Stream 内部机制](<http://taobaofed.org/blog/2017/08/31/nodejs-stream/>)
- [Node.js关于Stream的理解](<https://github.com/zhengweikeng/blog/issues/4>)



## Node的模块系统

Node加载模块遵循的是`CommonJs`规范，使用的是**同步加载**。同时NPM也是基于`CommonJs`定义的规范来实现依赖管理和模块自动安装等功能。

#### 一、简单模块定义和使用

在Node中，文件和模块是一一对应的。简单滴讲，一个NodeJs文件就是一个模块，这个文件可能是Javascript代码、Json或者编译过的C/C++扩展等。举个例子🌰：

```javascript
// test.js
exports.consoleA = function() {
	console.log('A')
}
exports.consoleB = function() {
  console.log('B')
}

// main.js
let test = require('./test')
test.consoleA()		// 'A'
test.consoleB()		// 'B'
```

上面例子在执行完`node main.js`命令后，会直接打印出对应字符串出来。

**Node中提供了exports和require两个对象**。其中exports用于暴露某个属性或方法的接口，require是则是用于从外部引入某个模块的接口。上述例子，当在`main.js`中使用`require`引入test.js后，其实只是引入了`test.js文件中的exports对象`，因此能够直接使用`exports对象`中的consoleA方法和consoleB方法。

需要注意的是，有时候我们想直接覆盖掉`exports`对象，这时候可以这样写：

```javascript
// test.js
module.exports = {
  consoleA: function() {
    console.log('A')
  },
  consoleB: function() {
    console.log('B')
  }
}

// main.js
let test = require('./test')
test.consoleA()		// 'A'
test.consoleB()		// 'B'
```

因此，**`require`引入总是模块中的`exports`对象**。

#### 二、require模块加载机制

引用阮一峰的说法，当Node运行代码过程中遇到`require(X)`时，会有如下的过程：

1. 当X是内置模块时（即Node全局定义的模块，例如http模块、fs模块等），会直接返回该模块，否则就会去到步骤2；
2. 当X以`./`或者`/`或者`../`开头时，会有如何处理：
   - 根据X所在的父模块（父模块即那个引入外部模块X的文件），进而确定X的绝对路径（也叫X路径解析过程）；
   - 将X当成文件时，会依次按下列尾缀顺序来访问，只要有其中一个存在，就会返回该模块，否则将X当成一个目录对待：
     - X
     - X.js
     - X.json
     - X.node
   - 将X当成目录时，则会搜寻X目录下的以下文件，也是按顺序搜，只要有一个存在，就会直接返回，否则就会去到步骤3:
     - X/package.json（即直接访问main字段中值）
     - X/index.js
     - X/index.json
     - X/index.node
3. 当X不带路径时，则会按如下顺序处理：
   - 根据X所在的父模块，进而确定X的绝对路径；
   - 依次在每个目录中，将 X 当成文件名或目录名加载（这个过程写不够清楚，等下看例子即可明白）；
4. 当上述步骤都找不到时，则会抛出`... not found`；

接下来就举个例子🌰，例如：当前脚本文件`/home/andraw-lin/projects/foo.js`执行了`require('bar')` ，属于上述的第三种情况，搜索过程如下：

- 首先，确定`bar`的绝对路径，并按顺序搜索以下文件：

  ```javascript
  /home/andraw-lin/projects/node_modules/bar
  /home/andraw-lin/node_modules/bar
  /home/node_modules/bar
  /node_modules/bar
  ```

- 在搜索过程，也是按顺序遵循路径搜索过程：

  ```javascript
  bar.js
  bar.json
  bar.node
  ```

- 当上述路径不存在时，就会当成一个目录，接着按如下顺序访问：

  ```javascript
  bar/package.json（main字段）
  bar/index.js
  bar/index.json
  bar/index.node
  ```

- 当上述都找不到时，就会直接抛出错误`... not found`

#### 三、模块载入策略

NodeJs的模块主要分为两类，分别是原生模块和文件模块。原生模块在NodeJs源码编译时直接转化成一个二进制执行文件，因此执行速度最快，而文件模块则是选择性动态加载，**文件模块加载的速度会比原生模块的要慢**。另外，**NodeJs对原生模块和文件模块都进行了缓存**，因此在第二次`require`时就毋需重新加载而是直接引用缓存中。其中原生模块一般都会放在`lib`目录下，而文件模块则不一定。

加载文件模块的工作，主要还是通过原生模块`Module`来实现。而在文件模块中，又会分为三类（这三类以后缀名区分），也是上述讲到的路径解析时，被当成一个文件对待，分别是以`js, json, node`后缀结尾：

- js后缀：通过 fs 模块同步读取 js 文件并编译执行；
- json后缀：调用 JSON.parse 解析加载；
- node后缀：通过 C/C++ 进行编写的 Addon，使用 dlopen 方法来进行加载；

通常情况下，开发中一般都是解析`js`后缀的。NodeJs在编译js文件时，会对其代码的头尾进行包装，举个例子🌰：

```javascript
// main.js
let fs = require('fs')
fs.readFile(...)
            
// NodeJs编译后
(function (exports, require, module, __filename, __dirname) {
  let fs = require('fs')
	fs.readFile(...)
});
```

可以看到，在NodeJs编译一个js文件后，会对其执行环境直接传入exports对象、require对象、module对象、`__filename`文件名、`__dirname`文件所在的目录绝对路径。这也就是为什么在NodeJs中可以直接使用这些变量的原因。

`__filename`和`__dirname`的区别在于，两者都是返回绝对路径，前者会包含当前文件名，后者不会只是包含在目录中。

以下是加载原生模块和文件模块时的示例图：



![加载原生模块和文件模块](http://pr0i7g1w3.bkt.clouddn.com/module-require.jpg)

![module-require](/Users/andraw-lin/Mine/Personal/FE_Images/Nodejs/module-require.jpg)



#### 四、Node模块与前端模块的区别

前端模块的使用方式，一般是通过 script 标签的载入 JavaScript 文件。而Node的模块则是直接使用`require`引入。

前端模块封装时一般都是裸露的 JavaScript 代码片段，而Node模块则是会将模块代码进行头尾包装（即封装在一个闭包当中），可有效滴避免变量的全局污染问题。

因此在解决前后端一致性的问题上，类库开发者需将类库的代码封装在一个闭包当中。



参考链接：

- [深入 Node.js 的模块机制](https://www.infoq.cn/article/nodejs-module-mechanism)
- [require() 源码解读]([http://www.ruanyifeng.com/blog/2015/05/require.html](http://www.ruanyifeng.com/blog/2015/05/require.html))



## Global Variable

Node的全局环境使用的是`global`对象，浏览器的全局环境使用的是`window`对象。因此Node中的全局变量，即直接在`global`对象定义的属性。`global`最根本的作用就是作为全局变量的宿主，按照 ECMAScript 的定义，满足以下条件的变量都是全局变量：

- 在最外层定义的变量；
- 全局对象的属性；
- 隐式定义的变量（未定义而直接赋值的变量）；

需要注意的是，**在NodeJs中是无法在最外层定义变量，因为编写的代码都是属于当前的模块**，而模块本身不是最外层上下文。另外，`__filename`和`__dirname`是模块中的局部变量，编译其 js 文件后传入的参数，举个栗子🌰：

```javascript
// main.js
console.log(__filename)		// /home/andraw-lin/projects/main.js
console.log(__dirname)		// /home/andraw-lin/projects
```

#### 一、Node中常用的全局变量

接下来介绍常用的全局变量

1. process

   用于描述当前NodeJs进程的对象，从而提供一个与操作系统的简单接口通道。具体操作可以看看上面的NodeJs的多进程。也可以参考一下[菜鸟教程对Process对象属性讲解](https://www.runoob.com/nodejs/nodejs-global-object.html)。

2. setTimeout / clearTimeout / setInterval / clearInterval

   类似于浏览器端`window`对象上实现的setTimeout / clearTimeout / setInterval / clearInterval。

3. console

   类似于浏览器端`window`对象上实现的console对象。

#### 二、Node中创建模块的全局变量

在NodeJs中要想创建一个模块的全局变量，可通过三种方式去创建：

- 隐式定义变量

  使用未定义而直接赋值方式创建，直接看栗子🌰：

  ```javascript
  a = 10
  console.log(global.a)		// 10
  ```

- global对象属性

  直接操作global对象，添加相应的属性创建，直接看栗子🌰：

  ```javascript
  global.b = 2
  console.log(global.b)		// 2
  ```

- module.exports

  由于在Node中基本都是模块化管理，因此在一个模块中定义的属性或方法，可以直接在另外一个模块中作为其全局变量：

  ```javascript
  // a.js
  module.exports = 1
  
  // b.js
  let a = require('a')
  console.log(a)		// 1
  ```

因此在使用上，若想在不同模块中使用全局变量来进行通信，中肯的建议是：**在小应用中使用 global 方式，大应用中使用 module.exports 方式**。



参考链接：

- [node.js里面的全局变量]([http://yijiebuyi.com/blog/e1d00bcd8d67e9cc0af437f703978da7.html](http://yijiebuyi.com/blog/e1d00bcd8d67e9cc0af437f703978da7.html))



## Web模块

使用Node可以直接创建一个Web服务端，直接操作的是Node的`Http内置模块`。

#### 一、HTTP模块

`Http模块`提供了`http.CreateServer()`方法来创建一个 http.Server 实例，直接上栗子🌰：

```javascript
let http = require('http')
// 创建一个http服务器
http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.write('This is a http server!!!')
  res.end()
}).listen(8080, '127.0.0.1')
```

可以看到的是`createServer`方法接受两个参数，分别对应**请求 request 和响应 response**，接下来解析一下这两个参数。

1. 请求 request （即 http.ServerRequest ）

   用于表示 http 请求信息，一个 HTTP 请求一般分为两部分：请求头和请求体。它有三个常用事件：

   - data：当请求体数据到来时，该事件被触发。同时该事件提供一个参数 trunk ，用于表示收到的数据。若该事件没有被监听，那么请求体将被抛弃；
   - end：当请求体数据传输完毕后触发；
   - close：当请求结束时触发；

   除了上述的常用事件外，也会在日常开发中用到它的常用属性，如下：

   - method：表示当前请求的方式；
   - url：表示当前请求的路由（常结合url内置模块来解析get请求中参数）；
   - headers：表示请求头；
   - httpVersion：表示 http 版本号；

2. 响应 response （即 http.ServerResponse ）

   用于表示 http 响应信息，它有三个重要的成员函数，分别是返回响应头、响应内容、结束请求。

   - writeHead(statusCode, [headers])

     向客户端发送响应头，`statusCode`表示http状态码，`headers`表示一个带有响应头属性的对象（可不传）。

   - write(data, [encoding])

     向客户端发送响应内容，`data`表示要发送的内容，`encoding`表示发送内容的编码方式（可不传），默认是 utf-8。

   - end([data], [encoding])

     结束响应，用于告知客户端所有响应内容已经发送完毕。**如果不调用该函数，客户端将会一直处于等待状态**。因此每次返回响应内容时都必须调用该函数。

另外，需要的注意的是，`HTTP模块`还提供了两个方法用于客户端向 HTTP 服务器发起请求（即方便Node服务器与其他服务器以及本地服务器进行交互）。

1. http.request(options, callback)

   options选项对象参数包括如下：

   - host：请求的IP地址；
   - port：请求IP地址的端口号，默认是80；
   - method：请求的方式，默认是GET；
   - path：请求的路由名，默认是/；
   - headers：请求头内容对象；

   直接看栗子🌰：

   ```javascript
   let http = require('http')
   let querystring = require('querystring')
   let content = querystring.stringify({
   	data: 'This is a message...'
   })
   let options = {
     host: 'http://127.0.0.1',
     method: 'POST',
     headers: {
       'content-type': 'application/x-www-form-urlencoded',
       'content-length': ocntent.length
     }
   }
   let req = http.request(options, res => {
     res.setEncoding('utf-8')
     res.on('data', data => {
       console.log(data)
     })
   })
   req.write(contents)
   req.end()
   ```

2. http.get()

   只用于处理 GET 请求的方式，不需要调用`res.end()`。

   ```javascript
   let http = require('http')
   http.get({ host: 'http://127.0.0.1' }, res => {
     res.setEncoding('utf-8')
     res.on('data', data => { console.log(data) })
   })
   ```



参考链接：[深入理解Node.js的HTTP模块](https://www.jb51.net/article/94505.htm)



#### 二、GET/POST请求参数处理

由于在`GET/POST`请求中，带上必要的参数是需要的，在`GET`上请求参数会是放到 url 上的，而在`POST`上请求参数是放到请求体上的，所以在处理上是不同的。

1. GET

   需要结合 url 内置模块中 parse 来解析 url 中的参数，直接上栗子🌰：

   ```javascript
   let http = require('http')
   let url = require('url')
   let until = reuqire('until')
   
   http.createServer((req, res) => {
     let queryStr = until.inspect(url.parse(req.url, true))
     res.writeHead(200)
     res.end(queryStr)
   }).listen(8080)
   ```

2. POST

   需要集合 querystring 内置模块的 parse 方法来解析接收到的参数，直接上栗子🌰：

   ```javascript
   let http = require('http')
   let querystring = require('querystring')
   let until = require('until')
   
   http.createServer((res, req) => {
     let tempData = ''
     res.on('data', data => { tempData += data })
     res.on('end', () => {
       let resData = querystring.parse(tempData)
       res.write(until.inspect(resData))
     })
   }).listen(8080)
   ```

   