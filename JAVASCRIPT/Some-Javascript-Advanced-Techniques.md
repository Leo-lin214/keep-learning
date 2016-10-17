---
layout: post
category: Andraw-lin
title: Some-Javascript-Advanced-Techniques
summary: Some-Javascript-Advanced-Techniques
---

## Javascript高级技巧总结

- [(一) 检测一个json对象是原生对象还是开发者自定义的对象](#一-检测一个json对象是原生对象还是开发者自定义的对象)
- [(二) 建立作用域安全的构造函数](#二-建立作用域安全的构造函数)
- [(三) 惰性载入函数](三-惰性载入函数)
- [(四) 函数绑定](四-函数绑定)
- [(五) Javascript防篡改对象](五-javascript防篡改对象)

### (一) 检测一个json对象是原生对象还是开发者自定义的对象

在任何值上调用Object原生的toString()方法, 都会返回一个[object NativeConstructorName]格式的字符串, 每个类在内部都有一个[[class]]属性, 这个属性中就指定了上述字符串中的构造函数名, 例如:

```javascript
var json = {
    "name" : "Andraw-lin",
    "age" : 21
}

//原生JSON对象
console.log(Object.prototype.toString.call(window.JSON));   //[object JSON]

//开发者自定义的json对象
console.log(Object.prototype.toString.call(json));  //[object Object]
```

### (二) 建立作用域安全的构造函数

```javascript
function Person(name, age){
    this.name = name;
    this.age = age;
}
var person = Person("Andraw-lin", 22);
```

创建实例时一般都要使用new操作符进行创建, 但如果没有使用new操作符, this将会执行window全局对象, 因此

```javascript
//紧接着上面代码
console.log(person.name);       //会报错
console.log(window.name);       //Andraw-lin
console.log(window.age);        //22
```

为了避免this指向window, 就需要创建一个作用域安全的构造函数

```javascript
function Person(name, age){
    if(this instanceof Person){
        this.name = name;
        this.age = age;
    }else{
        return new Person(name, age);
    }
}
var person = Person("Andraw-lin", 22);
console.log(window.name);       //""
console.log(person.name);       //"Andraw-lin"
```

### (三) 惰性载入函数

在解决浏览器之间行为的差异时, javascript代码里面经常会夹带这大量的if语句, 这将会影响到加载速度, 即使只有一个if语句的代码, 也肯定要比没有if语句的慢, 解决方法:

```javascript
// 代码例子
function createXHR(){
    if(typeof XMLHttpRequest != "undefined"){
        return new XMLHttpRequest();
    } else if(typeof ActiveXObject != "undefined"){
        if(typeof arguments.callee.activeXString != "string"){
            var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], i, len;
            for(i=0, len=versions.length; i<len; i++){
                try{
                    new ActiveXObject(versios[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                }catch(ex){
                    // 跳过
                }
            }
        }
        return new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error("No XHR object available");
    }
}
```

 - 在函数被调用时再处理函数
 
   ```javascript
    function createXHR(){
       if(typeof XMLHttpRequest != "undefined"){
            createXHR = function(){
                return new XMLHttpRequest();
            }
        } else if(typeof ActiveXObject != "undefined"){
            createXHR = function(){
                if(typeof arguments.callee.activeXString != "string"){
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], i, len;
                    for(i=0, len=versions.length; i<len; i++){
                        try {
                            new ActiveXObject(versios[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch(ex){
                            // 跳过
                        }
                    }
                }
                return new ActiveXObject(arguments.callee.activeXString);
            }
        } else {
            createXHR = function(){
                throw new Error("No XHR object available");
            }
        }
        return createXHR();
    }
   ```
   
   上面代码中if语句的每一个分支都会为createXHR变量赋值, 有效覆盖了原有的函数, 最后一步便是调用新赋的函数, 下一次调用createXHR()时候, 就会直接分配的函数, 有效避免了if语句判断;
   
   
 - 在声明函数时就指定适当的函数
 
   这种方式在第一次调用时就不会损失性能了, 而在代码首次加载时损失一点性能

   ```javascript
   var createXHR = (function(){
        function createXHR(){
           if(typeof XMLHttpRequest != "undefined"){
                return function(){
                    return new XMLHttpRequest();
                }
            } else if(typeof ActiveXObject != "undefined"){
                return function(){
                    if(typeof arguments.callee.activeXString != "string"){
                        var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], i, len;
                        for(i=0, len=versions.length; i<len; i++){
                            try {
                                new ActiveXObject(versios[i]);
                                arguments.callee.activeXString = versions[i];
                                break;
                            } catch(ex){
                                // 跳过
                            }
                        }
                    }
                    return new ActiveXObject(arguments.callee.activeXString);
                }
            } else {
                return function(){
                    throw new Error("No XHR object available");
                }
            }
        }
   })();
   ```
   
   结论就是, 惰性载入函数的优点就是只在执行分支代码时牺牲一点儿性能
   
   
### (四) 函数绑定

函数绑定要创建一个函数, 可以在特定的this环境中以指定参数调用另一个函数, 该技巧常常和回调函数与事件处理程序一起使用, 以便在将函数作为变量传递的同时保留代码执行环境

```javascript
var handler = {
    message: "Event handled",
    handleClick: function(event){
        console.log(this.message);
    }
};

var btn = document.getElementById("my-btn");
EventUtil.addHandler(btn, "click", handler.handleClick);
```
当按下按钮的时候, 就调用该函数, 本来应该打印出"Event handled", 实际上显示的却是undefined, 在个问题在于没有保存handler.handleClick()环境, 所以this指向这个按钮而不是handler(在IE8中, this指向window), 解决方法:

 - 闭包
 
   ```javascript
   var handler = {
        message: "Event handled",
        handleClick: function(event){
            console.log(this.message);
        }
    };
    
    var btn = document.getElementById("my-btn");
    EventUtil.addHandler(btn, "click", function(event){
        handler.handleClick(event);
    });
   ```
   
   
 - 使用原生bind()方法
 
   ```javascript
   var handler = {
        message: "Event handled",
        handleClick: function(event){
            console.log(this.message);
        }
    };
    
    var btn = document.getElementById("my-btn");
    EventUtil.addHandler(btn, "click", handler.handleClick.bind(handler));        //使用bind()方法只需要指向规定的对象即可
   ```

### (五) Javascript防篡改对象

 1. **第一级别: 不可扩展对象**

    不可扩展对象就是任何时候都不能向对象中添加属性和方法, 防止被别人意外修改对象
    
    ```javascript
    var person = {
        name: "Andraw"
    };
    
    console.log(Object.isExtensions(person));   //true, 可扩展
    
    Object.preventExtensions(person);           //防止向对象添加属性和方法
    
    console.log(Object.isExtensions(person));   //false, 不可扩展
    
    person.age = 22;
    console.log(person.age);                    //undefined
    ```
    
    

 2. **第二级别: 密封对象**

    密封对象就是在不可扩展对象的基础上, 不能删除属性和方法
    
    ```javascript
    var person = {
        name: "Andraw"
    }
    
    console.log(Object.isExtensions(person));   //true, 可扩展
    console.log(Object.isSealed(person));       //false, 可删除
    
    Object.seal(person);                        //不能删除属性和方法
    
    console.log(Object.isExtensions(person));   //false, 不可扩展
    console.log(Object.isSealed(person));       //true, 不可删除
    
    delete person.name;
    console.log(person.name);                   //undefined
    ```
    

 3. **冻结对象**

    冻结的对象既不可以扩展, 又是密封的, 而且对象数据属性不能修改
    
    ```javascript
    var person = {
        name: "Andraw"
    };
    
    console.log(Object.isExtensions(person));   //true, 可扩展
    console.log(Object.isSealed(person));       //false, 可删除
    console.log(Object.isFrozen(person));       //false, 可修改
    
    Object.freeze(person);
    
    console.log(Object.isExtensions(person));   //false, 不可扩展
    console.log(Object.isSealed(person));       //true, 不可删除
    console.log(Object.isFrozen(person));       //true, 不可修改
    
    person.name = "Tom";
    console.log(person.name);                   //"Andraw"
    ```