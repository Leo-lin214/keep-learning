---
layout: post
category: Andraw-lin
title: ES6-Notes
summary: ES6-Notes
---

## **<<深入理解ES6>>的笔记**

> ### **(一) 块级作用域绑定**

 1. var声明及变量提升(Hosting)机制
 
    在ES5中存在两个作用域，分别为**函数作用域**和**全局作用域**，无论实际上是在哪里声明的，都会被当成在当前作用域顶部声明的变量，举个栗子：
    
    ```javascript
        function geVal(condition){
            if(condition){
                var value = "blue";
                // 其他代码
                return value;
            }else{
                // 此处可访问变量value，其值为undefined
                return null;
            }
            // 此处可访问变量value，其值为undefined
        }
    ```
    上面代码，在预编译阶段，Javascript引擎会将上面的getVal函数修改成下面这样：
    
    ```javascript
        function getVal(condition){
            var value;
            if(condition){
                value = "blue";
                // 其他代码
                return value;
            }else{
                return null;
            }
        }
    ```
    可以看到，在ES5中，变量的value的声明被提升至函数顶部，而初始化的操作依旧留在原处执行。
    
 2. 块级声明



> ### **(二) 扩展对象的功能性**

 1. 对象字面量语法扩展

    - 属性初始值的简写
    
      ES6 在一个对象的属性与本地变量同名时，不必再写冒号和值，只写属性名即可，举个栗子：
      
      ```javascript
        function createPerson(name, age){
            return {
                name,
                age
            }
        }
      ```
      
    - 对象方法的简写语法
    
      ES6 消除了对象中定义方法时的冒号和function关键字，举个栗子：
      
      ```javascript
        var person = {
            name: 'Tom',
            sayName() {
                console.log(this.name);
            }
        }
      ```
 
    - 可计算属性名
    
      ES6 允许在对象字面量中使用变量作为属性名，但需要 [] 进行包裹才能读取到变量的值，举个栗子：
      
      ```javascript
        var name = "Andraw";
        var person = {
            [name]: 'haha',
            ['Hello ' + name]: 'hihi'
        }
        console.log(person.Andraw);                     // haha
        console.log(person['Hello Andraw']);            // hihi
      ```
      
      

 2. 新增方法
 
    - Object.is() 方法
     
      在 ES5 中比较两个值时，一般需要使用相等运算符（==）或全等运算符（===），而相等运算符会触发强制类型转换的行为，而全等运算符则不会，但也会出现不完全准确的栗子，例如，+0和-0在JavaScript引擎中被表示两个完全不同的实体，而在全等运算符下，两者却是相等的，而NaN === NaN的返回值为false，需要使用isNaN（）方法才可以正确检测NaN

      ES6 引入Object.is（）方法弥补全等运算符的不准确运算，它和全等运算符的结果几乎一致，主要就是应对部分全等运算符的不准确运算，举个栗子：
      
      ```javascript
        console.log(+0 == -0);                      // true
        console.log(+0 === -0);                     // true
        console.log(Object.is(+0, -0));             // false
        
        console.log(NaN == NaN);                    // false
        console.log(NaN === NaN);                   // false
        console.log(Object.is(NaN, NaN));           // true
        
        console.log(5 == 5);                        // true
        console.log(5 == "5");                      // true ( 会触发强制装换 )
        
        console.log(5 === 5);                       // true
        console.log(5 === "5");                     // false
        
        console.log(Object.is(5, 5));               // true
        console.log(Object.is(5, '5'));             // false
      ```
      
    - Object.assign() 方法
    
      混合（Mixin）是实现JavaScript对象组合的的一种模式，而 ES5 中实现一个简单的混合，举个栗子：
      
      ```javascript
        function mixin(rec, sup){
            Object.keys(sup).forEach(funciton(key) {
                rec[key] = sup[key];
            });
            return rec;
        }
      ```
      
      可以看到，上面mixin方法是一个浅复制，当属性值为对象时只复制对象的引用，这样，rec不需要通过继承就可以获得新属性；
      
      而 ES6 中则提出了assign（）方法可以接收任意数量的源对象，并按指定的顺序将属性复制到接收对象中，当然，当具有同名属性时，排在后面的属性会覆盖靠前的，举个栗子：
      
      ```javascript
        var rec = {};
        Object.assign(rec, {
            name: 'Andraw',
            age: 22
        },{
            age: 23
        });
        
        console.log(rec);                           // { name: 'Andraw', age: 23 }
      ```
      
 3. 重复的对象字面量属性
 
    在 ES5 严格模式中，当一个对象中拥有重复属性时则会直接抛出错误，而在 ES6 中则把重复属性检查被移除了，无论是在严格模式下，还是在非严格模式下，举个栗子：

    ```javascript
        var person = {
            name: "Andraw",
            name: "Tom"
        }
    ```
    

 4. 自有属性枚举顺序

    
    ES5 中未定义对象属性的枚举顺序，由JavaScript引擎厂商自行决定。而在 ES6 中则严格规定了对象的自有属性被枚举时的返回顺序，这将直接影响到Object.getOwnPropertyNames()方法及Reflect.ownKeys返回属性的方式，Object.assign()方法处理属性的顺序也将随之改变，规则如下：
    
    - 所有数字键按升序排序；
    
    - 所有字符串键按照它们被加入对象的顺序排序；
    
    - 所有Symbol键按照它们被加入对象的顺序排序；
    
    举个栗子：
    
    ```javascript
        var obj = {
                a: 1,
                0: 1,
                c: 1,
                2: 1,
                b: 1,
                1: 1
            },
            foo = {};
        obj.d = 1;
        console.log(Object.getOwnPropertyNames(obj).join(""));          // "012acbd"
        console.log(Object.assign(foo, obj));                           // {0:1, 1:1, 2:1, a:1, c:1, b:1, d:1}
    ```
    **注意**，对于for-in循环、Object.keys()方法、JSON.stringify()方法，都具有相同的枚举顺序，但并非所有厂商都遵循相同的实现方式，因此仍没指定一个明确的枚举顺序。
    

 5. 增强对象原型
 
    - 改变对象的原型
    
      在 ES5 中，有Object.getPrototypeOf()方法来返回任意指定对象的原型，但却缺少对象在实例化后改变原型的方法，而在 ES6 中则添加了Object.setPrototypeOf()方法来改变这一现状，举个栗子：

      ```javascript
        let person = {
            getGreeting() {
                return "Hello";
            }
        }
        let animal = {
            getGreeting() {
                return "Hi";
            }
        }
        
        // 以person对象为原型
        let friend = Object.create(person);
        console.log(friend.getGreeting());                                  // "Hello"
        console.log(Object.getPrototypeOf(friend) === person);              // true
        
        // 将原型设置为animal
        Object.setPrototypeOf(friend, animal);
        console.log(friend.getGreeting());                                  // "Hi"
        console.log(Object.getPrototypeOf(friend) === animal);              // true
      ```
      
    - 简化原型访问的Super引用
    
      ES6 引入Super引用的特性，使用它可以便捷地访问对象原型。
      
      举个栗子，如果你想重写对象实例的方法，又需要调用与它同名的原型方法，则在 ES5 中可以这样实现：
      
      ```javascript
        let person = {
            getGreeting() {
                return "Hello";
            }
        }
        let animal = {
            getGreeting() {
                return "Hi";
            }
        }
        let friend = {
            getGreeting() {
                return Object.getPrototypeOf(this).getGreeting.call(this) + ' man!';
            }
        }
        
        // 以person为原型
        Object.setPrototypeOf(friend, person);          
        console.log(friend.getGreeting());                                  // "Hello man!"
        
        // 以animal为原型
        Object.setPrototypeOf(friend, animal);                              
        console.log(friend.getGreeting());                                  // "Hi man!"
      ```
      
      上例中，Object.getPrototypeOf()方法可以确保调用正确的原型，后面的.call(this)可以确保正确设置原型方法中的this值，而使用 ES6 中super关键字，Super引用相当于指向对象原型的指针，简化如下：
      
      ```javascript
        let friend = {
            getGreeting() {
                return super.getGreeting() + ' man!';
            }
        }
      ```
      
      **注意**，Super引用必须要要在使用**简写方法的对象**中使用
      
      另外，Super引用在多重继承情况下非常有用，而这种情况下使用Object.getPrototypeOf()方法将会出现问题，举个栗子：
      
      ```javascript
        let person = {
            getGreeting() {
                return "Hello";
            }
        }
        
        // 以person对象为原型
        let friend = {
            getGreeting() {
                return Object.getPrototypeOf(this).getGreeting.call(this) + " man!";
            }
        }
        
        Object.setPrototypeOf(friend, person);
        
        // 原型是friend
        let foo = Object.create(friend);
        console.log(person.getGreeting());                              // "Hello"
        console.log(friend.getGreeting());                              // "Hello man"
        console.log(foo.getGreeting());                                 // error!
      ```
      
      上面栗子可以看出，foo的原型为friend对象，当执行foo的getGreeting方法时，会调用friend的getGreeting方法，而此时的this为foo，object.getPrototypeOf(this)又返回friend对象，所以就会进入递归调用直到触发栈溢出报错。
      
      而 ES6 的Super引用不是动态变化的，它总是指向正确的对象，例如将上面改写如下：
      
      ```javascript
        let person = {
            getGreeting() {
                return "Hello";
            }
        }
        
        // 以person对象为原型
        let friend = {
            getGreeting() {
                return super.getGreeting() + " man!";
            }
        }
        
        Object.setPrototypeOf(friend, person);
        
        // 原型是friend
        let foo = Object.create(friend);
        console.log(person.getGreeting());                              // "Hello"
        console.log(friend.getGreeting());                              // "Hello man"
        console.log(foo.getGreeting());                                 // "Hello man"
      ```
      
      在上面示例中，可以看到的是无论有多少个方法继承了getGreeting方法，super.getGreeting()始终指向person.getGreeting()方法。
      



> ### **(三) Symbol和Symbol属性**

 1. 创建Symbol
 
    举个栗子：

    ```javascript
        let firstName = Symbol();
        let person = {};
        
        person[firstName] = "Andraw";
        console.log(person[firstName]);                 // Andraw
    ```
    
    另外，Symbol函数接受一个可选参数，可以让你添加一段文本来描述即将创建的Symbol，而这段描述不可用于属性访问，不过便于阅读代码和Symbol程序，举个栗子：
    
    ```javascript
        let firstName = Symbol('first name');
        let person = {};
        
        person[firstName] = "Andraw";
        
        console.log("first name" in person);                    // false
        console.log(person[firstName]);                         // "Andraw"
        console.log(firstName);                                 // "Symbol(first name)"
    ```
    
    辨别Symbol类型可以直接使用typeof来进行检测；
    
    

 2. Symbol的使用方法
 
    所有使用可计算属性名的地方，都可以使用Symbol，另外，Symbol也可以用于可计算对象字面量属性名、Object.defineProperty()方法和Object.defineProperties()方法的调用过程中，举个栗子：

    ```javascript
        let firstName = Symbol('first name');
        
        // 使用一个可计算对象字面量
        let person = {
            [firstName]: 'Andraw'
        }
        
        // 将属性设置为只读
        Object.defineProperty(person, firstName, {
            writable: false
        });
        
        let lastName = Symbol("last name");
        Object.defineProperties(person, {
            [lastName]: {
                value: "Lin",
                writable: false
            } 
        });
    ```
    
    

 3. Symbol共享体系
 
    如果需要在不同的代码中共享同一个Symbol，例如在一个应用中有两种不同的对象类型，同时希望它们使用同一个Symbol属性来标识独特的标识符。ES6 提供了一个可以随时访问的全局 Symbol 注册表。

    创建一个可共享的 Symbol，要使用 Symbol.for() 方法。它只接受一个参数，也就是即将创建的 Symbol 的字符串标识符，这个参数同样也被用作 Symbol 的描述，举个栗子：
    
    ```javascript
        let uid = Symbol.for('uid');
        
        let object = {
            [uid]: '132'
        };
        
        console.log(object[uid]);                   // "132"
        console.log(uid);                           // "132"
        
        let uid2 = Symbol.for('uid');               

        console.log(uid === uid2);                  // true
        console.log(object[uid2]);                  // "132"
        console.log(uid2);                          // "Symbol(uid)"
    ```
    从上面可以看出，uid和uid2包含相同的Symbol并且可以互换使用。第一次调用Symbol.for()方法创建这个Symbol，第二次调用可以直接从Symbol的全局注册表中检索到这个Symbol。
    
    另外，可以使用Symbol.keyFor()方法在Symbol全局注册表中检索与Symbol有关的键，举个栗子：
    
    ```javascript
        let name = Symbol('uid');
        console.log(Symbol.keyFor(name));                    // undefine
        
        let age = Symbol.for('uid');        
        console.log(Symbol.keyFor(age));                     // "uid"
    ```
    
    

 4. Symbol与类型强制转换
 
    不能将Symbol强制转换为字符串和数字类型，举个栗子：

    ```javascript
        let uid = Symbol.for('uid');
        
        console.log(String(uid));                               // "Symbol(uid)"
        console.log(uid + "");                                  // 报错！
        console.log(uid/1);                                     // 报错！
    ```
    
    **需要注意的是，Symbol与Javascript中的非空值类似，其等价布尔值为true**
    
    

 5. Symbol属性检索
 
    ES6 中添加一个Object.getOwnPropertySymbols()方法来检索对象中的Symbol属性，它的返回值是一个包含所有Symbol自有属性的数组，举个栗子：

    ```javascript
        let uid = Symbol.for('uidNum');
        let object = {
            [uid]:  '123'
        };
        
        let symbols = Object.getOwnPropertySymbols(object);
        
        console.log(symbols.length);                        // 1
        console.log(symbols[0]);                            // "Symbol(uid)"
        console.log(object[symbols[0]]);                    // "123"
    ```
    
    

 6. 通过well-known Symbol暴露内部操作
 
    well-known Symbol为标准对象定义了一些以前只在语言内部可见的功能，它使用的是像symbol.hasInstance属性这样的全局Symbol常量。这些Symbol统一使用Symbol作为前缀。标准中规定，开发者可以通过多种方法修改对象的特性。