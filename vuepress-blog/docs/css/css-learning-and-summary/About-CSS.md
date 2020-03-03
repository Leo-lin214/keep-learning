---
layout: post
category: Andraw-lin
title: About CSS
summary: About CSS
---

## **CSS整体总结**

 - [(一) 渐进增强和优雅降级区别](#一-渐进增强和优雅降级区别)
 - [(二) 对合模型的理解以及它的兼容性](#二-对合模型的理解以及它的兼容性)
 - [(三) display: none 和 visibility: hidden 区别](#三-display-none-和-visibility-hidden-区别)
 - [(四) link 和 @import 区别](#四-link-和-import-区别)
 - [(五) position: absolute 和 float属性的区别](#五-position-absolute-和-float属性的区别)
 - [(六) 谈谈对box-sizing属性的理解](#六-谈谈对box-sizing属性的理解)
 - [(七) CSS选择器以及优先级](#七-css选择器以及优先级)
 - [(八) 浮动原理以及清除浮动方法](#八-浮动原理以及清除浮动方法)
 - [(九) FOUC以及如何避免](#九-fouc以及如何避免)
 - [(十) 如何把元素水平居中和垂直居中](#十-如何把元素水平居中和垂直居中)
 - [(十一) 描述下reset CSS文件的作用和优缺点](#十一-描述下resetcss文件的作用和优缺点)
 - [(十二) 谈谈你对重构的理解](#十二-谈谈你对重构的理解)
 - [(十三) Sass与Less区别](#十三-sass与less区别)

### (一) 渐进增强和优雅降级区别

 1. 渐进增强
 
    针对低版本浏览器进行构建页面( 保证最基本的功能 ), 然后在针对高浏览器进行效果, 效果等改进和追加功能( 达到更好的用户体验 );
 
 2. 优雅降级
 
    一开始就构建完整功能的页面, 然后再针对低版本浏览器进行兼容;

### (二) 对合模型的理解以及它的兼容性

 1. W3C标准盒模型
 
    总宽度 = 左右外边距(margin) + 左右边框宽度(border) + 左右内边距(padding) + 内容宽度(width);
 
 2. IE合模型
 
    总宽度 = 左右外边距(margin) + 内容宽度(width);

 3. 解决这两种模型的兼容性方法
 
    - 使用条件注释语句;
    - 使用CSS hacks;
    

### (三) display: none 和 visibility: hidden 区别

 1. 相同点: 两个属性都可以把一个元素进行隐藏不可见;
 2. 不同点:
 
    - display: none 会让元素完全在渲染树中消失, 渲染的时候不占据任何DOM树空间; 非继承性, 子孙节点消失由于元素从渲染树消失造成, 通过修改子孙节点属性无法显示; 会造成文档的重排;
    - visibility: hidden 不会让元素从渲染树消失, 仍然占据空间, 只是内容不可见; 有继承性, 子孙节点消失是因为继承了hidden, 通过设置visibility: visible可以让子孙节点重新显示; 只会造成本元素的重绘;
    

### (四) link 和 @import 区别

 1. link属于HTML标签, 而@import是CSS提供的;
 2. 当页面加载的时候, link会同时被加载, 而被@import引用的CSS会等到引用它的CSS文件被加载完再加载;
 3. link是HTML标签, 无兼容性问题, @import只能在IE5以上才能识别;
 4. link的优先级高于@import;
 

### (五) position: absolute 和 float属性的区别

 1. 相同点: 两者都能使元素脱离文档流, 并且可以设置其宽高;
 2. 不同点: absolute 会覆盖文档流中的其他元素, float 的元素则会仍然占据位置;
 

### (六) 谈谈对box-sizing属性的理解

box-sizing属性主要用来控制元素的盒模型的解析模式, 默认值是content-box;

 1. content-box：让元素维持W3C的标准盒模型. 设置width/height属性指的是content部分的宽/高;
 2. border-box：让元素维持IE传统盒模型. 置width/height属性指的是border + padding + content;
 

### (七) CSS选择器以及优先级

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
     
     
### (八) 浮动原理以及清除浮动方法

 1. 如果对一个元素设置浮动，它就会脱离文本流直到碰到框的最左或者最右，普通流的其他元素会取代它原本的位置;

 2. [清除浮动方法](https://github.com/Andraw-lin/Andraw-lin.github.io/blob/master/_posts/2016-03-29-Talking-About-The-Method-Of-Clearing-Floating-In-CSS.md);


### (九) FOUC以及如何避免

 1. 定义:
    
    Flash Of Unstyled Content的缩写,即文档样式闪烁,指的是在某些情况下,IE在加载页面时会出现短暂的CSS样式失效;

 2. 例子:
 
    在head标签里面没有任何的link标签或者script标签,这时候在style标签面只用了@import导入外部样式,这时候,IE会先加载整个HTML文档的DOM,然后再去导入外部的CSS文件,在加载那段时间里页面的内容是没有任何样式的;

 3. 避免方法:

    使用LINK标签将样式表放在文档HEAD中;
    
    
### (十) 如何把元素水平居中和垂直居中

[居中元素方法](https://github.com/Andraw-lin/Andraw-lin.github.io/blob/master/_posts/2016-03-30-Sum-Up-CSS-Horizontal-And-Vertical-Center.md)

### (十一) 描述下reset CSS文件的作用和优缺点

 1. 定义: 
 
    每个浏览器对于不同元素的css样式的默认值是不一样的，使用reset可以统一css样式;

 2. 优点:
 
    使用CSS reset可以很好地解决浏览器在解析颜色样式上的差异问题,减少了开发人员工作;

 3. 缺点:
   
    CSS reset 通常会增加浏览器进行样式计算的成本（即有一定的性能负担），因为它引入了许多的针对元素的全局规则，网页中几乎所有元素都会匹配一条乃至几条的reset规则，且往往规则中的属性设定其实会被更specific的规则所覆盖;

### (十二) 谈谈你对重构的理解

网站重构：在不改变外部行为的前提下，简化结构、添加可读性，而在网站前端保持一致的行为。也就是说是在不改变UI的情况下，对网站进行优化， 在扩展的同时保持一致的UI;

[可以扯到性能优化方面](###)

### (十三) Sass与Less区别

 1. 变量符不一样, Less 是@, 而 Sass 是$, 而且变量的作用与不一样, 例如:

    ```css
        // Less 作用域
        @color: blue;
        #header{
            @color: red;
            border: 1px solid @color;
        }
        #footer{
            border: 1px solid @color;
        }
        // Less 编译后
        #header { border: 1px solid red; }
        #footer { border: 1px solid blue; }
        
        // Sass 作用域
        $color: blue;
        #header{
            $color: red;
            border: 1px solid $color;
        }
        #footer{
            border: 1px solid $color;
        }
        // Sass 编译后
        #header { border: 1px solid red; }
        #footer { border: 1px solid red; }
    ```
    
 2. 输出设置不一样, Less 没有输出设置, Sass 提供了4种输出选项: nested( 嵌套 ), compact( 展开 ), compressed( 紧凑 ) 和 expanded( 压缩 );

 3. 另外 Sass 支持条件语句, 可以使用if{}else{}, for{}循环等等, 而 Less 不支持;