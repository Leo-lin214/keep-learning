---
layout: post
category: Andraw-lin
title: CSS Hack Principle And Operation
date: 2016-04-07
summary: CSS Hack Principle And Operation
---

## **CSS Hack原理及使用**
<br/>


### **(一) CSS Hack原理**


  利用不同浏览器对CSS的支持和解析结果不一样编写针对特定浏览器的样式


### **(二) 常用Hack**

  1. 属性Hack

  2. 选择器Hack

  3. IE条件注释


### **(三) 举例**

 1. 属性Hack: 不同浏览器解析bug或方法
 
    + 兼容IE6及以下版本:
    
      ```css
        #test{ 
            _color: red;   //即在属性前加下划线 
        }  
      ```
      
    + 兼容IE6或者IE7:
    
      ```css
        #test{
            *color: red;
            //或者
            #color: red;
            //或者
            color: red !ie; //类似!important
        }
      ```
      
    + 兼容除了IE6及以下的版本:
    
      ```css
        #test{
            color/**/: red;
        }
      ```
      
    + 兼容IE6-IE8
    
      ```css
        #test{
            color: red\9;
        }
      ```
      
    + 兼容IE7-IE8
    
      ```css
        #test{
            color/*\**/: red\9;
        }
      ```

 2. 选择器Hack: 不同浏览器对选择器的支持不一样

    + 兼容IE6及以下版本:
    
      ```css
        * html #test{
            color: red;
        }
      ```
      
    + 兼容IE7:
    
      ```css
        *+html #test{
            color: red;
        }
      ```
      
    + 兼容除了IE 6,7及以下版本:
    
      ```css
        html>/**/body #test{
            color: red;
        }
      ```
      
    + 兼容saf3+, chrome1+:
    
      ```css
        @media screen and (-webkit-min-device-pixel-ratio:0){
            #test{
                color: red;
            }
        }
      ```
      
    + 兼容 iPone(mobile webkit):
    
      ```css
        @media screen and (max-device-width: 480px){
            #test{
                color: red;
            }
        }
      ```
    
    + 兼容除了IE6-IE8的版本:
    
      ```css
        :root *> #test{
            color: red;
        }
      ```
    
    + 兼容Firefox only. 1+:
    
      ```css
        #test, x:-moz-any-link{
            color: red;
        }
      ```
      
    + 兼容Firefox 3.0+
    
      ```css
       #test, x:-moz-any-link, x:default{
            color: red;
       }
      ```
      

 3. IE条件注释: 适用于 IE5 ~ IE9常见格式如下

    ```html
        <!--[if IE 6]>
            Special instructions for IE 6 here      //可根据不同版本的IE引入不同样式表
        <![endif]-->
    ```