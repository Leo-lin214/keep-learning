---
layout: post
category: Andraw-lin
title: About HTML
summary: About HTML
---

## **HTML整体总结**

 - [(一) Doctype](#一-doctype)
 - [(二) Meta](#二-meta)
 - [(三) HTML5新增知识](#三-html5新增知识)
 - [(四) 网站性能优化](#四-网站性能优化)
 - [(五) 浏览器如何渲染](#五-浏览器如何渲染)
 - [(六) 移动端性能优化](#六-移动端性能优化)
 - [(七) sessionStorage,localStorage,cookie区别](#七-sessionstoragelocalstoragecookie区别)
 - [(八) cookie与session区别](#八-cookie与session区别)

### (一) Doctype

 1. 定义: 
 
    指示web浏览器关于页面使用哪个 HTML 版本进行编写与渲染页面的指令;

 2. 作用: 
 
    确保HTML元素能够在绝大多数的浏览器上呈现;另外,一般浏览器默认都会使用怪异模式解析渲染页面,doctype的出现能够使浏览器严格遵守标准模式(即让浏览器按照符合W3C的标准解析渲染页面);


### (二) Meta

主要有两个主要属性:

 1. name ( 用于描述网页 );
 2. http-equiv ( 相当于http文件头作用,可以向浏览器传回一些有用的信息,帮助正确和精确地显示网页内容 );

[Meta详细解析](https://github.com/Andraw-lin/Andraw-lin.github.io/blob/master/_posts/2016-03-20-In-Depth-Understanding-HTML-Meta-Tag.md)


### (三) HTML5新增知识

 1. 拖拽拖放;
 2. 语义化标签;
 3. 音频 ( audio ), 视频 ( video );
 4. 画布 ( cavans );
 5. 地理 ( getCurrentPosition() );
 6. 本地存储 ( localStorage );
 

### (四) 网站性能优化

 1. 内容方面:

    + 减少HTTP请求：合并文件、CSS精灵、inline Image
    + 减少DOM元素数量(联系到伪元素:before与:after)
    + 避免重定向(多余的中间访问)
    + 使Ajax可缓存
    + 将资源放到不同的域下：浏览器同时从一个域下载资源的数目有限，增加域可以提高并行下载量

 2. CSS方面:

    + 将样式表放到页面顶部
    + 不使用@import
    + 最好引用以min.css为后缀的css文件

 3. Javascript方面:

    + 将脚本放到页面底部
    + 将javascript和css从外部引入
    + 减少DOM操作
    + 合理设计事件监听器

 4. Cookie方面:

    + 减小cookie大小
    + 引入资源的域名不要包含cookie
    
### (五) 浏览器如何渲染

 1. 常见的浏览器内核:

    - IE内核: Trident ( Trident内核曾经几乎与W3C标准脱节（2005年），二是Trident内核的大量 Bug等安全性问题没有得到及时解决 );
    - 火狐内核: Gecko ( 代码完全公开，可以让全世界程序员为其编写代码，增加功能 );
    - Opera内核: Presto ( 公认的网页浏览速度最快的浏览器内核，但却牺牲了网页的兼容性 );
    - Safari和Chrome内核: webkit ( 自由软件，同时开放源代码 );
    
 2. 渲染过程:

    - 解析HTML以构建DOM树 ( 即转换树中的标签到DOM节点 );
    - 构建渲染树 ( 根据CSS选择器计算出节点的样式，创建渲染树 );
    - 布局渲染树 ( 从根节点递归调用，计算每一个元素的大小、位置等, 找出每个节点在屏幕上的精确坐标 );
    - 绘制渲染树
  
[浏览器如何渲染详细分析](https://github.com/Andraw-lin/Andraw-lin.github.io/blob/master/_posts%2F2016-04-14-How-Browser-Work.md)

### (六) 移动端性能优化

 1. 在```<head>```里引入CSS文件, 在```</body>```后面引入js
 2. 减少DOM操作;
 3. 尽量使用CSS3动画, 开启硬体加速 ( 可以用transform: translateZ(0)来开启硬件加速 );
 4. 适当使用touch事件代替click事件;
 5. 不滥用Float ( Float在渲染时计算量比较大，尽量减少使用 );
 

### (七) sessionStorage,localStorage,cookie区别

同源成立条件：协议相同、域名相同、端口相同；

 1. 生命周期不同. 
 
    cookie在设置的有效期内有效, 默认为浏览器关闭；sessionStorage在窗口关闭前有效，localStorage长期有效，直到用户删除;

 2. 请求时行为不同.

    cookie会在请求时发送到服务器，作为会话标识，服务器可修改cookie；web storage不会发送到服务器;
    
 3. 存储大小不同.

    浏览器不能保存超过300个cookie，单个服务器不能超过20个，每个cookie不能超过4k。web storage大小支持能达到5M;
    
 4. 分享行为不同.

    sessionStorage不能共享，localStorage在同源文档之间共享，cookie在同源且符合path规则的文档之间共享;
    
 5. 作用不同.

    cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，而Web Storage仅仅是为了在本地“存储”数据而生;
    
### (八) cookie与session区别

 1. cookie数据存放在客户的浏览器上，session数据放在服务器上；
 2. cookie不是很安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗考虑到安全应当使用session；
 3. session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能考虑到减轻服务器性能方面，应当使用COOKIE；