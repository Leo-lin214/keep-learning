#### 一、ES6的开发环境搭建

> 疑惑点有两个：

  1. .babelrc文件的作用是什么？
  
  2. package.json中的scripts作用是什么？
  
> 总结点

  1. npm init -y可以默认全部选项同意，不需要一次次按回车完成;
  
  2. 全局安装完babel-cli后就可以结合其他选项进行转化ES6->ES5，执行的命令为：
  
  ```javascript
    babel src/index.js -o dist/index.js
  ```
  

#### 二、新的声明方式

> 总结点

 1. var一般用于全局变量的声明，而let一般则用于局部变量的声明，const则用于常量的声明;

    举个栗子：
    
    ```javascript
        var a=2;
        {
            var a=3;
        }
        console.log(a);             // 3
        
        {
            let b = 5;
        }
        console.log(b);             // 报错，is not defined
    ```
 2. let声明可以连续声明变量，举个栗子：
  
    ```javascript
        let a, b, c;
        
        // 相当于
        
        var a, b, c;
    ```
    


#### 三、变量的解构赋值

> 总结点

 1. 数组模式的解构赋值可以简单理解为等号左边和等号右边的形式要统一，如果不统一，很可能获得undefined或者直接报错;
 2. 解构赋值中对于默认值，需要注意undefined和null的区别，undefined相当于什么都没有，null则相当于有值，值为null，举个栗子：
 
    ```javascript
        let [a, b='lin'] = ['hq', undefined];
        console.log(a+b);   // hqlin
        
        let [c, d='lin'] = ['hq', null];
        console.log(c+d);   // hqnull
    ```
    
    
 3. 数组的解构赋中的元素是按次序排列的，变量的取值由它的位置决定，而对象的解构赋值属性是没有次序的，变量必须与属性同名，才能渠道正确的值;
 4. 圆括号的使用
 
    如果在解构之前就定义了变量，这时候如果你使用这个变量进行解构赋值将会报错，例如：

    ```javascript
        let foo;
        {foo} = {foo: 'hha'};
        console.log(foo);
    ```
    
    这时候就需要加上圆括号即可解决：
    
    ```javascript
        let foo;
        ({foo} = {foo: 'haha'});
        console.log(foo);
    ```
    
    



#### 四、扩展运算符和rest运算符

> 总结点

 1. 扩展运算符和rest运算符拥有相同的语法，不同的是，rest参数是把所有的参数收集起来换成数组，而扩展运算符是把数组扩展成单独的参数;
 
    举个栗子：

    ```javascript
        // 扩展运算符
        var myArr = [5, 10, 15];
        console.log(...myArr);      // 5, 10, 15
        
        // rest参数
        function aa(...args){
            console.log(args);
        }
        aa(1, 2, 3);               // [1, 2, 3]
    ```
    
    

 2. 无论是哪种运算符，总之转换的技巧都是：
 
    ```javascript
        1, 2, 3 = ...[1, 2, 3];
    ```
    
    

 3. 扩展运算符的用处
 
    举个栗子，声明两个数组arr1和arr2，然后我们把arr1赋值给arr2，然后改变arr2的值，你会发现arr1的值也会改变了，因为这是对内存堆栈的引用，而不是真正的赋值

    ```javascript
        let arr1 = ['a', 'b', 'c'],
            arr2 = arr1;
        console.log(arr2);
        arr2.push('d');
        console.log(arr1);  // ['a', 'b', 'c', 'd']
    ```
    
    巧妙地使用扩展运算符可以有效地解决这个问题
    
    ```javascript
        let arr1 = ['a', 'b', 'c'],
            arr2 = [...arr1];
        console.log(arr2);
        arr2.push('d');
        console.log(arr1);  // ['a', 'b', 'c', 'd']
    ```
    
    

 4. 对于rest运算符，可以使用for...of循环来进行打印其中的值，举个栗子：
 
    ```javascript
        function aa(a, ...args){
            for(let val of args) {
                console.log(val);
            }
        }
        console.log(1, 2, 3);   // 2 3
    ```
    
    

 5. 需要注意的是，扩展运算符和rest运算符能用于数组中的任何类型数值，举个栗子：
 
    ```javascript
        let arr = ['aa', {'name': 'andraw', 'haha': {'name': 'Tom'}}, 12, function bb(){}];
        console.log(...arr);        // aa {name: "andraw", haha: {…}} 12 ƒ bb() {}
    ```
    

#### 五、字符串模板

> 总结点

 1. 字符串模板使用的表达式是${变量}，而且还能支持html标签，举个栗子：
 
    ```javascript
        let aa = 'haha',
            bb = `<b>sdddddasdsdasd</b>${aa}<br/>`;
        console.log(bb);
    ```
    
    
 2. 字符串的查找，es5中的是indexOf()，只能返回指定的位置，而es6值中的includes()方法则是返回布尔值;
 
 3. 字符串判断开头是否存在用的是startsWith()方法，判断结尾是否存在用的是endsWith()方法，举个栗子：
 
    ```javascript
        let aa = 'hasdqw';
        console.log(aa.startsWith('ha'));
        console.log(aa.endsWith('w'));
    ```
    
    
 4. 字符串的复制，举个栗子：
 
    ```javascript
        console.log('ab'.repeat(3));    // ababab
    ```
    


#### 六、数字操作

> 总结点

 1. 判断一个变量是否为数字，可以使用Number.isFinite(xx)，只要是数字不管是否为浮点数还是整数，都会返回true，其他则返回false，举个栗子：
 
    ```javascript
        console.log(Number.isFinite(1));    // true
        console.log(Number.isFinite('1'));  // false
        console.log(Number.isFinite(undefined));    // false
        console.log(Number.isFinite(NaN));  // false
        console.log(Number.isFinite(null)); // false
    ```
    
    
 2. NaN是特殊的非数字，可以使用Number.isNaN()进行验证，举个栗子：
 
    ```javascript
        console.log(Number.isNaN(NaN));     // true  
    ```
    
 3. 判断是否为整数可以使用Number.isInteger(xxx);
 4. 整数转换使用Number.parseInt(xxx)，浮点型转换使用Number.parseFloat(xxx)，举个栗子：
 
    ```javascript
        let a = 123.1;
        console.log(Number.parseInt(a));    // 123
        console.log(Number.parseFloar(a));  // 123.1
    ```
    
    
 5. 整数取值范围为最小安全整数到最大安全整数，最大安全整数为Number.MAX_SAFE_INTEGER，最小安全整数为Number.MIN_SAFE_INTEGER，如果判断一个数是否超过安全整数范围可以使用Number.isSafeInteger()方法，举个栗子：
 
    ```javascript
        let a = Math.pow(2, 53) - 1;
        console.log(Number.isSafeInteger(a));   // false
    ```
    
    

#### 七、新增的数组的知识

> 疑惑点

 1. eval()方法效率低下的原因？
 2. Array.form()方法底层是如何将一个json数组格式转换为一个真正的数组的？

 
> 总结点
 

 1. 一个标准的JSON的数组格式即是一个json中添加一个length属性，举个栗子：
 
    ```javascript
        let json = {
            '0': 'a',
            '1': 'b',
            '2': 'c',
            length: 3
        }
    ```
    
    
 2. Array.from()方法能够将一个json数组格式转化为一个真正的数组，举个栗子：
 
    ```javascript
        let json = {
            '0': 'a',
            '1': 'b',
            '2': 'c',
            length: 3
        }
        console.log(Array.from(json));      // ['a', 'b', 'c']
    ```
    
    需要注意的是，当json数组格式中存在非常规的属性时，转化时将根据length属性来确定最终数组的元素的个数，非常规的属性将不会加入到转化后的数组的中，举个栗子：
    
    ```javascript 
        let json = {
            '0': 'a',
            'a': 'b',
            '5': 'c',
            length: 3
        }
        console.log(Array.from(json));      // ['a', undefined, undefined]
    ```
    
 3. Array.of()方法是负责将一堆文本或者变量转换成数组，变量可以是任意类型，举个栗子：
 
    ```javascript
        let arr = Array.of('a', 1, {'name': 'andraw'});
        console.log(arr);   // ["a", 1, {…}]
    ```
    
    
    
 4. 数组的实例find()方法，所谓的实例方法不是以Array对象开始的，而是必须有一个已经存在的数组的才能调用的方法，find()方法接收一个匿名函数，函数必须传入三个参数：
 
    - value： 表示当前查找的值;
    - index： 表示当前查找的数组索引;
    - arr： 表示当前数组;
    
    当在寻找过程中，一旦遇到符合条件的数组元素就立即return并停止查找下去，举个栗子：

    ```javascript
        let arr = [1, 2, 3, 4, 5];
        console.log(arr.find(function(value, index, arr) {
            return value > 2;
        }));        // 3
    ```
    
    

 5. 数组的实例fill()方法，负责把数组进行填充，接收三个参数，第一个参数是填充的变量，第二个是开始填充的位置，第三个是填充到的位置，举个栗子：
 

    ```javascript
        let arr = [1, 2, 3, 4, 5];
        arr.fill('aa', 2, 5);
        console.log(arr);       // [1, 2, 'aa', 'aa', 'aa']
    ```
    
    

 6. 数组的遍历使用for...of...循环进行，举个栗子：
 
    ```javascript
        let arr = ['a', 1];
        for(let item of arr) {
            console.log(item);          // 'a' 1
        }
    ```
    
    有时候开发中需要用数组的索引的，那就可以使用keys()方法实现，举个栗子：
    
    ```javascript
        let arr = ['a', 1];
        for(let item of arr.keys()) {
            console.log(item);          // 0 1
        }
    ```
    
    有时候想索引和值都输出，那就需要用到entries()方法，举个栗子：
    
    ```javascript
        let arr = ['a', 1];
        for(let [index, item] of arr.entries()) {
            console.log(index + '---' + item);          
        }
    ```
    
    

 7. entries()实例方法生成的是Iterator形式的数组，这时候就可以直接让我们在需要时用next()方法手动跳转到下一个值，举个栗子：
 
    ```javascript
        let arr = ['a', 1];
        let list  = arr.entries();
        console.log(list.next().value);     // [0, 'a']
        console.log(list.next().value);     // [1, 1]
        console.log(list.next().value);     // undefined
    ```
    

#### 八、箭头函数和扩展

> 总结点

 1. ES6允许函数添加默认值，举个栗子：
 
    ```javascript
        function add(a, b=1) {
            return a+b;
        }
        console.log(add(1));        // 2
    ```
    
    还允许函数主动抛出错误，可以直接使用throw new Error(xxx)抛出错误，举个栗子：
    
    ```javascript
        function add(a, b=1) {
            if(a==1) {
                throw new Error('This is error');
            }
            return a+b;
        }
        console.log(add(1));
    ```
    
    
 2. ES6允许函数体内写上严谨模式，即```use strict```，而以前只能放到代码的最上边，相当于全局的使用，如果在函数内使用，即相当于针对函数来使用，需要注意的是，ES6中有一个坑，就是如果函数使用了参数的默认值形式，再在函数内使用严谨模式的话，就会抛出异常，所以在对函数使用严谨模式的同时，不能使用对函数是使用严谨模式，举个栗子：
 
    ```javascript
        function add(a, b) {
            'use strict'
            if(a == 0) {
                throw new Error('This is error');
            }
            return a+b;
        }
        console.log(add(1, 2));
    ```
    
    
 3. 对函数名（包括匿名函数名）使用```xxx.length```，即可获得这个函数中需要传递的参数个数，举个栗子：
 
    ```javascript
        let ad = function(a, b=2) {
            return a+b;
        }
        console.log(ad.length);     // 1
    ```
    
    需要注意的是，如果函数中有参数使用了默认值形式，则length中将会剔除这个有默认值的个数，所以上述就是返回了1而不是返回了2;
    
    
 4. 箭头函数的一个栗子：

    ```javascript
        var add = (a, b) => {
            console.log(1);
            return a+b;
        }
        
        // 相当于
        
        var add = function(a, b) {
            console.log(1);
            return a+b;
        }
    ```
    

#### 九、函数和数组的补漏

> 总结点

 1. 函数参数的解构可以分为对象的函数解构和数组的函数解构

    - 对象的函数解构
    
      在对后端返回的JSON格式的数据作为函数参数处理时，可以有效地使用对象的函数解构来处理，举个栗子：
      
      ```javascript
        let json = {
            a: '1',
            b: 'b'
        }
        function fun({a, b='3'}) {
            consolelog(a, b);
        }
        fun(json);
      ```
   
 
    - 数组的函数解构
    
      ```javascript
        let arr = ['a', 1];
        function aa(a, b) {
            console.log(a, b);
        }
        aa(...arr);
      ```
      
      

 2. in可以用于判断对象或者数组中是否存在某个值
 
    - 对象的判断
    
      ```javascript
        let obj = {
            a: '1',
            b: '2'
        }
        console.log('a' in obj);        // true
      ```
      
    - 数组的判断
    
      ```javascript
        let arr = [, '', undefined];
        console.log(0 in arr);          // false
        console.log(1 in arr);          // true
        console.log(2 in arr);          // true
      ```
      
      

 3. 数组的遍历方法
 
    - forEach
    
      ```javascript
        let arr = [1, 2, 3];
        arr.forEach((val, index) => console.log(index, val));
      ```
      
    - filter
    
      ```javascript
        let arr = [1, 2, 3];
        console.log(arr.filter(x => x>1));      // [2, 3]
      ```
      
    - some
    
      ```javascript
        let arr = [1, 2, 3];
        console.log(arr.some(x => x>1));        // true
      ```
      
      some遍历只需要一个符合要求即返回true，如果有全部都不符合就返回false
      
    - every
    
      ```javascript
        let arr = [1, 2, 3];
        console.log(arr.every(x => x>1));       // false
      ```
      
      every遍历只需要一个不符合要求即返回false，如果全部都符合即返回true
      
      
    - map
    
      ```javascript
        let arr = [1, 2, 3];
        console.log(arr.map(x => x>1));       // [false, true, true]
        
        // map遍历还能用于替换的作用
        console.log(arr.map(x => 'haha'));      // ["haha", "haha", "haha"]
      ```
      
     

 4. 数组转换为字符串可以使用join()方法和toString()方法，区别就是join()方法可以通过添加一些指定的分隔号来分隔不同元素，而toString()方法则是在转化后包含有逗号，举个栗子：
 
    ```javascript
        let arr = [1, 2, 3];
        console.log(arr.join('-'));     // 1-2-3
        console.log(arr.toString());    // 1,2,3
    ```
    


#### 十、ES6中的对象

> 疑惑点

 

 1. ES6中有一个对象浅复制的方法是哪个？
 

> 总结点

 1. ES6允许把声明的变量直接赋值给对象，举个栗子：
 
    ```javascript
        let name = 'andraw'，
            aa = function() {
                console.log(1);
            };
        let obj = {name};
        console.log(obj);       // {'name': 'andraw', aa: f}
    ```
    
 2. 有时候要根据后端返回的数据来确定一个对象属性的Key值，可以使用[]形式来对形象的构建，举个栗子：
 
    ```javascript
        let key = 'skill';
        var obj = {
            [key]: 'web'
        }
        console.log(obj.skill);     // web
    ```
    
    
 3. Object.is()方法能够进行对象值的比较，而在以前则可以使用===来判断，举个栗子：
 
    ```javascript
        var obj1 = {name: 'andraw'};
        var obj2 = {name: 'andraw'};
        console.log(obj1.name === obj2.name);   // true
        console.log(Object.is(obj1.name, obj2.name));    // true
    ```
    
    区分===和is方法的区别是什么，可以先看看下面的代码：
    
    ```javascript
        console.log(+0 === -0);         // true
        console.log(NaN === NaN);       // false
        console.log(Object.is(+0, -0));     // false
        console.log(Object.is(NaN, NaN));       // true
    ```
    
    别人给的记忆就是：===为同值相等，is()为严格相等
    
    
    
 4. Object.assign()能够用于将几个对象合并起来，举个栗子：
 
    ```javascript
        var a = {a: '1'};
        var b = {b: 'web'};
        console.log(Object.assign(a, b));       // {a: '1', b: 'web'}
    ```
    
    
#### 十二、Symbol在对象中的作用


> 疑惑点

 1. for...of...循环和for...in...循环的区别

> 总结点

 1. symbol的声明
 
    ```javacript
        let a = Symbol();
        let b = Symbol('haha');
        
        console.log(typeof a);      // symbol
        console.log(b);             // Symbol(haha)
        console.log(b.toString());  // Symbol(haha)
    ```
    
    需要注意的是，没有的toString的是红字，有toString的是黑字;
    
    
 2. 在对象中，可以使用Symbol构建对象的Key，并进行调用和赋值，举个栗子：
 
    ```javascript
        let haha = Symbol(),
            obj = {
                [haha]: 'hehe'
            };
        console.log(obj[haha]);     // hehe
        obj[haha] = 'hihi';
        console.log(obj[haha]);     // hihi
    ```
    
    
 3. Symbol类型能够对对象元素起到保护的作用，例如在一个对象中有很多值，在循环输出时，并不希望全部输出，可以使用Symbol进行保护，举个栗子：
 
    ```javascript
        let haha = Symbol(),
            obj = {
                name: 'andraw',
                skill: 'fe',
                [haha]: 'hehe'
            } ;
        for(let item in obj) {
            console.log(obj[item]);
            // andraw
            // fe
        }
        console.log(obj);   // {name: "andraw", skill: "fe", Symbol(): "hehe"}
    ```
    
    


#### 十三、Set和WeakSet数据解构

> 总结点

 1. Set的声明，举个栗子：
 
    ```javascript
        let arr = new Set([1, 2, 1]);
        console.log(arr);       // Set(2) {1, 2}
    ```
    
    Set和Array的区别是Set不允许内部有重复的值，如果有就显示一个，相当于去重，虽然Set很像数组，但他不是数组;
    
    
 2. Set值的增删查
 
    - 加add：

      ```javascript
        let arr = new Set([1, 2, 1]);
        console.log(arr);           // Set(2) {1, 2}
        console.log(arr.add(3));    // Set(3) {1, 2, 3}
        console.log(arr);           // Set(3) {1, 2, 3}
      ```
      
      add方法一次只能添加一个值，如果添加的值跟原来有重复，就会去掉;
      
    - 删delete：
    
      ```javascript
        let arr = new Set([1, 2, 3]);
        console.log(arr);           // Set(2) {1, 2}
        console.log(arr.delete(1)); // true
        console.log();              // Set(1) {2}
      ```
      
      delete方法同样也是一次只能删掉一个值;
      
    - 查has：
    
      用has进行的值的查找，返回的是true或false，举个栗子： 
      
      ```javascript
        let arr = new Set([1, 2, 1]);
        console.log(arr.has(1));            // true
      ```
      
    - 清clear：
    
      clear方法能够清掉set集合值中所有值，举个栗子：
      
      ```javascript
        let arr = new Set([1, 2]);
        console.log(arr.clear());           // undefined
        console.log(arr);                   // Set(0) {}
      ```
      
      

 3. Set集合遍历使用的是for...of...方法，举个栗子：
 
    ```javascript
        let arr = new Set([1, 2, 3]);
        for(let item of arr) {
            console.log(item);          
            // 1
            // 2
            // 3
        }
    ```
    另外还可以使用forEach方法进行遍历，举个栗子：
    
    ```javascript
        let arr = new Set([1, 2]);
        arr.forEach((item) => console.log(item));   // 1 2
    ```
    

 4. Set可以使用size属性来获取集合中元素的个数，举个栗子：
 
    ```javascipt
        let arr = new Set([1, 2, 1]);
        console.log(arr.size);          // 2
    ```
    
    

 5. WeakSet集合只能用于对象，另外，不能直接在new的时候就放入值，不然将报错，举个栗子：
 
    ```javascript
        let weakObj = new WeakSet(),
            obj = {a: '1', b: '2'},
            obj1 = obj;
            
        weakObj.add(obj);
        console.log(weakObj);
        weakObj.add(obj1);
        console.log(weakObj);
    ```
    
    上方输出的值都是只有一个值，因为，两个值是重复的，所以去重处理;
    
    


#### 十四、Map数据结构

> 总结点

 1. Map数据结构的声明以及增删查清，Map可以看作是键值对
 
    - 增set：

      ```javascript
        let map = new Map();
        map.set('name', 'andraw');
        console.log(map);           // Map(1) {"name" => "andraw"}
      ```
      
      需要注意的是，map的key值可以是任意类型的值，可以是对象，字符串等等，举个栗子：
      
      ```javascript
        let map = new Map(),
            json = {
                'name': 'Tom'
            };
        map.set(json, 'andraw');
        console.log(map);           // Map(1) {{…} => "andraw"}
      ```
      
    - 取值get：
    
      ```javascript
        let map = new Map(),
            json = {
                'name': 'Tom'
            };
        map.set(json, 'andraw');
        console.log(map.get(json));     // andraw
      ```
      
    - 删delete：
    
      ```javascript
        let map = new Map(),
            json = {
                'name': 'Tom'
            };
        map.set(json, 'andraw');
        console.log(map.delete(json));      // true
        console.log(map);                   // Map(0) {}
      ```
      
    - 清clear和查has：
    
      ```javascript
        let map = new Map(),
            json = {
                'name': 'Tom'
            };
        map.set(json, 'andraw');
        console.log(map.has(json));         // true
        console.log(map.clear());           // undefined
        console.log(map);                   // Map(0) {}
      ```
      
    - size：
    
      ```javascript
        let map = new Map(),
            json = {
                'name': 'Tom'
            };
        map.set(json, 'andraw');
        console.log(map.size);              // 1
      ```
      

#### 十五、用Proxy对对象进行预处理

> 总结点

 1. Proxy的存在能够使函数加上钩子函数，即可理解为在执行方法前预处理一些代码，举个栗子：
 
    ```javascript
        let pro = new Proxy({}, {
            get: (target, key, property) => console.log('haha')
        });
        pro.aa;                 // haha
        pro.bb;                 // haha
    ```
    
    
 2. get属性接收三个参数：
 
    - target：要进行预处理的目标对象，相当于上述的{};
    - key：预处理过程的Key值，相当于对象的属性，例如上述的aa和bb;
    - property：这个不太常用，目前还不清楚具体用法;
    

    set属性是在要改变Proxy属性值时，进行的预处理，共接收四个参数：
    
    - target：要进行预处理的目标对象;
    - key：预处理过程的Key值，相当于对象的属性;
    - value：要设置成的值;
    - receiver：改变前的原始值;
    
    举个栗子：
    
    ```javascript
        let pro = new Proxy({
            aa: 2
        }, {
           set: (target, key, value, receiver) => console.log(target, key, value, receiver);
        });
        pro.aa = 8;         // {aa: 2} "aa" 8 Proxy {aa: 2}
    ```
    
    

 3. apply的作用是调用内部的方法，它是使用在方法体是一个匿名函数时，举个栗子：
 
    ```javascript
        let pro = new Proxy(function(a, b) {
            return a+b;
        }, {
            apply: (target, ctx, args) => {
                return Reflect.apply(target, {}, args);
            }
        });
        console.log(pro(1, 1));         // 2
    ```
    


#### 十六、class类的使用

> 总结点

 1. 类的声明以及使用，举个栗子：
 
    ```javasceipt
        class order {
            name(val) {
                console.log(val);
                return val;
            }
            skill(val) {
              console.log(`${this.name('andraw')} is a good ${val}!`);
            }
        }
        let obj = new order;
        obj.name('andraw');     // andraw
        obj.skill('boy');       // andraw is good boy!
    ```
    
    需要注意的是，在类中声明方法时，两个方法就不需要再写逗号了，另外```this```指类本身;
    
 2. 在类的参数传递中，使用constructor进行传参，传递参数后，可以直接使用```this.xxx```进行调用，举个栗子：
 
    ```javascript
        class Order {
            constructor(a, b) {
                this.a = a;
                this.b = b;
            }
            add() {
                return this.a + this.b;
            }
        }
        let obj = new Order(1, 2);
        console.log(obj.add());         // 3
    ```
    
    
    
 3. class的继承通过使用extends实现，举个栗子：
 
    ```javascript
        class Order {
            add(a, b) {
                return a + b;
            }
        }
        class newOrder extends Order {}
        let obj = new newOrder;
        obj.add(1, 1);          // 2
    ```