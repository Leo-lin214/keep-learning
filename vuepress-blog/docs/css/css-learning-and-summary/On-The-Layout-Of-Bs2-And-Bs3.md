# 浅谈Bootstrap2和Bootstrap3的布局

　　从Bootstrap2到Bootstrap3，使得响应式布局对移动端支持更加好，并且自适应屏幕分辨率，今天我们就来谈谈从Bootstrap2到Bootstrap3的布局变化过程.

## Bootstrap2

　　Bootstrap默认的栅格系统为12列，宽度为940px，每个栅格外边距都是20px.Bootstrap2的栅格系统有两种，一种是固定式的(Fix)，一种是流式的(Fluid).默认情况下，Bootstrap2没有启用响应式布局特性，启用该特性需要引入CSS文件(bootstrap-responsive.min.css)，栅格系统适应不同设备和屏幕分辨率:

```css
@media (min-width: 1200px) {        //大于等于1200px，适合大屏幕
}
@media (min-width: 980px) {         //大于等于980px，默认
}
@media (min-width: 768px) {         //大于等于768px，适合平板
}
@media (max-width: 767px) {         //小于等于767px，适合手机到平板
}
@media (max-width: 480px) {         //小于等于480px，适合手机
```

　　另外，响应式(即流式)栅格与固定式栅格的区别在于式布局加的是自适应(即可变)宽度的容器，固定式布局加的是固定宽度的容器.Bootstrap2中使用布局的格式:

```html
<div class="span+数字"></div>      //数字表示占有多少个栅格
```
　　

**1. 固定式布局**
 

- 使用固定布局的时候，栅格系统会居中显示，例如执行如下代码:


  ```html
  <div class="container">
      <div class="row">
        <div class="span4 test1"></div>
        <div class="span4 test2"></div>
        <div class="span4 test3"></div>
      </div>
  </div>
  ```

  + 在min-width: 1200px情况下:
  ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout01.png)

  + 在min-width: 980px即默认情况下: 
  ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout02.png)

  + 在min-width: 768px情况下: 
  ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout03.png)

  + 在max-width: 767px情况下:
  ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout04.png)
     
        
        
**2. 流式布局**
     
        
- 流式布局是一种自适应屏幕的设计方法，即不固定块的宽度，而是以百分比为单位来确定每一块的宽度，自适应各种不同大小的屏幕，如手机，平板，电脑等，例如:

  ```html
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span4 test1">test1</div>
      <div class="span4 test2">test2</div>
      <div class="span4 test3">test3</div>
    </div>
  </div>
  ```
  + 在min-width: 1200px情况下:
    ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout11%20.png)
    
  + 在min-width: 980px即默认情况下: 
    ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout12.png)
        
  + 在min-width: 768px情况下: 
    ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout13.png)
        
  + 在max-width: 767px情况下:
    ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout14.png) 
    

## Bootstrap3

　　简单地说，在Bs3中只有一种布局，就是流式布局(响应式).

 1. 在Bootstrap3版本中，各种媒介分为4种像素宽度类型:

    ```css
    @media (min-width: 1200px) {        //大于等于1200px，适合大屏幕
    }
    @media (min-width: 992px) {         //大于等于980px，中等屏幕
    }
    @media (min-width: 768px) {         //大于等于768px，适合平板
    }
    @media (max-width: 767px) {         //小于等于767px，适合手机
    }
    ```

    + xs：默认指浏览器像素宽度小于768px;
    + sm：默认指浏览器像素宽度大于等于768px;
    + md：默认值指浏览器像素宽度大于等于992px;
    + lg：默认值指浏览器像素宽度大于等于1200px;


 2. 跟bs2一样，bs会把内容区域平均分成12等分，每一个栅格左右无边距，栅格的class为` col-*(*用0~12表示，表示占有多少栅格) `

    + xs：col-xs-1 ~ col-xs-12，多列始终在一行内;
    + sm：col-sm-1 ~ col-sm-12，多列在浏览器像素宽度大于等于768px时才在一行内;
    + md：col-md-1 ~ col-md-12，多列在浏览器像素宽度大于等于992px时才在一行内;
    + lg：col-lg-1 ~ col-lg-12，多列在浏览器像素宽度大于等于1200px时才在一行内;
    
 3. 例子:

    - 使用col-xs-1 ~ col-xs-12，无论屏幕宽度如何变化，所有栅格始终都会在一行内:

      ```html
       <div class="container">
           <div class="row">
              <div class="col-xs-4 test1">test1</div>
            <div class="col-xs-4 test2">test2</div>
            <div class="col-xs-4 test3">test3</div>
           </div>
       </div>
      ```
      ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout21.png) 
    
    - 使用col-sm-1 ~ col-sm-12，在大于等于768px时，始终在一行，小于时则会呈垂直展现:
      
      ```html
      <div class="container">
        <div class="row">
          <div class="col-sm-4 test1">test1</div>
          <div class="col-sm-4 test2">test2</div>
          <div class="col-sm-4 test3">test3</div>
        </div>
      </div>
      ```
      ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout22.png) 
      ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout23.png) 
    
    - 使用col-md-1 ~ col-md-12，在大于等于992px时，始终在一行，小于时则会呈垂直展现:
    
      ```html
      <div class="container">
        <div class="row">
          <div class="col-md-4 test1">test1</div>
          <div class="col-md-4 test2">test2</div>
          <div class="col-md-4 test3">test3</div>
        </div>
      </div>
      ```
      ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout24.png) 
      ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout25.png) 
    
    - 使用col-lg-1 ~ col-lg-12，在大于等于1200px时，始终在一行，小于时则会呈垂直展现:
    
      ```html
      <div class="container">
        <div class="row">
          <div class="col-lg-4 test1">test1</div>
          <div class="col-lg-4 test2">test2</div>
          <div class="col-lg-4 test3">test3</div>
        </div>
      </div>
      ```
      ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout26.png)
      ![](http://7xs89l.com1.z0.glb.clouddn.com/bootstraplayout27.png)
