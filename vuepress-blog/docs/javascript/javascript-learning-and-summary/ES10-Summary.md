# ES10 Summary

ES10(即 ES2019) 新增功能相对比较少，都是一些性能的优化。

- [Array.prototype.flat和Array.prototype.flatMap](#10-1)
- [Object.fromEntries](#10-2)
- [字符串去除首尾空格](#10-3)
- [Symbol.prototype.description](#10-4)
- [可选的catch参数](#10-5)
- [Array.prototype.sort方法由快排转换为Timsort](#10-6)
- [函数支持toString方法](#6-7)

## Array.prototype.flat和Array.prototype.flatMap

在日常开发中，我们常遇到一个问题，那就是将`[1, [1, 2], [1, [2, 3]]]`扁平化为`[1, 1, 2, 1, 2, 3]`。

以往的经历告诉我们，需要使用第三方库 lodash 来处理，导致了不必要的麻烦，为此，**ES10 直接为数组提供了 flat 方法来实现扁平化数组**。

```javascript
var arr = [1, [1, 2], [1, [2, 3]]]
console.log(arr.flat(2)) // [1, 1, 2, 1, 2, 3]
```

**flat 方法中参数，表示的是扁平化的层数**。

另外的方法 flatMap，其实就是数组的 flat 方法和 map 方法结合。

```javascript
[1, 2, 3].map(x => [x * x]) // [[1], [4], [9]]
[1, 2, 3].flatMap(x => [x * x]) // [1, 4, 9]
```

## Obejct.fromEntries

Object.fromEntries 方法和 ES6 中的 Object.entries 功能刚好相反，**Object.entries 是获取一个对象的键值对，而 Object.fromEntries 则是将键值对转化为对象**。

```javascript
Object.fromEntries([["a", 1], ["b", 2]]) // {a: 1, b: 2}
Object.entries({a: 1, b: 2}) // [["a", 1], ["b", 2]]
```

## 字符串去除首尾空格

ES10 为字符串提供了 trimStart 和 trimEnd 方法，用于去除首尾空格。

```javascript
'  123'.trimStart() // 123
'123  '.trimEnd() // 123
```

## Symbol.prototype.description

定义 Symbol 类型时，可传入一个字符串作为标志，若想获得该字符串，ES6 并没有提供方法，而 **ES10 则提供了 description 属性用于获取 Symbol 的描述信息**。

```javascript
var symbol = Symbol('haha')
console.log(symbol.description) // haha
```

## 可选的catch参数

在 ES10 之前，使用 try...catch 块时，若不给 catch 函数传递参数，会报错。

ES10 则直接将 catch 参数作为可选。

```javascript
// ES10前
try {
  // ...
} catch(e) {
  console.log(e)
} 
// ES10后
try {
  // ...
} catch {
  // ...
}
```

## Array.prototype.sort方法由快排转换为Timsort

在 ES10 前，数组的 sort 方法默认采取的是快排，但会存在不稳定性，为此，直接转为使用 Timsort。可自行了解一下。

**Timsort 就是将插入排序和归并排序进行合并起来得到的好算法**。

## 函数支持toString方法

ES10 支持函数直接以字符串的形式打印出来。

```javascript
var sum = (a, b) => a + b
console.log(sum.toString()) // (a, b) => a + b
```


































