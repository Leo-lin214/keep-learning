---
layout: post
category: Andraw-lin
title: Asynchronous Programming Method For Javascript
date: 2016-04-27
summary: Asynchronous Programming Method For Javascript
---

## **Javascript的异步编程方法**
<br/>

Javascript语言将任务的执行模式分成两种: 同步和异步, 接下来就说说Javascript的异步编程方法.

### **(一) setTimeout方法(回调函数)**

现在有两个函数f1和f2, 代码如下:

```javascript
f1();
f2();
```

可以看出, f2函数会等待f1函数执行完后才执行, 这时候如果f1函数耗时很长, 页面就会卡死在一个屏幕上, 很多东西都无法进行工作, 现在可以考虑一下使用异步的方式来减少上面的耗时工作, 例如:

```javascript
function f1(callback){
    setTimeout(function(){
        // f1的任务代码
        
        callback();
    }, 1000);
}
//调用f1, 其中f2作为参数调用
f1(f2);
```

### **(二) 事件监听**

另外一种实现异步的方法就是使用事件监听机制, 这时候, 任务的执行不取决于代码的顺序, 而取决于某个事件是否发生, 这里就使用jQuery方法: 

```javascript
//先为f1绑定一个事件
f1.on('done', f2);

function f1(){
    setTimeout(function(){
        //f1的任务代码
        
        //直接触发done事件
        f1.trigger('done');
    }, 1000);
}
```


### **(三) Promise对象**

Promise对象有一个then方法, 允许指定回调函数, 比如, 在f1中指定回调函数f2

先使用jQuery方法实现

```javascript
function f1(){
    var pro = $.Deferred();
    setTimeout(function(){
        //f1的任务代码
        
        pro.resolve();
    }, 500);
    
    return pro.promise;
}

f1().then(function(data){
    f2();
})
```

也可以使用ES6的方法实现:

```javascript
function f1(){
    var pro = new Promise(function(resolve, reject){
        setTimeout(function(){
            //f1的任务代码
            
            resolve();  
        }, 500);
        return pro;
    })
}

f1().then(function(data){
    f2();
})
```