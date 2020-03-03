# call、apply和bind

网上对于JavaScript的apply，call，bind的文章真的很多，今天我也想来分享一下个人对于的这三个的理解，来进一步巩固自己的一些知识点。

借用阮一峰的一句话:

> 对我来说，博客首先是一种知识管理工具，其次才是传播工具。我的技术文章，主要用来整理我还不懂的知识。我只写那些我还没有完全掌握的东西，那些我精通的东西，往往没有动力写。炫耀从来不是我的动机，好奇才是。

哈哈，闲话少说，直奔主题。

在JavaScript中，call、apply和bind是Function对象自带的三个方法，这三个方法的主要作用是改变函数中this指向。

## 上下文

- 上下文是指```this```在同一个作用域内的值，用来指定代码某些特定部分中的```this```的值。（在浏览器中在全局作用域中上下文中始终是```window```对象，在Node.js中在全局作用域中上下文始终是```Global```对象）另外，js允许使用**函数方法**改变上下文，这也是今天的主题。

- JavaScript有一大特点，就是函数存在**定义时上下文**和**运行时上下文**以及**上下文是可以改变的**

  + 定义时上下文：函数在定义的过程中，但代码还没执行，这时候的函数上下文一般指向```window```对象；

  + 运行时上下文：函数在运行时，this会根据不同情形来进行改变指向；

## 作用域

- js中的作用域可以分为两种类型：

 1. 全局作用域

 2. 局部作用域

- 作用域是指**变量的课访问性**

## call(thisArgs[，args...])

- call方法可以传递一个thisArgs参数和一个参数列表，thisArgs指定了函数在运行期的调用者，而参数列表则会被传入调用函数中。thisArgs的取值有一下4种情况：

  + 不传参、或者传null，undefined：函数中this指向window对象；

  + 传递另一个函数的函数名：函数中的this指向这个函数的引用；

  + 传递字符串、数值或布尔类型等基础类型：函数中的this指向其对应的包装对象，如String、Number、Boolean；

  + 传递一个对象：函数中的this指向这个对象；

  举个栗子：

  ```JavaScript
    function foo(a){
        console.log(this + ' ' + a);    // 输出函数a中的this对象
    }
    function bar(){}                // 定义函数bar
    var obj = {name：'andraw'};     // 定义对象obj
    
    foo.call();             // window undefined
    foo.call(null, 1);      // window 1
    foo.call(undefined, 1); // window 1
    
    foo.call(1, 1);     // Number 1
    foo.call('', 1);    // String 1
    foo.call(true, 1);  // Boolean 1
    
    foo.call(bar, 1);   // function bar(){} 1
    
    foo.call(obj);      // Object undefined
  ```
  
- 再举一个完整的栗子，来讲解一下call允许在一个对象上调用该对象没有定义的方法，并且这个方法可以访问本对象中属性：
  
  ```JavaScript
    var a = {
        name: 'Andraw-lin',     // 定义a的属性
        say: function(){        // 定义a的方法
            console.log('obj a');
        }
    }；
    
    function b(name){
        console.log(name);
        console.log(this.name);
        this.say();
    }
    
    b.call(a, 'test');
    
    // 输出结果为：
    //  test
    //  Andraw-lin
    //  obj a
  ```
  
## apply(thisArgs[，args...])

- apply和call两个方法的功能是一样的，唯一的区别是apply第二个参数的传递方式不同，apply的第二个参数必须是一个数组，而call允许传递一个参数列表。虽然apply接收的是一个参数数组，但在传递给调用函数时，却是以参数列表的形式传递，举个栗子：

  ```JavaScript
    function test(x, y, z){
        console.log(x, y, z);
    }
    
    test.apply(undefined, [1, 2, 3]);   // 1 2 3
  ```
  

## bind(thisArgs[，args...])

- bind是ES5新增的方法，它的参数和call类似，但又和call/apply有着显著的不同。

  调用call或apply都会自动执行对应的函数，而bind不会执行对应的函数，bind只是返回了函数的引用。
  
  ES5引入bind的真正目的是为了弥补call/apply的不足，由于call/apply会对目标函数自动执行，从而导致它无法在事件绑定函数中使用，因为事件绑定函数不需要我们手动执行，它是在事件被触发时由js内部自动执行的。而bind在实现改变函数this的同时又不会自动执行目标函数。
  
  举个栗子：
  
  ```JavaScript
    var obj = {name: 'Andraw-lin'};
    
    // 给document添加click事件监听，并绑定onClick函数
    // 通过bind方法设置onClick的this为obj，并传递参数为p1，p2
    document.addEventListener('click', onClick.bind(obj, 'p1', 'p2'), false);
    
    function onClick(a, b){
        console.log(this.name, a, b);
    }
  ```
  

## 应用场景一：继承

- js中没有继承的概念，如果一定要继承，call和apply可以实现这个功能，举个栗子：

  ```JavaScript
    function animal(name, weight){
        this.name = name;
        this.weight = weight;
    }
    function cat(){
        animal.call(this, 'cat', '50');
        this.say = function(){
            console.log(this.name + ' ' + this.weight);
        }
    }
    var test = new cat();
    test.say();     // cat 50
  ```
  
  上面的栗子可以看出，**animal的this指向cat的this，而cat中的this则指向的是test对象**
  
  
## 应用场景二：移花接木

- ArrayLike（类数组/伪数组）对象即拥有数组的一部分行为，它和JS原生的Array类似，但是它是自由构建的，它来自开发者对JavaScript对象的扩展，也就是说：**对于它的原型我们可以自由定义，而不会污染到JS原生的Array**。

  举个栗子：
  
  ```JavaScript
    function test(){
        // 先检测arguments是否为Array的实例
        console.log(arguments instanceof Array, Array.isArray(arguments));      // false false
        // 判断arguments是否有forEach方法
        console.log(arguments.forEach);     // undefined
        // 将数组中的forEach应用到arguments上
        Array.prototype.forEach.call(arguments, function(item){
            console.log(item);      // 1 2 3 4 
        });
    }
    test(1, 2, 3, 4);
  ```
  
  再举个栗子， 就是算一个数组中的最大值，因为数组是没有求最大值的方法，因此需要用到Math对象下获取最大值的方法：
  
  ```JavaScript
    var arr = [2, 3, 1, 5, 4];
    Math.max.apply(null, arr);          // 5
  ```