> About Set

**集合是由一组无序且唯一（即不能重复）的元素组成**。与数学中常提到的集合概念是类似的，但也会经常使用在数据结构中，例如ES6中实现的Set类就是这次要提及的集合概念。

集合可以有并集、交集以及差集等基本操作。另外，**集合可以想象成一个无重复元素，也顺序概念的数组**。

---

> Create A Set

实现一个集合的骨架，既可使用对象储存数据，也可使用数组存储数据。需要注意的是：**数组是可以使用字符串作为索引的**，一旦索引转化后不是数字类型，则不可使用for进行遍历，只可以使用对象的for…in..进行遍历。

一个集合的基本骨架包括如下：

```javascript
function Set() {
  var items = {}		// 用一个对象存储
  var length = 0		// 用于存储集合中元素的个数
  this.add = function(value) { ... }		// 向集合中添加一个元素
  this.remove = function(value) { ... }		// 从集合中移除一个元素
  this.has = function(value) { ... }		// 判断一个值是否在集合中
  this.clear = function()	{ ... }		// 移除集合中所有项
  this.size = function() { ... }		// 返回集合中所包含元素的数量，即集合的长度
  this.values = function() { ... }		// 返回一个包含集合中所有值的数组
}
```

可以看到，使用一个对象进行存储数据，那新添加的元素键名如何取？很简单，**集合直接将元素的值作为键值**即可，接下来模拟实现ES6中的Set类如下。

1. has

   判断一个元素是否在集合中，就直接判断元素值是否存在对象中即可。

   ```javascript
   this.has = function(value) {
     return value in items
   }
   ```

2. add

   由于集合中一个重要的点就是不能存储重复的值，在添加新的元素时，需判断元素是否已经存在于集合中，一旦存在，即返回false即可，否则直接添加。

   ```javascript
   this.add = function(value) {
     if (!this.has(value)) {
       items[value] = value
       length++
       return true
     }
     return false
   }
   ```

3. remove

   移除集合中指定元素的值，可直接使用对象的delete方法即可。

   ```javascript
   this.remove = function(value) {
     if (this.has(value)) {
      	delete items[value]
       length--
       return value
     }
     return null
   }
   ```

4. clear

   清除集合中所有元素，最简单的方法便是直接赋值一个空对象，如需考虑垃圾回收可进行遍历对象逐个删除集合中储存的数据。

   ```javascript
   this.clear = function() {
     items = {}
     length = 0
   }
   ```

5. size

   直接使用存储的长度表示即可。

   ```javascript
   this.size = function() { return length }
   ```

6. values

   将集合中所有的元素统一转化为一个数组输出。

   ```javascript
   this.values = function() {
     let elementArr = []
     for (var key in items) {
       elementArr.push(items[key])
     }
     return elementArr
   }
   ```

---

> Operation Of Set（集合的操作）

集合的操作具体有如下几方面：

- 并集：对于给定的两个集合，返回一个包含两个集合中所有元素的新集合；
- 交集：对于给定的两个集合，返回一个包含两个集合中共同拥有的元素的新集合；
- 差集：对于给定的两个集合，返回一个只存在于第一个集合但不存在于第二个集合的元素的新集合；
- 子集：对于给定的两个集合，判断第一个集合中所有的元素是否也存在于第二个集合中；

接下来就逐个根据Set实现上述的效果：

1. 并集

   处理并集的情况下，由于add方法已经存在判断是否在原集合中存在重复元素，因此最简单的方法就是直接新建一个集合，然后遍历两个需要并集的集合，并逐个添加到新集合中，最后返回。

   ```javascript
   this.union = function(otherSet) {
     let otherSetValues = otherSet.values(),
         index = -1
     while(++index < otherSet.size()) {
       this.add(otherSetValues[index])
     }
     return JSON.parse(JSON.stringify(items))
   }
   ```

2. 交集

   处理交集时，最简单的方式只需遍历第二个集合，判断该集合中的元素是否存在于第一个集合中即可。

   ```javascript
   this.inersection = function(otherSet) {
     let intersectionSet = new Set(),
         index = -1,
         otherSetValues = otherSet.values()
     while(++index < otherSet.size()) {
       this.has(otherSetValues[index]) && intersectionSet.add(otherSetValues[index])
     }
     return intersectionSet
   }
   ```

3. 差集

   返回该集合中不存在于目标集合中的元素所组成的集合。

   ```javascript
   this.difference = function(otherSet) {
     let differenceSet = new Set(),
         index = -1,
         values = this.values()
     while(++index < this.size()) {
       !otherSet.has(values(index)) && differenceSet.add(values(index))
     }
     return differenceSet
   }
   ```

4. 子集

   判断该集合是否为目标集合的子集，最简单的方式遍历该集合中的values是否都在目标集合中即可。

   ```javascript
   this.subset = function(otherSet) {
     let values = this.values(),
         index = -1
     if (this.size() <= otherSet.size()) {
       while(++index < this.size()) {
         !otherSet.has(values[index]) && return false
       }
       return true
     }
     return false
   }
   ```

综上所述，实现了Set类中对应的集合操作后，会发现ES6中实现的Set类同样也是可以如此操作。当然也是可以使用数组去存储集合中数据，但是永远记得，**集合中元素的键名和值都是同一个值来的**。

----

