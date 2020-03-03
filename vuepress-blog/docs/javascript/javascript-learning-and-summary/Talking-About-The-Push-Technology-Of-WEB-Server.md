# 服务器推送技术

相信大伙们对于服务器推送都不陌生，尤其在实现某些实时功能时，那么常用的服务器推送技术都有哪些呢？不妨往下睇睇。

## Ajax短轮询

 1. 使用:

    实现很简单,只需要利用XHR, 通过setInterval定时发送请求;
    

 2. 缺点: 

    容易造成数据同步不及时无效的请求, 容易增加后端处理压力;
 
 3. 实现: 

    ```javascript
    setInterval(function() {
        $.ajax({
            url:'http://api.3g.qq.com',
            success: function() {
                //code from here
            }
        });
    }, 3000);
    ```
    
## Ajax长轮询

 1. 使用:

    在Ajax短轮询的基础上进行了改进, 在没有更新的时候不再返回空响应, 当客户端向服务器发送Ajax请求的时候, 服务器接到请求后会持续保持连接, 直到有新消息才返回响应消息并关闭连接(也叫comet)
    
 2. 短轮询和长轮询区别:
  
 ![](http://7xs89l.com1.z0.glb.clouddn.com/ajax-server-push.jpg)

 3. 实现:

    ```javascript
    function async() {
        $.ajax({
            url: 'http://api.3g.qq.com',
            success: function() {
                async();
                //code from here
            }
        });
    }
    ```
    
## Server-Sent-Events(SSE)

 1. 使用:
   
    Server-sent-events(SSE)让服务端可以向客户端流式发送文本消息，在实现上，客户端浏览器中增加EventSource对象，使其能通过事件的方式接收到服务器推送的消息，在服务端，使用长连接的事件流协议，即请求响应时增加新数据流数据格式(非常使用于后端数据更新频繁且对实时性要求较高而又不需要客户端向服务端通信的情况下)

 2. 示意图:
 
    ![](http://7xs89l.com1.z0.glb.clouddn.com/sse-server-push.png)


 3. 实现(结合Event Source API):

    ```javascript
    var source = new EventSource('http://localhost:8080');
    
    source.addEventListener('message', function(e) {
      console.log(e.data);
    }, false);
    
    source.addEventListener('open', function(e) {
      // Connection was opened.
    }, false);
    
    source.addEventListener('error', function(e) {
      if (e.readyState == EventSource.CLOSED) {
        // Connection was closed.
      }
    }, false);
    
    source.addEventListener('userlogin', function(e) {
      console.log(e.data);
    }, false);
    ```
  
    另外, 需要注意的是,Event Source 使用非常简单,浏览器在支持情况下会自动处理一切, 包括连接管理接收并解析数据到最后触发DOM事件
    
## WebSocket

 1. 使用:

    WEBSocket实现的是客户端与服务端都是双向的, 基于消息的文本或二进制数据通信
    
 2. 实现(根据WEBSocket API)

    ```javascript
    var connection = new WebSocket('ws://localhost:8080');

    // When the connection is open, send some data to the server
    connection.onopen = function () {
      connection.send('Ping'); // Send the message 'Ping' to the server
    };
    
    // Log errors
    connection.onerror = function (error) {
      console.log('WebSocket Error ' + error);
    };
    
    // Log messages from the server
    connection.onmessage = function (e) {
      console.log('Server: ' + e.data);
    };
    ```
   使用WEBScoket API跟Event Source一样, 浏览器提供的WebSocket API很简单，使用时无需关心连接管理和消息处理等底层细节，只需要发起连接，绑定相应的事件回调即可