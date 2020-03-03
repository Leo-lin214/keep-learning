---
layout: post
category: Andraw-lin
title: Know About HTTP
summary: Know About HTTP
---

## **Know About HTTP**

- [(一) HTTP协议的定义](#一-http协议的定义)
- [(二) HTTP协议的主要特点](#二-http协议的主要特点)
- [(三) HTTP协议的版本](#三-http协议的版本)
- [(四) HTTP1.0版本和HTTP1.1版本区别](#四-http10版本和http11版本区别)
- [(五) HTTP请求](#五-http请求)
- [(六) HTTP响应](#六-http响应)
- [(七) HTTP状态码](#七-http状态码)
- [(八) HTTP/2.0与HTTP/1.x对比](#八-http20与http1x对比)
- [(九) 了解CDN工作流程](九-了解cdn工作流程)

### (一) HTTP协议的定义

 - HTTP是hypertext transfer protocol（超文本传输协议）的简写，它是TCP/IP协议的一个应用层协议，用于定义WEB浏览器与WEB服务器之间交换数据的过程。客户端连上web服务器后，若想获得web服务器中的某个web资源，需遵守一定的通讯格式，HTTP协议用于定义客户端与web服务器通迅的格式

### (二) HTTP协议的主要特点

 - 支持C/S(客户/服务器)模式;
 - 简单快速:
 
    客户向服务器请求服务时，只需传送请求方法和路径;

 - 灵活:

    HTTP允许传输任意类型的数据对象(传输的类型由Content-Type加以标记);
    
 - 无连接:

    无连接的含义是限制每次连接只处理一个请求 , 服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间;
    
 - 无状态:

    无状态是指HTTP协议对于事务处理没有记忆能力,缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大 , 另一方面，在服务器不需要先前信息时它的应答就较快
 
 
### (三) HTTP协议的版本

 - HTTP协议的版本有两个:

   + HTTP/1.0

   + HTTP/1.1


### (四) HTTP1.0版本和HTTP1.1版本区别

 1. 在HTTP1.0协议中，客户端与web服务器建立连接后，只能获得一个web资源;
 2. 在HTTP1.1协议中，允许客户端与web服务器建立连接后，在一个连接上获取多个web资源;


### (五) HTTP请求

 1. HTTP请求包括的内容

    + 客户端连上服务器后，向服务器请求某个web资源，称之为客户端向服务器发送了一个HTTP请求;
    + 一个完整的HTTP请求包括: 一个请求行,若干消息头,以及实体内容;
    + HTTP请求的格式:
      
      ```javascript
      <method><request-URL><version>    //起始行
      <headers>         //首部
      <entity-body>     //实体内容
      ```
      
    + 效果图:
    
      ![](http://7xs89l.com1.z0.glb.clouddn.com/HTTPrequest.png)

 2. HTTP请求行

    + 请求行中的请求方式包括POST、GET、HEAD、OPTIONS、DELETE、TRACE、PUT,其中常用的就是GET和POST,默认使用的是GET方式

    [GET和POST区别](https://github.com/Andraw-lin/Andraw-lin.github.io/blob/master/_posts/2016-04-05-AJAX-Cache-Principle.md)
 
 

 3. HTTP消息头

    + HTTP请求中常用消息头主要有:
    
      - accept:
        浏览器通过这个头告诉服务器，它所支持的数据类型;

      - Accept-Charset:
        浏览器通过这个头告诉服务器，它支持哪种字符集;

      - Accept-Encoding：
        浏览器通过这个头告诉服务器，支持的压缩格式;

      - Accept-Language：
        浏览器通过这个头告诉服务器，它的语言环境;

      - Host：
        浏览器通过这个头告诉服务器，想访问哪台主机;
        
      - If-Modified-Since：
        浏览器通过这个头告诉服务器，缓存数据的时间;
        
      - Referer：
        浏览器通过这个头告诉服务器，客户机是哪个页面来的防盗链;
        
      - Connection：
        浏览器通过这个头告诉服务器，请求完后是断开链接还是继续链接;
        
        
### (六) HTTP响应

 1. HTTP响应包括的内容

    + 一个HTTP响应代表服务器向客户端回送的数据;
    + 一个HTTP响应包括有一个状态行、若干消息头、以及实体内容;
    + HTTP响应格式:
    
      ```javascript
      <version><status><respon-phare>   //起始行
      <headers>         //首部
      <entity-body>     //实体内容
      ```
    
    + 效果图:
    
      ![](http://7xs89l.com1.z0.glb.clouddn.com/HTTPresponse.png)
      
      
 2. 常用的响应头(消息头):

    + Location:
      服务器通过这个头，来告诉浏览器跳到哪里;

    + Server:
      服务器通过这个头，告诉浏览器服务器的型号;
      
    + Content-Encoding:
      服务器通过这个头，告诉浏览器，数据的压缩格式;
      
    + Content-Length:
      服务器通过这个头，告诉浏览器回送数据的长度;
      
    + Content-Language:
      服务器通过这个头，告诉浏览器语言环境;

    + Content-Type:
      服务器通过这个头，告诉浏览器回送数据的类型;
      
    + Refresh:
      服务器通过这个头，告诉浏览器定时刷新;

    + Content-Disposition:
      服务器通过这个头，告诉浏览器以下载方式打数据;
      
    + Transfer-Encoding:
      服务器通过这个头，告诉浏览器数据是以分块方式回送的;
      
    + Expires:
      告知浏览器要不要进行缓存(值为-1时为不要缓存);
      
    + Cache-Control:
      由服务器端返回，标记该资源可以在浏览器缓存中存活的相对时间，以秒为单位;
      
    [浏览器缓存](https://github.com/Andraw-lin/FE-Knowledge-Summary/blob/master/HTML/Something-About-HTML.md#%E4%B9%9D-%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BC%93%E5%AD%98)

    [cookie与session](https://github.com/Andraw-lin/FE-Knowledge-Summary/blob/master/JAVASCRIPT/Something-About-Javascript.md)
    
    
### (七) HTTP状态码

    

 1. 100~199表示成功接受请求,要求客户端继续提交下一次请求才能完成整个处理过程:

 2. 200~299表示成功接收请求并已完成整个过程处理:

 3. 300~399表示为完成请求,客户需进一步细化请求;

 4. 400~499表示客户端的请求有错误;

 5. 500~599表示服务端出现错误;

### (八) HTTP/2.0与HTTP/1.x对比

 1. HTTP/2.0相比HTTP/1.x提升了WEB性能,在HTTP/1.1完全语义兼容的基础下,进一步减少了网络延迟;
 2. 在HTTP/2.0中,可以实行多路复用,允许同时通过单一的HTTP/2.0连接发起多重的请求-响应消息;
 3. HTTP/2.0能够使用专门的HPACK算法为首部进行压缩;
 4. 在HTTP/2.0基础上,服务端可以对客户端的一个请求发送多个响应;

### (九) 了解CDN工作流程

当浏览器在发送请求的时候, 会有一个域名解析成 IP 的过程. 在 DNS 解析的时候，会依次找到你本地的 host，如果没有找到就会到当地运营商的 DNS 去解析，一般叫 Local DNS，然后 Local DNS 把域名从后到前进行解析，解析到主域名的时候就会得到一条 cName，然后就根据这个 cName 请求到 cName 本身的 DNS 服务器上。如果这个 DNS 有做 CDN 服务，它就会从 Local DNS 的请求中拿到运营商 IP，知道你的请求来自哪里，然后根据你的地点，通过一定的算法，找到最接近你，最适合你的 CDN 节点的 IP 返回给浏览器. 
