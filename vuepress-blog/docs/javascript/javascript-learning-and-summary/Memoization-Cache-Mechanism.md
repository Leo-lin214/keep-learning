# Memoization缓存机制

在web开发中，我们都知道性能一直是重点关注的地方，而今天所讲的Memoization缓存技术是一个非常有用的技术手段来缓存函数的计算结果，主要用于处理冗长的查找或昂贵的递归计算。

## Memoization是什么

**Memoization**，中文翻译就是记忆化，意思就是利用一种缓存存储的特定输入计算输出的结果，基本原理就是如果你可以判断在一次运算之前，程序已经完成依赖一组特定的输入值的计算，那么计算结果可以直接返回，而不需要重复计算一次。

## Memoization的简单实现

在大多数Javascript实现的Memoization中，它们都有一个共通点：使用闭包技术，在函数内使用cache变量存储函数计算结果。下面就以zepto.js作者Thomas Funchs所写的一个简单易读的Memoization作为栗子：

```javascript
    Function.prototype.memoize = function() {
        let self = this,
            cache = {};
        return function(arg) {
            if(arg in cache) {
                console.log('缓存返回结果：' + cache[arg]);
                return cache[arg];
            } else {
                console.log('计算存进缓存：' + cache[arg]);
                return cache[arg] = self(arg);
            }
        }
    }
```

执行的时候

```javascript
    function add(num) {
        let sum = num + 1;
        return sum;
    }
    let fun = add.memoize();
    fun(1);                                 // 计算存进缓存：2
    fun(1);                                 // 缓存返回结果：2
```

## 多个参数下的Memoization实现

上面提到的Memoization的简单实现主要是处理单个参数的情况，那如果要处理多个参数的时候，我们又该如何处理？

道理很简单，当需要处理多个参数的时，需要把缓存的内容变成多维数据结构，或者把多个参数合并成一个唯一的Key作为一个索引。废话不多说，直接上栗子：

```javascript
    Function.prototype.memoize = function() {
        let self = this,
            cache = {};
        return function(x, y) {
            let value;
            cache[x] = cache[x] || {};
            if(x in cache && y in cache[x]) {
                value = cache[x][y];
                console.log("缓存返回结果：" + value);
            } else {
                value = self(x, y);
                cache[x][y] = value;
                console.log("计算存进缓存：" + value);
            }
            return value;
        }
    }
```

执行的时候：

```javascript
    function add(x, y) {
        return x + y;
    }
    var fun = add.memoize();
    fun(1, 2);                              // 计算存进缓存：3
    fun(1, 2);                              // 缓存返回结果：3
```


## Memozation的优点和不足

 1. 优点

    Memoization的好处是很好地减少了执行时间和潜在总体性能的改进，例如对于一些递归运算、重复同样的计算操作或者经常进行一些相同额重复的XHR调用，Memoization都会发挥出其极大的优势。
    
    

 2. 不足

    如果对于方法的输出变化随着时间的变化而变化，Memoization并不适合，例如抓取的数据定期更新。因此在选用Memoization时通常需要考虑你想做什么，当然它可以很好地缓存大量的查询结果，但这付出的成本是存储大型数据集（访问内存的速度）。