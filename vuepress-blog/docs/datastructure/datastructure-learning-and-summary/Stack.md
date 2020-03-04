> Create Stack

**栈是一种遵循后进先出原则的有序集合。**一个栈会含有两个端点，分别为栈顶和栈尾。栈顶代表的是后进的一端，主要负责栈元素的添加以及删除操作。栈尾代表的是先进的一端，也叫栈底。**元素进入栈永远都是从栈顶到栈尾的。**如下示例图：



![栈的基本示意图](http://ppu8vcpyg.bkt.clouddn.com/About-stack.jpg)

![About-stack](/Users/andraw-lin/Mine/Personal/FE_Images/Data-Structure/About-stack.jpg)



一、栈的创建

栈的基本实现主要包含以下属性以及方法：

```javascript
function Stack() {
  var items = []		// 用于存储栈里的数据，私有属性不会暴露
  this.push = function() { ... }		// 向栈中添加元素
  this.pop = function() { ... }		// 从栈顶开始移除元素，同时返回移除的元素
  this.peek = function() { ... }		// 返回栈顶元素，不对栈做任何处理
  this.isEmpty = function() { ... }		// 判断栈是否为空
  this.clear = function() { ... }		// 移除栈里的所有元素
  this.size = function() { ... }		// 返回栈里元素的个数
}
```

1. push

   栈的添加元素操作，可以直接使用原生JS对数组的push实现，实现如下：

   ```javascript
   this.push = function(element) {
     items.push(element)
     // 为了拓展，在push完后，可直接返回最终栈的长度
     return items.length
   }
   ```

2. pop

   与push类似，可直接使用原生JS对数组的pop实现，并最终返回移除栈顶的元素：

   ```javascript
   this.pop = function() {
     return items.pop()
   }
   ```

3. peek

   返回栈顶元素可直接使用数组的最大长度来获取栈顶元素：

   ```javascript
   this.peek = function() {
     return items[items.length - 1]
   }
   ```

4. isEmpty

   判断栈是否为空，可直接判断数组中长度是否为0即可：

   ```javascript
   this.isEmpty = function() {
     return items.length === 0
   }
   ```

5. clear

   移除栈中的所有元素，方法有两种：

   ```javascript
   // 第一种：直接赋值为一个新的数组
   this.clear = function() {
     items = []
   }
   
   // 第二种：通过循环，每一次遍历都pop一次，直到最后结束（好处就是可省去一次垃圾回收）
   this.clear = function() {
     while (items.length) items.pop()
   }
   ```

6. size

   可直接使用数组的length替代即可：

   ```javascript
   this.size = function() {
   	return items.length
   }
   ```

二、实例

1. 实现一个函数，可实现一个数的十进制转化为二进制。

   十进制转化为二进制，最简单的操作就是，将十进制的数除以2向下取整，取余并向下取整后放进一个栈中，重复操作，直到该十进制数为0，实现如下：

   ```javascript
   function divideByTwo(num) {
     let stack = new Stack(),
     	str = ''
     while(num) {
     	stack.push(Math.floor(num % 2))
       num = Math.floor(num / 2)
     }
     while(!stack.isEmpty()) str += stack.pop()
     return str
   }
   ```

   为了拓展，现在实现一个十进制转化为任何进制的数，实现跟上述基本一致，也只需要将上述方法修改一下即可：

   ```javascript
   function divideBy(num, base) {
     let stack = new Stack(),
     	str = '',
     	digits = '0123456789ABCDEF'
     while(num) {
       stack.push(Math.floor(num % base))
       num = Math.floor(num / base)
     }
     while(!stack.isEmpty()) str += digits[stack.pop()]
     return str
   }
   ```

   