# 关于Nginx-你需要知道的点点滴滴

相信作为一个 Web 开发者来说，对 Nginx 肯定不陌生。我们先来看看 Nginx 在官方到底是一个什么定义。

> Nginx 是一个异步框架的 Web 服务器，也可以用作反向代理、负载平衡器和 HTTP 缓存。

很容易理解，Nginx 就是一个 Web 服务器，可以很高效滴处理异步请求。



## 目录

1. [<span>何为静态页面？又何为动态页面？</span>](#何为静态页面？又何为动态页面？)
2. [<span>Nginx、Apache和Tomcat区别</span>](#Nginx、Apache和Tomcat区别<)
3. [<span >Nginx-正向代理和反向代理</span>](#Nginx-正向代理和反向代理)
4. [<span >Nginx-基本结构</span>](#Nginx-基本结构)
5. [<span >Nginx-处理跨域</span>](#Nginx-处理跨域)
6. [<span >Nginx-过滤和Rewrite</span>](#Nginx-过滤和Rewrite)
7. [<span >Nginx-gzip压缩</span>](#Nginx-gzip压缩)
8. [<span >Nginx-负载均衡</span>](#Nginx-负载均衡)
9. [<span>Nginx-缓存机制</span>](#Nginx-缓存机制)



## 何为静态页面？又何为动态页面？

下面我会直接讲解，不讲那么多废话 🙈。

- 静态页面：通常以 html 结尾的文件，所有数据都是直接写死到文件中，客户端加载静态页面时，无需对数据库进行操作，而是直接将文件内容呈现出来。
- 动态页面：通常以 php、jsp、asp 结尾的文件，所有数据都是存储到数据库上的，客户端请求文件时，服务端需从数据库中获取数据并动态填充到文件中，最后将一个完整的文件内容直接返回到客户端中。

**静态页面更像是我们平时写死的 html 内容，而动态页面更像是前端领域经常提到的模板引擎**。那么静态页面和动态页面之间又有何区别？

静态页面由于会将所有内容都写在 html 文件中，因此会显得比较大，并且每次更改内容时都必须生成新的文件。而动态页面刚好相反，由于数据都是动态添加的，所以会显得比较小，但是数据获取内部却需要发出请求，因此访问速度会比静态页面慢。

接着我们再来看看在服务器中，客户端访问静态页面或动态页面流程是怎样的 🤔。

- 服务器中访问静态页面流程

  客户端访问一个网站时，先经过 DNS 解析得到相应的 IP 地址，接着 HTTP 协议或 HTTPS 协议将客户端请求传到服务端，服务端收到请求后就把网站目录下的 index.html 返回到客户端。

- 服务器中访问动态页面流程

  相比访问静态页面，访问动态页面则是多了客户端发送请求和服务端处理数据工作。

  客户端访问一个网站时，先经过 DNS 解析得到相应的 IP 地址，接着 HTTP 协议或 HTTPS 协议将客户端请求传到服务端，服务端收到请求找到网站目录下的 index.php 文件，并把该文件传到 php 服务器中，php 服务器利用脚解析成功后再把内容返回到客户端。

  在 php 解析过程中，可能会存在访问数据库获取相应数据，并把数据动态放到内容中。

其实还有一种类型是**伪静态页面，原理就是通过将动态页面的URL地址重写，改写成以html、htm等结尾的静态URL地址**。实际上还是一个动态页面的 Rewrite 过程，对服务端的消耗会增大。



## Nginx、Apache和Tomcat区别

相信童鞋们对于 Apache 和 Tomcat 服务器都不陌生，那么它们三者又有何区别？

- Nginx：web 服务器。采取**异步非阻塞**方式，多个连接对应一个进程，在高并发情况下能处理更多的连接请求而不占太多的资源。**静态页面处理能力较强**，尤其是反向代理服务表现突出，常被用作负载均衡和代理服务器使用。
- Apache：web 服务器。采取**同步阻塞**方式，一个连接对应一个进程，极大限制了处理多个请求性能。**支持的模块众多，性能稳定，本身只支持静态解析，但可以通过扩展脚本、模块等支持动态页面**。在 Rwrite 功能上比 Nginx 好很多，常用于处理动态请求。
- Tomcat：应用服务器。用来处理 jsp 页面和运行 servlet。

简单总结一下，Nginx 处理对象就是静态页面，采取异步非阻塞方式，常作为反向代理服务。Apache 本身只支持静态页面，可通过 PHP 脚本程序支持动态 PHP 页面或 Tomcat 支持 JSP 页面，由于其支持模块众多以及 Rewrite 功能强大，因此在结合第三方模块解析动态页面层面上比 Nginx 显得尤为突出。

总之，**Nginx 适合处理静态请求和反向代理，Apache 适合处理动态请求**。



## Nginx-正向代理和反向代理

在开发中，我们常常听到正向代理以及反向代理这两个词，我们先来看看有什么区别。

1. 正向代理

   一个位于客户端和服务端之间代理服务器，客户端向代理服务器发送一个请求并指定目标（即原始服务器 IP 地址），然后代理服务器向原始服务器转交请求并将获得的内容返回给客户端。例如我们常常使用的fanqiang。

   **正向代理服务的目标是客户端（即对客户端是透明的），客户端可向代理服务器访问到客户端本身无法访问到的服务器资源。正向代理服务器对于服务端不是透明的，服务器并不知道请求方是代理服务器还是客户端**。

   ![正向代理](https://raw.githubusercontent.com/Andraw-lin/keep-Learning/master/asset/%E6%AD%A3%E5%90%91%E4%BB%A3%E7%90%86.jpg)

2. 反向代理

   服务器使用一个代理服务器处理客户端请求，代理服务器可将请求转发到内部网络上的服务器，并将服务器的返回结果直接返回给客户端。

   **反向代理服务的目标是服务器（即对服务端是透明的），对客户端请求进行内部网络的转发，进而实现负载均衡。反向代理对于客户端不是透明的，客户端并不知道服务方是代理服务器还是原始服务器**。

   ![反向代理](https://raw.githubusercontent.com/Andraw-lin/keep-Learning/master/asset/%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86.jpg)



## Nginx-基本结构

在理解了正向代理和反向代理后，我们就来看看 Nginx 到底在结构上是长啥样的。下面是 Nginx 的一个基本结构

```nginx
// ...                 # 全局块
events {               # events块
  // ...
}
http {                 # http块
  server {             # server块
    location path {    # location块
      // ...
    }
    location path {
      // ...
    }
  }
  server {
    location path {
      // ...
    }
  }
}
```

现在就来解析一下每个字段到底是什么用处。

- 全局块：配置 Nginx 服务器的用户（组）、允许生成的 worker process 数、进程 PID 等。
- events块：配置影响 Nginx 服务器与用户的网络连接。
- http块：配置代理、缓存和日志等绝大多数的功能和第三方模块的配置。
- server块：配置虚拟主机相关内容。
- location块：对于请求路由进行匹配并作相应处理，还用于处理数据缓存、地址重定向等逻辑。



## Nginx-处理跨域

面试过程中，常常会被问及如何处理跨域，其中使用 Nginx 请求代理是其中的一种实现方案。

首先，我们先来回顾一下**同源策略，即同协议、同域名、同端口**情况下，才可以在浏览器中正常请求并得到相应内容。

那么当请求不符合同源策略时，Nginx 是如何处理的呢？答案就是 **proxy**。

Nginx 处理跨域的原理是，**当网站地址 a.com 向 b.com 发出请求时，先启动一个 Nginx 服务器，配置相应的 server 块名为 a.com，设置 location 对需要跨域的请求进行拦截，并将请求代理到 b.com**。配置如下：

```nginx
server {
  listen       80;
  server_name  a.com;
  location / {
    proxy_pass b.com;
  }
}
```



## Nginx-过滤和Rewrite

在前端路由中，当匹配不到路由时，一般会直接重定向到 404 页面。如果现在有一个业务逻辑，就是当后端返回的状态码为502、500状态码时，我们需要重定向到首页，可以如何做呢？

一般情况下，前端的做法肯定是对 http 状态码进行获取，然后匹配到为500或502时，直接手动重定向到首页。这做法可以肯定是可以的，但未免显得稍微麻烦，我们可以使用 Nginx 对状态进行匹配配置就可以很简单滴实现上述功能。配置如何

```nginx
error_page 500 502 /test.html;
  location = /test.html {
    root /root/static/html;
  }
```

除此之外，Nginx 还可以对路由进行重写，如匹配不到路由时直接重定向到首页，配置如何。

```nginx
location / {
  rewrite  ^.*$ /index.html  redirect;
}
```



## Nginx-gzip压缩

在优化项目上，我们都清楚对于 js 文件和 css 文件进行 gzip 压缩。在所有浏览器中，并不是所有浏览器都支持 gzip 压缩，**若浏览器支持 gzip，一般情况下在请求头上默认自动带上`Accept-Encoding`来标识对 gzip 压缩的支持**。

```http
Accept-Encoding: gzip, deflate
```

启动 gzip 压缩同样需要服务端支持，当客户端支持 gzip 压缩，那么**服务端只需要返回 gzip 格式文件即可启用 gzip 了，默认响应头字段为`Content-Encoding`**。

```http
Content-Encoding: gzip
```

那么，在 Nginx 中是如何配置来让服务端支持 gzip 压缩的？看看如下配置

```nginx
gzip                        on;
    gzip_http_version       1.1;        
    gzip_comp_level         5;
    gzip_min_length         1000;
    gzip_types text/csv text/xml text/css text/plain text/javascript application/javascript application/x-javascript application/json application/xml;
```

可以看到的是，gzip 默认是关闭的，并且配置时需要设定 http 版本为 1.1，为什么？原因是 http 1.1 支持 TCP 持久连接，而 http 1.0 需要配置`Connection: keep-alive`才会是持久连接，需知道的是持久连接有助于避免每次请求都需要重新 TCP 建立连接。



## Nginx-负载均衡

**负载均衡原理是利用一定的分配策略将网络负载平衡地分配到网络集群的各个操作单元上，使得单个重负载任务、大量并发请求分担到多个单元上分别处理，从而减少用户的等待时间**。

在 Nginx 中如何实现负载均衡呢？按照 OSI 七层模型，**Nginx 服务器实现的负载均衡一般认为是七层负载均衡**。

通过硬件实现的负载均衡效果好、效率高、性能稳定，但是缺陷就是成本够高。而**通过软件实现的负载均衡则是依赖于均衡算法的选择和程序的健壮性**。均衡算法主要分为两大类：静态负载均衡算法和动态负载均衡算法。

其中静态负载均衡算法主要有**一般轮询算法、基于比率的加权轮询算法、基于优先级的加权轮询算法**，算法较为简单并且在**一般网络下**都能得到比较好的效果。

而动态负载均衡有基于任务量的**最少连接优先算法**、基于性能的**最快响应优先算法**等，在较为**复杂的网络环境**中适应性强，效果更好。

Nginx 默认情况下采用一般轮询算法，主要使用的配置是 proxy_pass 和 upstream 指令。示例配置如下

```nginx
upstream haha {
  server 192.168.1.2:80;
  server 192.168.1.3:80;
  server 192.168.1.4:80;
}
server {
  listen: 80;
  server_name: www.test.com;
  index index.html index.htm;
  location / {
    proxy_pass http://haha;
    proxy_set_header: Host Shost;
  }
}
```

下面就在 Nginx 基础上，对上述列举的算法进行配置

- 一般轮询算法：将客户端请求**按顺序进行轮询分配**到相应的服务器中。

  ```nginx
  upstream haha {
    server 192.168.1.2:80;
    server 192.168.1.3:80;
    server 192.168.1.4:80;
  }
  ```

- 最少连接优先算法：将客户端请求优先分配到压力较小的服务器中，平衡每个队列的长度。

  ```nginx
  upstream haha {
    least_conn;
    server 192.168.1.2:80;
    server 192.168.1.3:80;
    server 192.168.1.4:80;
  }
  ```

- 最快响应优先算法：对客户端所有请求中处理时间最短的优先分配。

  ```nginx
  upstream haha {
    fair;
    server 192.168.1.2:80;
    server 192.168.1.3:80;
    server 192.168.1.4:80;
  }
  ```

- 客户端ip绑定：对客户端请求中来自同一个 IP 的请求只分配一台机器，有效解决动态网页存在的 session 共享问题。

  ```nginx
  upstream haha {
    ip_hash;
    server 192.168.1.2:80;
    server 192.168.1.3:80;
    server 192.168.1.4:80;
  }
  ```



## Nginx-缓存机制

**Nginx 使用 Proxy Cache 和 Proxy Store 实现代理服务器的缓存机制**。

1. Proxy Store 缓存机制

   该指令**配置是否在本地磁盘直接对来自代理服务器的响应数据进行缓存**。**不提供缓存过期更新、内存索引建立等功能，不占用内存空间，对静态数据效果够好**。

   配置如下

   ```nginx
   proxy_store on | off | string;
   ```

2. Proxy Cache 缓存机制

   **生成专门的进程对磁盘上的缓存文件进行扫描，在内存中建立缓存索引**，提高访问效率，并且还会**生成专门的管理进程对磁盘上的缓存文件进行过期判定、更新等方面的管理**。

   Proxy Cache 缓存机制不管在性能上还是在数据管理上要远远优于 Proxy Store 缓存机制。一般配置如下。

   ```nginx
   http: {
     // ...
     proxy_cache_path /test/proxyCache levels=1:2 max_size=2m inactive=5m loader_sleep=1m; keys_zone=MYPROXYCACHE:10m # 配置缓存数据存放路径和Proxy Cache使用的内存Cache空间
     proxy_temp_path /test/temp; # 配置响应数据的临时存放目录
     server {
       // ...
       location / {
         proxy_pass http://www.test.com; # Nginx缓存里拿不到资源，向该地址转发请求，拿到新的资源，并进行缓存
         proxy_cache MYPROXYCACHE; # 指定用于页面缓存的共享内存，对应http层设置的keys_zone
         proxy_cache_valid 200 302 1h; # 配置200状态和302状态的响应缓存1小时
       }
     }
   }
   ```

另外，附上一个静态资源服务器的配置示范。

```nginx
location ~* \.(png|gif|jpg|jpeg)$ {
  root    /root/static/; # 指定路径即为Nginx本地路径
  autoindex on;
  access_log  off;
  expires     10h; # 设置过期时间为10小时          
}
```















































