# Promise特性

在了解Promise之前,先要知道Promise是什么? 因此, 我们可以在控制台上打上console.dir(Promise)来看看Promise具体是什么东西

![](http://7xs89l.com1.z0.glb.clouddn.com/console.dirPromise.png)

可以看出Promise就是一个构造函数, 这时候可以尝试通过new方法创建一个Promise对象
   
```javascript
    var pro = new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("执行完成");
            resolve("Promise");
        }, 2000);
    });
```
在以上代码中, 我们执行了一个异步操作，也就是setTimeout，2秒后，输出“执行完成”，并且调用resolve方法。

但需要注意的是, 只是new了一个对象, 并没有调用它, 传进去的函数就已经执行了!!

因此我们使用Promise的时候一般是抱在一个函数中, 在需要的时候去运行这个函数, 例如:

```javascript
function run(){
    var pro = new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("执行完成");
            resolve("Promise");
        }, 2000);
    });
    return pro;
}
run();
```

## Promise的方法

 1. then()方法(结合resolve方法)

    上面提到过使用resolve方法, 那么resolve方法是用来干嘛的呢? 其实resolve方法就是调用了then()方法, 例如:
    
    ```javascript
    function run(){
        var pro = new Promise(function(resolve, reject){
            setTimeout(function(){
                console.log("执行完成");
                resolve("Promise");
            }, 2000);
        });
        return pro;
    }
    run().then(fucntion(data){
        console.log(data);
    })
    ```
    运行的结果是:
    
    ![](http://7xs89l.com1.z0.glb.clouddn.com/promisethenconsole1.png)
    
    这时候还不能看出Promise中then的优势何在, 现在就讲解一下使用then最大的好处就是能够链式操作, 现在举一个例子: 
    
    ```javascript
    function run1(){
        var pro = new Promise(function(resolve, reject){
            setTimeout(function(){
                console.log("执行完成run1");
                resolve("run1的数据");
            }, 2000);
        });
        return pro;
    }
    function run2(){
        var pro = new Promise(function(resolve, reject){
            setTimeout(function(){
                console.log("执行完成run2");
                resolve("run2的数据");
            }, 2000);
        });
        return pro;
    }
    function run3(){
        var pro = new Promise(function(resolve, reject){
            setTimeout(function(){
                console.log("执行完成run3");
                resolve("run3的数据");
            }, 2000);
        });
        return pro;
    }
    run1.then(function(data){
        console.log(data);
        return run2();
    }).then(function(data){
        console.log(data);
        return run3();
    }).then(function(data){
        console.log(data);
    });
    ```
    
    运行后的效果图为:
    
    ![](http://7xs89l.com1.z0.glb.clouddn.com/promisethenlinkconsole.png)
    
    输出的时候可以清晰看出, 每隔2秒即输出一个run运行Promise后的结果.
    
    另外, 在then方法里面, 你可以直接return你想要的数据而不是Promise对象, 在后面的then中就可以接收到数据了, 例如, 紧接着上面最后那句运行代码:
    
    ```javascript
    run1().then(function(data){
        console.log(data);
        return run2();
    }).then(function(data){
        console.log(data);
        return "哈哈";
    }).then(function(data){
        console.log(data);
    })
    ```
    
    输出的结果是: 
    
    ![](http://7xs89l.com1.z0.glb.clouddn.com/promisethenreturnconsole.png)
    
    

 2. reject()方法

    上面只提及了交接成功后的resolve()方法, 而没有提及到交接失败后的方法, 其实在Promise对象里面, 如果失败后调用了reject方法, 调用的时候会有两种方式:
    
    - 作为then()方法里面的第二个参数
    
      ```javascript
      run().then(function(data){
            console.log(data);
            console.log("resolved");
      }).then(function(reason, data){
            console.log(reason);
            console.log("rejected");
      })
      ```
 
    - 使用catch方法
    
      ```javascript
      run().then(function(data){
            console.log(data);
            console.log("resolved");
      }).catch(function(reason){
            console.log(reason);
            console.log("rejected");
      })
      ```
 
      catch方法除了这个作用以外, 还有另外一个作用: 在执行resolve的回调的时候, 如果抛出异常, 那么并不会报错卡死js, 而是会进到catch方法中
      
      

 3. all()方法

    使用Promise.all来执行, all接收一个数组参数, 里面的值最终都算返回Promise对象, 以上面举的三个run方法为例: 
    
    ```javascript
    Promise.all([run1(), run2(), run3()]).then(function(data){
      console.log(data);
    })
    ```
    
    输出的结果是: 
    
    ![](http://7xs89l.com1.z0.glb.clouddn.com/promiseallconsole1.png)
    
    可以看出三个异步操作都是并行的, 等它们执行完后才会进到then方法里面, 这时候, 三个异步操作返回的数据会放到then匿名函数的参数data里面