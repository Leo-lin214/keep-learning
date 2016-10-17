---
layout: post
category: Andraw-lin
title: Something About Javascript
date: 2016-04-06
summary: Something About Javascript
---

## Something About Javascript

- [(一) callee, caller, call(), apply()区别和认识](#一-callee-caller-call-apply区别和认识)
- [(二) XMLHttpRequest通用属性方法以及使用](#二-xmlhttprequest通用属性方法以及使用)
- [(三) sessionStorage,localStorage,cookie区别](#三-sessionstoragelocalstoragecookie区别)
- [(四) cookie与session区别](#四-cookie与session区别)
- [(五) Web storage和cookie区别](#五-web-storage和cookie区别)
- [(六) 闭包的理解](#六-闭包的理解)
- [(七) JS中定义函数的方法](#七-js中定义函数的方法)
- [(八) JS定义对象的方法](#八-js定义对象的方法)
- [(九) javascript中基本数据类型](#九-javascript中基本数据类型)
- [(十) 如何解决跨域问题](#十-如何解决跨域问题)
- [(十一) 作用域链的理解](#十一-作用域链的理解)
- [(十二) 异步加载JS方法](#十二-异步加载JS方法)
- [(十三) 创建Ajax过程](#十三-创建ajax过程)

### (一) callee, caller, call(), apply()区别和认识

 1. 函数内部属性: callee, caller
 
    + callee
      
      - 定义:

         每个函数都有arguments对象,用于保存函数的参数,该对象带有callee属性,该属性是一个指针,指向拥有这个arguments对象的函数(即指向正被执行的Function 对象)

      - 举例:
      
        ```javascript
            function add(num){
                if(num<=1){
                    return 0;
                }else{
                    return num + arguments.callee(num-1);   //callee指向当前被执行的函数对象add
                }
            }
        ```
        callee属性最适合用于递归,当add函数名被修改的时候,函数内部递归部分不需要修改,因为arguments.callee指向的就是当前函数对象
        
      - 需要特别的注意的是: callee有一个length属性,arguments.length是实参长度,arguments.callee.length是形参长度,举例:
      
      ```javascript
        function add(a, b){
            console.log(arguments.length);          //输出3
            console.log(arguments.callee.length);   //输出2
        }
        add(1, 2, 3);
      ```
      
    + caller
    
      - 定义: 
        
         caller属性保存着调用当前函数的函数的引用(即指向调用当前函数的对象), 如果是在全局作用域中调用当前函数,它的值为null
        
      - 举例:
      
        ```javascript
            function outer(){
                inner();
            }
            function inner(){
                console.log(inner.caller);      //输出outer(因为outer调用当前inner函数)
            }
            outer();
        ```
        
        如果是全局调用当前函数:
        
        ```javascript
            function add(a, b){
                return a + b;
            }
            console.log(add.caller);        //输出null(因为全局调用add函数)
        ```
        
 2. 方法: call(), apply()

    + call()方法
    
      - 定义:
      
         表示调用一个对象的一个方法,以另一个对象替换当前对象,说明白一点其实就是更改对象的内部指针,即改变对象的this指向的内容
         
      - 格式:
       
        ```javascript
            call([Obj[,arg1[, arg2[, [,.argN]]]]])
        ```
        obj: 可选项,将被用作当前对象
        arg1, arg2,..., argN: 可选项,将被传递方法参数序列
        不带参数时,默认就是window对象作为参数
        
      - 举例:
       
        只带一个参数或者不带参数时
        
        ```javascript
            <input type="text" id="myText" value="input text">
            function Obj(){
                this.value="对象!";
            }
            var value="global变量";
            function Fun1(){
                alert(this.value);
            }
            window.Fun1();          //输出global变量
            Fun1.call();            //输出global变量
            Fun1.call(window);      //输出global变量
            Fun1.call(document.getElementById('myText'));   //输出input text
            Fun1.call(new Obj());   //输出对象!
        ```
        
        带两个参数时:
        
        ```javascript
            var func=new function(){
                this.a="func"
            }
            var myfunc=function(x){
                var a="myfunc";
                alert(this.a);
                alert(x);
            }
            myfunc.call(func,"var");        //分别弹出func和var
        ```
        var作为myfunction的参数
        
    + apply()方法    
        
      - 对于apply和call两者在作用上是相同的，但两者在参数上有区别的,对于第一个参数意义都一样，但对第二个参数不同, apply传入的是一个参数数组，也就是将多个参数组合成为一个数组传入，而call则一个一个参数传入（从第二个参数开始）
      
      - 使用apply的好处是可以直接将当前函数的arguments对象作为apply的第二个参数传入
      



### (二) XMLHttpRequest通用属性方法以及使用

 1. 通用属性方法:
 
    + open(method, url, asynchronous):
    
      初始化准备发送到服务器上的请求。method是HTTP方法，不区分大小写；url是请求发送的相对或绝对URL；asynchronous表示请求是否异步

    + send(body):
    
      对服务器请求进行初始化。body为即要作为请求主体发送的数据，如果不需要通过请求主体发送数据，则必须传入null
      
    + readyState：
    
      表示请求状态的整数，可以取值：
      
      - UNSENT（0）：为初始化，对象已创建
      
      - OPENED（1）：启动，已经调用open()方法，但尚未调用send()方法
      
      - HEADERS_RECEIVED(2)：发送，已经调用send()方法，但尚未接收到响应
      
      - LOADING(3)：接收，已经接收到部分响应数据
      
      - DONE(4)：完成，已经接收到全部响应数据而且已经可以在客户端使用了
      
    + onreadystatechange事件：
    
      readyState改变时调用的函数(事件)
      
    + status：
    
      服务器返回的HTTP状态码：
      
      - 1xx：请求已发出，在处理中；
      
      - 2xx：已处理成功；
      
      - 3xx：重定向，需要更深层次处理；
      
      - 4xx：客户端错误，语法错误等(400：语法错误；401：未经授权；403：服务端收到请求，但拒绝为它服务)；
        
      - 5xx：服务的错误(500：服务端发生不可逾期错误；503：现在还不能处理，过一段时间才恢复正常)；
      
    + statusText:
    
      服务器返回的HTTP状态信息
      
    + responseXML:
    
      Document对象，表示服务器的响应解析成的XML文档
      
    + abort():
    
      取消异步HTTP请求
      
 2. 使用:
 
    ```javascript
    var xhr = createXHR();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){        //查看请求状态
            if(xhr.status >=200 && xhr < 300 || xhr.status == 304){     //查看返回HTTP状态码
                alert(xhr.responseText);
            }else{
                alert("请求失败:"+ xhr.status);
            }
        }
    };
    xhr.open("get","test.php",true);
    xhr.send(null);
    ```
    
### (三) sessionStorage,localStorage,cookie区别

同源成立条件：协议相同、域名相同、端口相同；

 1. 都会在浏览器端保存，有大小限制;
 2. cookie会在请求时发送到服务器，作为会话标识，服务器可修改cookie；web storage不会发送到服务器;
 3. 有效期：cookie在设置的有效期内有效，默认为浏览器关闭；sessionStorage在窗口关闭前有效，localStorage长期有效，直到用户删除;
 4. sessionStorage不能共享，localStorage在同源文档之间共享，cookie在同源且符合path规则的文档之间共享
 5. localStorage的修改会促发其他文档窗口的update事件;
 6. cookie有secure属性要求HTTPS传输;
 7. 浏览器不能保存超过300个cookie，单个服务器不能超过20个，每个cookie不能超过4k。web storage大小支持能达到5M;

### (四) cookie与session区别

 1. cookie数据存放在客户的浏览器上，session数据放在服务器上；
 2. cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗考虑到安全应当使用session；
 3. session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能考虑到减轻服务器性能方面，应当使用COOKIE；
 4. 单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie；
 5. 所以个人建议：
    将登陆信息等重要信息存放为SESSION
    其他信息如果需要保留，可以放在COOKIE中

### (五) Web storage和cookie区别

 1. 首先，Web Storage的概念和cookie相似，区别是它是为了更大容量存储设计的；
 2. Cookie的大小是受限的，并且每次你请求一个新的页面的时候Cookie都会被发送过去，这样无形中浪费了带宽，另外cookie还需要指定作用域，不可以跨域调用；
 3. Web Storage拥有setItem,getItem,removeItem,clear等方法，不像cookie需要前端开发者自己封装setCookie，getCookie；
 4. cookie也是不可以或缺的：cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，而Web Storage仅仅是为了在本地“存储”数据而生；
 5. localStorage和sessionStorage都具有相同的操作方法，例如setItem、getItem和removeItem等；

### (六) 闭包的理解

- [浅谈JS闭包和this](https://github.com/Andraw-lin/Andraw-lin.github.io/blob/master/_posts/2016-04-01-Talking-About-JS-Closures-And-This-Keywords.md)

### (七) JS中定义函数的方法

 1. Function操作符：
  
    ```javascript
        function func(){}
    ```
    
    
 2. 函数表达式：

    ```javascript
        var func = function(){}
    ```
    

 3. 构造函数(可以接收任意数量参数，但最后一个参数被看成是函数体)：

    ```javascript
        var func = new Function("num1","num2","return num1+num2");  //不推荐使用这种方法定义函数
    ```
    
 4. ES6:arrow function

### (八) JS定义对象的方法

 1. 对象字面量：
 
    ```javascript
        var obj = {};
    ```
    
    
 2. 构造函数：

    ```javascript
        var obj = new Object();
    ```

 3. Object.create():

    ```javascript
        var obj = Object.create(Object.prototype);
    ```
 
 
### (九) javascript中基本数据类型
 

 1. 6 中基本数据类型:

    + undefined
    + null
    + string
    + boolean
    + number
    + symbol(ES6)
    

 2. 1 中引用类型:

    + Object

### (十) 如何解决跨域问题

 1. JSONP方法

    - 原理是:
      动态插入script标签，通过script标签引入一个js文件，这个js文件载入成功后会执行我们在url参数中指定的函数，并且会把我们需要的json数据作为参数传入;
      
    - 例子:
    
      ```javascript
      <script type="text/javascript">
      function dosomething(jsondata){
        //处理获得的json数据
      }
      </script>
      <script src="http://example.com/data.php?callback=dosomething"></script>
      ```
    - CORS和JSONP对比
    
      + JSONP只能实现GET请求，而CORS支持所有类型的HTTP请求;
      + 使用CORS，开发者可以使用普通的XMLHttpRequest发起请求和获得数据，比起JSONP有更好的错误处理;
      + JSONP主要被老的浏览器支持，它们往往不支持CORS，而绝大多数现代浏览器都已经支持了CORS;
 
 2. CORS

    对于CORS的支持，主要就是通过设置Access-Control-Allow-Origin来进行的。如果浏览器检测到相应的设置，就可以允许Ajax进行跨域的访问;
    
    
 3. 通过修改document.domain来跨子域

    - 将子域和主域的document.domain设为同一个主域.前提条件：这两个域名必须属于同一个基础域名!而且所用的协议，端口都要一致，否则无法利用document.domain进行跨域;
    - 例子:
      
      ```javascript
      <iframe id = "iframe" src="http://example.com/b.html" onload = "test()"></iframe>
      <script type="text/javascript">
        document.domain = 'example.com';//设置成主域
        function test(){
          alert(document.getElementById('iframe').contentWindow);//contentWindow 可取得子窗口的 window 对象
        }
      </script>
      ```
   
 4. 使用window.name来进行跨域

    + window对象有个name属性，该属性有个特征：即在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个window.name的，每个页面对window.name都有读写的权限，window.name是持久存在一个窗口载入过的所有页面中的;
    
 5. 使用HTML5中新引进的window.postMessage方法来跨域传送数据

    + 还有flash、在服务器上设置代理页面等跨域方式。个人认为window.name的方法既不复杂，也能兼容到几乎所有浏览器，这真是极好的一种跨域方法;
    



### (十一) 作用域链的理解

 - 作用域链的作用是保证执行环境里有权访问的变量和函数是有序的，作用域链的变量只能向上访问，变量访问到window对象即被终止，作用域链向下访问变量是不被允许的


### (十二) 异步加载JS方法

 1.  `<script>` 标签的 `async="async"` 属性

    HTML5中新增的属性,但这种方法不能保证脚本按顺序执行;


 2. `<script>` 标签的 `defer="defer"` 属性

    兼容所有浏览器,这种方法可以确保所有设置defer的脚本按顺序执行;
    

 3. 动态创建 `<script>` 标签

    兼容所有浏览器
    例子:
    
    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript">
                (function(){
                        var s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.src = "jquery-1.7.2.min.js";
                        var tmp = document.getElementsByTagName('script')[0];
                        tmp.parentNode.insertBefore(s, tmp);
                })();
            </script>
        </head>
        <body>
                <img src="2.jpg" />
        </body>
    </html>
    ```

### (十三) 创建Ajax过程

 1. 过程:
    - 创建`XMLHttpRequest`对象,也就是创建一个异步调用对象;
    - 创建一个新的`HTTP`请求,并指定该`HTTP`请求的方法、`URL`及验证信息;
    - 设置响应`HTTP`请求状态变化的函数;
    - 发送`HTTP`请求;
    - 获取异步调用返回的数据;
    - 使用JavaScript和DOM实现局部刷新;

 2. 代码:

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