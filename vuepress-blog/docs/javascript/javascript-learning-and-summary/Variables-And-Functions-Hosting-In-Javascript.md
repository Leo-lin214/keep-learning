# 变量提升和函数提升

今天在讲解变量和函数提升之前, 先看一下下面几个例子: 

```javascript
    var name = "Andraw";
    console.log(name);        
```

对于上面这个问题, 毫无疑问, 弹出的依然是 " Andraw ", 这时候, 再看下面这个例子: 

```javascript
    var name = "Andraw";
    (function(){
        console.log(name);
    })()
```

对于上面的问题, 对于熟悉 JS 中块级作用域的理解问题的同学, 可以很容易给出答案就是输出 " Andraw ". 因为在JS中, 是没有块级作用域的, 这时候如果需要一个块级作用域时, 就要使用 IIFE 即自执行函数来创建一个虚拟的会计作用域, 这时候再看下面这个例子: 

```javascript
    var name = "Andraw";
    (function(){
        console.log(name);
        var name = "Tom";
    })()
```

对于上面的问题, 有些同学可能会觉得输出结果应该为 " Andraw ", 但也会有部分同学也会觉得输出应该为 " Tom ", 这时候我会跟你们说, 最后的结果是 " undefined ", 这是为什么 ? 那就是涉及到我们要讲的一个在 JS 中很重要的知识点, 变量提升. 因为上面我们知道在块级作用域里面访问变量的时候, 会先在自己本作用域内寻找, 先寻找有没有这个变量, 如果有, 就会直接输出本作用域内的变量的值, 如果没有, 就会沿着作用域链往上进行询问, 直到询问到 Window 对象为止. 上面代码中, 因为在执行到 console.log(name) 之前, 就已经执行了 var name; 声明过程, 这就是所谓的变量提升问题, 上面代码相当于如下: 

```javascript
    var name = "Andraw";
    (function(){
        var name;
        console.log(name);
        name = "Tom";
    })()
```

更改后可以很容易看出, 变量提升后的变量会先定义变量, 所以才会输出 undefined .

下面再举几个跟变量提升的问题, 如下: 

```javascript
    var name = "Andraw";
    console.log(name);                   // 输出为: Andraw
    if(true){
        console.log(name);              // 输出为: Andraw
        var name = "Tom";
        console.log(name);              // 输出为: Tom
    }
    console.log(name);                  // 输出为: Tom
```

上面提到过, 在 JS 中是没有块级作用域的, 所以这时候, 只能通过 IIFE 即自执行函数来实现虚拟的块级作用域, 所以上面更改 name 后, 就相当于更改了全局的 name 值, 如果把上面代码使用自执行函数, 会得到你想要的结果: 

```javascript
    var name = "Andraw";
    console.log(name);                  // 输出为: Andraw
    (function(){
        console.log(name);              // 输出为: undefined
        var name = "Tom";
        console.log(name);              // 输出为: Tom
    })();
    console.log(name);                  // 输出为: Andraw
```

接下来, 我们就来谈谈函数提升又是怎么一回事 ? 

首先, 在 JS 中, 声明函数有两种方法: 一种是函数表达式, 另外一种是函数声明方式, 这时候, 我们要注意的是: 只有函数声明形式才能被提升 ! ! !

以下就是使用定义函数的两种方式来测试一下函数提升的问题: 

- 函数声明方式【函数提升成功】:

  ```javascript
    getName();                          // 输出为: Andraw
    function getName(){
        console.log("Andraw");      
    }
  ```
  
- 函数表达式方式【函数提升失败】:

   
  ```javascript
    getName();                          // 报错
    var getName = function(){
        console.log("Andraw");
    }
  ```
   
   执行上面的代码的时候, 会报错: TypeError: getName is not a function;
 