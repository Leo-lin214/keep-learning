# ES8 Summary

ES8 也是在 ES6 基础上继续进行拓展。

## Object.values()和Object.entries()

**在 ES6 中提及过，只有可迭代对象可以直接访问 keys、entries、values 三个方法**。**在 ES8 中在 Object 对象上实现了 values 和 entries 方法**，因为 Object 已经支持了 kes 方法，直接看🌰：

```javascript
var obj = {
  a: 1,
  b: 2
}
console.log(Object.keys(obj)) // ["a", "b"]
console.log(Object.values(obj)) // [1, 2]
console.log(Object.entries(obj)) // [["a", 1], ["b", 2]]
```

其中，entries 方法还能结合 Map 数据结构。

```javascript
var obj = {
  a: 1,
  b: 2
}
var map = new Map(Object.entries(obj))
console.log(map.get('a')) // 1
// Map { "a" => 1, "b" => 2 }
```

## 字符串追加

1. 字符串新增方法 String.prototype.padStart 和 String.prototype.padEnd，用于向字符串中追加新的字符串。看个🌰：

   ```javascript
   '5'.padStart(2) // ' 5'
   '5'.padStart(2, 'haha') // 'h5'
   '5'.padEnd(2) // '5 '
   '5'.padEnd(2, 'haha') // '5h'
   ```

   padStart 和 padEnd 对于格式化输出很有用。

2. 使用 padStart 方法举个例子，有一个不同长度的数组，往前面追加 0 来使得长度都为 10。

   ```javascript
   const formatted = [0, 1, 12, 123, 1234, 12345].map(num => num.toString().padStart(10, '0'))
   console.log(formatted)
   // ["0000000000", "0000000001", "0000000012", "0000000123", "0000001234", "0000012345"]
   ```

   使用 padEnd 也是同样的道理。

## Object.getOwnPropertyDescriptors

Object.getOwnPropertyDescriptors 直接返回一个对象所有的属性，甚至包括 get/set 函数。

ES2017 引入该函数主要目的在于方便将一个对象浅拷贝给另一个对象，同时也可以将 getter/setter 函数也进行拷贝。意义上和 Object.assign 是不一样的。

直接看个🌰：

```javascript
var obj = {
  a: 1,
  b: {
    a: 2
  },
  set c(temp) {
    this.d = temp
  },
  get c() {
    return this.d
  }
}
var newObj1 = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj))
console.log(newObj1)
// {
//  c: undefined
//  a: 1
//  b: {a: 2}
//  get c: ƒ c()
//  set c: ƒ c(temp)
//  __proto__: Object
// }
var newObj2 = Object.assign({}, obj)
console.log(newObj2)
// {
//  a: 1
//  b: {a: 2}
//  c: undefined
//  __proto__: Object
// }
```

在克隆对象方面，**Object.assign 只能拷贝源对象中可枚举的自身属性，同时拷贝时无法拷贝属性的特性（如 getter/setter）。而使用 Object.getOwnPropertyDescriptors 方法则可以直接将源对象的所有自身属性（是自身属性啊，不是所有可访问属性！）弄出来，再拿去复制**。

上面的栗子中就是配合原型，将一个对象中可访问属性都拿出来进行复制，弥补了 Object.getOwnPropertyDescriptors 方法短处（即无法获取可访问原型中的属性）。

**若只是浅复制自身属性，还可以结合 Object.defineProperties 来实现**。

```javascript
var obj = {
  a: 1,
  b: {
    a: 2
  },
  set c(temp) {
    this.d = temp
  },
  get c() {
    return this.d
  }
}
var newObj = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj))
conso.e.log(newObj)
// {
//  c: undefined
//  a: 1
//  b: {a: 2}
//  get c: ƒ c()
//  set c: ƒ c(temp)
//  __proto__: Object
// }
```

## 允许在函数参数最后添加逗号

听说是为了方便 git 算法更加方便区分代码职责。直接看个🌰。

```javascript
const sum = (a, b,) => a + b
```

## Async/Await

在 ES8 所有更新中，最有用的一个！！！

**async 关键字告诉 Javascript 编译器对于标定的函数要区别对待。当编译器遇到 await 函数时会暂停，它会等到 await 标定的函数返回的 promise，该 promise 要么 resolve 得到结果、要么 reject 处理异常。**

直接上一个栗子，对比一下使用 promise 和使用 async 区别。

```javascript
// 模拟获取userName接口
var getUser= userId
 => new Promise(resolve => {
   setTimeout(() => {
     resolve(userName)
   }, 2000)
 })
// 模拟获取userAge接口
var getUserAge = userName
 => new Promise(resolve => {
   setTimeout(() => {
     if(userName === 'Andraw') {
       resolve('24')
     } else {
       reject('unknown user')
     }
   }, 2000)
 })
// ES6的promise实现方式
function es6Fn(userId) {
  getUser(userId)
    .then(getUserAge)
    .then(age => {
      console.log(age)  
    })
}
// ES8的async实现方式
async function es8Fn(userId) {
  var userName = await getUser(userId)
  var userAge = await getUserAge(userName)
  console.log(userAge)
}
```

使用 ES8 的 async 异步编程更符合日常开发流程，而 ES6 的 promise 也是一个很好的使用， ES8 的 async 只是在 promise 基础上更上一层楼。

1. async 函数返回 promise。

   若想**获取一个 async 函数的返回结果，则需要使用 promise 的 then 方法**。

   接着拿上述 ES8 的 async 实现方式来举个例子。

   ```javascript
   async function es8Fn(userId) {
     var userName = await getUser(userId)
     var userAge = await getUserAge(userName)
     return userAge
   }
   // 获取es8Fn async函数返回结果
   es8Fn(1).then(userAge => { console.log(userAge) })
   ```

2. 并行处理

   我们知道，每次调用 es8Fn 函数时，都需要等到至少 4 秒时间，若调用 N 次，则需要等到 4N 秒。**使用 Promise.all 来并行处理，可以极大释放时间限制。**

   ```javascript
   async function newES8Fn() {
     var [a, b] = await Promise.all([es8Fn, es8Fn])
     return [a, b]
   }
   ```

   上述并行处理后，就可以很好滴避免多次调用而时间耗费的问题。

3. 错误处理

   对于 async/await 的错误处理，有三种方法可以处理，分别是在函数中使用 try-catch、catch 每一个 await 表达式、catch 整个 async-await 函数。

   - 在函数中使用 try-catch

     ```javascript
     async function es8Fn(userId) {
       try {
       	var userName = await getUser(userId)
         var userAge = await getUserAge(userName)
         return userAge 
       } catch(e) {
         console.log(e)
       }
     }
     ```

   - catch 每一个 await 表达式

     由于每一个 await 表达式都返回 Promise，对每一个表达式都进行 catch 处理。

     ```javascript
     async function es8Fn(userId) {
       var userName = await getUser(userId).catch(e => { console.log(e) })
       var userAge = await getUserAge(userName).catch(e => { console.log(e) })
       return userAge
     }
     ```

   - catch 整个 async-await 函数

     ```javascript
     async function es8Fn(userId) {
       var userName = await getUser(userId)
       var userAge = await getUserAge(userName)
       return userAge
     }
     es8Fn(1).then(userAge => { console.log(userAge) }).catch(e => { console.log(e) })
     ```


