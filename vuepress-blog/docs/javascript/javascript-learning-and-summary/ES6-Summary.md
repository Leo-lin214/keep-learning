# ES6 Summary

在`ES6`中，可以说是整个`Javascript`改版中最大的一版，下面就来看看主要包含哪些内容。

## 块级作用域绑定（var、let、const）

1. 在 Javascript 中**不存在块级作用域**，只存在**全局作用域**和**函数作用域**。

2. 使用 var 声明的变量不管在哪声明，都会**变量提升**到当前作用域的最顶部。看个🌰：

   ```javascript
   function test() {
     console.log(a) // 不会报错，直接输出undefined
     if(false) {
       var a = 1
     }
   }
   test()
   
   // 相当于
   function test() {
     var a
     console.log(a)
     if(false) {
       a = 1
     }
   }
   test()
   ```

   另外，定义和声明是两码事，如果变量都还没定义就使用时，就会报错（xxx is not defined）。

3. let 和 const 都能够**声明块级作用域**，用法和 var 是类似的，**let 和 const 都是不会变量提升**。看个🌰：

   ```javascript
   function test() {
     if(false) {
       console.log(a) // 报错，a is not defined（也是传说中的临时性死区）
       let a = 1
     }
   }
   test()
   ```

   **let 和 const 必须先声明再访问**。

   所谓临时性死区，就是在当前作用域的块内，在声明变量前的区域（**临时性死区只有 let 和 const 才有**）。看个🌰：

   ```javascript
   if(false) {
     // 该区域便是临时性死区
     let a = 1
   }
   ```

4. **const 声明变量时必须同时赋值**，并且不可更改。

5. 在全局作用域中使用 var 声明的变量会存储在 window 对象中。而使用 let 和 const 声明的变量则只会覆盖 window 对象中同名的属性，而不会替换。看个🌰：

   ```javascript
   window.a = 1
   let a = 2
   
   console.log(a) // 2
   console.log(window.a) // 1
   ```

   **let 和 const 声明的变量会存在一个单独的`Script`块作用域中**（即[[Scopes]]作用域中能找到）。

   ```javascript
   // 接着上面列举的栗子
   function aa() {}
   console.dir(aa)
   // 你会发现在输出内容中[[Scopes]]，会存在两个作用域，一个是Script，一个是Global
   [[Scopes]]: Scopes[2]
   0: Script {a: 2}
   1: Global {parent: Window, opener: null, top: Window, length: 1, frames: Window, …}
   ```

## 字符串和正则表达式

1. 支持 UTF-16（含义是任何一个字符都适用两个字节表示），其中方法如下：

   - codePointAt：返回参数字符串中给定位置对应的码位，返回值为整数。
   - fromCodePoint：根据指定的码位生成一个字符。
   - normalize：提供Unicode的标准形式，传入一个可选字符串参数，指明应用某种Unicode标准形式。

2. 字符串中新增的方法有：

   - includes(str, index)：检测字符串指定的可选索引中是否存在参数文本。

   - startsWith(str, index)：检测字符串头部是否有指定的文本。

   - endsWith(str, index)：检测字符串尾部是否有指定的文本。

   - repeat(number)：接受一个整数，重复对应字符串整数次。

     ```javascript
     console.log('aa'.repeat(2)) // aaaa
     ```

3. 当给正则表达式添加 u 字符时，表示从编码单元操作模式切换为字符模式。

4. 模板字符串支持多行文本、模板中动态插入变量、模板子面量方法使用。

   - 多行文本。

     ```javascript
     `1
     
     2`
     ```

   - 模板中动态插入变量。

     ```javascript
     let a = 1
     console.log(`${a} haha`) // 1 haha
     ```

   - 模板子面量方法。

     ```javascript
     function aa(a, ...b) {
       console.log(a, b)
     }
     let a = 1
     aa`hehe ${a} haha`
     // 输出为：
     // ["hehe ", " haha", raw: ["hehe ", " haha"]] [1]
     ```

     其中参数 a 表示模板字符串中静态字符。参数 b 表示模板动态变量。

## 函数

1. **支持默认参数，默认参数不仅可以为字符串、数字、数组或对象，还可以是一个函数**。看个🌰：

   ```javascript
   function sum(a = 1, b = 2) {
     return a + b
   }
   sum()
   ```

   **参数默认值不能被 arguments 识别**，看个🌰：

   ```javascript
   function sum(a = 1, b = 2) {
     console.log(arguments)
   }
   sum() // {}
   sum(3, 6) // {"0": 3, "1": 6}
   ```

   **默认参数同样存在临时性死区**，看个🌰：

   ```javascript
   // 在初始化a时，由于b还没被声明，因此无法直接将b赋值给a
   function aa(a = b, b) {
     return a + b
   }
   ```

2. **支持展开运算符(...)**，其作用是解构数组和对象。看个🌰：

   ```javascript
   // 展开数组或对象
   var a1 = [1, 2]
   var a2 = {a: 1}
   console.log(...a1) // 1 2
   console.log({...a2}) // {a: 1}
   
   // rest参数
   function aa(...obj) {
     console.log(obj)
   }
   aa(a1) // 1 2
   aa(a1, a2) // [[1, 2], {a: 1}]
   ```

3. 支持箭头函数。箭头函数和普通函数的区别有：

   - **箭头函数木有 this**，this 指向的是定义该箭头函数所在的对象。
   - **箭头函数没有 super**。
   - **箭头函数没有 arguments**。
   - **箭头函数内部不存在 new.target 绑定（构造函数存在）**。并且箭头函数中不能使用 new 关键字。
   - **箭头函数不存在原型**。

4. **支持尾调用优化**。（调用一个函数时都会生成一个函数调用栈，尾调用就可以很好滴避免生成不必要的尾调用[阮一峰的尾调用优化讲解](http://www.ruanyifeng.com/blog/2015/04/tail-call.html)）

   只有满足以下三个条件时，引擎才会帮我们做好尾调用优化。

   - 函数不是闭包。
   - 尾调用是函数最后一条语句。
   - 尾调用结果作为函数返回。

   看个🌰：

   ```javascript
   // 符合尾调用优化情况
   function aa() {
     return bb()
   }
   
   // 无return不优化
   function aa() {
     bb()
   }
   // 不是直接返回函数不优化
   function aa() {
     return 1 + bb()
   }
   // 最后一条语句不是函数不优化
   function aa() {
     const cc = bb()
     return cc
   }
   // 闭包不优化
   function aa() {
     function bb() {
       return 1
     }
     return bb()
   }
   ```

   需要知道的是，**递归都是很影响性能的，但是有了尾调用后，递归函数的性能将得到有效的提升**。

   ```javascript
   // 斐波那契数列
   // 常做方案
   function fibonacci(n) {
     if(n === 0 || n === 1) return 1;
     return fibonacci(n-1) + fibonacci(n-2);
   }
   
   // 尾递归优化，其中pre是第一项的值，next作为第二项的值
   function fibonacci(n, pre, next) {
     if (n <= 1) return next
     return fibonacci(n - 1, next, pre + next)
   }
   ```

## 对象的扩展

1. **对象方法和属性支持简写，以及对象属性支持可计算**。看个🌰：

   ```javascript
   const id = 1
   const obj = {
     id,
     [`test${id}`]: 1,
     printId() {
       return this[`test${id}`]
     }
   }
   ```

2. Object 新增了方法如下：

   - **Object.is**。判断两个值是否相等。

     ```javascript
     console.log(Object.is(NaN, NaN)) // true
     console.log(Object.is(+0, -0)) // false
     console.log(Object.is(5, "5")) //false
     ```

   - **Object.assign**。浅拷贝一个对象，相当于一个 Mixin 功能。

     ```javascript
     const obj = {a: 1, b: 2}
     const newObj = Object.assign({...obj, c: 3})
     console.log(newObj) // {a: 1, b: 2, c: 3}
     ```

3. 对象支持同名属性，不过后面的属性会覆盖前面同名的属性。看个🌰：

   ```javascript
   const obj = {
     a: 1,
     a: 2
   }
   console.log(obj) // {a: 2}
   ```

4. **遍历对象时，默认都是数字属性按顺序提前，接着就是首字母排序**。看个🌰：

   ```javascript
   const obj = {
     name: 'haha',
     1: 2,
     a: 1,
     0: 'hehe'
   }
   for(var key in obj) {
     console.log(key)
   }
   // 输出顺序为
   // 0
   // 1
   // name
   // a
   ```

5. 支持实例化后的对象改变原型对象，使用方法`Object.setPrototypeOf()`。

   ```javascript
   var parent1 = {a: 1}
   var child = Object.create(parent1)
   console.log(child.a) // 1
   var parent2 = {b: 2}
   child = Object.setPrototypeOf(child, parent2)
   console.log(child.a, child.b) // undefined, 2
   ```

## 解构

1. 解构的定义是，**从对象中提取出更小元素的过程，即对解构出来的元素进行重新赋值**。

2. 对象解构必须是同名的属性。看个🌰：

   ```javascript
   var obj = {
     a: 1,
     b: 2
   }
   var a = 3, b = 3;
   ({a, b} = obj)
   console.log(a, b) // 1, 2
   ```

3. 数组解构可以有效地处理交换两个变量的值。

   ```javascript
   var a = 1, b = 2;
   [a, b] = [b, a]
   console.log(a, b) // 2, 1
   ```

   数组解构还可以按需取值，看个🌰：

   ```javascript
   var arr = [[1, 2], 3]
   var [[,b]] = arr
   console.log(b) // 2
   ```

4. 混合解构就是对象和数组解构结合，看个🌰：

   ```javascript
   var obj = {
     a: 1,
     b: [1, 2, 3]
   };
   ({a, b: [...arr]} = obj)
   console.log(a, arr) // 1, [1, 2, 3]
   ```

5. 解构参数就是直接从参数中获取相应的参数值。看个🌰：

   ```javascript
   function aa({a = 1, b = 2} = obj) {
     console.log(a, b)
   }
   aa({a: 3, b: 6}) // 3, 6
   ```

## Symbol

1. Symbol 是一种特殊的、不可变的数据类型，可作为对象属性的标识符使用，也是一种原始数据类型。

2. Symbol 的语法格式为：

   ```javascript
   Symbol([desc]) // desc是一个可选参数，用于描述Symbol所用
   ```

   创建一个 Symbol，如下：

   ```javascript
   const a = Symbol()
   const b = Symbol('1')
   console.log(a, b) // Symbol(), Symbol('1')
   ```

   **创建 Symbol 不能使用 new**。

3. Symbol 最大的用处在于创建对象一个唯一可计算的属性名。看个🌰：

   ```javascript
   const obj = {
     [Symbol('name')]: 12,
     [Symbol('name')]: 13
   }
   console.log(obj) // {Symbol(name): 12, Symbol(name): 13}
   ```

   有效地避免命名冲突问题。

4. Symbol 不支持强制转换为其他类型。

5. 在 ES6 中提出一个 `@@iterator`方法，所有支持迭代的对象（如数组、Set、Map）都要实现。其中**`@@iterator`方法的属性键为`Symbol.iterator`而非字符串**。**只要对象定义有`Symbol.iterator`属性就可以用`for...of`进行迭代**。

   ```javascript
   // 判断对象是否实现Symbol.iterator属性，就可以判断是否可以使用for...of进行迭代
   if(Symbol.iterator in obj) {
     for(var n of obj) console.log(n)
   }
   ```

6. Symbol 支持全局共享机制，使用 Symbol.for 进行注册，使用 Symbol.keyFor 进行获取。看个🌰：

   ```javascript
   // Symbol.for中参数可为任意类型
   let a = Symbol.for(12)
   console.log(Symbol.keyFor(a), typeof Symbol.keyFor(a)) // '12', string
   ```

   Symbol.keyFor 最终获取到的是一个字符串值。

7. Symbol 可作为类的私有属性，**使用 Object.keys 或 Object.getOwnPropertyNames 方法都无法获取 Symbol 的属性名**。**只能使用 for...of 或 Object.getOwnPropertySymbols 方法获取**。看个🌰：

   ```javascript
   var obj = {
     [Symbol('name')]: 'Andraw-lin',
     a: 1
   }
   console.log(Object.keys(obj)) // ["a"]
   console.log(Object.getOwnPropertySymbols(obj)) // [Symbol(name)]
   ```

## Set和Map

1. Set 常用于检查对象中是否存在某个键值，Map 则常用于获取已存的信息。

2. Set 是有序列表，含有相互独立的非重复值。支持的属性和方法如下：

   - size。返回 Set 对象中元素个数。

   - add(value)。在 Set 对象尾部添加一个元素。

   - entries()。**返回 Set 对象中[值，值]形式**，看个🌰：

     ```javascript
     var a = new Set([1, 2, 3])
     for(var [b, c] of a.entries()) {
       console.log(b, c)
     }
     // 输出结果为：
     // 1 1
     // 2 2
     // 3 3
     ```

   - forEach(callback)。用于遍历 Set 集合。

   - has(value)。判断 Set 集合中是否存在有指定的值。

3. Set 集合的特点是没有下标，没有 Key。**Set 和 Array可以相互转换**，如下：

   ```javascript
   // 数组转成Set
   const arr = [1, 2, 3]
   console.log(new Set(arr))
   
   // Set转成数组
   const se = new Set([1, 2, 3])
   console.log([...se])
   ```

4. **Set 集合是一个强引用，只要 new Set 实例化的引用存在，就不会释放内存**。若定义一个 DOM 元素的 Set 集合，然后在某个 js 中引用了该实例，当页面跳转时，并不会立马释放内存，因为引用还在。**WeakSet 就是专门用于释放强引用的**。

   WeakSet 和 Set 区别：

   - WeakSet 对象中只能存放对象类型，不能存放原始数据类型。而 Set 对象则可以。
   - WeakSet 对象中存储的对象值是弱引用的，若无其他变量或属性引用该对象值，则这个对象值会被当成垃圾回收掉。而 Set 对象则是存储强引用。
   - WeakSet 对象中存储的值是无法被枚举。而 Set 对象则可以枚举。

5. Map 是存储键值对的有序列表，key 和 value 支持所有数据类型。**对比 Set 集合，Map 集合多了 set 方法和 get 方法**。看个🌰：

   ```javascript
   var m = new Map()
   m.set('name', 'haha')
   m.set('year', '1999')
   console.log(m.get('name'), m.get('year')) // haha, 1999
   ```

   支持对象作为 key 值，看个🌰：

   ```javascript
   const key = {}
   m.set(key, 'hehe')
   m.get(key) // 'hehe'
   ```

6. 和 WeakSet 一样，也会有 WeakMap 存在，专门针对弱引用。看个🌰：

   ```javascript
   var map = new WeakMap()
   var key = document.querySelector('.header')
   map.set(key, 'DOM')
   map.get(key) // 'DOM'
   key.parentNode.removeChild(key)
   key = null
   ```

##  迭代器(Iterator)和生成器(Generator)

1. **迭代器是一种特殊对象，每一个迭代器对象都有一个 next()，该方法返回一个对象，包括了 value 和 done 属性**。使用 ES5 模拟实现迭代器如下：

   ```javascript
   function createIterator(items) {
     var i = 0
     return {
       next() {
         var done = (i >= items.length)
         var value = i < items.length ? items[i++] : undefined
         return { done, value }
       }
     }
   }
   var arr = createIterator([1, 2])
   console.log(arr.next()) // { done: false, value: 1 }
   console.log(arr.next()) // { done: false, value: 2 }
   console.log(arr.next()) // { done: true, value: undefined }
   ```

2. **生成器就是一个函数，用于返回迭代器的**。使用 * 号声明的函数即为生成器函数，同时需要**使用 yield 控制进程**。看个🌰：

   ```javascript
   function *createIterator() {
     console.log(1)
     yield 1
     console.log(2)
     yield 2
     console.log(3)
   }
   var a = createIterator() // 执行后并不会输出任何东西
   console.log(a.next()) // 先输出1，再输出{ value: 1, done: false }
   console.log(a.next()) // 先输出2，再输出{ value: 2, done: false }
   console.log(a.next()) // 先输出3，再输出{ value: undefined, done: true }
   ```

   总结一下，**迭代器执行 next() 方法时，只会执行前面到 yield 间的代码，后面代码都会被终止**。

   同样地，在 for 循环中使用迭代器，遇到 yield 时都会终止进程。看个🌰：

   ```javascript
   function *createIterator(items) {
     for(let i = 0; i < items.length;  i++) {
       yield items[i]
     }
   }
   const a = createIterator([1, 2, 3]);
   console.log(a.next()); //{value: 1, done: false}
   ```

3. yield 只能在生成器函数内使用。

4. 生成器函数还可以使用匿名函数形式创建，看个🌰：

   ```javascript
   const createIterator = function *() {
     // ...
   }
   ```

5. 凡是**通过生成器得到的迭代器，都是可迭代的对象（即可迭代对象具有 Symbol.iterator 属性）**，可使用 for...of 进行迭代。看个🌰：

   ```javascript
   function *createIterator() {
     yield 1
     yield 2
   }
   var obj = createIterator()
   for(var val of obj) {
     console.log(val)
   }
   // 输出为
   // 1
   // 2
   ```

   **可迭代对象可访问 Symbol.iterator 直接得到迭代器**，看下面

   ```javascript
   function *createIterator() {
     yield 1
     yield 2
   }
   var obj = createIterator()
   var newObj = obj[Symbol.iterator]() // 其实obj[Symbol.iterator]相当于createIterator迭代器
   ```

   **Symbol.iterator 可用于检测一个对象是否可迭代**。

   ```javascript
   typeof obj[Symbol.iterator] === "function"
   ```

6. **默认情况下定义的对象是不可迭代的，但是可以通过 Symbol.iterator 创建迭代器**。看个🌰：

   ```javascript
   const obj = {
     items: [],
     *[Symbol.iterator]() {
       for (let item of this.items) {
         yield item;
       }
     }
   }
   ```

7. 数组、Set、Map等可迭代对象，其内部已实现迭代器，并且提供3种迭代器调用，分别是：

   - entries()：返回一个迭代器，用于返回键值对。

     ```javascript
     var arr = [1, 2, 3]
     for(var [key, value] of arr.entries()) {
       console.log(key, value)
     }
     // 输出结果为
     // 0 1
     // 1 2
     // 2 3
     ```

   - values()：返回一个迭代器，用于返回键值对的value。

     ```javascript
     var arr = [1, 2, 3]
     for(var value of arr.values()) {
       console.log(value)
     }
     // 输出结果为
     // 1
     // 2
     // 3
     ```

   - keys()：返回一个迭代器，用于返回键值对的key。

     ```javascript
     var arr = [1, 2, 3]
     for(var key of arr.keys()) {
       console.log(key)
     }
     // 输出结果为
     // 0
     // 1
     // 2
     ```

8. 高级迭代器功能，主要包括传参、抛出异常、生成器返回语句、委托生成器。

   - 传参。**next 方法传参数时，会作为上一轮 yield 的返回值，除了第一轮 yield 外**，看个🌰：

     ```javascript
     function *aa() {
       var a1 = yield 1
       var a2 = 10
       yield a1 + 10
     }
     var a = aa()
     console.log(a.next(2)) // { value: 1, done: false }
     console.log(a.next(100)) // { value: 110, done: false }
     ```

   - 抛出异常。

     ```javascript
     function *aa() {
       var a1 = yield 1
       var a2 = 10
       yield a1 + 10
     }
     var a = aa()
     console.log(a.next(2)) // { value: 1, done: false }
     console.log(a.throw(new Error('error'))) // error
     console.log(a.next(100)) // 不再执行
     ```

   - 生成器种遇到 return 语句时，表示退出操作。

     ```javascript
     function *aa() {
       var a1 = yield 1
       return
       yield a1 + 10
     }
     var a = aa()
     console.log(a.next(2)) // { value: 1, done: false }
     console.log(a.next(100)) // { value: undefined, done: true }
     ```

   - 委托生成器。其实就是生成器嵌套生成器。

     ```javascript
     function *aIterator() {
       yield 1;
     }
     function *bIterator() {
       yield 2;
     }
     function *cIterator() {
       yield *aIterator()
       yield *bIterator()
     }
     var i = cIterator()
     console.log(i.next()) // {value: 1, done: false}
     console.log(i.next()) // {value: 2, done: false}
     ```

9. 异步任务执行器，其实就是用来循环执行生成器。

   因为我们知道生成器需要执行 N 次 next() 方法才能运行完，异步任务执行器就是帮我们做这些事情的。

   ```javascript
   function run(taskFn) {
     var task = taskFn() // 调用生成器
     var result = task.next()
     function step() {
       if(!result.done) {
         result = task.next(result.value)
         step()
       }
     }
     step()
   }
   run(function *() {
     let text = yield fetch() // 异步请求获取数据
     doSomething(text) // 处理返回结果
   })
   ```

   **异步任务执行器，其实就是间接实现了 async 和 await 功能。**

## 类class

1. 在 ES6 中，**将原型的实现写在类中**，和 ES5 本质上是一致的，都是需要新建一个类名，然后实现构造函数再实现原型方法。看个🌰：

   ```javascript
   class Person {
     constructor(name) { // 新建构造函数
       this.name = name // 私有属性
     }
     sayName() { // 定义一个方法并且赋值到构造函数的原型中
       return this.name
     }
   }
   ```

   **私有属性的定义，只需要在构造方法中定义`this.xx = xx`即可**。

2. 类声明和函数声明的区别，主要有：

   - 类声明不能提升，而函数声明则会被提升。
   - 类声明中代码会自动强行运行在严格模式下。
   - 类中的所有方法都是不可枚举的，而函数声明的对象中方法则是可以枚举的。
   - 类中的构造函数只能使用 new 来调用，而函数则可以普通调用或 new 来调用。

3. 类的定义有声明式定义和表达式定义，看个🌰：

   ```javascript
   // 声明式定义
   class Person {
     // ...
   }
   
   // 表达式定义
   let person = Class {
     // ...
   }
   ```

   类还支持立即调用。

   ```javascript
   let person = new Class {
     constructor(name) {
       this.name = name
     }
     sayName() {
       return this.name
     }
   }('Andraw')
   console.log(person.sayName()) // Andraw
   ```

4. **类支持在原型上定义访问器属性**。看个🌰

   ```javascript
   class Person {
     constructor(name) {
       this.name = name
     }
     get myName() {
       return this.name
     }
     set myName(name) {
       this.name = name
     }
   }
   var descriptor = Object.getOwnPropertyDescriptor(Person.prototype, 'myName')
   console.log('get' in descriptor) // true
   console.log(descriptor.enumerable) // false 表示不可枚举
   ```

   **类中定义的属性或方法名都是可支持表达式的**。

   ```javascript
   const test = 'sayName'
   class Person{
     constructor(name) {
       this.name = name
     }
     [test]() {
       return this.name
     }
   }
   ```

   类中定义的方法同样可以是生成器方法。

   ```javascript
   class Person {
     *sayName() {
       yield 1
       yield 2
     }
   }
   ```

5. 静态属性或静态方法，是在属性或方法前面使用 static 关键字。**static 修饰的方法或属性只能被类本省直接访问，而不能在实例中访问**。

   ```javascript
   class Person {
     static sayName() {
       return this.name
     }
   }
   ```

6. 在 React 中写一个组件`Test`时，必须得继承`React.Component`。其中 Test 组件就是一个派生类。**派生类中的构造函数内部必须使用 super()**。

   关于 super 的使用需要注意：

   - **只可以在派生类中使用 super**。派生类是指继承自其他类的新类。
   - **派生类中构造函数访问 this 之前必须要先调用 super()，负责初始化 this**。
   - 如果不想调用 super，可让类的构造函数返回一个对象。

7. 当派生类继承于父类时，其**父类中的静态成员也会被继承到派生类中**，但是**静态成员同样只能是被派生类访问，而无法被其实例访问**。

8. 在构造函数中可使用 new target（**new target 通常表示当前的构造函数名**）来阻止实例化类。看个🌰：

   ```javascript
   class Person {
     constructor() {
       if(new.target === Person) { // 不允许该类被调用实例化
         throw new Error("error")
       }
     }
   }
   ```

## 数组

1. 在 ES5 中创建数组的方式有两种，分别是数组子面量（即 var arr = []）和 Array 实例（即 new Array()）。

   在 ES6 中新增两种方法创建数组，分别是 Array.of() 和 Array.from()。

   - Array.of()。我们知道 new Array() 中传入一个数字时，表示的是生成多少长度的数组，Array.of() 就是为了处理这种尴尬场面的，看个🌰：

     ```javascript
     const a1 = new Array(1)
     const a2 = Array.of(1)
     console.log(a1, a2) // [undefined], [1]
     ```

   - Array.from()。用于将类数组转换为数组。

     ```javascript
     function aa() {
       const arr = Array.from(arguments)
       console.log(arr)
     }
     aa(1, 2)
     // [1, 2]
     
     // 可传第二个参数，作为第一个参数的转换
     const arr = Array.from(arguments, value => value + 2)
     
     // 可传第三个参数，用来指定this
     
     // Array.from可用于处理数组去重
     Array.from(new Set(...arguments))
     ```

2. 数组新增的方法有。

   - find()。传入一个回调函数，**找到数组中符合当前搜索规则的第一个元素**，返回它，并且终止搜索。

     ```javascript
     var arr = [1, 2, 3]
     console.log(arr.find(n => typeof n === "number")) // 1
     ```

   - findIndex()。传入一个回调函数，**找到数组中符合当前搜索规则的第一个元素，返回它的下标**，终止搜索。

     ```javascript
     var arr = [1, 2, 3]
     console.log(arr.find(n => typeof n === "number")) // 0
     ```

   - fill()。**用新元素替换掉数组内的元素，可以指定替换下标范围**。格式和🌰如下：

     ```javascript
     // 格式如下
     arr.fill(value, start, end)
     
     // 栗子
     const arr = [1, 2, 3]
     console.log(arr.fill(4)) // [4, 4, 4] 不指定开始和结束，全部替换
     
     const arr1 = [1, 2, 3]
     console.log(arr1.fill(4, 1)) // [1, 4, 4] 指定开始位置，从开始位置全部替换
     
     const arr2 = [1, 2, 3]
     console.log(arr2.fill(4, 0, 2)) // [4, 4, 3] 指定开始和结束位置，替换当前范围的元素
     ```

   - copyWithin()。选择数组的某个下标，从该位置开始复制数组元素，默认从0开始复制。格式和🌰如下：

     ```javascript
     // 格式如下
     arr.copyWithin(target, start, end)
     
     // 栗子
     const arr = [1, 2, 3, 4, 5]
     console.log(arr.copyWithin(3)) // [1,2,3,1,2] 从下标为3的元素开始，复制数组，所以4, 5被替换成1, 2
     
     const arr1 = [1, 2, 3, 4, 5]
     console.log(arr1.copyWithin(3, 1)) // [1,2,3,2,3] 从下标为3的元素开始，复制数组，指定复制的第一个元素下标为1，所以4, 5被替换成2, 3
     
     const arr2 = [1, 2, 3, 4, 5]
     console.log(arr2.copyWithin(3, 1, 2)) // [1,2,3,2,5] 从下标为3的元素开始，复制数组，指定复制的第一个元素下标为1，结束位置为2，所以4被替换成2
     ```

## Promise与异步编程

1. 对 DOM 做事件处理操作，如点击、激活焦点、失去焦点等，再比如使用 Ajax 请求数据时利用回调函数获取返回值，都属于异步编程。

2. Promise 中文意思就是承诺，**Javascript 对你许一个承诺，会在未来某个时刻兑现承诺**。

   Promise 有生命周期，分别是**进行中（pending）、已经完成（fulfilled）、拒绝（rejected）**。

   Promise 不会直接返回异步函数的执行结果，需要使用 then 方法获取，获取异常回调时，需要使用 catch 方法获取。

   结合 axios 看个🌰，axios 是前端比较热门的 http 请求插件之一。

   ```javascript
   // 1. 创建axios实例
   import axios from 'axios'
   export const instance = axios.create()
   
   // 2. 使用axios实例 + Promise获取返回值
   const promise = instance.get('url')
   promise.then(res => console.log(res)).catch(err => console.log(err))
   ```

3. Promise 构造函数只有一个参数，该参数为一个函数，被作为执行器。**执行器有两个参数，分别是 resolve() 和 reject()** ，前一个表示成功回调，后一个表示失败回调。

   ```javascript
   new Promise((resolve, reject) => {
     setTimeout(() => resolve(5), 0)
   }).then(res => console.log(5)) // 5
   ```

   **Promise 实例只能过 resolve 或者 reject 函数返回数据，并且使用 then 或者 catch 进行获取**。

   ```javascript
   Promise.resolve(1).then(res => console.log(res)) // 1
   Promise.reject(2).catch(res => console.log(res)) // 2
   // 捕获错误时，可使用catch获取
   new Promise((resolve, reject) => {
     if(true) {
       throw new Error('error')
     }
   }).catch(err => console.log(err))
   ```

4. **浏览器和 Node 提供了 unhandledRejection 和 rejectionHandled 两个事件处理 Promise 中没有设置 catch 问题**。

   ```javascript
   // unhandledRejection
   let rejected
   rejected = Promise.reject("It was my wrong!")
   
   process.on("unhandledRjection", function(reason, promise) {
     console.log(reason.message) // It was my wrong!
     console.log(rejected === promise) // true
   })
   
   // rejectionHandled
   let rejected
   rejected = Promise.reject("It was my wrong!")
   
   process.on("rejectionHandled", function(reason, promise) {
     console.log(reason.message) // It was my wrong!
     console.log(rejected === promise) // true
   })
   ```

   浏览器中使用上面两个方法只是在 window 对象上监听，而 Node 中使用是在 process 对象上监听。

   unhandledRejection 和 rejectionHandled的区别就是，前者是事件循环中触发，后者则是事件循环后触发。**两者都是处理 Promise 中使用 reject 捕获错误时，而没有使用 catch 进行捕获处理**。

5. **Promise 支持链式调用，有效地解决了回调地狱问题**。看个🌰：

  ```javascript
  new Promise((resolve, reject) => {
    resolve(1)
  }).then(res => { return res + 1 }).then(res => {console.log(res)}) // 2
  ```
  
6. 除了 resolve 和 reject 方法外，还有两个方法，便是 Promise.all 和 Promise.race。

   - Promise.all。**运行多个 Promise，当全部 Promise 都返回结果时，才会使用 then 进行处理**。

     ```javascript
     Promise.all([
       new Promise(function(resolve, reject) {
         resolve(1)
       }),
       new Promise(function(resolve, reject) {
         resolve(2)
       }),
       new Promise(function(resolve, reject) {
         resolve(3)
       })
     ]).then(arr => {
       console.log(arr) // [1, 2, 3]
     })
     ```

   - Promise.race。**和 all 方法类似，不过就是当有一个返回结果时，就可以使用 then 进行处理**。

     ```javascript
     Promise.race([
       new Promise(function(resolve, reject) {
         setTimeout(() => resolve(1), 1000)
       }),
       new Promise(function(resolve, reject) {
         setTimeout(() => resolve(2), 10)
       }),
       new Promise(function(resolve, reject) {
         setTimeout(() => resolve(3), 100)
       })
     ]).then(value => {
       console.log(value) // 2
     })
     ```

7. **Promise 本身不是异步，只有它的 then 方法或者 catch 方法才是异步。**

   目前 ES7 已经支持 async 方案，该方案比 Promise 还强大啊。

   ```javascript
   async function a() {
     await function() {}
   }
   ```

## 代理(Proxy)和反射(Reflect)

1. 代理 Proxy 就是拦截 JS 引擎内部目标的底层对象操作，反射 Reflect 就是针对 Proxy 还原原对象操作方法。

   | **代理陷阱**             | 覆写的特性                                                   | 默认特性                           |
   | ------------------------ | ------------------------------------------------------------ | ---------------------------------- |
   | get                      | 读取一个属性值                                               | Reflect.get()                      |
   | set                      | 写入一个属性                                                 | Reflect.set()                      |
   | has                      | in操作符                                                     | Reflect.has()                      |
   | deleteProperty           | delete操作符                                                 | Reflect.delete()                   |
   | getProperty              | Object.getPropertypeOf()                                     | Reflect.getPrototypeOf()           |
   | setProperty              | Object.setPrototypeOf()                                      | Reflect.setPrototypeOf()           |
   | isExtensible             | Object.isExtensible()                                        | Reflect.isExtensible()             |
   | preventExtensions        | Object.preventExtensions()                                   | Reflect.preventExtensions()        |
   | getOwnPropertyDescriptor | Object.getOwnPropertyDescriptor()                            | Reflect.getOwnPropertyDescriptor() |
   | defineProperty           | Object.defineProperty()                                      | Reflect.defineProperty()           |
   | ownKeys                  | Object.ownKeys()、Object.getOwnPropertyNames()、Object.getOwnPropertySymbols() | Reflect.ownKeys()                  |
   | apply                    | 调用一个函数                                                 | Reflect.apply()                    |
   | construct                | 用new调用一个函数                                            | Reflect.construct()                |

   **反射 Reflect 一般和代理 Proxy 结合使用，设置相应的代理方法处理数据时，需同时使用反射 Reflect 对原对象的方法操作一遍**。

   现在就拿 set 做个🌰。set属性是在要改变Proxy属性值时，进行的预处理，共接收四个参数：

   - target：要进行预处理的目标对象;
   - key：预处理过程的Key值，相当于对象的属性;
   - value：要设置成的值;
   - receiver：改变前的原始值;

   ```javascript
   let pro = new Proxy({
     aa: 2
   }, {
     set: (target, key, value, receiver) => console.log(target, key, value, receiver);
   });
   pro.aa = 8;         // {aa: 2} "aa" 8 Proxy {aa: 2}
   ```

2. Proxy的存在能够使函数加上钩子函数，即可理解为在执行方法前预处理一些代码，举个栗子：

   ```javascript
   let pro = new Proxy({}, {
     get: (target, key, property) => console.log('haha')
   });
   pro.aa;                 // haha
   pro.bb;                 // haha
   ```

3. 在使用如 http-proxy 插件或 webpack 时，有时需要访问某个 api，通过配置 proxy 跳转到指定的 url 能解决跨域问题。但是该种模式和代理 Proxy 有异曲同工之处，但是机制是不一样的。

   ```javascript
   devServer: {
     proxy: [
       {
         context: "/api/*", //代理API
         target: 'https://www.hyy.com', //目标URL
         secure: false
       }
     ]
   }
   ```

## 使用模块封装代码

1. 模块可以是函数、数据、类，需要指定导出的模块名，才能被其他模块访问。看个🌰

   ```javascript
   // 数据模块
   const obj = { a: 1 }
   // 函数模块
   const sum = (a, b) => a + b
   // 类模块
   class Person {
     // ...
   }
   ```

2. 模块引入使用 import 关键字，导入模块方式有两种。

   - 导入指定的模块。

     ```javascript
     import { sum } from 'a.js'
     sum(1, 2)
     ```

   - 导入全部模块。

     ```javascript
     import allFn from 'a.js'
     allFn.sum(1, 2)
     ```

3. 模块导出使用 export 关键字，看个🌰：

   ```javascript
   // 导出数据模块
   export const obj = { a: 1 }
   // 导出函数模块
   export const sum = (a, b) => a + b
   // 导出类模块
   export class Person {
     // ...
   }
   ```

   需要注意的是，**ES6 提供了模块的默认导出，在导出时结合  default 关键字**，看个🌰：

   ```javascript
   // a.js
   function sum(a, b) {
     return a + b
   }
   export default sum
   
   // b.js
   import sum from 'a.js'
   sum(1, 0)
   ```

4. **不能在语句和函数内使用 export 关键字，只能在模块顶部使用**。

5. ES6 提供了两种方式修改模块的导入和导出名，分别是**导出时修改和导入时修改，使用 as 关键字**。

   - 导出时修改。

     ```javascript
     // a.js
     function sum(a, b) {
       return a + b
     }
     export default {sum as add}
     
     // b.js
     import add from 'a.js'
     add(1, 2)
     ```

   - 导入时修改。

     ```javascript
     // a.js
     function sum(a, b) {
       return a + b
     }
     export default sum
     
     // b.js
     import sum as add from 'a.js'
     add(1, 2)
     ```

6. **无绑定导入，是指当模块没有可导出模块时，全都是定义的全局变量，可使用无绑定导入**。看个🌰：

   ```javascript
   // a.js
   let a = 1
   const PI = 3.1314
   
   // b.js
   import 'a.js'
   console.log(a, PI) // 1, 3.1314
   ```

7. **使用 webpack 打包 js 后，浏览器加载模块时，总是按顺序加载，先加载模块1，再加载模块2，因为 module 类型默认使用 defer 属性**。

   ```javascript
   <script type="module" src="module1.js"></script>
   <script type="module" src="module2.js"></script>
   ```


