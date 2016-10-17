Tags：ES6学习总结

## Learning Summary In ES6

 - [(一) 变量与字符串](#一-变量与字符串)
 - [(二) 数值](#二-数值)
 - [(三) 数组](#三-数组)
 - [(四) 对象](#四-对象)
 - [(五) 函数](#五-函数)
 - [(六) Set](#六-set)
 - [(七) Map](#七-map)
 - [(八) Iterator ( 遍历器 ) 和 For...Of...]()

### (一) 变量与字符串

 1. let 变量

    - let 的作用类似于 var , 用来声明变量, 但是所声明的变量, 只在 let 命令所在的代码块内有效, 例如: 
    
       ```javascript
        if(true){
            var a = 1;
            let b = 2;
        }
        console.log(a);                 //输出为1
        console.log(b);                 //报错: ReferenceError: b is not defined
       ```
       
    - let 声明的变量会有声明提升, 例如: 
    
      ```javascript
        console.log(a);                 //undefined
        console.log(b);                 //undefined
        var a = 10;
        let b = 10;
      ```
      
    - 在for循环的计数器中, 很适合使用 let 命令声明的变量, 例如:
    
      ```javascript
        var a = []; 
        for(let i = 0; i<10;i++){
            a[i] = function(){
                console.log(i);
            }
        }
        a[3]();                             //输出的为: 3 
      ```
 
 2. const 常量
 
    - const 声明的是常量, 一旦声明, 值将是不可变的, 例如: 
    
      ```javascript
        const i = 10;
        i = 1;                      //报错
        const i = 5;                //报错
      ```
      
    - const 也是具有块级作用域
    
      ```javascript
        if(1){
            const i = 10;
        }
        console.log(i);             //报错: ReferenceError
      ```
      
    - const 声明的常量能变量提升 ( 必须先声明后使用 ) , 例如:
    
      ```javascript
        if(1){
            console.log(a);         //输出为 undefined
            const a = 10;
        }
      ```
      
    - const 不可重复声明, 例如:
    
      ```javascript
        var message = "Hello!";
        let age = 25;
 
        // 以下两行都会报错
        const message = "Goodbye!";
        const age = 30;
      ```
     
    - const 指令指向变量所在的地址，所以对该变量进行属性设置是可行的（未改变变量地址），如果想完全不可变化（包括属性），那么可以使用冻结, 例如: 
    
      ```javascript
        const C1 = {};
        C1.a = 1;
        document.write(C1.a);       // 1 
        C1 = {};                    // 报错  重新赋值，地址改变
         
        //冻结对象，此时前面用不用const都是一个效果
        const C2 = Object.freeze({}); 
        C2.a = 1;                   //Error,对象不可扩展
        document.write(C2.a);
      ```

 3. 是否包含字符串的三种新方法
 
    传统上, javascript 只有 indexOf() 方法, 可以用来确定一个字符串是否包含在另一个字符串中, 在ES6中又提供了三种新方法: 

    - includes() : 
    
      返回布尔值, 表示是否找到了参数字符串, 例如: 
      
      ```javascript
        var str = "Hello World";
        str.includes("o");                      // 返回true
      ```
      
    - startsWith() : 
    
      返回布尔值, 表示参数字符串是否在源字符串的头部, 例如: 
      
      ```javascript
        var str = "Hello World";
        str.startsWith("o");                    // 返回false
      ```
      
    - endsWith() : 
    
      返回布尔值, 表示参数字符串是否在源字符串的尾部, 例如: 
      
      ```javascript
        var str = "Hello World";
        str.endsWith("ld");                     // 返回true
      ```
      
    - 另外, 这三个方法都支持第二个参数, 表示开始搜索的位置, 例如: 
    
      ```javascript
        var str = "Hello World";
        str.includes("o", 6);                   // 返回true
        str.startsWith("or", 6);                // 返回false
        str.endsWith("ld", 6);                  // 返回true
      ```
      在上面的代码里面, 可以看出, 对于第二个参数, endsWith() 方法与其他两个方法有所不同, 它针对的是前 n 个字符, 而其他两个方法针对的是从第 n 个位置直到字符串结束;      

 4. repeat () 方法
 
    repeat () 返回一个新字符串, 表示将原字符串重复 n 次, 例如: 

    ```javascript
        var str = "Andraw-lin";
        console.log(str.repeat(2));     //输出: Andraw-linAndraw-lin    
    ```
    
 5. 模板字符串

    - 模板字符串中, 支持字符串的插值, 例如:
    
      ```javascript
        let name = "Andraw-lin";
        $("#test").append(`Hello ${name}`);     //输出: Hello Andraw-lin
      ```
      
    - 模板字符串还可以包含多行, 例如: 
    
      ```javascript
        let multiLine = `
            This is
            a string
            with multiple
            lines
            `;
        document.write(multiLine);  
      ```
 
 6. 标签模板
 
    先举个例子: 

    ```javascript
        var a = 5,
            b = 10;
        tag`Hello ${a+b} world ${a*b}`;     //注意, 前面的tag可以换成自定义名字
    ```
    
    由上面的代码可以看出, 模板字符串前面有一个标识名, 它是一个函数, 整个表达式的返回值, 就是tag函数处理模板字符串后的返回值, 这时候tag函数的所有参数的实际值如下: 
    
    - 第一个参数: ["Hello ", 'world '];
    - 第二个参数: 15 ( 即a+b的结果 );
    - 第三个参数: 50 ( 即a*b的结果 );
    
    下面是一个完整的例子程序: 
    
    ```javascript
        var a = 5,
            b = 10;
        function tag(s, v1, v2){
            document.write(s[0]);
            document.write(s[1]);
            document.write(v1);
            document.write(v2);
            return OK;
        }
        tag`Hello ${a+b} world ${a*b}`; 
        //输出结果为: "Hello "
        // "world "
        // 15
        // 50
        // "OK"
    ```
    
 7. String.raw () 方法
 
    模板字符串可以是原始的 ( 所谓的原始就是不会转义任何字符,任何字符都会以普通字符串的方式来输出 ), 若使用 String.raw 作为模板字符串的前缀, 则模板字符串可以是原始的, 反斜线也不再是特殊字符, \n 也不会被解析成换行符 ( 需要注意的是如果字符串里包含有html标签, 则会转义相对应的Dom元素 ), 例如:

    ```javascript
        let str = String.raw`Not a newline: \n<br/>Hello World`;
        document.write(str);
        //输出结果为: 'Not a newline:'
        // 'Hello World'
    ```
    


### (二) 数值

 1. 判断值是否为无穷或者NaN
    
    Number.isFinite ( ) 和 Number.isNaN ( ) 两个方法用来检查 Infinite 和 NaN 这两个特殊值, 例如: 
    
    Number.isFinite( ) 用来检查一个数值是否 非 无穷
    
    ```javascript
        // 判断是否
        Number.isFinite(15);                    // true
        Number.isFinite(0.8);                   // true
        Number.isFinite(NaN);                   // false
        Number.isFinite(Infinity);              // false
        Number.isFinite(-Infinity);             // false
        Number.isFinite("foo");                 // false
        Number.isFinite("15");                  // false
        Number.isFinite(true);                  // false
    ```
    
    Number.isNaN( ) 用来检查一个值是否为NaN
    
    ```javascript
        Number.isNaN(NaN);                  // true
        Number.isNaN(15);                   // false
        Number.isNaN("15");                 // false
        Number.isNaN(true);                 // false
    ```
    
 2. 值是否为整数
 
    Number.isInteger( ) 用来判断一个值是否为整数, 在javascript内部, 整数和浮点数是同样的储存方法, 所以 3 和 3.0 被视为同一个值, 例如: 

    ```javascript
        Number.isInteger(25)            // true
        Number.isInteger(25.0)          // true
        Number.isInteger(25.1)          // false
        Number.isInteger("15")          // false
        Number.isInteger(true)          // false
    ```
    
 3. Math 对象
 
    Math 对象新增的方法, 都是静态的方法, 只能在Math对象上调用.

    - Math.trunc( ) : 
      去除一个数的小数部分, 返回整数部分, 例如: 
    
      ```javascript
        Math.trunc(4.1);            //输出: 4
        Math.trunc(-4.1);           //输出: -4
        Math.trunc("23");           //输出: 23
        Math.trunc("23dsadsa");     //输出: NaN
        Math.trunc("");             //输出: 0
      ```
      
      注意: 对于空值和无法截取整数的值, 返回 NaN
      
    - Math.sign( ) : 
      判断一个数到底是正数, 负数, 还是0, 返回值有五种: 参数为正数, 返回+1; 参数为负数, 返回-1; 参数为0, 返回0; 参数为-0, 返回-0; 其他值, 返回NaN;
      
      ```javascript
        Math.sign(-5);                   // -1
        Math.sign(5);                    // +1
        Math.sign(0);                    // +0
        Math.sign(-0);                   // -0
        Math.sign('hubwiz');             // NaN
      ```
     
    - Math.cbrt( ) : 
    
      计算一个数的立方根, 例如: 
      
      ```javascript
        Math.cbrt(-1);                  // -1
        Math.cbrt(0);                   // 0
        Math.cbrt(2);                   // 1.2599210498948732
      ```
      
    - Math.fround( ) :
    
      返回一个数的单精度浮点数形式, 例如: 
      
      ```javascript
        Math.fround(0);                 // 0
        Math.fround(1.337);             // 1.3370000123977661
        Math.fround("asdasd");          // NaN
        Math.fround("1.264");           // 1.2640000581741333
      ```
      
    - Math.hypot( ) : 
    
      返回所有参数的平方和的平方根, 例如: 
      
      ```javascript
        Math.hypot(3, 4);               // 5
        Math.hypot(3, 4, 5);            // 7.0710678118654755
        Math.hypot();                   // 0
        Math.hypot(NaN);                // NaN
        Math.hypot(3, 4, 'foo');        // NaN
        Math.hypot(3, 4, '5');          // 7.0710678118654755
        Math.hypot(-3);                 // 3
      ```
      
      注意: 如果参数不是数值, Math.hypot方法会将其转为数值, 只要有一个参数无法转为数值, 就会返回NaN;

### (三) 数组

 1. 将两类对象转为真正的数组 ( Array.from )
 
    Array.from ( ) 方法用于将两类对象转为真正的数组: 类似数组的对象和可遍历的对象, 例如; 

    ```javascript
        var obj = {
            0: "yeah",
            "1": "haha",
            name: "Andraw",
            length: 4
        };
        var str = Array.from(obj);
        console.log(str);       //输出为: ["yeah", "haha", undefined, undefined];
    ```
    注意: 转为数组的时候, 必须带有length属性, 否则无法把对象或者字符串转化为数组, 即空数组 [ ];
    
    Array.from ( ) 还接收第二个参数, 作用类似数组的map的方法, 用来对每个元素进行处理, 也可传一个函数作为第二个参数, 例如: 
    
    ```javascript
        var str = "Andraw";
        var arr = Array.from(str, function(x){
            console.log(x);
        });
        // 输出为: ["A", "n", "d", "r", "a", "w"];
    ```
    Array.from()的一个应用是: 将字符串转为数组, 然后返回字符串的长度, 这样可以避免JavaScript将大于\uFFFF的Unicode字符(即汉字), 算作两个字符的bug.
    

 2. 将值转换为数组 ( Array.of )
 
    Array.of方法用于将一组值, 转换为数组, 例如: 

    ```javascript
        Array.of(3, 11, 8);             // 输出为: [3, 11, 8]
        Array.of(3);                    // 输出为: [3]
        Array.of(3).length;             // 输出为: 1
    ```
    
    Array.of( ) 这个方法的主要目的是, 弥补数组构造函数的缺陷, 因为在数组构造函数里会根据参数个数的不同导致Array( ) 的行为有差异, 例如:
    
    ```javascript
        Array();                        // 输出为: []
        Array(3);                       // 输出为: [undefined, undefined, undefined]
        Array(3, 11);                   // 输出为: [3, 11]
    ```
    
    上面代码说明, 对于数组的构造函数, 值有当参数个数不少于2个! ! !  Array( ) 才会返回由参数组成的新数组;
    

 3. 找出第一个符合条件的数组成员和位置 ( find和findIndex )
 
    - find 方法
    
      用于找出第一个符合条件的数组成员, 只要找到第一个符合条件的数组元素, 即返回该元素, 如果找不到符合的成员, 则返回 undefined, 例如:

      ```javascript
        var arr = [1, -5, -2, 3, 0].find(function(value, index, arr){
            return value<0;
        });
        console.log(arr);               // 输出为: -5
      ```
      
      find 中的回调函数的参数依次是: 当前的值, 当前的位置, 原数组;
      
    - findIndex 方法
    
      用法与 find 方法非常类似, 返回第一个符合条件的数组成员的位置, 如果所有成员都不符合条件, 则返回 -1 ,例如: 
      
      ```javascript
        var arr = [1, 5, 10, 15].findIndex(function(value, index, arr){
            return value > 9;
        });
        console.log(arr);               // 输出为: 2
      ```
      
      注意: ES5中的 indexOf 方法无法识别数组的NaN成员, 但是 findIndex 方法可以借助 Object.is 方法做到, 例如: 
      
      ```javascript
        [NaN].indexOf(NaN);                         // 输出为: -1
        [NaN].findIndex(function(value){
            return Object.is(NaN, value);           // 输出为: 0
        });
      ```
      
 4. 填充数组 ( fill )
 
    fill ( ) 使用给定值, 填充一个数组, 例如: 

    ```javascript
        var arr = ["a", "b", "c"].fill(7);  
        console.log(arr);                   // 输出为: [7, 7, 7];
        var str = new Array(3).fill(7);
        console.log(str);                   // 输出为: [7, 7, 7];
    ```
    
    fill ( ) 方法对于数组中已有的元素, 在填充的过程中, 会全部抹去;
    
    fill ( ) 方法还可以接收第二个和第三个参数, 用于指定填充的起始位置和结束位置, 例如: 
    
    ```javascript
        var arr = ["a", "b", "c"].fill(7, 1, 2);
        console.log(arr);                   // 输出为: ["a", 7, "c"]
    ```
    
 5. 三个新的遍历方法
 
    以下三个方法都返回一个遍历器, 可以用 for...of 循环进行遍历

    - entries (  ) : 
    
      对 键值对 的遍历, 例如: 
      
      ```javascript
        for(var i of ["a", "b"].entries()){
            console.log(i);         // 输出为: [0, "a"] [1, "b"]
        }
        for(var [index, value] of ["a", "b"].entries()){
            console.log(index + "--" + "value");
            // 输出为: 
            0--"a"
            1--"b"
        }
      ```
      
    - keys ( ) : 
    
      对 键名 的遍历, 例如: 
      
      ```javascript
        for(var index of ["a", "b"].keys()){
            console.log(index);         // 输出为: 0 1
        }
      ```
      
    - values ( ) : 
    
      对 键值 的遍历, 例如: 
      
      ```javascript
        for(var value of ["a", "b"].values()){
            console.log(value);         // 输出为: "a" "b"
        }
      ```
      

### (四) 对象

 1. 属性的简洁表示法
 
    ES6 允许直接写入变量和函数, 例如: 

    能够返回多个值

    ```javascript
        function printNum(x, y){
            var xx = x;
            var yy = y;
            return {xx, yy};                  // 输出为: {xx: x, yy: y}
        }
        相当于 : 
        function printNum(x, y){
            return {x: x, y: y};
        }
    ```
    
    对象中的方法简洁写法
    
    ```javascript
        var person = {
            name: "Andraw",
            getName() {
                console.log(this.name);
            }
        }
        person.getName();                   // 输出为: Andraw
    ```
    
    
 2. 属性名表达式

    在 javascript 中定义对象的属性, 有两种方法, 例如: 
    
    ```javascript
        var obj = {};
        // 方法一
        obj.foo = true;
        // 方法二
        obj["a"+"bc"] = "Andraw";
        console.log(obj);               // 输出为: {foo: true, "abc": "Andraw"}
    ```
    
    方法一是直接用标识符作为属性名, 方法二是用表达式作为属性名
    
    如果是使用字面量定义对象 ( 使用大括号 ), 在ES5中只能使用方法一 ( 标识符 ) 定义属性, 例如: 
    
    ```javascript
        var obj = {
            foo: true,
            name: "Andraw"
        }
    ```
    
    在ES6中允许字面量定义对象时, 使用方法二 ( 表达式 ) 作为对象的属性名, 即把表达式放在方括号内, 例如: 
    
    ```javascript
        let proKey = 'key'; 
    
        let obj = {
            [proKey]: true,
            ['a'+'bc']: 123
        };
        console.log(obj);           // 输出为: {key: true, abc: 123}
    ```
    
    表达式还可以用于定义方法名, 例如: 
    
    ```javascript
        let obj = {
            ["name"]: 20,               // 会报错, 因为没有name这个变量
            ["get"+"Name"]() {          // 不会报错, 因为表达式可用于定义方法名
                console.log("Success ! ! !");
            }
        }
    ```
    
 3. 比较两个值是否严格相等

    Object.is( ) 用来比较两个值是否严格相等, 它与严格比较运算符( === ) 的行为基本一致, 不同之处只有两个地方: 一是 +0 不等于 -0 , 二是 NaN 等于自身, 例如: 
    
    ```javascript
        +0 === -0;                          // 输出为: true
        NaN === NaN                         // 输出为: false
        
        Object.is(+0, -0);                  // 输出为: false
        Object.is(NaN, NaN);                // 输出为: true
    ```
    
 4. 源对象的所有可枚举属性, 复制到目标对象

    Object.assign ( ) 方法用来将源对象 ( source ) 的所有可枚举属性, 复制到目标对象 ( target ), 至少需要两个对象作为参数, 第一个参数是目标对象, 后面的参数都是源对象, 只要有一个参数不是对象, 就会抛出 TypeError 错误, 例如: 
    ```javascript
        var target = {a: 1};
        var source1 = {b: 2};
        var source2 = {c: 3};
        Object.assign(target, source1, source2);
        console.log(target);                // 输出为: {a: 1,b: 2,c: 3};
    ```
    
    如果目标对象与源对象有同名属性, 或多个源对象有同名属性, 则后面的属性会覆盖前面的属性, 例如: 
    
    ```javascript
        var target = {a: 1, b: 1};
        var source1 = {b: 2, c: 2};
        var source2 = {c: 3};
        Object.assign(target, source1, source2);
        console.log(target);                // 输出为: {a: 1, b: 2, c: 3}
    ```
    
 5. Symbol 类型

    ES6 引入了一种新的原始数据类型 Symbol, 表示独一无二的 ID, 凡是属性名属于 Symbol 类型, 就都是独一无二的, 可以保证不会与其他属性名产生冲突, 例如: 
    
    ```javascript
        var s = Symbol();
        console.log(typeof s);              // 输出为: symbol
    ```
    
    注意: Symbol 函数前不能使用 new 命令, 否则会报错, 这是因为生成的 Symbol
是一个 原始类型的值 , 不是对象, 另外 Symbol 类型的值不能与其他类型的值进行运算, 会报错, 例如: 


    ```javascript
        var sym = Symbol("name");
        console.log(sym);                           // 输出为: symbol(name)
        console.log("Your name is "+sym);           // 报错: TypeError: can't convert symbol to string
        console.log("Your name is ${sym}");         // 报错: TypeError: can't convert symbol to string
    ```
    
    但是, Symbol 类型的值可以转为字符串, 例如: 
    
    ```javascript
        var sym = Symbol("name");
        console.log(String(sym));                   // 输出为: symbol(name)
        console.log(sym.toString());                // 输出为: symbol(name)
    ```
    

### (五) 函数

 1. 默认参数

    ES6 能够在函数的参数里设置默认值, 例如: 
    
    ```javascript
        function setName(name="Andraw"){
            var personName = name;
            console.log(personName);
        }
        setName();                          // 输出为: "Andraw"
        setName("Tom");                     // 输出为: "Tom"
    ```
    
 2. reset 参数

    reset 参数 ( 形式为: "...变量名" ) 可以称为不定参数, 用于获取函数的多余的参数, 这样就不需要使用 arguments 对象, 另外 reset 参数搭配的变量是一个数组, 该变量将多余的参数放入数组中, 例如: 
    
    ```javascript
        function getMessage(...person){
            console.log(person);
        }
        getMessage("Andraw", 18, "本科");           // 输出为: ["Andraw", 18, "本科"]
    ```
        
 3. 扩展运算符
    
    扩展运算符 ( spread ) 是三个点 (...), 它就相当于 reset 参数的逆运算, 将一个数组转为用逗号分隔的参数序列, 主要用于 函数调用 , 另外它也允许传递数组或者类数组直接作为参数而不用通过 apply ,例如: 

    ```javascript
        var people = ["张三", "李四", "王五"];
        
        // sayHello 函数本来接收三个单独的参数people1, people2, people3
        function sayHello(people1, people2, people3){
            console.log(`Hello ${people1}, ${people2}, ${people3}`);
        }
        
        // 在 ES5 中需要使用 apply 方法来把数组作为参数传进函数里面调用
        sayHello.apply(null, people);       // 输出为: Hello 张三, 李四, 王五
        
        // 在 ES6 中则则可以直接使用扩展运算符把数组作为参数进行传入
        sayHello(...people);                // 输出为: Hello 张三, 李四, 王五
    ```
    
 4. 箭头函数

    箭头函数是使用 => 语法的函数简写形式, 这与 CoffeeScript 的相关特性非常相似;
    
    - 单参数情况, 例如: 
    
      ```javascript
        // ES5 的写法
        var f = function(v){
            return v;
        }
        // ES6 的写法
        var f = v => v;
      ```
      
    - 多参数情况, 例如: 
    
      ```javascript
        var f = (a, b) => {
            console.log(a);
            console.log(b);
        }
      ```
      注意: 在箭头函数中, 需要用到 { } 括号来把代码块包住;
      
    另外, 箭头函数有几个使用注意点: 
    
    - 函数体内的 this 对象, 绑定定义时所在的对象, 而不是使用时所在的对象;
    - 不可以当作构造函数, 即不可以使用 new 命令, 否则会抛出一个错误;
    - 不可以使用 arguments 对象, 该对象在函数体内不存在;
    
    上面三点中, 第一点尤其值得注意, this对象的指向是可变的, 但是在箭头函数中, 它是固定的;
    

 5. 函数绑定

    函数绑定运算符使用并排的两个双引号 ( :: ) , 双引号左边是一个对象, 右边是一个函数, 该运算符会自动将左边的对象, 作为上下文环境 ( 即 this 对象 ) , 绑定到右边的函数上面, 例如: 
    
    ```javascript
        var foo = {
            name: "Tom"
        };
        var name = "Andraw";
        function bar(){
            console.log(this.name);
        }
        bar();                          // 输出为: Andraw
        foo::bar();                     // 输出为: Tom
    ```
    
    另外, 对于有多个参数的函数时, 例如: 
    
    ```javascript
        // ES6 写法
        foo::bar(...arguments);
        // 相当于以下 ES5 写法
        bar.apply(foo, arguments);
    ```
    

### (六) Set

 1. 基本用法

    数据结构 Set 类似于数组, 但是成员的值都是唯一的, 没有重复的值, 例如: 
    
    ```javascript
        var arr = new Set([1, 2, 2, 3]);
        console.log(arr);                   // 输出为: 1, 2, 3
    ```
    
    另外, 向 Set 加入值的时候, 不会发生类型转换, 所以 5 和 " 5 " 是两个不同的值, 例如: 
    
    ```javascript
        var arr = new Set([1, 2, 2, 3, "3"]);
        console.log(arr);                   // 输出为: 1, 2, 3, "3"
    ```
    
    还有种特殊情况就是, 由于两个空对象不是精确相等, 所以它们被视为两个值, 例如: 
    
    ```javascript
        var arr = new Set();
        arr.add({});
        console.log(arr.size);              // 输出为: 1
        arr.add({});
        console.log(arr.size);              // 输出为: 2
    ```
    
 2. Set 实例的属性

    Set 结构的实例有以下属性: 
    
    - Set.prototype.constructor: 构造函数, 默认就是 Set 函数;
    - Set.prototype.size: 返回 Set 实例的成员总数;
    
 3. Set 实例的方法

    Set 实例的方法分为两大类: 操作方法 ( 用于操作数据 ) 和 遍历方法 ( 用于遍历成员 )
    
    操作方法: 
    
    - add ( value ) : 添加某个值, 返回 Set 结构本身;
    - delete ( value ) : 删除某个值, 返回一个布尔值, 表示删除是否成功;
    - has ( value ) : 返回一个布尔值, 表示该值是否为 Set 的成员;
    - clear (  ) : 清除所有成员, 没有返回值;
    
    ```javascript
        var s = new Set();
        s.add(1).add(2).add(2);
        s.has(1);                   // 输出为: true
        s.has(2);                   // 输出为: true
        s.has(3);                   // 输出为: false
        s.delete(2);                // 输出为: true
        s.delete(3);                // 输出为: false
        s.has(2);                   // 输出为: false
    ```
    
    另外, Array.form 方法可以将 Set 结构转为数组: 
    
    ```javascript
        var arr = new Set([1, 2, 2, 3]);
        console.log(Array.from(arr));           // 输出为: [1, 2, 3]
    ```
    
    遍历方法: 
    
    - keys ( ) : 返回一个键名的遍历器;
    - values ( ) : 返回一个键值的遍历器;
    - entries ( ) : 返回一个键值对的遍历器;
    - forEach ( ) : 使用回调函数遍历每个成员;
    
    ```javascript
        var arr = new Set([1, 2, 2, 3]);
        arr.forEach(function(item){
            console.log(item);                  // 输出为: 1 2 3
        })
    ```
    
 4. WeakSet

    WeakSet 和 Set 一样都不存储重复的元素, 但有些不同点, 使用 WeakSet 存储的成员只能是对象, 而不是其他类型的值, 例如: 
    
    ```javascript
        var ws = new WeakSet();
        ws.add(1);              // 报错: TypeError: Invalid value used in weak set
    ```
    
    主要有以下三个方法: 
    
    - add ( value ) : 向 WeakSet 实例添加一个新成员;
    - delete ( value ) : 清除 WeakSet 实例的指定成员;
    - has ( value ) : 返回一个布尔值, 表示某个值是否存在;
    
    另外, WeakSet 没有 size 属性, 没有方法遍历它的成员;
    
    
### (七) Map

 1. 实例的属性和操作方法

    - size : 返回成员总数;
    - set ( key, value ) : 设置 key 所对应的键值, 然后返回整个 Map 结构, 如果 key 已经有值, 则键值会被更新, 否则就新生成该键;
    - get ( key ) : 读取 key 对应的键值, 如果找不到 key , 返回 undefined;
    - has ( key ) : 返回一个布尔值, 表示某个键是否在 Map 数据结构中;
    - delete ( key ) : 删除某个键, 返回true, 如果删除失败, 返回 false;
    - clear ( ) : 清除所有成员, 没有返回值;
    
    set ( ) 方法返回的是 Map 本身, 因此可以采用 链式写法;
    
    ```javascript
        var m = new Map();
        m.set("edition", 6)                 // 键是字符串
        .set(262, "standard")               // 键是数值
        .set(undefined, "haha");            // 键是undefined
        var hello = function(){
            console.log("hello");
        }
        m.set(hello, "Hello");              // 键是函数
        
        m.has("edition");                   // 输出为: true
        m.has("years");                     // 输出为: false
        m.has(262);                         // 输出为: true
        m.has(undefined);                   // 输出为; true
        m.has(hello);                       // 输出为: true
        
        m.get(hello);                       // 输出为: Hello
        m.get("edition");                   // 输出为: 6
        
        m.clear();                      
        console.log(m.size);                // 输出为: 0
    ```
    
 2. 遍历方法

    Map 原生提供三个遍历器: 
    
    - keys ( ) : 返回键名的遍历器;
    - values ( ) : 返回键值的遍历器;
    - entries ( ) : 返回所有成员的遍历器;
    
    ```javascript
        var map = new Map([
            ['F', 'no'],
            ['T', 'yes']
        ]);
        console.log(map);           // 输出为: Map {"F" => "no", "T" => "yes"}

        for(var key of map.keys()){
            consolo.log(key);       // 输出为: "F" "T" 
        }
        for(var value of map.values()){
            console.log(value);     // 输出为: 'no' 'yes'
        }
        for(var arr of map.entries()){
            console.log(arr);       // 输出为: ['F', 'no'] ['T', 'yes']
        }
    ```
Map 结构转为数组结构, 比较快速的方法是结合使用扩展运算符 ( ... ) , 例如:
    
    ```javascript
        var map = new Map([
            ['F', 'no'],
            ['T', 'yes']
        ]);
        console.log([...map.keys()]);       // 输出为: ['F', 'T']
        console.log([...map.values()]);     // 输出为: ['no', 'yes']
        console.log([...map.entries()]);    // 输出为: [['F', 'no'], ['T', 'yes']]
        console.log([...map]);              // 输出为: [['F', 'no'], ['T', 'yes']]
    ```
    
    Map 也有一个 forEach 方法, 与 Set 结构的 forEach 方法类似, 也可以实现遍历;
    
 3. WeakMap

    WeakMap 结构与 Map 结构基本类似, 唯一的区别是它只接受对象作为键名 ( null 除外 ) , 不接受原始类型的值作为键名, 而且键名所指向的对象, 不计入垃圾回收机制, 例如: 
    
    ```javascript
        var map = new WeakMap(),
            element = document.querySelector(".element");
            
        map.set(element, 'origin');
        
        var value = map.get(element);
        console.log(value);                     // 输出为: origin
    ```
    
    另外, WeakMap 与 Map 在 API 上的区别主要是两个: 
    
    - 没有遍历操作 ( 即没有key( ), values( ), entries( )方法, 也没有 size 属性 );
    - 无法清空, 即不支持 clear 方法, 这与 WeakMap 的键不被计入引用, 被垃圾回收机制忽略有关;
    
    因此, WeakMap 只有四个方法可用: get( ), set( ), has( ), delete( );
    
    
### (八) Iterator ( 遍历器 ) 和 For...Of...


 Iterrator 的遍历过程: 
 
  - 创建以恶搞指针, 指向当前数据结构的起始位置, 也就是说, 遍历器的返回值是一个指针对象;
  - 第一次嗲用指针对象的 next 方法, 可以将指针指向数据结构的第一个成员;
  - 第二次调用指针对象的 next 方法, 指针就指向数据结构的第二个成员;
  - 调用指针对象的 next 方法, 直到它指向数据结构的第二个成员;

 另外, Iterator 接口主要供 For...Of... 消费
 
 
 1. 数据结构的默认 Iterator 接口

    在 ES6 中, 可迭代的数据结构( 比如数组 ) 都必须实现一个名为 Symbol.iterator 的方法， 该方法会返回一个该结构元素的迭代器, 使用 next() 方法进行遍历后返回的对象中会包含了两个属性: value ( 表示遍历对象中的值 )和 done ( 表示是否遍历结束, 即值为false时表示遍历还没结束 ), 例如: 
    
    ```javascript
        var arr = [1, 2, 3];
        var iter = arr[Symbol.iterator]();
        console.log(iter);             // 输出为: ArrayIterator {}
        
        console.log(iter.next());      // 输出为: {value: 1, done: false}
        console.log(iter.next());      // 输出为: {value: 2, done: false}
        console.log(iter.next());      // 输出为: {value: 3, done: false}
        console.log(iter.next());      // 输出为: {value: undefined, done: true} 表示遍历结束
    ```
    
    另外, 变量 arr 是一个数组, 原生就具有遍历器接口, 部署在arr的 Symbol.iterator 属性上面;
    

 2. 调用默认 Iterator 接口的场合

    - 解构赋值
    
      对数组和 Set 结构进行解构赋值时, 会默认调用 iterator 接口
      
      ```javascript
        var arr = new Set("123");
        var [x, y] = arr;
        console.log([x, y]);              // 输出为: [1, 2];
      ```
      
    - 扩展运算符
    
      扩展运算符 (...) 也会调用默认的 iterator 接口, 例如: 
      
      ```javascript
        var str = "123";
        console.log([...str]);            // 输出为: ['1', '2', '3'];
        var arr = ['a', 'b'];
        console.log(['a', ...arr]);       // 输出为: ['a', 'a', 'b'];
      ```
      
    - 其他场合会调用默认的 iterator 接口的还有: 
    
      + yield*
      + Array.from()
      + Map(), Set(), WeakMap(), WeakSet()
      + Promise.all(), Promise race()
 
