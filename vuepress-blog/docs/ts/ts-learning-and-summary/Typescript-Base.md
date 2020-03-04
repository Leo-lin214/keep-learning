# Typescript Base

- [原始数据类型](#原始数据类型)
- [任意值](#任意值)
- [类型推论](#类型推论)
- [联合类型](#联合类型)
- [接口类型](#接口类型)
- [数组类型](#数组类型)
- [函数类型](#函数类型)
- [类型断言](#类型断言)
- [类型别名以及字符串字面量类型](#类型别名以及字符串字面量类型)
- [元组类型](#元组类型)
- [类<span style="color: red">（重点）</span>](#类（重点）)
- [类与接口](#类与接口)
- [泛型](#泛型)



## 原始数据类型

1. 原始数据类型包括：number、string、boolean、undefined、null、symbol。一般来说，对于基础数据类型，可以使用如下编写：

   ```typescript
   // number
   let num: number = 1
   
   // string
   let str: string = '1'
   
   // boolean
   let bool: boolean = true
   
   // undefined
   let und: undefined = undefined
   
   // null
   let nul: null = null
   ```

   有一点需要额外注意的是，`undefined`和`null`是所有类型的子类型，因此下面是成立的：

   ```typescript
   let num: number = undefined
   let str: string = null
   ```

2. 一旦`number\string\boolean`遇到`new`相应的对象时，则需要用到`Number\String\Boolean`，如下：

   ```typescript
   // Number
   let Num: Number = new Number(1)
   
   // String
   let Str: String = new String('1')
   
   // Boolean
   let Bool: Boolean = new Boolean(true)
   ```

3. Javascript 中是没有`void`空值的概念，而在 Typescript 中则可以有如下用处：

   - 用来表示没有任何返回值的函数

     ```typescript
     function aa(): void {
       let a = 1
     }
     ```

   - 声明一个`void`类型的变量，**只能赋值为`undefined`和`null`，而不能赋值为其他数据类型**

     ```typescript
     let a: void = undefined
     let b: void = null
     ```


## 任意值

`any`用来表示任意值，作用是允许赋值时的类型为任意类型。直接上栗子🌰：

```typescript
let text: any = 'str'
text = 1
```

**在任意值上访问其任何属性和方法都是被允许。**

若变量在声明的时候未指定其类型，那么它就会被自动识别为任意值类型，直接上🌰：

```typescript
let text
text = 1

// 等价于

let text: any
text = 1
```


## 类型推论

在没有声明指定的类型情况下，当一个变量在声明的同时进行赋值时，`Typescript`都会进行一个类型推断，直接上🌰：

```typescript
let str = 'string'
str = 8

// 上述的代码执行时会报错，相当于

let str: string = 'string'
str = 8
```

上面的代码就是在声明同时进行赋值，`Typescript`进行了一个类型推断，判断其为字符串类型，因此会默认自动指定字符串类型。

**若定义时没有进行赋值，不管之后有没有赋值，都会被推断成`any`任意值类型而完全不被类型检查**。直接上🌰：

```typescript
let str
str = 7
str = 'string'

// 相当于

let str: any
str = 7
str = 'string'
```

## 联合类型

联合类型表示取值时可以指定多种类型中的一种，使用`|`符号隔开类型，直接上🌰：

```typescript
let str: string | number
str = 'string'
str = 8
```

**当`Typescript`通过类型推断无法辨别出类型时，则只能访问其联合类型中所有类型里共有的属性或方法。**

```typescript
function aa(text: string | number): void {
  return text.length
}

// 会报错，因为通过类型推断根本无法辨别出text的类型，而且length只有字符串拥有，而数字类型则没有
```

但是，在赋值时，可通过类型推断出其类型，进而判断出是否可使用指定的属性或方法。

```typescript
let str: string | number
str = 'string'
console.log(str.length) // 类型推断出为string类型，因此可以访问length
str = 8
console.log(str.toString()) // 类型推断出为number类型，因此可以访问toString方法
```

## 接口类型

接口是对行为的抽象，而具体如何行动和操作则需要由类来进行实现。直接上🌰：

```typescript
interface Person {
  name: string,
  age: number
}
let person: Person = {
  name: 'andraw',
  age: 26
}
```

接口就好比如形容一个事物的形状外表，当你想在其他地方形容它时，则必须要在它的基础上进行形容。

需要注意的是，一般情况下，**不允许定义的变量比接口少属性或多属性**。

```typescript
interface Person {
  name: string,
  age: number
}

// 以下情况都会被报错
let person1: Person = {
  age: 26
}
let person2: Person = {
  name: 'haha',
  age: 26,
  gender: 'female'
}
```

若想表明该属性是可选属性，则需要使用`?`号表示：

```typescript
interface Person {
  name: string,
 	age?: number
}
let person: Person = {
  name: 'andraw'
}
```

若想一个接口允许有任意的属性，则可以如下定义：

```typescript
interface Person {
  name: string,
  age?: number,
  [propName: string]: any
}
```

需要注意的是，**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型子集**。

```typescript
interface Person {
  name: string,
 	[propName: string]: number
}
let person: Person = {
  name: 'andraw'
}
```

上述的代码表明了，定义了任意属性必须为字符串类型，因此任意属性在赋值时必须为字符串、undefined或者null。

若想表明该属性是可读属性，那么需要使用`readonly`来表示。（需注意的是，**只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候**）

```typescript
interface Person {
  readonly id: number,
}
let person1: Person = {} // 会报错，因为没声明id属性
let person2: Person = { // 正确
  id: 12
}
```

## 数组类型

在`Typescript`中，指定数组类型的方式有很多，主要有以下几种。

1. 类型 + 方括号

   该方法是用来表示数组类型中最为简单易理解的一种，直接上🌰：

   ```typescript
   let arr1: number[] = [1, 2, 3] // 正确
   let arr2: number[] = [1, '2', 3] // 错误，因为指定类型为number，而不能使用字符串类型的值
   ```

2. 数组泛型

   使用数组泛型`Array<elemType>`表示数组类型。

   ```typescript
   let arr: Array<number> = [1, 2, 3]
   ```

3. 接口表示

   接口也可以用来表示数组类型，但是需要规定索引为数值类型，直接上🌰：

   ```typescript
   interface NumberArr {
     [index: number]: number
   }
   ```

   一般情况下，使用接口表示数组少之又少。**只有一种情况会经常使用接口表示数组，那就是类数组**，如arguments。

   ```typescript
   function sum() {
     let args: {
       [index: number]: number,
       length: number,
       callee: Function,
     } = arguments;
   }
   ```

   同时，**`Typescript`内置了`IArguments`对象用于表示`arguments`：**

   ```typescript
   // 内置对象IArguments
   interface IArguments {
       [index: number]: any;
       length: number;
       callee: Function;
   }
   
   // 因此在使用时，上述的sum函数可修改如下
   function sum() {
     let args: IArguments = arguments
   }
   ```

   

## 函数类型

**在`Javascript`中定义函数的方式有两种，分别是函数声明和函数表达式**。而在`Typescript`中，函数类型的定义主要有以下几种：

1. 函数的声明

   ```typescript
   function sum(x: number, y: number): number {
     return x + y
   }
   ```

   输入多余的（或者少于要求的）参数，是不被允许的。

   ```typescript
   // 继续利用上述函数声明的函数
   sum(1, 2, 3) // 报错
   sum(1) // 报错
   sum(1, 2) // 正确
   ```

2. 函数表达式

   ```typescript
   let fun: (x: number, y: number) => number = function(x: number, y: number): number {
     return x + y
   }
   ```

   需要明确的是，这里的`=>`与 ES6 中`=>`不一样。**`Typescript`中的`=>`用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型**。

3. 接口定义

   上一节中，接口可以定义数组，另外还可以定义函数。

   ```typescript
   interface Sum {
     (x: number, y: number): number
   }
   let sum: Sum = (x: number, y: number) => x + y
   ```

定义函数固然简单，但有时我们还需要对参数作出如下处理：

1. 可选参数

   对于可选参数依然使用的是`?`符号。

   ```typescript
   function sum(x: number, y?: number): number {
     return y ? x + y : x
   }
   ```

   可选参数后面不允许再出现必需参数。

   ```typescript
   // 定义时会报错
   function sum(x?: number, y: number): number {
     return x ? x + y : y
   }
   ```

2. 参数默认值

   **在`Typescript`中，会将添加默认值的参数识别为可选参数**。

   ```typescript
   function sum1(x: number = 1, y: number): number {
     return x + y
   }
   function sum2(x: number, y: number = 1): number {
     return x + y
   }
   ```

3. 剩余参数

   在 ES6 中，可以使用`...rest`（也叫 rest 参数）方式获取函数中剩余的参数。由于 rest 本身就是一个数组，因此可以用数组的类型来定义它。

   ```typescript
   function push(array: any[], ...rest: any[]):void {
     rest.forEach(restItem => {
       array.push(restItem)
     })
   }
   ```

有时候，我们需要对函数进行重载，即允许一个函数接受不同数量或类型的参数时，作出不同的处理。

例如，实现一个`reverse`函数，当输入数字时，返回肯定为数字，当输入为字符串时，返回肯定是字符串。

```typescript
// 一般情况下，你会这样定义
function reverse(x: number | string): number | string {}

// 但这样定义是无法正确表达的，因此应该如下定义
function reverse(x: number): number
function reverse(x: string): string
function reverse(x: number | string): number | string {}
```

对于第二种方式的定义，**`Typescript`会优先从最前面的函数定义开始匹配，所以多个函数定义若有包含关系，则需要优先把精确的定义写在前面**。



## 类型断言

在`Typescirpt`中，当使用类型推断方法无法辨别出类型时，就可以**使用类型断言的方式进行手动指定一个值的类型**。方式主要有以下两种：

1. <类型>值

   ```typescript
   function foo(x: number | string) {
     if ((<string>x).length) {
       return (<string>x).length
     } else {
       return x.toString().length
     }
   }
   ```

2. 值 as 类型

   ```typescript
   function foo(x: number | string) {
     if ((x as string).length) {
       return (x as string).length
     } else {
       return x.toString().length
     }
   }
   ```

需要注意的是，**在 React 的 tsx 语法中，必需用到是后一种方法**。



## 类型别名以及字符串字面量类型

使用`type`，将一个别名来替代定义的类型。直接上🌰：

```typescript
type Name = string
let str: Name = 'haha'
```

`type`除了上述的功能外，还可以用于定义字符串字面量类型。

```typescript
type EventNames = 'click' | 'dbclick'
let eventName: EventNames = 'scroll' // 报错，只能取click、dbclick中的一个值
```

定义字符串字面量类型，就相当于规定了变量的范围，超出范围就会报错。



## 元组类型

数组类型是合并了相同类型的对象，而元组则是合并了不同类型的对象。接下来就创建一个元组类型

```typescript
let arr: [number, string] = [1, 'haha']
```

需要注意的是，**元组类型只能多，不能少**。不能在定义时额外添加新的元素，只能通过方法push等操作

```typescript
let arr1: [number, string] = [1] // 报错
let arr2: [number, string] = [1, 'haha'] // 正确
arr2.push(1)
```

**元组类型若想新加元素，那必须符合定义的类型，否则就会报错**。



## 类（重点）

1. ES6 中类的用法如下

   - 属性和方法的定义

     ```javascript
     class Animal {
       constructor(name) {
         this.name = name
       }
       sayName() {
         return this.name
       }
     }
     ```

     需要注意的是，**在 ES6 中属性必需要在构造器中定义**。

   - 类的继承

     ```javascript
     class Cat extends Animal {
       constructor(name) {
         super(name) // 相当于调用了父类的构造器
       }
       sayHi() {
         return `haha, ${super.sayHi()}`
       }
     }
     ```

     使用`extends`实现类的继承。

   - 存取器

     使用 getter 和 setter 可以改变属性的赋值和取值行为。

     ```javascript
     class Animal {
       constructor(name) {
         this.name = name
       }
       get name() {
         return this.name
       }
       set name(newName) {
         console.log(newName)
       }
     }
     ```

     实质上，**在 ES5 中实现 getter 和 setter 使用的依然是`Object.defineProperty`方法**。

   - 静态方法

     所谓的**静态方法，就是不能实例化，只能直接通过类来调用**。使用`static`修饰符来实现。

     ```javascript
     class Animal {
       static isAnimal(a) {
         return a instanceof Animal
       }
     }
     let animal = new Animal()
     console.log(Animal.isAnimal(animal)) // true
     ```

2. ES7 中类的用法如下

   - 实例属性

     **在 ES6 中实例的属性只能通过构造函数中`this.xxx`来定义，而在 ES7 中则可以直接在类里面进行定义**。

     ```javascript
     class Animal {
       name = 'cat'
     	constructor(name) {
         if (name) {
         	this.name = name 
         }
       }
     }
     let animal = new Animal()
     console.log(animal.name) // cat
     ```

     实质上，相当于设置实例属性的默认值。

   - 静态属性

     在 ES7 中，可以使用`static`定义一个静态属性。

     ```javascript
     class Animal {
       static year = '2019'
     }
     console.log(Animal.year)
     ```

3. Typescript 中类的用法如下

   - 支持 public、private 和 protected

     + public：修饰的属性或方法是公有的，在任何地方都可以访问，当编写的属性或方法不标明修饰符时，都会默认使用 public；

       ```javascript
       class Animal {
         name
         constructor(name) {
           this.name = name
         }
       }
       
       // 相当于
       class Animal {
         public name
         public constructor(name) {
           this.name = name
         }
       }
       ```

     + private：修饰的属性或方法是私有的，无法在子类以及实例中访问到；

       ```javascript
       class Animal {
         private name
         constructor(name) {
           this.name = name
         }
       }
       class Cat extends Animal {
         constructor(name) {
           super(name)
           console.log(this.name) // 会报错，因为this.name是私有属性，在子类是无法访问的
         }
       }
       ```

       需要注意的是，**当在构造函数中使用`private`时，该类就不允许被继承或者实例化**。

       ```typescript
       class Animal {
         private name
         private constructor(name) {
           this.name = name
         }
       }
       let animal = new Animal() // 会报错
       ```

     + protected：修饰的属性或方法是受保护的，但和 private 有一点不同的是，可以在子类中允许被访问

       ```typescript
       class Animal {
         protected name
         constructor(name) {
           this.name = name
         }
       }
       class Cat extends Animal {
         constructor(name) {
           super(name)
           console.log(this.name) // 不会报错，因为this.name是受保护的，可以在子类中访问的
         }
       }
       ```

       需要注意的是，**当在构造函数中使用`protected`时，该类就只允许被继承，而不允许被实例化**。

       因此，`protected`和`private`最大区别就在于，**`protected`只允许被自身和子类所使用，而`private`则只允许被自身使用**。

   - readonly

     只读属性关键字，只允许出现在属性声明或索引签名中。

     ```typescript
     class Animal {
       public readonly name
     }
     ```

     需要注意的是，**`readonly`和其他修饰符同时存在时，需要写在后面**。

   - 抽象类

     抽象类是供其他继承的基类，**抽象类不允许被实例化，而且抽象类中的抽象方法必需在子类中被实现**。

     ```typescript
     abstract class Animal {
       private name
       constructor(name) {
         this.name = name
       }
       abstract sayHi()
     }
     class Cat extends Animal {
       constructor(name) {
         super(name)
       }
       sayHi() {
         return this.name
       }
     }
     ```



类的类型，直接上🌰：

```typescript
class Animal {
  name: string
  constructor(name: string) {
    this.name = name
  }
  sayHi(): string {
    return this.name
  }
}
```



## 类与接口

1. 类实现接口

   实现是面向对象中一个重要的概念，使用`implements`关键字来实现。

   ```typescript
   interface Warn {
     alert()
   }
   class Door {}
   class SecurityDoor extends Door implements Warn {
     alert() {
       console.log('SecurityDoor is open...')
     }
   }
   class Car implements Warn {
     alert() {
       console.log('Car is Open...')
     }
   }
   ```

   一个类可以实现多个接口，如下：

   ```typescript
   interface Warn {
     alert()
   }
   interface Light {
     lightOn()
   }
   class Car implements Warn, Light {
     alert() { ... }
     lightOn() { ... }
   }
   ```

2. 接口继承接口

   ```javascript
   interface Warn {
     alert()
   }
   interface LightAndWarn extends Warn {
     lightOn()
   }
   ```

3. 接口继承类

   ```javascript
   class Point {
     x: number,
     y: number
   }
   interface Point3d extends Point {
     z: number
   }
   let point3d: Pointed3d = {x: 1, y: 2, z: 3}
   ```

4. 混合类型

   接口在实现函数过程中，除了定义函数体外，还可以定义其自身的属性以及方法。

   ```typescript
   interface Sum {
     (x: number): number,
     text: string,
     getText(): string
   }
   function getSum(): Sum {
     let sum = (function(x: number) { return x } as Sum)
     sum.text = 'sum'
     sum.getText = function() {
       return '...'
     }
     return sum
   }
   let sum = getSum()
   console.log(sum(8), sum.text)
   ```



## 泛型

泛型指的是，在定义函数、接口或类的时候，不预先指定具体的类型，而在使用时候再指定类型的一种特性。

1. 函数使用泛型

   ```typescript
   function createArray<T>(length: number, value: T): Array<T> {
     let result: T[] = []
     for (let i = 0; i < length; i++) {
       result[i] = value
     }
     return result
   }
   
   createArray<string>(3, 'x')
   // 也可以不用指定类型，Typescript会根据类型推断出是什么类型
   createArray(3, 'x')
   ```

   当然若需多个类型参数时，可以按如下定义

   ```typescript
   function sum<T, U>(x: T, y: U): [T, U] {
     return [x, y]
   }
   sum(1, 2)
   ```

2. 泛型约束

   例如想读取一个变量的`length`属性，由于无法在使用时辨别出是什么类型，因此可以使用泛型约束进行规范。

   ```typescript
   interface Length {
     length: number
   }
   function consoleLength<T extends Length>(x: T) {
     console.log(x.length)
   }
   ```

3. 接口使用泛型

   ```typescript
   interface Person<T> {
     name: T,
     age: T
   }
   let person: Person<string> = {
     name: 'ha',
     age: '12'
   }
   ```

4. 类使用泛型

   ```typescript
   class Person<T> {
     name: T
   }
   let person = new Person<string>()
   person.name = 'Andraw'
   ```

5. 泛型参数的默认类型

   有些情况下，`Typescript`支持我们为泛型中的类型参数指定一个默认类型。

   ```typescript
   function createArray<T = string>(length: number, value: T): Array<T> {
     let result: T[] = []
     for (let i = 0; i < length; i++) {
       result[i] = value
     }
     return result
   }
   ```

   





























