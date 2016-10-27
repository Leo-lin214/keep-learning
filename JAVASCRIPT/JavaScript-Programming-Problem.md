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

### **Question 5: 时间格式化输出**

题目描述: 
按所给的时间格式输出指定的时间: 
格式说明--对于 2014.09.05 13:14:20, 有
yyyy: 年份, 2014 ;
yy: 年份, 14 ;
MM: 月份, 补满两位, 09 ;
M: 月份, 9 ;
dd: 日期, 补满两位, 05 ;
d: 日期, 5 ;
HH: 24制小时, 补满两位, 13 ;
H: 24制小时, 13 ;
hh: 12制小时, 补满两位, 01 ;
h: 12制小时, 1;
mm: 分钟, 补满两位, 14 ;
m: 分钟, 14 ;
ss: 秒, 补满两位, 20 ;
s: 秒, 20 ;
w: 星期, 为 ['日', '一', '二', '三', '四', '五', '六'] 中的某一个, 本 Demo 结果为五 ;

输入例子: 

```javascript
    formatDate(new Date(1409894060000), 'yyyy-MM-dd HH:mm:ss 星期w');
```

输出例子: 

```javascript
    2014-09-05 13:14:20 星期五 ;
```

答案: 

```javascript
    function formatDate(date, str){
        var obj = {
            yyyy: date.getFullYear(),
              yy: ("" + date.getFullYear()).slice(-2),
               M: date.getMonth() + 1,
              MM: ("0" + (date.getMonth() + 1)).slice(-2),
               d: date.getDate(),
              dd: ("0" + date.getDate()).slice(-2),
               H: date.getHours(),
              HH: ("0" + date.getHours()).slice(-2),
               h: date.getHours() % 12,
              hh: ("0" + (date.getHours() % 12)).slice(-2),
               m: date.getMinutes(),
              mm: ("0" + date.getMinutes()).slice(-2),
               s: date.getSeconds(),
              ss: ("0" + date.getSeconds()).slice(-2),
               w: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
        };
        return str.replace(/([a-z]+)/ig, function(a){
            return obj[a];
        });
    }
```

### **Question 6: Dom节点查找**

题目描述: 
实现函数 commonParentNode 函数, 使能够实现查找两个节点的最近的一个共同父节点, 可以包括节点自身 ;

输入描述:
oNode1 和 oNode2 在同一个文档中, 且不会为相同的节点 ;

答案: 

```javascript
    function commonParentNode(oNode1, oNode2){
        for(;oNode1;oNode1 = oNode1.parent){
            if(oNode1.contains(oNode2)){
                return oNode1;
            }
        }
    }
```

### **Question 7: 邮箱字符串**

题目描述: 
判断输入是否是正确的邮箱格式 

输入描述: 

```javascript
    isEmail(email) ;
```

输出描述: 

```javascript
    输出为 true 时, 表示格式正确 ;
    输出为 false 时, 表示格式不正确 ;
```

答案: 

```javascript
    function isEmail(email){
        var reg = /^[\w+\.]+@\w+([.]\w+)+$/;
        return reg.test(email);
    }
```

### **Question 8: 字符串字符统计**

题目描述: 

统计字符串中每个字符的出现频率, 返回一个 Object, 其中 Key 为统计字符, value
为出现频率: 

 - 不限制 Key 的顺序 ; 
 - 输入的字符串参数不会为空 ;
 - 忽略空白字符 ;

输入例子: 

```javascript
    count("Hello World") ;
```

输出例子: 

```javascript
    {h: 1, e: 1, l: 3, o: 2, w: 1, r: 1, d: 1} ;
```

答案: 

```javascript
    function count(str){
      var obj = {};
      str.replace(/\S/g, function(items){       // \S匹配任何非空字符
        !obj[items] ? obj[items] = 1 : obj[items]++;
      });
      return obj;
    }
```