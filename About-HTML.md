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
 - [(五) sessionStorage,localStorage,cookie区别](#五-sessionstoragelocalstoragecookie区别)

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
    + 将资源放到不同的域下：浏览器同时从一个域下载资源的数目有限，增加域可以提高并行下载量

 2. CSS方面:

    + 将样式表放到页面顶部
    + 不使用@import
    + 最好引用以min.css为后缀的css文件

 3. Javascript方面:

    + 将脚本放到页面底部
    + 将javascript和css从外部引入
    + 合理设计事件监听器

 4. Cookie方面:

    + 减小cookie大小
    + 引入资源的域名不要包含cookie

### (五) sessionStorage,localStorage,cookie区别

同源成立条件：协议相同、域名相同、端口相同；

 1. 生命周期不同. 
 
    cookie在设置的有效期内有效, 默认为浏览器关闭；sessionStorage在窗口关闭前有效，localStorage长期有效，直到用户删除;

 2. 请求时行为不同.

    cookie会在请求时发送到服务器，作为会话标识，服务器可修改cookie；web storage不会发送到服务器;
    
 3. 存储大小不同.

    浏览器不能保存超过300个cookie，单个服务器不能超过20个，每个cookie不能超过4k。web storage大小支持能达到5M;