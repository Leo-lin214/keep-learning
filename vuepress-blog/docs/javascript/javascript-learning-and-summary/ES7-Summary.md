# ES7 Summary

ES7 在 ES6 基础上仅仅新增了**求幂运算符（\*\*）**和 **Array.prototype.includes()** 方法。

需要注意的是，**在 ES6 中仅仅提供了字符串 includes 实现，而在 ES7 中则在数组中进行完善**。

## 求幂运算符（**）

**\*\* 运算符相当于 Math 对象中的 pow 求幂方法**，使用如下。

```javascript
2 ** 3 = 8
// 相当于
Math.pow(2, 3) // 8
```

\*\* 运算符和 +- 运算符用法一致，看个🌰：

```javascript
let num = 2
num **= 3
// 相当于 num = num ** 3
console.log(num) // 8
```

## Array.prototype.includes()

数组中实现的 includes 方法，**用于判断一个数组是否包含一个指定的值，如果包含就返回 true，否则返回 false**。

includes 和 indexOf 都是使用 === 来进行比较，但是**在 includes 中，NaN === NaN 返回的是 true，而 indexOf 则是返回 false**。

另外，**includes 和 indexOf 方法都是认为，+0 === -0**。


