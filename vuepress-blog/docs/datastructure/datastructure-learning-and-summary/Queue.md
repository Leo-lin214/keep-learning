> About Queue

队列和栈类似，遵循的是**先进先出原则（FIFO，先来先服务）**，存储的也是一组有序集合。

**在队尾添加新元素，而在队顶进行移除元素**，新添加的元素必须排在队列的尾部。在生活中有很多例子可以说明，例如排队买票时，都是先来排队的客户可以先被处理，而后面来的客户必须得进行排队。看示例图：



![队列的示例图](http://ppu8vcpyg.bkt.clouddn.com/About-queue.jpg)

![About-queue](/Users/andraw-lin/Mine/Personal/FE_Images/Data-Structure/About-queue.jpg)



---

> Create Queue

创建一个队列类，基本需要包含的属性以及方法如下：

```javascript
function Queue() {
  var items = []		// 用于储存队列数据，私有属性
  // 暴露出去的方法
  this.enqueue = function() { ... }		// 向队尾添加一个新的元素
  this.dequeue = function() { ... }		// 移除队列的第一项，并返回被移除的元素
  this.front = function() { ... }		// 返回队列中的第一项，但不对队列做任何改变
  this.isEmpty = function() { ... }		// 判断队列中是否为空
  this.size = function() { ... }		// 返回队列的长度
}
```

1. enqueue

   入队列的实现，和栈使用的方法一致，都是使用原生数组提供的push方法即可：

   ```javascript
   this.enqueue = function(element) {
     return items.push(element)
   }
   // 为了方便推展，在元素从队尾推进队列后，直接返回队列长度
   ```

2. dequeue

   移除队列中的元素，由于是直接从队列的队顶直接移除，并返回移除的元素，因此可直接使用原生数组提供的shift方法，即移除数组第一项的数据：

   ```javascript
   this.dequeue = function() {
     return items.shift()
   }
   ```

3. front

   与栈中的peek方法不一样的是，栈是直接获取数组中最后一个项的元素，而front方法则是直接获取数组数组中第一项元素，如下：

   ```javascript
   this.front = function() {
     return items[0]
   }
   ```

4. isEmpty

   与栈中的实现一致：

   ```javascript
   this.dequeue = function() {
     return items.length === 0
   }
   ```

5. size

   直接返回数组的长度：

   ```javascript
   this.size = function() {
     return items.length
   }
   ```

---

> Priority queue（优先队列）

优先队列是在基础队列上的一种升级，可以理解为优先级高的元素会优先于优先级低的元素先执行。

在生活中，例如排队急诊时，医生会优先队病的较重的一方先看病；银行排队服务时，VIP用户总会比普通用户先被服务。

在实现上，有两种方案，分别是：

- 入队列控制。根据元素的优先级来入队列，优先级高的先进队列，然后在后续的处理时，按正常走即可；
- 出队列控制。入队列时还是按正常地push进来，然后在后续处理时，则需按照优先级高的先出队列；

相对而言，入队列控制在实现上会简单许多，由于出队列控制需要调整数组中元素的位置：

```javascript
function PriorityQueue() {
  let items = []		// 用于存储数据的私有属性
  function QueueElement(element, priority) {		// 创建队列中的元素私有类
    this.element = element
    this.priority = priority
  }
  this.enqueue = function(element, priority) {		// 入队列控制
  	let queueElement = new QueueElement(element, priority)
    if (!items.length) {
      return items.push(queueElement)
    } else {
      let index = items.length
      while (index--) {
        if (queueElement.priority > items[index].priority) {
          items.splice(index, 0, queueElement)
          return items.length
        }
      }
      return items.push(queueElement)
    }
  }
  this.getItems = function() { return items }
}
// 测试
var queueTest = new PriorityQueue()
queueTest.enqueue('haha', 5)
queueTest.enqueue('hehe', 1)
queueTest.enqueue('didi', 3)
queueTest.enqueue('kaka', 2)
console.log(queueTest.getItems())
// 输出为：
0: QueueElement {element: "haha", priority: 5}
1: QueueElement {element: "didi", priority: 3}
2: QueueElement {element: "kaka", priority: 2}
3: QueueElement {element: "hehe", priority: 1}
```

---

> Circular Queue（循环队列）

循环队列在很多机制都会用到，好比如js的异步运行机制都会采用，将异步处理的Callback统一放到一个事件队列中，一旦循环遍历过程中发现有数据返回时就会执行对应的Callback，并将该Callback从事件队列中移除掉。

原理很简单，都是在基础队列的基础上的一种升级，在好比如击鼓传花游戏，几个孩子围成一圈，把花迅速地传给隔壁的人，当某一个时刻时，就移除掉手上有花的孩子，然后再重新传。

现在模拟击鼓传花游戏，实现代码如下：

```javascript
function hotPotato(nameList, num) {
	let queue = new Queue()
  nameList.forEach(item => { queue.enqueue(item) })
  while (queue.size() > 1) {
    let index = 0
    while (index++ < num) {
      queue.enqueue(queue.dequeue())
    }
    console.log(`${queue.dequeue()} has already remove.`)
  }
  console.log(`${queue.dequeue()} has win this game.`)
}
// 测试：
var nameList = ['haha', 'hehe', 'didi', 'kaka', 'tata', 'baba', 'fefe']
hotPotato(nameList, 3)
// 输出如下：
kaka has already remove.
haha has already remove.
baba has already remove.
tata has already remove.
fefe has already remove.
didi has already remove.
hehe has win this game.
```

可以看到，**循环队列的实现，最主要就是遍历完一项后，立马将该项重新从队尾进行添加，直到符合条件后才会重新开始**。

---

