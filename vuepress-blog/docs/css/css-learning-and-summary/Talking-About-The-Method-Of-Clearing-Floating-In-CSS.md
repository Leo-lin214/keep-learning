# CSS中清除浮动的方法

　　今天在复习scss浮动的过程中，发现有一道很有意思的题目，是关于如何去除css浮动，借此在这里分享一下.


　　题目是这样的:


　　　　如下图，在一个id为doc的div里面，设置了width为300px，border为4px的红色实线边框，而在这个div里面，又分别定义了三个width为100px，height为100px，float为left的不同颜色边框，这时候，请列出能够实现id为doc的div高度从0变到100px:

html代码:

```html
  <div id="doc">
      <div class="text text1">text1</div>
      <div class="text text2">text2</div>
      <div class="text text3">text3</div>
  </div>
```

css代码:

```css
  #doc{
      width: 300px;
      border: 4px solid red;
    }
  .text{
    width: 100px;
    height: 100px;
    float: left;
  }
  .text1{
    background: #E28080;
  }
  .text2{
    background: #B9E999;
  }
  .text3{
    background: #98DEDD;
  }
```


  ```效果图```:
  
  ![](http://7xs89l.com1.z0.glb.clouddn.com/cssclearfloateffect.png)






下面就来谈谈到底都有哪些方法能够实线去除浮动，进而实现id为doc的div高度从0变到100px

## 末尾多创建一个div方法

  末尾多创建一个div实质是在指定元素里面补上最后一个元素，使用clear:both清除浮动，也就是说，在id为doc的div里面最后一个子节点补上一个div，并且附上属性clear:both:

  ```html
    <div id="doc">
      <div class="text text1">text1</div>
      <div class="text text2">text2</div>
      <div class="text text3">text3</div>
      <div style="clear:both"></div>
    </div>
  ```

## 伪元素:after

  使用伪元素:after，也就是说，直接对id为doc的div使用:after伪元素选择器，然后使用clear:both清除浮动，原理跟第一种方法一样:
      
  ```css
    #doc:after {
      display: block;
      content: '';
      clear: both;
    }
  ```

## overflow

  应用值为hidden或auto的overflow时，会有一个副作用，就是自动清除其包含的任何浮动元素:

  ```css
    #doc {
      width: 300px;
      border: 4px solid red;
      overflow: hidden;           //这里使用hidden或auto都可以
    }
  ```
    
    

## min-hight的特殊属性(听说是将来css4中的属性)

  使用min-hight的特殊属性contain-floats可以是实现清除浮动，不过这个属性是css4将要推出的新属性，现在的浏览器暂时还不支持，但结果却能够实现:

  ```css
    #doc {
      width: 300px;
      border: 4px solid red;
      min-height: contain-float;
    }
  ```