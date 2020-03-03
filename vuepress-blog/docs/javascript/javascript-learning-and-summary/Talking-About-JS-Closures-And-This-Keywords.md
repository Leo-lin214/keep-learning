# 闭包和this指向问题

相信大伙们对于闭包以及this指向听的不少，下面就以一些简单栗子来深入了解一下它们的机制。

## 闭包

　　定义：闭包是在某个作用域内定义的函数，它可以访问这个作用域内的所有变量；

　　闭包常见用途：创建特权方法用于访问控制；事件处理程序及回调；

　　说到闭包,就先来讲讲闭包的理解,使用闭包主要是为了设计私有的方法和变量,闭包的优点是可以避免全局变量的污染，缺点是闭包会常驻内存，会增大内存使用量，使用不当很容易造成内存泄露.另外,闭包有三个特性,分别是函数嵌套函数,函数内部可以引用外部的参数和变量以及参数和变量不会被垃圾回收机制回收,接下来直接入题:
　　

 1. 第一题
 
    ```javascript
    var name ="Window";
    var getName=(function(){
     var name = "function";
     return function (){
         return name ;
     }
    })();
    console.log(getName()); // function
    console.log(name);      // Window
    ```

    执行getName()时,其中name所在执行环境的作用域链包含自身函数内的活动对象,外部函数活动对象,全局变量对象,因此执行时,会从内到外进行搜索;而如果单纯执行name的时候,即直接找到全局变量对象;
 
 
 2. 第二题

    ```javascript
    var result = [];
    function createFunctions(){
       for (var i=0; i<3 ;i++){
          result[i]=function(){
              return i;
          };
       }
    }
    createFunctions();
    console.log(result[0]()); // 3
    console.log(result[1]()); // 3
    console.log(result[2]()); // 3
    ```
 
    执行createFunctions()时,而result数组里的每个元素在执行该函数前都已经保存好了一个函数,执行时,则直接返回了i=3,正因为这种机制导致闭包只能取得包含函数中任何变量的最后一个值
 
 
 3. 第三题
 
    ```javascript
    i=2;
    for (var i=0;i<3;i++){}
    alert (i);         //3
    ```
    因为javascript没有块级作用域,如果像java,c++那些语言用到上面的for块级作用域时,最后,运行完后,最终i输出2,所以在javascript中,运行完for循环后的i不会被销毁,还会被保留在内存中,即使重新声明变量还是会输出3,除非人为更改,例如:

    ```javascript
    i=2;
    for (var i=0;i<3;i++){}
    var i;
    alert (i);         //3
    ```
 
 
 4. 第四题
 
    ```javascript
    i=2;
    (function(){
      for (var i=0;i<3;i++){}
    })();
    alert (i);         //3
    ```

    使用闭包能够间接实现块级作用域,这时候,运行匿名函数的时候,所定义的i就会在这个匿名函数运行完就会被销毁,因此在外面调用i的时候,执行环境的作用域链即为全局变量对象
 
 
  <br/>

## this关键字
  <br/>
 

 1. 第一题
 
    ```javascript
    var name ="Window";
       var object = {
           name :"object",
           getName: function (){
               var name = "Function";
               return this.name;
           }
       }
    }
    console.log(object.getName()); //object
    console.log((object.getName)()); //object
    console.log((object.getName = object.getName)()); //Window
    ```

    遇到this的时候,要搞清楚所调用的函数最终要返回的是什么,object.getName()是object调用getName函数,因此this直接指向object,另外object.getName == (object.getName),而在(object.getName = object.getName)中,因为object.getName返回的是一个函数function(){var name = "My Funcition";return this.name;},因此最终相当于(function(){var name = "My Funcition";return this.name;})(),所以this直接指向window
 
 
 
 2. 第二题
 
    ```javascript
    var name ="Window";
    var object = {
       name :"object",
       getName: function (){
           return function (){
              return this.name;
           };
       }
    }
    console.log(object.getName()()); //Window
    console.log((object.getName = object.getName)()()); //Window
    ```
    执行object.getName()时,会返回function (){return this.name;}函数,在执行这个函数时,this指向了window对象,同理,(object.getName = object.getName)()也是返回function (){return this.name;}函数,所以最终this还是指向window对象
 
 

 3. 第三题
 
    ```javascript
    var name ="Window";
       var object = {
           name :"object",
           getName: function (){
           var that = this ;
           return function (){
              return that.name;
           };
       }
    }
    console.log(object.getName()()); //object
    console.log((object.getName = object.getName)()()); //Window
    ```
    在这里使用一个that等于了this对象,所以在执行object.getName()时,刚好this指向的是object对象,然后赋值给that对象,所以object.getName()()时,这时候使用了that,而that指向了object
 
 

 4. 第四题
 
    ```javascript
    var name ="Window";
    getName=(function(){
       var name = "function";
       return function (){
           var name ="function";
           return this.name ;
       }
    })();
    console.log(getName());    //Window
    console.log((getName)());  //Window
    ```
    使用getName()之前,匿名函数已经执行,然会返回function(){var name ="function ";return this.name ;}函数,然后再执行该函数的时候,this指向window对象,另外getName() == (getName())