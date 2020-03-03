# JSONP实现

 1. 在客户端, 我们知道跨域 JS 文件中的代码, WEB 页面也是可以无条件执行的.

    例如, 在**远程服务器 server.com** 根目录下有一个 **server.js** 文件, 代码如下: 
    
    ```javascript
        console.log("This is server!!!");
    ```
 
    然后在**本地服务器 local.com** 有个页面 **local.html**, 代码如下:
    
    ```javascript
        <head>
            <script type="text/javascript" src="http://server.com/server.js"></script>
        </head>
    ```
    
    如无意外, 在 test.html 页面的控制台上则直接输出 **This is server!!!** ;
    

 2. 现在, 我们的需求不再是简单地运行跨域的 JS 文件, 而是想获取来自跨域的一些数据, 这时候就需要使用 **JSONP方式** 进行对应的修改.

    在 **local.com** 上的 **local.html** 定义一个函数, 然后在 **server.com** 上的 **server.js** 中传入数据进行调用, 修改如下: 
    
    ```javascript
        <head>
            <script type="text/javascript">
                var getData = function(json){
                    console.log(json);
                }
            </script>
            <script type="text/javascript" src="http://server.com/server.js"></script>
        </head>
    ```
    
    而在 **server.com** 上的 **server.js** 修改如下:
    
    ```javascript
        getData({
            "name": "Andraw",
            "age": 23
        })
    ```
    
    运行后的结果是在控制台上正确地输出了```{name: "Andraw", age: 23}```, 这也就达到了跨域的目的, 但上面的代码存在着**缺陷**, 就是把**路径以及 callbacak 写死** ;
    

 3. 为了解决上述的缺陷, 有些人或许会想到**动态创建 script 标签**进行相对应的解决, 而这也是目前最好的解决方案.

    在 **local.com** 上的 **local.html** 修改如下:
    
    ```javascript
        <head>
            <script type="text/javascript">
                var getData = function(json){
                    console.log(json);
                };
                var url = "http://server.com.server.js?name=Andraw&callback=getData";
                var script = document.createElement("script");
                script.setAttribute("src", url);
                document.getElementByTagName('head')[0].appendChild(script);
            </script>
        </head>
    ```
    
    而在 **server.com** 上的 **server.js** 修改如下:
    
    ```javascript
        getData({
            "name": "Andraw",
            "age": 23
        });
    ```
    
    如无意外, 很成功就输出了```{name: "Andraw", age: 23}```, 因此, 说到底 JSONP 就是一个字符串拼接过程, **需要注意的是: 后台需要获取 callback ,然后把响应数据作为 callback 参数, 最后把整个 callback 返回** ;
    
    

 4. 在 **jQuery** 中的 **ajax** 已经对 **jsonp 进行了相对应的封装**, 如下:

    ```javascript
        $.ajax({
            type: "get",
            url: "http://server.com.server.js?name=Andraw",
            dataType: "jsonp",
            jsonp: "callback",  // 传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
            jsonpCallback: "getData",   // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
            success: function(data){
                console.log(data);
            }
        })
    ```
    
    在上面的代码中, 也许你会觉得疑惑, 因为由始至终, 我们都没有定义一个 **getData** 函数, 这就是 **ajax** 神奇之处, 它内在已经把 **JSONP** 进行对应的封装, 所以**后台只需要获取 callback 参数, 然后把响应数据放到 callbaack 括号里, 然后把整个 callback( data ) 返回即可** ;