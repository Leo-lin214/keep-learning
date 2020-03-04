> About LinkedList

数组这种数据结构对于JS来说，是极其方便操作数据的。但是数组有一个致命缺陷：**从数组的起点或中间插入或移除某项元素时成本会很高，因为需要移动元素**（即使我们可以直接使用JS提供的splice方法，但其背后实现的思想的确会耗费很高的成本）。

**链表，用于存储有序的元素集合。**链表中的元素在内存中**并不是连续放置**的。每个元素都是由一个存储元素本身的值，以及一个指向下一个元素的指针组成。

示例图如下：



![](http://ppu8vcpyg.bkt.clouddn.com/About-Single-Linked-list.jpg)

![About-Single-Linked-list](/Users/andraw-lin/Mine/Personal/FE_Images/Data-Structure/About-Single-Linked-list.jpg)



相比于传统的数组，链表的好处在于添加或移除元素时并不需要移动链表中的其他元素。例如在中间插入一个元素，只需要找到对应位置下的前一个Node节点的Next指针指向新的元素，而新的元素的Next指向下一个元素即可，像火车车厢那样，只需要在两节车厢中的线解开插入即可。

---

> Create A Single LinkedList（单向链表）

链表中最基本的数据结构就是单向链表，一个单向链表的基本骨架如下：

```javascript
function LinkedList() {
  var Node = function(element) {		// 创建链表节点的私有类
    this.element = element
    this.next = null
  }
  var length = 0		// 用于存储链表的长度
  var head = null		// 用于指向链表的第一个节点
  this.append = function(element) { ... }		// 向链表的尾部添加一个新的元素
  this.insert = function(position, element) { ... }		// 向链表内插入一个新的元素
  this.removeAt = function(position) { ... }		// 将链表中特定位置的元素移除
  this.remove = function(element) { ... }		// 将链表中能匹配的元素移除
  this.indexOf = function(element) { ... }		// 返回元素在列表中的索引
  this.isEmpty = function() { ... }		// 判断链表中是否为空
  this.size = function() { ... }		// 返回链表的长度
  this.toString = function() { ... }		// 输出元素的值
}
```

1. append

   向LinkedList对象尾部添加一个元素时，需考虑两种场景，第一种是当链表为空时，就直接将head指向对应先添加的元素；第二种是链表不为空的情况，则直接向链表尾部添加元素。

   ```javascript
   this.append = function(element) {
     let elementNode = new Node(element)
     if (!head) {
       head = elementNode
     } else {
       let elementNext = head
       while (elementNext.next) { elementNext = elementNext.next }
       elementNext.next = elementNode
     }
     length++
   }
   ```

2. insert

   向链表中插入一个元素，需考虑插入位置的前后两个元素，除了考虑在链表的中间插入元素外，还需考虑在链表的头部以及尾部插入元素。

   ```javascript
   this.insert = function(position, element) {
     if (position >= 0 && position <= length) {
       let elementNode = new Node(element)
       if (position === 0) {
         elementNode.next = head
         head = elementNode
       } else {
         let index = 1,
             elementNext = head.next,
             elementBefore = head
         while(index++ !== position) {
           elementBefore = elementNext
           elementNext = elementNext.next
         }
         elementBefore.next = elementNode
         elementNode.next = elementNext
       }
       length++
       return true
     } else {
       return false
     }
   }
   ```

3. removeAt

   移除特定位置的元素，跟insert类似，除了移除中间的元素以外，还需考虑到的是链表头部和尾部情况。

   ```javascript
   this.removeAt = function(position) {
     if (position >= 0 && position < length) {
       if (position === 0) {
         head = head.next
       } else {
         let elementNext = head.next,
             elementBefore = head,
             index = 1
         while(index++ !== position) {
           elementBefore = elementNext
           elementNext = elementNext.next
         }
         elementBefore.next = elementNext.next
       }
       length--
       return true
     } else {
       return false
     }
   }
   ```

4. remove

   移除特定元素，需进行遍历匹配。

   ```javascript
   this.remove = function(element) {
     if (elementBefore.element === element) {
       head = head.next
     } else {
       let elementBefore = head,
         	elementNext = head.next
       while (elementNext) {
         if (elementNext.element === element) {
           elementBefore.next = elementNext.next
           break
         }
         elementBefore = elementNext
         elementNext = elementNext.next
       }
     }
     length--
     return true
   }
   
   /*********************************************/
   
   // 除了上述的做法，还可以结合实现的indexOf方法以及removeAt方法相结合来解决
   this.remove = function(element) {
     let index = this.indexOf(element)
     return this.removeAt(index)
   }
   ```

5. indexOf

   与原生的JS提供的indexOf背后实现的思想一致，遍历整个链表，一旦遍历到的元素与参数能够匹配时，即返回此时记录的index值，并跳出循环。

   ```javascript
   this.indexOf = function(element) {
     let elementBefore = head,
         index = 0
     while(elementBefore) {
       if (elementBefore.element === element) return index
       elementBefore = elementBefore.next
       index++
     }
     return -1
   }
   ```

6. isEmpty

   判断链表是否空，可直接从私有属性length是否等于0来判断即可。

   ```javascript
   this.isEmpty = function() {
     return length === 0
   }
   ```

7. size

   直接返回链表的长度即可。

   ```javascript
   this.size = function() {
     return length
   }
   ```

8. toString

   将链表转换成一个字符串输出，需遍历进行。

   ```javascript
   this.toString = function() {
     let elementBefore = head,
         str = ''
     while(elementBefore) {
       str += `${elementBefore.element}. `
       elementBefore = elementBefore.next
     }
     return str
   }
   ```

---

> Create a Doubly LinkedList（双向链表）

双向链表的节点有两个指向，一个指向上一个节点，另外一个指向下一个节点。示例图如下：



![](http://ppu8vcpyg.bkt.clouddn.com/About-Doubly-Linked-List.jpg)

![About-Doubly-Linked-List](/Users/andraw-lin/Mine/Personal/FE_Images/Data-Structure/About-Doubly-Linked-List.jpg)



可以看到的是，**相比于单向链表，双向链表只是多了一个可以指向上一个的值，这就有利于从链表的最后一个元素向前遍历**。对于单向链表，有一个致命缺陷就是，一旦迭代列表错过了要找的元素，就需要回到列表的原点重新迭代。

一个基本的双向链表所具有的骨架如下：

```javascript
function DoublyLinkedList() {
  var Node = function(element) {		// 用于创建双向链表的节点私有类
    this.element = element
    this.pre = null
    this.next = null
  }
  var length = 0,		// 用于表示链表的长度的私有属性
      head = null,		// 用于表示链表的第一个元素的私有属性
      tail = null		// 用于表示链表的最后一个元素的私有属性（也是跟单向链表不同地方）
  // ...方法依然跟单向链表一致，接下来逐个实现
  this.append = function(element) { ... }		// 向链表的尾部添加一个新的元素
  this.insert = function(position, element) { ... }		// 向链表内插入一个新的元素
  this.removeAt = function(position) { ... }		// 将链表中特定位置的元素移除
  this.remove = function(element) { ... }		// 将链表中能匹配的元素移除
  this.indexOf = function(element) { ... }		// 返回元素在列表中的索引
  this.isEmpty = function() { ... }		// 判断链表中是否为空
  this.size = function() { ... }		// 返回链表的长度
  this.toString = function() { ... }		// 输出元素的值
}
```

1. append

   向双向链表的尾部添加一个新的元素，实现跟单向链表一致，只是多了一个尾部属性指向的添加而已。

   ```javascript
   this.append = function(element) {
     let elementNode = new Node(element)
     if (!head) {
       head = elementNode
     } else {
       let elementNext = head
       while (elementNext.next) { elementNext = elementNext.next }
       elementNext.next = elementNode
     }
     tail = elementNode		// 多了一步tail的指向添加
     length++
   }
   ```

2. insert

   在特定的位置插入一个新的元素，与单向链表的区别在于，单向链表只需控制next值，而双向链表则需同时控制next和pre的值。

   ```javascript
   this.insert = function(position, element) {
     if (position >= 0 && position <= length) {
       let elementNode = new Node(element)
       if (position === 0) {
         if (!head) {
           head = elementNode
           tail = elementNode
         } else {
           elementNode.next = head
           head.pre = elementNode
           head = elementNode
         }
       } else if (position === length) {
         tail.pre.next = elementNode
         elementNode.pre = tail.pre
         tail = elementNode
       } else {
         let index = 1,
             elementPre = head,
             elementNext = head.next
         while(index++ < position) {
           elementPre = elementNext
           elementNext = elementNext.next
         }
         elementPre.next = elementNode
         elementNode.pre = elementPre
         elementNode.next = elementNext
         elementNext.pre = elementNode
       }
       length++
       return true
     } else {
       return false
     }
   }
   ```

3. removeAt

   在指定的位置移除元素，与单向链表一致，区别就在于还需控制链表的Next值以及Pre值。

   ```javascript
   this.removeAt = function(position) {
     if (position >= 0 && position < length) {
       if (position === 0) {
         head = head.next
         length === 1 ? tail = null : head.pre = nulll
       } else if (position === length - 1) {
         tail.pre.next = null
         tail = tail.pre
       } else {
         let index = 0,
             elementPre = head,
             elementNext = head.next
         while(index++ !== position) {
           elementPre = elementNext
           elementNext = elementNext.next
         }
         elementPre.next = elementNext.next
         element.next.pre = elementPre
       }
       length--
       return true
     } else {
       return false
     }
   }
   ```

4. indexOf、isEmpty、size、toString方法都是和单向链表一致的，可参考单向链表的写法。

5. remove

   实现remove某个元素的值，最简单的就是结合indexOf以及removeAt实现。

   ```javascript
   this.remove = function(element) {
     let index = this.indexOf(element)
     return this.removeAt(index)
   }
   // 当然也可以循环遍历来进行匹配获取相对应的值，然后再处理Pre的值以及Next的值即可
   ```

---

> Circular LinkedList（循环链表）

循环链表，与之前学习的循环队列是一个很相似的东西。每遍历到一个元素时，就把该元素取出来，放到tail中，然后head将指向第二个元素。

对于事件队列，个人认为使用循环链表会更加的妥协，由于回调函数在事件队列中都会在监听，一旦发现有数据返回，就会立马返回，因此，执行后的Callback将会在事件队列中消失。我们都知道循环队列中元素的移动需要耗费很多性能，而使用链表的方式，将大大提高元素的移动，有效地提高事件队列的执行效率。

———————————待续（实现上，可自己想想，其实可直接使用单向链表来实现）



个人建议：**当需要添加和移除很多元素时，最好的选择就是链表，而非数组。**





