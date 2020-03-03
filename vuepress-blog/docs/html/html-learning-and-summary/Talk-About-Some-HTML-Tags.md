---
layout: post
category: Andraw-lin
title: Talk About Some HTML Tags
date: 2016-04-06
summary: Talk About Some HTML Tags
---


### 1.datalist标签的使用

 - datalist提供一个事先定义好的列表,通过id与input关联,当在input内输入时就会有自动完成的功能,用户将会看见一个下拉列表供其选择;
 - 例子: 
```
    <!DOCTYPE html>
    <html>
     <head>
        <title>HTML5 datalist tag</title>
        <meta charset="utf-8">
     </head>
        <p>
            浏览器版本：<input list="words">
        </p>
        <datalist id="words">
            <option value="Internet Explorer">
            <option value="Firefox">
            <option value="Chrome">
            <option value="Opera">
            <option value="Safari">
            <option value="Sogou">
            <option value="Maxthon">
        </datalist>
     </body>
    </html>
```

### 2.details标签的使用

 - <details>标签允许用户创建一个可展开折叠的元件，让一段文字或标题包含一些隐藏的信息;
 - 例子: 
 
 ```
    <details>
    <summary>Google Nexus 6</summary>
    <p>商品详情：</p>
    <dl>
        <dt>屏幕</dt>
        <dd>5.96” 2560x1440 QHD AMOLED display (493 ppi)</dd>
        <dt>电池</dt>
        <dd>3220 mAh</dd>
        <dt>相机</dt>
        <dd>13MP rear-facing with optical image stabilization 2MP front-facing</dd>
        <dt>处理器</dt>
        <dd>Qualcomm® Snapdragon™ 805 processor</dd>
    </dl>
</details>
 ```
 点击Google Nexus 6后,后面的内容就会展现出来,而且展现出来的东西还会占取DOM的一个地方;
 
 - 通过给<details>标签设置open属性让它默认为展开状态,例如:
 ```
    <details open>
 ```
 
### 3.figure标签和figcaption标签的使用   
 - figure标签规定独立的流内容（图像、图表、照片、代码等等）。figure 元素的内容应该与主内容相关，但如果被删除，则不应对文档流产生影响;
 - figcaption 标签定义 figure 元素的标题（caption）。"figcaption" 元素应该被置于 "figure" 元素的第一个或最后一个子元素的位置;
 - 例子: 
 
 ```
    //以前的图文并茂的写法
    <li>
        <img src="" /><p>title</P>
    </li>   
 ```
 使用figure和figcaption后:
 
 ```
    //figure用来代替原来li标签,figcaption用来代替原来P标签
    <figure>
        <figcaption>黄浦江上的的卢浦大桥</figcaption>
        <img src="shanghai_lupu_bridge.jpg" width="350" height="234" />
    </figure>
 ```
 
### 4.mark标签的使用
 - 使用mark标签可以高度显示文档中的文字以达到醒目的效果;
 - 例子: 
 
 ```
    <p>百度百科是一部内容开放、自由的网络<mark>百科</mark>全书,旨在创造一个涵盖所有领域知识,服务所有互联网用户的中文知识性<mark>百科</mark>全书。在这里你可以参与词条编辑,分享贡献你的知识</p>
 ```
 在浏览器显示时,"百科"两个字会以黄色为背景色,而字体还是黑色;
 
### 5.progress标签的使用
 - 单独使用<progress>标签,在不同的浏览器会呈现不同的进度条