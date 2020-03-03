---
layout: post
category: Andraw-lin
title: A little Summary In << Professional JavaScript for Web Developers >>
summary: A little Summary In << Professional JavaScript for Web Developers >>
---

## **A little Summary In << Professional JavaScript for Web Developers >>(To Be Continue)**

- [(一) 基本概念](#一-基本概念)
- [(二) 作用域和内存问题](#二-作用域和内存问题)
- [(三) 引用类型](#三-引用类型)
- [(五) BOM](#五-bom)
- [(六) DOM](#六-dom)
- [(七) 事件](#七-事件)
- [(八) 表单脚本](#八-表单脚本)
- [(九) JSON](#九-JSON)

### (一) 基本概念

  1. 严格模式作用

     - 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
     - 消除代码运行的一些不安全之处，保证代码运行的安全；
     - 提高编译器效率，增加运行速度；

  2. 局部变量和全局变量

     - 使用var定义的变量为局部变量,全局变量就不需要var;
     - 如果在函数中使用var定义一个变量,这个变量在函数退出后就会被销毁,例如:

       ```javascript
       function test(){
          var message="hi";
       }
       test();
       alert(message);  //报错!
       ```
       相反使用全局变量就不会出错:

       ```javascript
       function test(){
            message="hi";
       }
       test();
       alert(message);  //输出"hi"
       ```

  3. typeof

     - ECMAScript有5中简单数据类型: Undefined,Null,Boolean,Number,String,还有一种复杂数据类型: Object;
     - "undefined"---如果这个值未定义或者本身;
     - "boolean"---如果这个值是布尔值;
     - "string"---如果这个值是字符串;
     - "number"---如果这个值是数值或者NaN;
     - "object"---如果这个值是对象或null;
     - "function"---如果这个值是函数;
     - 使用var声明变量但没有初始化的变量就是undefined,如果没有使用var声明即全局变量没有初始化时使用typeof操作符时会报错``is not defined``;
     - 对于尚未声明的变量,只能执行一项操作,就是使用typeof操作符检测类型,而且结果师undefined;
     - 从逻辑角度看,null代表一个空指针,所以使用typeof时结果是object;
     - 各种数据转换成boolean类型,如下表:

       | 数据类型 | 转换为true的值 | 转换为false的值 |
       | -----|:----:| ----:|
       | Boolean | true | false |
       | String | 任何非空字符串 | ""(空字符串) |
       | Number | 任何非零数字值(包括无穷大) | 0和NaN |
       | Object | 任何对象 | null |
       | Undefined | n/a(即不适用) | undefined |

     - javascript遵循IEEE754标准,因此这个标准中的浮点数不能正确地表达小数(比如0.1),所以0.1+0.2不等于0.3,而等于0.30000000000000004;
     - NaN(not a number): 任何涉及nan的操作都会返回nan,另外,nan与任何值都不相等包括nan本身;
     - number()函数: 
       + 如果是boolean值,true返回1,false返回0;
       + 如果是null,返回0;
       + 如果是undefined,返回NaN;
       + 如果是只包含数字的的字符串,返回对应的数字,如果包含浮点数,返回对应的浮点数(去掉前导零),如果包含有效的十六进制格式,例如"0xf",将返回相同大小的十进制整数值,如果字符串是空,将返回0,如果除以上以外的字符,将返回NaN;
       + 如果是对象,则调用valueof()方法,依照以上的规则转换返回的值,如果转换的结果是NaN,则调用对象的toString()方法,然后再次依照前面的规则转换返回相对应的字符串值;
     - parseInt()函数: 
       + 如果第一个字符不是数字字符或者负号,返回NaN;
       + 空字符串时将返回NaN;
       + 数字后面带有非数字的字符会忽略非字符,例如"12345blue",返回12345;
       + 对于小数将忽略小数点后面的一切;
       + 前面带有0x或者0开头的数字,将返回16进制和8进制;
     - parseFloat()函数: 只对第一个小数点有效,如果有多个小数点,会忽略第二个以后的小数点一切;
     - 任何字符串都可以通过length访问长度;
     - 数值,布尔值,对象和字符串,NaN都有toString()方法,null和buquandengundefined都没有这个方法,这时候只能使用String()方法,null返回null,undefined返回undefined;
     - Object类型每个实例都有的属性和方法: 
       + constructor: 保存着用于创建当前对象的函数;
       + hasOwnProperty(ropertyName): 用于检查给定的属性在当前对象实例中(而不是在实例的原型中)是否存在,例如o.hasOwnProperty("name");
       + isPrototypeof(object): 用于检查传入的对象是否是传入的对象的原型;
       + propertyIsEnumerable(propertyName): 用于检查给定的属性是否能够使用for-ind语句来枚举;
       + toLocaleString():  返回对象的字符串表示,该字符串与执行环境对应;
       + toString(): 返回对象的字符串表示;
       + valueOf(): 返回对象的字符串,数值或布尔值表示,通常与toString()方法的返回值相同;
     - Infinity与0相乘,结果为NaN,Infinity与非0数值相乘结果为Infinity,Infinity与-Infinity相加后得到NaN;
     - 函数中的参数,可以通过argument数组来直接访问;
     - null与undefined相等,但不全等;

### (二) 作用域和内存问题

  1. 基本类型和引用类型
     - 只能对引用类型值动态地添加属性,不能对基本数据类型添加;
     - 确定哪种基本类型使用typeof操作符,确定一个值是哪种引用类型使用instanceof操作符
     - 从一个变量向另一个变量复制基本类型值和引用类型值时,例如:

       ```javascript
       var num1 = 5;
       var num2 = num1;
       ```
       复制前的变量对象:


       |  |   |   | 
       |--|:--:|--:|
       |  |   |   |
       |  |   |   | 
       | num1 | 5(Number类型) |  |


       复制后的变量对象:


       |  |  |  |
       |--|:--:|--:|
       |  |   |   |
       | num2 | 5(Number类型) |   |
       | num1 | 5(Number类型) |   |


       num1和num2是两个完全独立的,这两个变量参与任意操作没有影响;

     - 在对象进行复制的时候,例如:

       ```javascript
       var obj1 = new object();
       var obj2 = obj1;
       obj1.name = 'helloword';
       alert(obj2.name);
       ```
       复制前的变量对象:

       |  |  |  |
       |--|:--:|--:|
       |  |   |   |
       |  |   |   | 
       | obj1 | (object类型) |  |

       复制后的变量对象:

       |  |  |  |
       |--|:--:|--:|
       |  |   |   |
       | obj2 | (object类型) |  | 
       | obj1 | (object类型) |  |

       复制后obj2和obj1都指向同一个object对象,所以当为obj1添加name属性后,可以通过obj2访问这个属性;

     - 传递参数例子:

       ```javascript
       function addTen(count){
           num + = 10;
           return num;
       }
       var count = 20;
       var result = addTen(count);
       alert(count);     //20,没有变化
       alert(result);    //30
       ```
  2. 垃圾收集
     - 最常用的就是标记清除,还有不太常见的引用计数;
     - 分配给Web浏览器的可用内存数量通常比分配给桌面应用程序的少,目的是: 出于安全方面的考虑,防止运行javascript的网页耗尽全部系统内存而导致系统奔溃;

### (三) 引用类型

  1. object类型
     - 创建object实例的方式有两种:
       + 第一种是使用new操作符后跟object构造函数,例如

         ```javascript
         var person = new Object();
         person.name = "helloword";
         ```
         等价于:

         ```javascript
         var person = {};
         person.name = "helloword";
         ```
       + 另一种使用对象字面量表示法,例如

         ```javascript
         var person = {
             name: "tom",
             age: 18
         }
         ```

  3. Array类型
     - 创建数组有两种方式: 
       + 第一种是使用Array构造函数,例如

         ```javascript
         var colors = new Array();
         ```
         其中new可以省略,即

         ```javascript
         var colors = Array();
         ```

       + 另一种还是使用数组字面量创建,例如

         ```javascript
         var colors = ['red','blue','orange'];
         ```

     - 数组的length属性,通过设置这个属性,可以从数组的末尾移除或向数组中添加新项,例如

       ```javascript
       var colors = ['red','blue','orange'];
       colors.length = 2;
       alert(colors[2]);    //undefined
       ```

     - join()方法只接受一个参数,即用作分隔符的字符串,然后返回包含所有数组项的字符串,例如

       ```javascript
       var colors = ['red','blue','orange'];
       alert(colors.join(','));  //red,green,blue
       ```

       但如果某一项的值是null或者undefined,例如

       ```javascript
       var colors=['red','blue',''];
       colors.join(',');   //red,blue,
       ```

     - (栈的方法)数组中提供了push()和pop()方法,实现类似栈的行为: 
       + push()方法可以接受任意数量的参数,把它们逐个添加到数组末尾,并返回修改后数组的长度,例如

       ```javascript
       var colors = Array();
       var count = colors.push("red","blue");
       alert(count);   //2
       ```

       + pop()方法从数组末尾移除最后一项,减少数组的lengh的长度,然后返回移除的项,例如

       ```javascript
       var colors = ['red','blue'];
       var item = colors.pop();
       alert(item);   //blue
       ```

     - (队列的方法)结合使用shift()和push()方法可以像队列一样使用数组: 
       + push()方法跟上面的一样;
       + shift()方法发就是从数组中取得第一项;

     - unshift()方法能在数组前端添加任意个项并返回新数组的长度;
     - reverse()方法只是把原来数组的顺序倒过来,返回一个倒过来的数组;sort()方法就是升序数组,返回一个升序后的数组;
     - concat()方法是先创建当前数组一个副本,然后将接收到的参数添加倒这个副本的末尾,例如

       ```javascript
       var colors = ['red','blue'];
       var colors2 = colors.concat('yellow',['orange','pink']);
       alert(color2);  //red,blue,yellow,orange,pink
       ```
     - slice()方法在只有一个参数的时候,返回从该参数指定的位置开始到当前数组的末尾的所有向,如果有两个参数,则返回起始和结束位置之间的项,但不包括结束位置的项,例如

       ```javascript
       var colors = ['red','blue','yellow'];
       var color1 = colors.slice(1);   //red,yellow
       var color2 = colors.slice(1,2); //red
       ```
       如果参数中带有负数,则使用数组长度加上该数来确定相应的位置,例如长度为5的数组,slice(-2,-1)即slice(3,4);

     - splice()方法主要用途是向数组的中部插入项: 
       + 删除: 只需指定2个参数(即要删除的第一项的位置和要删除的项数),例如splice(0,2)会删除前两项;
       + 插入: 需要3个参数(起始位置,0(要删除的项数),要插入的项);
       + 替换: 需要3个参数(起始位置,0(要删除的项数),要插入的项);

     - indexof()和lastindexof()都是需要两个参数(即要查找的项和(可选的)表示查找起点位置的索引),不同的是,lastindexof是从数组末尾开始,例如:

       ```javascript
       var num = [1,2,3,4,5];
       alert(num.indexof(4));  //4
       alert(num.lastindexof(4));   //4
       ```
       特别地:
       ```javascript
       var person = {name: "hellow"};
       var people = [{name: "hellow"}];
       var morePeople = [people];
       alert(people.indexOf(person));   //-1
       alert(morePeople.indexof(person));    //0
       ```
     - 数组定义了5组迭代方法: 

       |方法| 解析 |
       |--|:--:|
       | every() | 对数组中的每一项运行给定函数,如果该函数每一项都返回true,则返回true |
       | some() | 对数组中的每一项运行给定函数,如果该函数对某一项返回true,就返回true|
       | filter() | 对数组中的每一项运行给定函数,返回该函数中符合要求的项组成的数组 |
       | map() | 对数组中的每一项运行给定函数,返回每次函数调用的结果组成的数组 |
       | forEach() | 对数组中的每一项运行给定函数,没有返回值 |

       例如: 

       ```javascript
       var num = [1,2,3,5];
       var everyResults = num.every(function(item, index ,array){
           return (item > 2);
       });
       alert(everyResults);    //false
       ```
        
     - 归并方法有两个: reduce()和reduceRight(),区别是reduceRight()是从末尾开始到第一项,都是接收两个参数,一个在每一项上调用的函数和(可选的)作为归并基础的初始值,而传给这两个方法里面的函数的参数有4个,分别是:前一个值,当前值,项的索引,数组对象,注意,第一次迭代发生在数组的第二项上,因此第一个参数是数组的第一项,第二个参数就是数组的第二项,例如:

       ```javascript
       var value = [1,2,3,4,5];
       var sum = value.reduce(function(prev,cur,index,array){
          return prev + cur;
       });
       alert(sum);     //15
       ```

  4. Function类型

     - javascript中的function(函数)没有重载,例如:

       ```javascript
       function addNumber(num){
           return num+100;
       }
       function addNumber(num){
           return num+200;
       }
       var result = addNumber(100);        //结果为300
       ```
       等价于:

       ```javascript
       var addNumber = function(num){
           return num + 100;
       }
       addNumber = function(num){
           return num + 200;
       }
       var result = addNumber(100);        //结果为300
       ```
       明显地,赋值第二个函数的时候,直接把第一个函数覆盖;

     - 函数声明: 对函数声明,解析器会率先读取函数声明,并使其执行任何代码之前可用,例如

       ```javascript
       alert(sum(10,10));
       function sum(num1,num2){
           return num1 + num2;
       }
       ```
       在代码开始执行之前,解析器就已经通过一个名为函数声明提升的过程,读取并将函数声明添加到执行环境中;

     - 函数表达式: 对于函数表达式,必须等到解析器执行到它所在的代码行,才会真正被解析执行,例如

       ```javascript
       alert(sum(10,10));
       var sum = function(num1,num2){
           return num1 + num2;
       }
       ```
       这行代码在运行的时候会报sum is not a function错误,就是因为函数位于一个初始化语句中,而不是一个函数声明,换句话说,在执行函数所在的语句之前,变量sum中不会保存有对对函数的引用;

     - 每个函数都带有两个属性: length和prototype,length属性表示函数参数的个数,例如

       ```javascript
       function sayName(name){
           alert(name);    
       }
       alert(sayName.length);      //输出1
       ```
  5. 基本包装类型
     - 引用类型与基本包装类型区别: 主要区别就是生存期,使用new操作符创建的引用类型的实例,在执行流离开当前作用域之前都一直保存在内存中,而自动创建的基本包装类型的对象,则只存在于一行代码的执行瞬间,然后立即被销毁;
     - 对基本包装类型实例使用typeof,会返回Object;而且所有基本包装类型的对象都会被转换成true;
     - 使用new调用基本包装类型的构造函数,与直接调用相同名的转型函数是不一样的,例如

       ```javascript
       var value = "25";
       var number = Number(value);         //转型函数
       alert(typeof(number));              //"number"
   
       var obj = new Number(value);        //构造函数
       alert(typeof(obj));                 //"object"
       ```
     - Boolean类型容易出现的误解,例如

       ```javascript
       var obj = new Boolean(false);
       var result = obj && true;
       alert(result);              //true
       ```
       因为obj是一个Boolean对象,在布尔表达式中,任何对象都会被转换成true,最终结果就是true && true;
       对比:

       ```javascript
       var value = false;
       var result = value && true;
       alert(result)               //false
       ```
       因为value直接就是一个boolean基本类型,因此在布尔表达式中依旧还是false;

     - 基本类型boolean与引用类型Boolean有两个区别: 
       + 使用typeof操作符时,基本类型就是返回"boolean",而引用类型就是返回"object";
       + 由于Boolean对象是Boolean类型的实例,所以使用instanceof操作符测试Boolean对象会返回true,测试基本类型的布尔值则返回false;
     
     - Number类型重写了valueOf(),toLocaleString()和toString()方法,使用valueOf()方法返回对象表示的基本类型的数值,另外两个方法泽返回字符串形式的数值,但在toString()方法中可以接收一个表示多少进制的参数,例如

       ```javascript
       var num = 10;
       alert(num.toString());          //"10"
       alert(num.toString(2));         //"1010"
       alert(num.toString(8));         //"12"
       alert(num.toString(10));        //"10"
       alert(num.toString(16));        //"a"或者"A"
       ```

     - String类型中concat()方法跟数组中的concat()一样,例如

       ```javascript
       var string = "hello";
       var result = string.concat("word");         //concat可以接收多个参数
       alert(string);                              //输出"hello"
       alert(result);                              //输出helloword
       ```

     - slice()和substring(),substr()所需要的参数基本一致,唯独不一样的是第二个参数,slice()和substring()第二个参数都是字符串最后一个字符后面的位置,而substr()第二个参数则是返回字符个数,例如

       ```javascript
       var string = "hello world";
       alert(string.slice(3));            //"lo world"
       alert(string.substring(3));        //"lo world"
       alert(string.substr(3));           //"lo world"
       alert(string.slice(3,7));          //"lo w"
       alert(string.substring(3,7));      //"lo w"
       alert(string.substr(3,7));         //"lo worl"
       ```
       另外,当参数是负数的时候,三个方法的行为都不一样,slice()会将传入的负值与字符串的长度相加,substr()将负的第一个参数加上字符串的长度,将负的第二个参数转换为0,substring()会把所有负值的参数都转换为0,例如

       ```javascript
       var string = "hello world";
       alert(string.slice(-3));            //"rld"
       alert(string.substring(-3));        //"hello world"
       alert(string.substr(-3));           //"rld"
       alert(string.slice(3,-4));          //"lo w"
       alert(string.substring(3,-4));      //"hel",变成substring(3,0)后,这个方法默认会把最小的放最前面,大的放后面,即substring(0,3)
       alert(string.substr(3,-4));         //""(空字符串)
       ```

     - trim()方法可以删除前置及后缀的所有空格,但字符串本身不会变化,只是创建一个副本出来赋值给另外一个变量,例如

       ```javascript
       var string = "   helloworld   ";
       var trimString = string.trim();
       alert(string);                      //"   helloworld   "
       alert(trimString);                  //"helloworld"
       ```

     - localeCompare()方法用于比较两个字符串,遵循以下规则: ①如果字符串应该排在字符串参数之前,就返回-1;②如果两个字符串相等,返回0;③如如果字符串应该排在字符串参数之后,就返回1,例如

       ```javascript
       var string = "yellow";
       alert(string.localeCompare("brick"));           //1
       alert(string.localeCompare("yellow"));          //0
       alert(string.localeCompare("zoo"));             //-1
       ```

  6. 单体内置对象

     - javascript定义两个单体内置对象: Global和Math;
     - Global对象中encodeURI()和encodeURIComponent()方法
       + 相同点: 可以对URI进行编码,以便发送到浏览器,有效的URI中不能包含某些字符,例如空格,这两个方法都是用特殊的utf-8编码替换所有无效的字符;
       + 不同点: encodeURI()方法主要用于整个URI,而且不会对本身属于URI的特殊的字符进行编码,例如冒号,正斜杠,问号和#号,但和encodeURIComponent()方法主要用于对URI中的某一段进行编码,而且对它发现的任何非标准的字符进行编码;
       + encodeURI()方法编码后的结果是除了空格之外其他字符原封不动,而encodeURIComponent()方法则会使用对应的编码替换所有非字母数字字符,而且一般来说,encodeURIComponent()方法用得比较多;
       + encodeURI()方法对应的解码方法是decodeURI()方法,而和ncodeURIComponent()对应的decodeURIComponent(),可以解码任何字符的编码;
     - Math()对象中的min()和max()方法,就是从一组数值中选出最小值和最大值,例如

       ```javascript
       var max = Math.max(1,2,3);
       alert(max);                     //3
       ```  

       如果想从一个数组中选出最大值或最小值,可以使用apply()方法在

       ```javascript
       var value = [1,2,3];
       var max = Math.max.apply(Math, value);
       alert(max);                     //3
       ```

     - Math对象中的random()方法返回大于等于0小于1的一个随机数,选出整数的方法: 值 = Math.floor(Math.random()*可能值的总数 + 第一个可能的值),例如

       ```javascript
       var num = Math.floor(Math.random()*10+1);       //输出1~10之间的值
       ```
       Math.floor()就是向下取整方法,例如Math.floor(25.9)输出的结果就是25;

### (五) BOM

  1. 全局作用域

     - 尝试访问未声明的变量会抛出错误,但是通过查询window对象,可以知道某个可能未声明的变量是否存在,例如

       ```javascript
       var newValue = oldValue;                //会抛出错误,因为oldValue未定义
       ```
       相反: 

       ```javascript
       var newValue = window.oldValue;         //不会抛出错误,因为这是一次属性查询,newValue的值为undefined
       ```
     - 与框架有关的一个对象是self,始终指向window,实际上,self和window对象可以互换使用;

  2. 间歇调用(setInterval)和超时调用(setTimeout)

     - 超时调用setTimeout有两个参数: 要执行的代码和以毫秒表示的时间(即在执行代码前所需要等待多少毫秒),只运行一次,例如

       ```javascript
       setTimeout("alert('helloworld!')",1000);        //第一个参数不建议传入字符串,因为传递的字符串可能导致性能损失,建议传入函数
       //推荐的调用方式
       setTimeout(function(){
           alert("helloworld!");
       },1000);
       ```
       setTimeout的结果是返回数值ID,表示超时调用,这个超时调用ID是计划执行代码的唯一标识符,可以通过调用它取消调用,例如

       ```javascript
       var id = setTimeout(function(){
           alert("HelloWorld!");
       },1000);
       //把它取消
       clearTimeout(id);
       ```
     - 间歇调用setInterval接收的参数与setTimeout相同: 要执行的代码(字符串或函数)和每次执行之前需要等待的毫秒数(每隔时间运行一次,并且不建议传递字符串),例如

       ```javascript
       setInterval("alert('helloworld!')",1000);        //第一个参数不建议传入字符串,因为传递的字符串可能导致性能损失,建议传入函数
       //推荐的调用方式
       setInterval(function(){
           alert("helloworld!");
       },1000);
       ```
       同样地,setInterval也是返回一个ID,用于将来某个时候取消调用,例如

       ```javascript
       var id = setInterval(function(){
           alert("HelloWorld!");
       },1000);
       //把它取消
       clearInterval(id);
       ```
     - 一般认为,使用超时调用来模拟间歇调用的是一种最佳实践,在开发环境下,很少使用真正的间歇调用,原因是后一个间歇调用可能会在前一个间歇调用结束之前启动, 所以可以使用超时调用替换间歇调用,例如

       ```javascript
       var num = 0;
       var max = 10;
       function incrementNumber(){
           num++;
          
           //如果执行次数未达到max设定的值,则设置另一次超时调用
           if(num < max){
               setTimeout(incrementNumber, 500);
           }else{
               alert("Done");
           }
       }
       setTimeout(incrementNumber, 500);
       ```

  3. 系统对话框
     - alert(): 警告对话框,接收一个字符串并将其显示给用户,这个方法结果是向用户显示一个系统对话框,其中包含指定的文本和OK("确定")按钮;
     - confirm(): 确认框,接收一个字符串,这个方法结果是向用户显示一个确认框,其中包括指定的文本,OK("确定")按钮和cancel("取消")按钮,而且返回值是true(点了确认)和false(点了取消),例如

       ```javascript
       if(confirm("Are you sure?")){
           alert("helloworld!");
       }else{
           alert("sorry!");
       }
       ```
     - prompt(): 提示框,接收两个参数,分别是要显示给用户的文本框和文本输入域的默认值(可以是一个空字符串),这个方法结果是向用户显示一个提示框,其中包括指定文本,用户输入域,确认("OK")按钮和cancel("取消")按钮,如果用户点击OK按钮,则返回文本输入域的值,如果用户关闭或者点击cancel按钮,则返回null;
  4. history对象
     - 使用go()方法可以在用户历史记录中任意跳转,可以向后或者向前,只接收一个参数,可以传向后或向前跳转的一个整数值,负数表示向后跳转,正数表示向前跳转,例如

       ```javascript
       //后退一页
       history.go(-1);
       //向前一页
       history.go(1);
       //向前两页
       history.go(2);
       ```
     - 使用back()和forward()方法,分别是后退和前进按钮,例如

       ```javascript
       //后退一页
       history.back();
       //前进一页
       history.forward();
       ```

### (六) DOM

  1. 操作节点

     - appendChild()方法,用于向childNodes列表末尾添加一个节点,返回结果是新增的节点,例如

       ```javascript
       var node = someNode.appendChild(newNode);
       alert(node == newNode);     //true
       alert(someNode.lastChild == newNode);   //true
       ```
     - insertBefore()方法,接收两个参数,要插入的节点和作为参照的节点,插入节点后,被插入的节点会变成参照点的前一个同胞节点,返回结果就是插入节点,如果参照节点是null,则insertBefore()与appendChild()执行相同的操作操作,例如

       ```javascript
       //插入后成为最后一个子节点
       var node = someNode.insertBefore(newNode,null);
       alert(newNode == someNode.lastChild);   //true

       //插入后成为第一个子节点
       var node = someNode.insertBefore(newNode,someNode.firstChild);
       alert(node == newNode);     //true
       alert(newNode == someNode.firstChild);      //true

       //插入到最后一个子节点前面
       var node = someNode.insertBefore(newNode, someNode.lastChild);
       alert(newNode == somoNode.childNodes[someNode.childNodes.length-2]);     //true
       ```

     - replaceChild()方法,接收两个参数,要插入的节点和要替换的节点,被替换的节点仍然还在文档中,只是在文档中以及没有自己的位置,例如

       ```javascript
       //替换第一个子节点
       var node = someNode.replaceChild(newNode,someNode.firstChild);

       //替换最后一个子节点
       var node = someNode.replaceChild(newNode,someNode.lastChild);
       ```
     - removeChild()方法,只想移除而非替换节点,只接收一个参数,即要移除的节点,被移除的节点将被作为返回值,通过这个方法移除的节点仍然为文档所有,只不过在文档中已经没有了自己的位置,跟replaceChild()方法一样,例如

       ```javascript
       //移除第一个子节点
       var node = someNode.removeChild(someNode.firstChild);

       //移除最后一个子节点
       var node = someNode.removeChild(someNode.lastChild)
       ```

  2. Document类型

     - document对象是HTMLDocument(继承自Document类型)的一个实例,表示整个HTML页面;
     - 内置访问其子节点的快捷方式,一个是documentElement属性,该属性始终指向HTML页面中的<html>元素,另一个就是通过childNodes()列表访问文档元素,但documentElement属性则能更快捷,更直接地访问元素,例如

       ```javascript
       <html>
           <body></body>
       </html>
       //从上述html代码中可见,其文档包含一个子节点,即<html>元素,可通过以下访问:
       var html = document.documentElement;        //取得对<html>的引用
       alert(html == document.childNodes[0]);      //true
       alert(html == document.firstChild);         //true
       ```
       可见documentElement,firstChild和childNodes[0]的值相同,都指向html元素;

     - getElementById()只返回文档中第一次出现的元素,IE7及不区分id的大小写,除了这个意外都区分大小写,如果不存在带有相应ID的元素,则返回null,例如

       ```javascript
       <div id="myDiv">some text</div>
       //获取<div>的引用
       var div = document.getElementById("myDiv");
       ```
       另外,不能让表单字段的name特性与其他元素的ID相同,因为IE7及其以前的版本,通过document.getElementById获取的时候也会获取到有name与其他id相同名字的表单;

     - getElementsByTagName()方法,只接收一个参数,就是元素的标签名,,返回包含零个或者多个元素的数组,例如

       ```javascript
       var images = document.getElementsByTagName("img");
       alert(images.length);           //输出图像的数量
       alert(images[0].src);           //输出第一个图像元素的src特性
       alert(images.item[0].src);      //输出第一个图像元素的src特性
       ```
       取到所有图像引用以后,可以直接根据name属性来访问指定的图像,例如

       ```javascript
       <img src="myimage.gif" name="myImage">
       //根据name来获取
       alert(images.nameItem["myImage"]);
       alert(images["myImage"]);
       ```
     - getElementsByName()方法,返回带有给定的name特性的所有元素,例如

       ```javascript
       var radios = document.getElementByName("color");        //获取所有带有name="color"的元素
       ```

     - document.anchors: 包含文档中所有带name特性的<a>元素;
     
     - document.forms: 包含文档中所有的<form>元素,与document.getElementsByTagName("form")得到的结果相同;
     - document.images: 包含文档中所有的<img>元素,与document.getElementsByTagName("img")得到的结果相同;
     - document.links: 包含文档中所有带href特性的<a>元素;
     - document.write()和document.writeln(): write()会原样写入,而writeln()则原样写入后在字符串末尾加上换行符(\n),另外write()和writeln()方法输出的任何HTML代码都将原样处理,例如

       ```html
          <html>
          <head>
              <title>example<title>
          </head>
          <body>
              <p>The current date and time is:
                  <script>
                      document.write("<strong>"+(new Date()).toString()+"</strong>");
                  </script>
              </p>
          </body>
          </html>
       ```
       如果document.write()和document.writeln()里面带有</script>标签的时候,就要把里面的都要转义,例如<\/script>,如果是在window.onload页面加载后再运行document.write()和document.writeln()的时候,文本内容将覆盖整个页面的内容;

       ```html
          <html>
          <head>
              <title>example<title>
          </head>
          <body>
              <p>The current date and time is:
                  <script>
                      window.onload = function(){
                          document.write("<strong>"+(new Date()).toString()+"</strong>");   
                      }
                  </script>
              </p>
          </body>
          </html>
       ```
       这段代码结果是页面只显示<strong>"+(new Date()).toString()+"</strong>;

     - getAttribute()方法,参数就是传入一个实际的特性名,例如要想得到class特性值,应该传入class而不是className,后者只有通过对象属性访问特性时才用,如果给定特性名不存在,则直接返回null,例如

       ```javascript
       //直接通过对象访问属性
       var div = document.getElementById("myDiv");
       alert(div.id);
       alert(div.className);
       alert(div.title);
       alert(div.lang);
       alert(div.dir);

       //使用getAttribute()访问属性
       var div = document.getElementById("myDiv");
       alert(div.getAttribute("div"));
       alert(div.getAttribute("class"));
       alert(div.getAttribute("title"));
       alert(div.getAttribute("lang"));
       alert(div.getAttribute("dir"));
       ```
       只有取得自定义特性值的情况下才会用到getAttribute()方法,一般都是对象直接访问;

     - setAttribute()方法,接收两个参数,分别是要设置的特性姓名和值,如果特性不存在,则会创建给属性并设置相应的值,但是如果是通过对象访问属性直接赋值设置的属性是自定义的,该属性不会自动成为元素的特性,例如

       ```javascript
       div.mycolor = "red";
       alert(div.getAttribute("mycolor"));     //null(IE除外)
       ```
     - removeAttribute()方法,彻底删除元素的特性,不仅会清除特性的值,而且也会从元素完全删除特性,例如

       ```javascript
       div.removeAttribute("class");
       ```
     - createElement()方法可以创建新元素,只接收一个参数,即要创建元素的标签名,例如

       ```javascript
       var div = document.createElement();
       ```
       创建好的元素不会被添加到文档树,这时候如果要操作元素的特性,可以如下

       ```javascript
       div.id = "myDiv";
       div.className = "box";
       ```
       创建后的新元素要添加到文档树,可以使用appendChild(),insertBefore(),replaceChild(),例如

       ```javascript
       document.body.appendChild(div);
       ```
     - 通过firstChild属性可以获得文本节点以及修改文本节点内容,例如

       ```javascript
       //HTML代码
       <div>   </div>
       //js代码
       var div = document.getElementByTagName("div");
       var text = div.firstChild();       //或者div.childNodes[0]
       //修改文本节点的内容
       text.nodeVale = "hellow";
       ```
       修改文本节点内容的时候,如果包含有html标签,则会直接输出html标签而不会解析;
     
     - createTextNode()方法用来创建文本节点,接收一个参数就是要插入的文本的节点,例如

       ```javascript
       var element = document.createElement("div");
       element.className = "message";

       var textNode = document.createTextNode("hahaha");
       element.appendChild(textNode);

       document.body.appendChild(element);
       ```
     - comment类型: 注释在DOM中是通过comment类型来表示的,获得注释内容,例如

       ```javascript
       <div id="myDiv"><!-- A comment --></div>
       //获取注释内容
       var div = document.getElementById("myDiv");
       var comment = div.firstChild;
       alert(comment.data);        //A comment
       ```

### (七) 事件

  1. 事件流

     - 事件流: 就是从页面中接收事件的顺序;
     - 事件流包括三个阶段: 事件捕获阶段,处于目标阶段和事件冒泡阶段;
     - 事件捕获阶段顺序: 沿着DOM树依次向下,一直传播到事件的实际目标;
     - 事件冒泡阶段顺序: 沿着DOM树依次向上,直至传播到document对象;
     - 事件处理程序(或事件侦听器): 响应某个事件函数;事件: 用户或者浏览器自身执行的某种动作;
     - 事件处理程序的过程: 
       + 当你点击一个元素的时候，浏览器并不知道你所点击的确定元素是哪个，它会从 DOM tree 的最高层一层一层往下找，尽可能地找到这个元素所处的最低一层，这就是我们的捕获阶段;
       + 当浏览器找到这个元素的最低层的时候，就会触发绑定在这个元素上的 handler，这就是我们的第二个阶段，处于目标阶段;
       + 当执行完这个 handler 的时候，浏览器就会根据捕获时的路径，往回走，这时候就会触发绑定在父元素的 handler，这个阶段就是我们的事件冒泡阶段;
       + 例如, 有一个div元素里面加入一个p元素, 在p元素里面加入span元素, 这时候我们在每个元素上都添加一个点击事件处理函数, 当我点击div的时候, 会先触发span事件处理函数, 然后冒泡上去, 触发p元素, 最后再触发div元素;
     - HTML事件处理程序中,函数内部可以通过even变量直接访问事件对象,例如

       ```javascript
       <input type="button" value="click me" onclick="alert(event.type);">
       ```
       在函数内部,this的值等于事件的目标元素,例如

       ```javascript
       <input type="button" value="click me" onclick="alert(this.value)">
       ```
       事件处理程序还可以直接访问自己的属性,例如

       ```javascript
      <input type="button" value="click me" onclick="alert(value)">
      ```
     - 删除事件处理程序,直接赋值为null即可,例如

       ```javascript
       btn.onclick = null;
       ```
     - addEventListener()接收三个参数,分别是要处理的事件名,作为事件处理程序的函数和一个布尔值,布尔值如果是true,表示在捕获阶段调用事件处理程序,如果是false,表示在冒泡阶段调用事件处理程序,例如

       ```javascript
       var btn = document.getElementById("myBtn");
       btn.addEventListener("click",function(){
           alert(this.id);
       },false);
       ```
       使用addEventListener()方法好处就是可以为目标元素添加多个事件处理程序,例如

       ```javascript
       var btn = document.getElementById("myBtn");
       btn.addEventListener("click",function(){
           alert(this.id);
       },false);
       btn.addEventListener("click",function(){
           alert("Helloworld!!!");
       },false);
       ```
       以上程序会按顺序执行,先弹出id,然后弹出helloworld;
     
     - 使用addEventListener()方法的目标元素如果要消除事件处理程序,就需要使用removeEventListener()方法,参数跟addEventListener()方法一样,但如果函数是匿名函数的话会报错,只能使用函数名,例如

       ```javascript
       var btn = document.getElementById("myBtn");
       var handle = function(){
           alert(this.id);
       };
       btn.addEventListener("click",handle,false);
       btn.removeEventListener("click",handle,false);
       ```
     - IE事件处理程序中也有两个跟上面类似的方法,分别是attachEvent()和detachEvent()方法,都接收两个参数,分别是事件处理程序的名称,与事件处理程序函数,而且事件处理函数都是处理冒泡阶段,例如

       ```javascript
       var btn = document.getElementById("myBtn");
       btn.attachEvent("onclick",function(){
           alert("Clicked");
       });
       ```
     - 辨别this,target,currentTarget,如果直接将事件处理程序指定给了目标元素,则那三个值都是相等的,例如
    
       ```javascript
       var btn = document.getElementById("myBtn");
       btn.onclick = function(event){
           alert(event.currentTarget === this);        //true
           alert(event.target === this);               //true
       }
       ```
       如果事件处理程序存在于按钮的父节点中,这些值都是不相同的,例如

       ```javascript
       document.body.onclick = function(event){
           alert(event.currentTarget === document.body);       //true
           alert(this === document.body);                      //true
           alert(event.target === document.getElementById("myBtn"));   //true
       }
       ```
     - 使用event.type属性可以处理多个事件函数,例如

       ```javascript
       var btn = document.getElementById("myBtn");
       var handler = function(event){
           switch(event.type){
               case "click":
                   alert("clicked");
                   break;
               case "mouseover":
                   alert("mouseover");
                   break;
               case "mouseout":
                   alert("mouseout");
                   break;
           }
       };
       btn.onclick = handler;
       btn.mouseover = handler;
       btn.mouseout = handler;
       ```
     - 阻止事件的默认行为,可以使用preventDefault()方法,例如阻止点击链接后直接跳到另一页面

       ```javascript
       var link = document.getElementById("myLink");
       link.onclick = function(event){
           event.preventDefault();
       }
       ```
     - stopPropagation()方法用于立即停止事件在DOM层次中的传播,即取消进一步的事件捕获或冒泡,例如

       ```javascript
       var btn = document.getElementById("myBtn");
       btn.onclick = function(event){
           alert("clicked");
           event.stopPropagation();            //防止冒泡到body上的事件触发
       }
       ```
     - 跨浏览器对象,使用EventUtil对象 
    
       ```javascript
       event = EventUtil.getEvent(event);          //取得事件对象
       ```

### (八) 表单脚本

  1. 获取表单

     - 获取表单可以使用getElementByTagName()方法,例如

       ```javascript
       var form = document.getElementByTagName("form");
       ```
       也可以直接通过document.forms可以取得页面中的所有的表单,例如

       ```javascript 
       var form = document.forms[0];           //取得页面中的第一个表单
       var form2 = document.forms["form2"];    //取得页面中名称为"form2"的表单
       ```
       获取表单里其他表单字段的话,就需要用到Elements[],例如

       ```javascript
       //html代码
       <form method="post" id="myForm">
          <ul>
               <li><input type="radio" name="color" value="red">red</li>
               <li><input type="radio" name="color" value="green">green</li>
               <li><input type="radio" name="color" value="blue">blue</li>
           </ul>
       </form>
       //javascript代码
       var form = document.getElementByTagName("form");
       var colorFields = form.elements["color"];
       alert(colorFields.length);          //返回3

       alert(colorFields[0] === form.elements[0]);         //返回true
       ```

     - select()方法: 选择文本,即选择在文本框里面的内容,例如

       ```javascript
       var textbox = document.forms[0].elements["textbox1"];
       textbox.select();
       ```

### (九) JSON

  1. 解析与序列化

     - JSON对象有两个方法: stringify()和parse(),这两个方法分别用于把javascript对象序列化为JSON字符串和把Json字符串解析为原生javascript值,例如

       ```javascript
       //javascript字面量对象
       var book = {
           title: "Professional",
           editions: 3,
           year: 2011
       };
       //转化为JSON字符串
       var jsonText = JSON.stringify(book);
       //输出结果是:
       {
           "title": "Professional",
           "editions": 3,
           "year": 2011
       };
       ```
       当javascript对象中带有undefined的值时,会忽略,结果中最终都是有效JSON数据类型的实例属性,当想把JSON对象转换为javascript对象时,即

       ```javascript
       var book = JSON.parse(jsonText);
       ```
     - 序列化过滤,在JSON.stringify()中,除了要序列化的javascript对象外,还可以接收另外两个参数,这两个参数用于指定以不同方式序列化javascript对象,第一个参数是过滤器,可以是一个数组,还可以是一个函数,例如

       ```javascript
       var book = {
           "title": "Professional",
           "authors": [
               "Tom"
           ],
           edition: 3,
           year: 2011
       };
       var jsonText = JSON.stringify(book, ["title","edition"]);
       ```
       最后得到的结果是: {"title":"Professional","edition":3},过滤不在数组中的属性,如果是函数的时候,效果就不同了,函数会接收两个参数,分别是属性名和属性值,例如

       ```javascript
       var book = {
           "title": "Professional",
           "authors": [
               "Tom"
           ],
           edition: 3,
           year: 2011
       };
       var jsonText = JSON.stringify(book, function(){
           switch(key){
               case "authors":
                   return value.join(",");
               case "year":
                   return 5000;
               case "edition":
                   return undefined;
               Default: 
                   return value;
           }
       });
       ```
       注意,遇到undefined时,相应的属性就会忽略,最后的输出结果: {"title": "Professional","authors":"Tom","year":5000};
       JSON.stringify()的第三个参数就是用于控制结果中的缩进和空白符,如果这个参数是一个参数,那它表示的是每个级别缩进的空格数
     
     - JSON.parse()方法可以接收另一个参数,该参数是一个参数,为了区分JSON.stringify()中第二个参数函数,该函数被称为还原函数,虽然作用都一样,例如,在将日期字符串转化为Date对象的时候,经常要用到还原函数,例如:

       ```javascript
       var book = {
           "title": "Professional",
           "authors": [
               "Tom"
           ],
           edition: 3,
           year: 2011,
           date: new Date(2011,1,1);
       };
       var jsonText = JSON.stringify(book);
       //解析过程
       var book = JSON.parse(jsonText, function(key,value){
           if(key == "date"){
               return new Date(value);
           }else{
               return value;
           }
       });
       alert(book.date.getFullYear());             //字符串转为对象后才可以使用getFullYear()方法
       ```