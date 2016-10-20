---
layout: post
category: Andraw-lin
title: JavaScript Programming Problem
summary: JavaScript Programming Problem
---

## **JavaScript Programming Problem**
<br/>

### **Question 1: 修改 this 指向**

题目描述:　
封装函数 f，使 f 的 this 指向指定的对象 ;

输入例子: 

```javascript
bindThis(function(a, b){return this.test + a + b}, {test: 1})(2, 3);    // 输出结果为 6
```

答案: 

```javascript
    // 可使用 call()
    function bindThis(f, oTarget){
        return function(a, b){
            return f.call(oTarget, a, b);
        }
    }
    // 或者使用 apply()
    function bindThis(f, oTarget){
        return function(){
            return f.apply(oTarget, arguments);
        }
    }
    // 或者使用 bind()
    function bindThis(f, oTarget){
        return function(a, b){
            return f.bind(oTarget)(a, b);
        }
    }
```

### **Question 2: 深度克隆**

题目描述: 
封装函数 myClone , 使能够实现深度克隆 ;

答案: 

```javascript
    function myClone(obj){
        var foo;
        if(obj instanceof Array){               // 判断是否为数组对象
            foo = [];
            var i = obj.length;
            while(i--){
                foo[i] = myClone(obj[i]);
            }
            return foo;
        }else if(obj instanceof Object){        // 判断是否对象
            foo = {};
            for(var k in obj){
                if(obj.hasOwnProperty(k)){
                    foo[k] = myClone(obj[k]);
                }
            }
            return foo;
        }else{
            return obj;
        }
    }
```

### **Question 3: 数组去重**

题目描述: 
为 Array 对象添加一个去除重复项的方法 ;

输入例子: 

```javascript
    [false, true, undefined, null, NaN, 0, 1, {}, {}, 'a', 'a', NaN].myClear() ;
```

输出结果:

```javascript
    [false, true, undefined, null, NaN, 0, 1, {}, {}, 'a'] ;
```

答案: 

```javascript
    Array.prototype.myClear = function(){
        var arr = [],
            tag = true;
        for(var i=0; i<this.length; i++){
            if(this[i] != this[i]){                 // 判断是否为 NaN
                if(tag){
                    arr.push(this[i]);
                    tag = false;
                }
            }else{
                if(arr.indexOf(this[i]) == -1){
                    arr.push(this[i]);
                }
            }
        }
        return arr;
    }
```

### **Question 4: 获取URL参数**

题目描述: 
获取 url 中的参数
1. 指定参数名称，返回该参数的值 或者 空字符串 ;
2. 不指定参数名称，返回全部的参数对象 或者 {} ;
3. 如果存在多个同名参数，则返回数组 ;

输入例子: 

```javascript
    getUrlParam('http://www.Andraw-lin.io?key=1&key=2&key=3&test=4#haha', 'key') ;
```

输出结果: 

```javascript
    [1, 2, 3] ;
```

答案: 

```javascript
    function getUrlParams(url, key){
        var result = {};
        url.replace(/\??(\w+)=(\w+)&?/g, function(a, k, v){     // a为匹配项, k为第一个捕获组的匹配项, v为第二个捕获组的匹配项
             if(result[k] !== undefined){
                var t = result[k];
                result[k] = [].concat(t, v);
             }else{
                result[k] = v;
             }
        });
        if(key === undefined){
            return result;
        }else{
            return result[key] || "";
        }
    }
```