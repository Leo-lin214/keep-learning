---
layout: post
category: Andraw-lin
title: 5 Typical JavaScript Interview Exercises
summary: 5 Typical JavaScript Interview Exercises
---

## **5 Typical JavaScript Interview Exercises**
<br/>

### **Question 1: Scope**

观察以下代码, 然后看看输出结果是什么: 

```javascript
    (function(){
        var a = b = 1;
    })();
    console.log(b);
```

输出结果是: 1;

为什么 ?

这道题的本意就是想考察你的作用域理解程度, 在题目里面, a 变量使用 var 进行定义, 它就是一个局部变量, 而 b 变量则是一个全局变量, 所以在 IIFE 中能够模拟一个块级作用域, 因此如果强制在外面输出 a 变量时候, 会直接报错, 输出: a is not define; 

但是有一点需要注意的是, 上面的结论只是在非严格模式下回成立!!!如果对上面题目进行修改如下: 

```JavaScript
    'use strict';                   // 使用严格模式
    (function(){
        var a = b = 1;
    })();
    console.log(b);
```

这时候情况就会不一样了, 在严格模式下, 执行上面代码, 会直接报错: b is not define; 因为在严格模式下, b 依旧被看做的是一个局部作用域, 如果这时候想把 b 变量变成全局变量, 则需要在 IIFE 中把 b 变量变成 window.b 即可;


### **Question 2: Geate "native" methods**

在 String 对象上编写一个 repeatify 方法, 使能够实现如下效果:

```JavaScript
    console.log('hello'.repeatify(3));          // 输出结果为: hellohellohello
```

实现方法: 

```JavaScript
    String.prototype.repeatify = String.prototype.repeatify || function(length){
        var str = "";
        for(var i=0;i<length;i++){
            str += this;
        }
        return str;
    };
```

### **Question 3: Hoisting**

观察以下例子, 看看输出结果是什么: 

```javascript
    function test(){
        console.log(a);
        console.log(foo());
        
        var a = 1;
        function foo(){
            return 2;
        }
    }
    test();
```

输出结果为: undefined 和 2, 这就是常见的变量声明提升和函数声明提升问题, 其实上面的例子就相当于下面: 

```javascript
    function test(){
        var a;
        fucntion foo(){
            return 2;
        }
        console.log(a);
        console.log(foo());
        a = 1;
    }
```

看到上面的例子后, 你就会豁然开朗, 很明显知道输出结果;


### **Question 4: How this works in JavaScript**

再看看下面题目, 看看输出结果是多少: 

```javascript
    var name = Andraw;
    var obj = {
        name: "Tom",
        prop: {
            name: "Jenny",
            getFullName: function(){
                return this.name;
            }
        }
    };
    console.log(obj.prop.getFullName());
    
    var test = obj.prop.getFullName();
    console.log(test());
```

好明显, 懂得 this 指向的同学就会很容易得出结果为: Jenny 和 Andraw, 首先, 直接调用 obj.prop.getFullName() 方法时, 我们能够正确看到调用 getFullName() 这个方法的对象正是 obj.prop 这个对象, 因此 this 指向的就是 obj.prop 对象, 然后 this.name 输出的就是 Jenny , 而当把 obj.prop.getFullName() 赋给一个变量 test 时, 这时候 test 已经是一个方法 getFullName() , 这时候再执行它的时候, 即运行的是 window.getFullName() 方法, 所以 this 指向的就是 window 对象, 输出结果为: Andraw;


### **Question 5: Callback**

看看这道题目, 看看最后输出结果是多少: 

```javascript
    var items = document.querySelecttorAll(".items");
    for(var i = 0, max = iems.length; i < max.length; i++){
        var element = items[i];
        element.addEventListener('click', function(){
            console.log('you clicked on element number is ' + i);
        });
    }
```

这道题考察的就是想看看你有没有了解回调函数里面的异步调用过程, 其实简单点说就是 JS 是一个单线程过程, 所以在异步开始执行的时候, 主线程中的 for 循环已经执行完毕, 这时候的 i == 5 , 所以无论你怎么点击, 最后的结果都会是 5 ;