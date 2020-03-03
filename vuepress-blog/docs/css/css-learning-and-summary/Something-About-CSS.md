---
layout: post
category: Andraw-lin
title: Something About CSS
date: 2016-04-06
summary: Something About CSS
---

## **Something About CSS**

- [(一) CSS选择器](#一-css选择器)
- [(二) CSS Sprites](#二-css-sprites)
- [(三) display:none与visibility:none](#三-displaynone与visibilitynone)
- [(四) HTML导入CSS方式](#四-html导入css方式)
- [(五) link与@import的区别](#五-link与import的区别)
- [(六) CSS中具有继承性的属性](#六-css中具有继承性的属性)
- [(七) FOUC](#七-fouc)
- [(八) 如何居中元素](#八-如何居中元素)
- [(九) 清除浮动(实现BFC)](#九-清除浮动实现bfc)
- [(十) 描述下reset CSS文件的作用和使用它的好处](#十-描述下reset-css文件的作用和使用它的好处)
- [(十一) 浮动的工作原理](#十一-浮动的工作原理)

### (一) CSS选择器

  1. 基础选择器
    
     + *通用选择器
    
       匹配所有元素,不参与选择器优先级计算,兼容性为IE6+;
     + A(元素)标签选择器

       匹配所有A元素,兼容性为IE6+;
     + .info类选择器:
        
       匹配所有class属性中包含info的与元素,兼容性为IE6+;
      
     + ID选择器
    
       匹配指定ID的元素,兼容性为IE6+

  2. 组合选择器

     + A,B多元素选择器
    
       匹配所有A元素或者B元素,兼容性为IE6+
      
     + A B后代选择器
    
       匹配所有属于A元素后代的B元素,兼容性为IE6+
      
     + A > B子元素选择器
    
       匹配A的```子元素```中B元素,兼容性为IE7+
      
     + A + B直接兄弟选择器
    
       匹配在A之后第一个兄弟节点是B元素,兼容性为IE7+
      
     + A ~ B兄弟选择器
    
       选择A之后所有兄弟节点中是B元素,兼容性为IE7+
      

  3. 属性选择器

     + A[att]
    
       匹配所有设置了att属性的元素,兼容性为IE7+
      
     + A[att=val]
    
       匹配所有att属性值等于val的元素,兼容性为IE7+
      
     + A[att~=val]
    
       匹配所有att属性值具有多个空格分隔的值,其中一个值等于val的元素,兼容性为IE7+
      
     + A[att|=val]
    
       匹配所有att属性值以val开头或者刚好等于val的元素,兼容性为IE7+
      
     + A[att^=val]
    
       匹配所有att属性值以val开头的元素,兼容性为IE7+
      
     + A[att$=val]
    
       匹配所有att属性值以val结尾的元素,兼容性为IE7+
      
     + A[att*=val]
    
       匹配所有att属性值中包含val的元素,兼容性为IE7+
      
     + [:checked]
    
       匹配单选框,复选框,下拉框中选中状态下的元素,兼容性为IE9+
      
      

  4. 伪类选择器

     + A:first-child
    
       匹配满足的A元素,且A元素是其父节点的第一个子元素,兼容性为IE7+
      
     + A:last-child
    
       匹配满足的A元素,且A元素是其父节点的最后一个子元素,兼容性为IE9+
      
     + :not(selector)
      
       匹配不符合selector的元素,不参与选择器的优先级,兼容性为IE9+
      
     + A:link
    
       匹配所有未被点击的链接,兼容性为IE7+
      
     + A:visited
    
       匹配所有已被点击的链接,兼容性为IE7+
      
     + A:active
    
       匹配鼠标已经其上按下,还没释放的A元素,兼容性为IE7+
      
     + A:hover
    
       匹配鼠标悬停其上的A元素,兼容性为IE7+
      
     + A:focus
    
       匹配所有获得当前焦点的A元素,兼容性为IE7+
      
     + :nth-child(An+B)

       匹配其父元素的第An+B个子元素,兼容性为IE9+
      
     + :nth-last-child(An+B)
    
       匹配其父元素的倒数第An+B个子元素,兼容性为IE9+
      
     + A:only-child
    
       匹配满足的A元素,且A元素是其父元素的唯一子元素
      
     + :target
    
       匹配文档中特定"id"点击后的效果(可使用:target实现tab切换)
      
  5. 伪元素选择器

     + A::first-line
      
       匹配快元素A元素的第一行,兼容性为IE6+
      
     + A::first-letter
    
       匹配块元素A元素的第一个字母,兼容性为IE6+
      
     + ::before和:before
    
       选择元素虚拟子元素(元素的第一个子元素),CSS3中::表示伪元素,兼容性:before为IE8+,::after为IE9+

  6. CSS选择器的效率从高到低是:

     + id选择器
     + class选择器
     + 标签选择器
     + 直接兄弟选择器(h1+span)
     + 子选择器(ul>li)
     + 后代选择器(ul a)
     + 属性选择器
     + 伪类,伪选择器
  
      
    
    
### (二) CSS Sprites
  

 1. 原理:

    将多个小图片拼接到一个图片中.利用CSS的“background-image”，“background-repeat”，“background-position”的组合进行背景定位，background-position可以用数字能精确的定位出背景图片的位置
    

 2. 优点:
 
    + 减少了网页的http请求，从而大大的提高了页面的性能(最大的优点)
    + 减少图片的字节
    + 解决了网页设计师在图片命名上的困扰，只需对一张集合的图片上命名就可以了,提高了网页的制作效率

 3. 缺点:

    + 图片合并麻烦.      
      (因为在图片合并的时候，你要把多张图片有序的合理的合并成一张图片，还要留好足够的空间，防止板块内不会出现不必要的背景；这些还好，最痛苦的是在宽屏，高分辨率的屏幕下的自适应页面，你的图片如果不够宽，很容易出现背景断裂)
    
    + 维护麻烦. 
      (如果页面背景有少许改动，一般就要改这张合并的图片，无需改的地方最好不要动，这样避免改动更多的css，如果在原来的地方放不下，又只能（最好）往下加图片，这样图片的字节就增加了，还要改动css)
 
 
### (三) display:none与visibility:none

 1. 共同点:
 
    都能把网页上某个元素隐藏起来,即在文档中看不见

 2. 区别:

    + display:none;会让元素完全从渲染树中消失,渲染的时候不占据任何空间;visibility:hidden;不会让元素从渲染树消失,渲染师元素继续占据空间,只是内容不可见
    + 修改文档流中元素的display通常会造成文档重排,修改visibility属性只会造成本元素的重绘
    + 浏览器不会读取display: none;元素内容；会读取visibility: hidden;元素内容
    
    
### (四) HTML导入CSS方式

 1. 使用link标记引用外部CSS文件(推荐此方法)
 2. 使用style标签包含样式
 3. 使用@import引用外部CSS文件
 4. 使用内联样式(即在元素内使用style属性)


### (五) link与@import的区别

 1. 语法结构不一样,link是HTML方式,@import是CSS方式
 2. link支持并行下载,而@import只支持串行下载
 3. 浏览器对link支持早于@import,可以使用@import对老浏览器隐藏样式
 4. @import必须在样式规则之前,可以在css文件中引用其他文件
   
 
 

### (六) CSS中具有继承性的属性

 1. font
 2. word-break
 3. letter-spacing
 4. text-align
 5. text-rendering
 6. word-spacing
 7. text-indent
 8. text-transform
 9. text-shadow
 10. line-height
 11. color
 12. visibility
 13. cursor
      
### (七) FOUC

 1. 定义:
    
    Flash Of Unstyled Content的缩写,即文档样式闪烁,指的是在某些情况下,IE在加载页面时会出现短暂的CSS样式失效

 2. 例子:
 
    在head标签里面没有任何的link标签或者script标签,这时候在style标签面只用了@import导入外部样式,这时候,IE会先加载整个HTML文档的DOM,然后再去导入外部的CSS文件,在加载那段时间里页面的内容是没有任何样式的

 3. 避免方法:

    使用LINK标签将样式表放在文档HEAD中


### (八) 如何居中元素

 - [居中元素方法](https://github.com/Andraw-lin/Andraw-lin.github.io/blob/master/_posts/2016-03-30-Sum-Up-CSS-Horizontal-And-Vertical-Center.md)
 

### (九) 清除浮动(实现BFC)

 - [清除浮动方法](https://github.com/Andraw-lin/Andraw-lin.github.io/blob/master/_posts/2016-03-29-Talking-About-The-Method-Of-Clearing-Floating-In-CSS.md)


### (十) 描述下reset CSS文件的作用和使用它的好处

 1. 定义: 
 
    每个浏览器对于不同元素的css样式的默认值是不一样的，使用reset可以统一css样式;

 2. 使用好处:
 
    使用CSS reset可以很好地解决浏览器在解析颜色样式上的差异问题,减少了开发人员工作;

 3. 使用坏处:
   
    CSS reset 通常会增加浏览器进行样式计算的成本（即有一定的性能负担），因为它引入了许多的针对元素的全局规则，网页中几乎所有元素都会匹配一条乃至几条的reset规则，且往往规则中的属性设定其实会被更specific的规则所覆盖 

### (十一) 浮动的工作原理

 - 如果对一个元素设置浮动，它就会脱离文本流直到碰到框的最左或者最右，普通流的其他元素会取代它原本的位置