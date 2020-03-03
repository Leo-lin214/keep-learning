# CSS的水平居中和垂直居中

　　利用 CSS 来实现对象的水平(或者垂直)居中有许多不同的方法，比较难的是选择那个正确的方法。现在就来总结一下常见的水平(或者垂直)居中方法:


## 水平居中
  

1. 设置左右外边距为auto

   设置指定块级元素的左右外边距为auto时,并不需要跟宽度和高度有任何的联系:

   HTML代码:

   ```html
      <div id="header"></div>
   ```

   CSS代码:

   ```css
      #header {
         width: 100px;
         height: 100px;
         background: red;
         margin: 0 auto;
      }
   ```



2. 绝对定位

   使用绝对布局,实质就是计算宽度以达到块级元素的居中,但这个方法有个缺点就是必须要跟元素的宽度联系起来:

   HTML代码:
   
   ```html
      <div id="header"></div>
   ```
   
   CSS代码:
   
   ```css
      #header {
         width: 100px;
         height: 100px;
         background: red;
         position: absolute;
         left: 50%;
         margin-left: -50px;
      }
   ```



3. flex布局

   使用flex布局唯一的缺陷就是只能兼容IE10+,IE10以下都不能正确显示内容,并且必须要设置宽度,没有的宽度的情况下不会居中:
   
   HTML代码:

   ```html
      <div id="header">
         <div id="content"></div>           //内容区是你要居中的块级元素
      </div>
   ```
   
   CSS代码:
   
   ```css
      #header {
         width: 100%;
         display: flex;                 //先设置布局为flex布局
         justify-content: center;       //实现居中
      }
      #content {
         width: 100px;
         height: 100px;
         background: red;
      }
   ```
 



## 垂直居中

1. 表格布局

   表格布局需要结合vertical-align属性才能实现垂直居中,但需要四层盒子模型,  最后一层才是你要进行垂直居中的块级元素,值得注意的是,第三层却是作为一个  过渡的空壳:

   HTML代码:

   ```html
      <div id="wrapper">
         <div id="cell">
            <div>
               <div id="content"></div>
            </div>
         </div>
      </div>
   ```

   CSS代码:

   ```css
      #wrapper {
         display: table;            //最外层必须要设置成table布局
         height: 600px;
         width: 300px;
         background: black;
      }
      #cell {
         display: table-cell;       //第二层要设置成table的单元格
         vertical-align: middle;    //进行居中
      }
      #content{
         width: 100px;
         height: 100px;
         background: orange;
      }
   ```



2. 根据高度的绝对布局

   跟水平居中的绝对布局一样,根据元素的高度,然后通过绝对布局计算出合适高度进行垂直居中:

   HTML代码:

   ```html
      <div id="content"></div>
   ```

   CSS代码:

   ```css
      #content {
         position: absolute;
         top: 50%;
         margin-top: -50px;
         width: 100px;
         height: 100px;
         background: red;
      }
   ```



3. 清除浮动

   所谓的清除浮动,即在你在指定居中元素前再创建一个块级元素,设置为左浮动,然后再在指定居中元素进行清除浮动即可达到居中效果,而这个方法跟高度设置有联系:

   HTML代码:

   ```html
      <div id="header"></div>            //浮动元素
      <div id="content"></div>           //要垂直的content
   ```

   CSS代码:

   ```css
      #header{
         float: left;                   //设置左浮动
         height: 50%;                   
         margin-bottom: -50px;          //设置为居中元素高度的一半
      }
      #content{
         clear: both;                   //进行清除浮动
         width: 100px;
         height: 100px;
         background: red;
      }
   ```



4. 跟高度没联系的绝对定位

   在绝对定位的情况下,top和bottom都要设置为0,通过设置magin为auto时即可达到垂直居中:

   HTML代码:

   ```html
      <div id="content"></div>
   ```

   CSS代码:

   ```css
      #content {
         position: absolute;
         top: 0;
         bottom: 0;
         margin: auto;
         width: 100px;
         height: 100px;
         background: red;
      }
   ```



5. flex布局

   使用flex布局中align-items属性即可,但要设置父元素的高度:

   HTML代码:

   ```html
      <div id="header">
         <div id="content"></div>
      </div>
   ```

   CSS代码:

   ```css
      #header {
         width: 100%;
         height: 100%;
         display: flex;
         align-items: center;
      }
      #content {
         width: 100px;
         height: 100px;
         background: red;
      }
   ```



6. 使用line-hight属性

   使用line-height属性只能对块级元素里面的文本进行垂直居中,对块级元素不会起任何作用:

   HTML代码:

   ```html
      <div id="content">
         <p>HelloWorld</p>
      </div>
   ```


   CSS代码:

   ```css
      #content {
         width: 100px;
         height: 100px;
         line-height: 100px;
         border: 1px solid red;
      }
      #content p {
         margin: 0;
      }
   ```
 