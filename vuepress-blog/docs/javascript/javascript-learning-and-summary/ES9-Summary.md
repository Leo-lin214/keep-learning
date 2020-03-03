# ES9 Summary

ES9(即ES2018) 主要新增了对象的扩展运算符 Rest 以及 Spread、异步迭代器、Promise支持 finally 方法、正则的扩展。

## 对象的扩展运算符 Rest 以及 Spread

如果使用过 Object.assign 方法合并对象，应该就很清楚。在 ES6 中，在数组中支持了 Rest 解构赋值和 spread 语法。

```javascript
// ES6中的Rest
var [a, ...b] = [1, 2, 3, 4, 5, 6]
console.log(a, b) // 1, [2, 3, 4, 5, 6]

// ES6中的spread
function sum(a, ...b) {
  console.log(a, b)
}
sum(1, 2, 3)
// 输出为：1, [2, 3]
```

**ES8 则在对象中支持了 Rest 解构赋值和 Spread 语法**。

```javascript
// rest解构赋值
var {x, ...y} = {x: 1, a: 2, b: 3}
console.log(x, y) // 1, { a: 2, b: 3 }

// spread语法，接着上面解构的值
var c = {x, ...y}
console.log(c) // {x: 1, a: 2, b: 3}
```

## 异步迭代器和异步生成器

在 ES6 中，如果一个对象具有 Symbol.iterator 方法，那该对象就是可迭代的。目前，只有 Set、Map、数组内部实现 Symbol.iterator 方法，因此都是属于可迭代对象。

```javascript
var set = new Set([1, 2, 3])
var setFn = set[Symbol.iterator]()
console.log(setFn) // SetIterator {1, 2, 3}
console.log(setFn.next()) // {value: 1, done: false}
console.log(setFn.next()) // {value: 2, done: false}
console.log(setFn.next()) // {value: 3, done: false}
console.log(setFn.next()) // {value: undefined, done: true}
```

默认的对象是不支持可迭代的，若实现了 Symbol.iterator 方法，那么它也是可迭代的。那么对象的 Symbol.iterator 方法如何实现的呢？

```javascript
var obj = {
  a: 1,
  b: 2,
  [Symbol.iterator]() {
    var allKeys = Object.keys(this)
    var i = 0
    return {
      next: () => {
      	return {
          value: this[allKeys[i++]],
          done: i > allKeys.length
        }
      }
    }
  }
}
var objFn = obj[Symbol.iterator]()
console.log(objFn) // {next: ƒ}
console.log(objFn.next()) // {value: 1, done: false}
console.log(objFn.next()) // {value: 2, done: false}
console.log(objFn.next()) // {value: undefined, done: true}
```

上面的实现，还可以再完善一丢。利用生成器

```javascript
var obj = {
  a: 1,
  b: 2,
  [Symbol.iterator]: function *() {
    for(let key in this) {
      yield this[key]
    }
  }
}
var objFn = obj[Symbol.iterator]()
console.log(objFn) // Generator {_invoke: ƒ}
console.log(objFn.next()) // {value: 1, done: false}
console.log(objFn.next()) // {value: 2, done: false}
console.log(objFn.next()) // {value: undefined, done: true}
```

由上面可以知道，**同步迭代器就是一个特殊对象，里面包含有 value 和 done 两个属性（即 {value, done}）**。那么异步迭代器又是什么？

**异步迭代器，和同步迭代器不同，不返回 {value, done} 形式的普通对象，而是直接返回一个 {value, done} 的 promise 对象**。

其中，**同步迭代器使用 Symbol.iterator 实现，异步迭代器使用 Symbol.asyncIterator 实现**。

```javascript
var obj = {
  a: 1,
	b: 2,
  [Symbol.asyncIterator]() {
    var allKeys = Object.keys(this)
    var i = 0
    return {
      next: () => {
        return Promise.resolve({
          value: this[allKeys[i++]],
          done: i > allKeys.length
        })
      }
    }
  }
}
var objAsyncFn = obj[Symbol.asyncIterator]()
console.log(objAsyncFn) // {next: ƒ}
console.log(objAsyncFn.next().then(res => {
  console.log(res) // {value: 1, done: false}
}))
console.log(objAsyncFn.next().then(res => {
  console.log(res) // {value: 2, done: false}
}))
console.log(objAsyncFn.next().then(res => {
  console.log(res) // {value: undefined, done: true}
}))
```

那么既然有了异步迭代器，就肯定有**异步生成器，专门用来生成异步迭代器的**。

```javascript
var obj = {
  a: 1,
	b: 2,
  [Symbol.asyncIterator]: async function *() {
    for(let key in this) {
      yield this[key]
    }
  }
}
var objAsyncFn = obj[Symbol.asyncIterator]()
console.log(objAsyncFn) // obj {<suspended>}
console.log(objAsyncFn.next().then(res => {
  console.log(res) // {value: 1, done: false}
}))
console.log(objAsyncFn.next().then(res => {
  console.log(res) // {value: 2, done: false}
}))
console.log(objAsyncFn.next().then(res => {
  console.log(res) // {value: undefined, done: true}
}))
```

另外，**异步迭代器和同步迭代器有一样东西很类似，就是使用 next() 后，是无法知道什么时候才会到最后一个值，在同步迭代器中，需要使用 for...of 进行遍历才能有效地处理迭代器中每一项值**。

**在异步迭代器中，同样支持遍历，不过是 for...await...of 遍历**。

```javascript
var obj = {
  a: 1,
	b: 2,
  [Symbol.asyncIterator]: async function *() {
    for(let key in this) {
      yield this[key]
    }
  }
}
(async function() {
  for await (var value of obj) {
    console.log(value)
  }
})()
```

 **for...await...of 只会在异步生成器中或异步函数中有效**。

## Promise支持 finally 方法

Promise 成功获取数据时使用 then 方法，处理异常时使用 catch 方法。但是**在某些情况下，我们不管成功还是存在异常，都希望 Promise 能够运行一些共同的代码，finally 就是处理这些事情的**。

```javascript
Promise.resolve(1).then(res => { console.log(res) }).finally(() => { console.lig('common code...') })
// 输出结果为
// 1
// common code...
```

## 正则的扩展

在正则表达式中，点 \. 可以表示任意单个字符。

```javascript
/foo.bar/.test('foo\nbar') // false
```

上面代码中，为了能够匹配任意字符，ES9 提出了 s 修饰符，使得 . 可以匹配任意单个字符。

```javascript
/foo.bar/s.test('foo\nbar') // true
```

还有几个暂不讨论。可自行了解哈


