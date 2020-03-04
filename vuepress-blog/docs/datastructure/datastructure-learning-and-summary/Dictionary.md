> About Dictionary And HashTable（关于字典与哈希表）

字典与哈希表，功能上跟集合很类似，**都用于存储无序且唯一值（不重复的值）**。

在集合中，其更加注重于值的本身，因为值不仅用于作为值，并用于作为键。而**在字典和哈希表中，同样也是以【键，值】的形式来存储数据（而这一次的键不再是值本身）**，但这两种数据结构在实现上却会有所不同。

---待续—字典与哈希表的不同点

---

> Create A Dictionary

在字典中，存储的是【键，值】对，其中键名则是用于查询特定元素的。字典和集合很相似，**集合以【值，值】的形式存储元素，字典则是以【键，值】的形式来存储元素**。

字典也被称作映射。举个例子：一个实际的字典（单词和它们的释义）、一个地址簿（地址对应一个地方）。其实在ES6中，**字典就是对应Map类**，接下来就来模拟实现ES6中的Map类。

一个基本字典应该具有如下骨架：

```javascript
function Dictionary() {
  var items = {}		// 用于存储字典中元素的私有属性
  var length = 0		// 用于存储字典中长度（即元素的个数）
  this.set = function(key, value) { ... }		// 向字典中添加新元素
  this.remove = function(key) { ... }		// 从字典中移除特定键的值
  this.has = function(key) { ... }		// 判断字典中是否存在相对应的键
  this.get = function(key) { ... }		// 从字典中获取对应键的值，对原有的字典结构不造成影响
  this.clear = function() { ... }		// 移除字典中所有元素
  this.size = function() { ... }		// 返回字典中元素的个数
  this.keys = function() { ... }		// 返回一个包含字典中所有键的数组
  this.values = function() { ... }		// 返回一个包含字典所有值的数组
}
```

对于字典，存储数据时也可以使用数组结构，一旦使用数组结构，遍历时必须使用对象遍历方法（例如for…in…形式）。但是使用对象存储相对来说会更加的简单以及理解。

1. has

   直接判断一个键是否在对象中即可。

   ```javascript
   this.has = function(key) {
     return key in items
   }
   ```

2. set

   当发现设置的Key存在于字典中时，直接覆盖对应Key的值即可。

   ```javascript
   this.set = function(key, value) {
     items[key] = value
     length++
     return true
   }
   ```

3. remove

   使用对象delete属性即可删除对应的键值对。

   ```javascript
   this.remove = function(key) {
     if (this.has(key)) {
       delete items[key]
       length--
       return true
     }
     return false
   }
   ```

4. get

   先判断对应Key是否存在与字典中，若有则返回，否则直接返回null即可。

   ```javascript
   this.get = function(key) {
     return this.has(key) ? items[key] : null
   }
   ```

5. clear

   清除字典中所有元素，最简单的方式就是直接赋值为一个新的对象，复杂的方式就可以考虑遍历对象，再逐个delete即可。

   ```javascript
   this.clear = function() {
     items = {}
     length = 0
   }
   ```

6. size

   直接返回字典的长度即可。

   ```javascript
   this.size = function() {
     return length
   }
   ```

7. keys

   需遍历整个字典，并把对应Key推进一个数组中返回。需注意的是，**使用for…in…，会把原型中的属性也遍历出来**，因此需使用has方法确保是在字典中存在的键值，而不是在原型中存在的值。

   ```javascript
   this.keys = function() {
     let keysArr = []
     for(let key in items) {
     	if (this.has(key)) keysArr.push(key)
     }
     return keysArr
   }
   ```

8. values

   与keys做法一致。

   ```javascript
   this.values = function() {
     let valuesArr = []
     for(let key in items) {
     	if (this.has(key)) valuesArr.push(items[key])
     }
     return valuesArr
   }
   ```

---

> Create A HashTable

哈希表，也叫散列表。散列算法的作用是尽可能快地在数据结构中找到一个值。

与字典类似，都是通过【键，值】形式来存储数据。主要区别就在于：**字典通过get的形式去获取值时，内部实现是需要遍历整个数据结构来找到它，而哈希表就不需要遍历，而是直接根据某种算法直接找出对应的值出来**。以下就使用电子邮件地址簿的示意图来说明一下：



![](http://ppu8vcpyg.bkt.clouddn.com/About-HashTable.jpg)

![About-HashTable](/Users/andraw-lin/Mine/Personal/FE_Images/Data-Structure/About-HashTable.jpg)



可以看到，散列表转化后的值一般为数值，并且使用数组进行存储。当访问某个键名时，通过使用散列算法转化成数值后并直接读取存储于对应数值索引下的变量即可。

一个基本的散列表骨架主要包含如下：

```javascript
function HashTable() {
  var table = []		// 用于存储散列表中的数据的私有属性
  var loseloseHashCode = function(key) { ... }		// 散列算法（私有方法）
  this.put = function(key, value) { ... }		// 向散列表中添加一个新的项
  this.remove = function(key) { ... }		// 根据键值移除散列表中对应的值
  this.get = function(key) { ... }		// 从散列表中返回对应Key的值
}
```

在实现上述骨架之前，由于会涉及到一个散列算法，因此需先实现一个散列算法：

```javascript
loseloseHashCode = function(key) {
  let index = -1,
      hash = 0
  while(++index < key.length) hash += key.charCodeAt(index)
  return hash % 37
}
```

该散列算法的用法就是遍历整个键名，每个字母转成ASCII码后再与37取余数得到一个新的索引值。至于为什么要跟37取余数，原因在于单纯地取ASCLL码数值过大，会导致数组中存储空间浪费。

1. put

   有了散列函数，就可以很容易解决键名对应数组的索引问题。

   ```javascript
   this.put = function(key, value) {
     let position = loseloseHashCode(key)
     // 每一次添加元素，都尝试输出该元素的转化后的键名是多少
     console.log(`${position}-${key}`)
     table[position] = value
   }
   ```

2. remove

   根据对应的Key值移除散列表中的数据，需把Key值通过散列算法转化后得到的值，由于散列表中存储数据的结构是数组，因此直接找到对应的新Key值赋值为undefined即可（因为**对于数组，那些还没赋值的索引，默认值都为undefined**）。

   ```javascript
   this.remove = function(key) {
     table[loseloseHashCode(key)] = undefined
   }
   ```

3. get

   由于散列表的一个很重要的作用就是能够快速地找到对应Key值下的Value，因此该方法同样也是通过散列算法转化后，直接拿出计算出的索引下的值出来即可（并不再需要像字典那样遍历整个对象匹配对应的Key值后再输出）。

   ```javascript
   this.get = function(key) {
     return table[loseloseHashCode(key)]
   }
   ```

需要注意的是，跟散列表类似的，还有一个数据结构叫散列集合。同样的，**集合的概念在上面已经讲过，即使用【值，值】形式存储，而散列集合的概念则是【散列算法 (值)，值】**，还有一个很重要的区别就是，**散列的数据结构使用的都是数组来储存数据的**。



参考知识链接：（值得研究）

- [V8中的快速属性访问-Fast Properties in V8](<https://blog.csdn.net/szengtal/article/details/79054762>)
- [V8 之旅：对象表示](<http://newhtml.net/v8-object-representation/>)
- [JavaScript中使用object[key]查找属性的过程是怎样的呢（相对于Array查找元素）？](<https://www.zhihu.com/question/30848981>)



---

> Handling Conflicts In Hash Table（处理哈希表中的存储数据时的冲突）

在上述阐述哈希表时，会将属性名通过哈希方法（也叫散列函数）进行转化得到对应的哈希值，然后再根据哈希值在存储数据的数组中直接拿对应的数据。这是一个很简单的过程，但你也许应该注意到，当得到的哈希值相同时，哈希表应该怎样去处理这样的哈希值相同存值问题呢？

目前处理的方案有：**分离链接、线性探查和双散列法**。其中**线性探查方法在V8实现对象存储数据时也会用到**。

1. 分离链接

   分离链接法，就是出现重复的哈希值中，使用一个链表来存储结果。一旦下次通过哈希方法得到相同的哈希值时，就在链表后接上。

   也许你会疑问，在相同哈希值情况下，为什么不使用栈或者队列的形式存储？原因很简单，对于对数组元素频繁操作时都推荐使用链表处理。（当然有同学也会想到使用集合或字典的形式存储，答案是可以的，不过会有问题，听说是因为再嵌入对象形式的话，会导致哈希死循环了，体现不到哈希的作用）。

   在实现之前，需实现一个专门用来保存对应的Key和Value的类。因为链表中只会保存一个Value值，为了方便查询需同时保存Key和Value，实现如下：

   ```javascript
   let ValuePair = function(key, value) {
     this.key = key
     this.value = value
     this.toString = function() {
       return `[${this.key}-${this.value}]`
     }
   }
   ```

   接下来就具体实现对应的方法：

   - put

     在相同哈希值情况下，由于使用的是链表形式来存储对应的数值，因此在对应的哈希值下添加元素时，需判断该哈希值是否有值，若有则需要初始化一个链表出来：

     ```javascript
     this.put = function(key, value) {
       let position = loseloseHashCode(key)
       if (table[position] === undefined) {	// 需判断对应hash下是否有值，若无值，需初始化一个链表
         table[position] = new Linkedlist()
       }
       table[position].append(new ValuePair(key, value))
     }
     ```

   - get

     查询一个对应的Key值，需循环遍历链表去匹配出来对应的值即可。（需注意的是，**遍历链表需先获取链表的Head才能进行遍历**）

     ```javascript
     this.get = function(key) {
       let position = loseloseHashCode(key)
       if (table[position] !== undefined) {
         let elementCurrent = table[position].getHead()		// 需先获取链表的头部对象，才能进一步进行遍历
         while(elementCurrent) {
          	if (elementCurrent.element.key === key) return elementCurrent.element.value
           elementCurrent = elementCurrent.next
         }
       }
       return undefined
     }
     ```

   - remove

     使用remove移除对应哈希值下的元素时，由于使用的是一个链表的形式，移除匹配到对应的Key元素后，其他元素不需进行移动，这在性能上得到了大大提升。

     ```javascript
     this.remove = function(key) {
       let position = loseloseHashCode(key)
       if (table[position] !== undefined) {
         let elementCurrent = table[position].getHead()
         while(elementCurrent) {
           if (elementCurrent.element.key === key) {
             table[position].remove(elementNext.element)
             return true
           }
           elementCurrent = elementCurrent.next
         }
       } else {
         return false
       }
     }
     ```

   

2. 线性探查

   线性探查的思想就是，**当想向表中某个哈希位置加入一个新元素的时候，如果索引为index的位置已经被占据了，就尝试index+1的位置，如果index+1的位置也被占据了，就尝试index+2的位置，以此类推**。

   - put

     判断对应的哈希位置下是否有值存在，一旦有值就需要向下一个索引去探寻，直到找到索引下有位置才会存储起来。

     ```javascript
     this.put = function(key, value) {
       let position = loseloseHashCode(key)
       while(table[position]) position++
       table[position] = new ValuePair(key, value)
     }
     ```

   - get

     同样需要遍历该位置下是否有值，一旦有值即返回，否则就继续向下一个索引继续探寻即可。

     ```javascript
     this.get = function(key) {
       let position = loseloseHashCode(key)
       while(table[position]) {
         if (table[position].key === key) return table[position].value
         position++
       }
       return undefined
     }
     ```

   - remove

     由于存储哈希表时，**不能直接删除某个哈希值，不然会导致整个哈希表中其他所有哈希元素均会收到影响**。因此在移除某个哈希表中的元素时，直接给对对应元素设置为undefined即可。

     ```javascript
     this.remove = function(key) {
       let position = loseloseHashCode(key)
       while(table[position]) {
         if (table[position].key === key) {
           table[position] = undefined
           return true
         }
         position++
       }
       return false
     }
     ```



鉴于处理哈希表中元素冲突的情况，处理方案可以使用**分离链接、线性探查和双散列法**，但在开发中需尽量地降低哈希表的冲突问题。因此对于哈希算法（也叫散列函数）的设置尤为重要。一个好的哈希算法可以尽可能地避免哈希值冲突存值问题。

**一个表现良好的哈希算法是由几个方面构成：插入和检索元素的时间（即性能）、较低的冲突可能性**。

目前社区最被推荐的散列函数之一：djb2哈希算法

```javascript
// djb2
var djb2HashCode = function(key) {
  var hash = 5381
  for (let i = 0; i < key.length; i++) {
    hash = hash * 33 + key.charCodeAt(i)
  }
  return hash % 1013
}
```











