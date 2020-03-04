> About Array Sort

数组排序中常用的会有5种方式，分别是**冒泡排序、选择排序、插入排序、归并排序、快速排序**。

冒泡排序和选择排序在性能上是最差的，而插入排序只有在数组元素比较少的情况下才会有较好一点的性能，但是依然不是推荐使用的方案。**冒泡排序、选择排序、插入排序的算法复杂度为O（n\^2）**。

归并排序和快速排序的复杂度都为O（nlog\^n），是排序中推荐使用的方案。其中Javascript的sort方法在火狐上是使用归并排序实现的，而在Chrome中则是使用快速排序进行实现的。另外，快速排序相对于同样是复杂为O（n\^2）的其他排序方式都会有稍微更好一点点的性能。

> Create A Array Sort Class

接下来会实现一个类，主要包含实现各种排序算法。基本骨架如下：

```javascript
function ArrayList() {
  let array = []		// 用于保存测试数据的私有变量
  let swapItem = function(iIndex, jIndex) { [a[iIndex], a[jIndex]] = [a[jIndex], a[iIndex]] }		// 用于交换两个测试数据位置的私有方法
  this.insert = function(item) {		// 向数组中添加新的测试数据
    array.push(item)
  }
  this.toString = function() {		// 以字符串的形式返回数组中测试元素
    return array.join()		
  }
  this.bubbleSort = function() { ... }		// 冒泡排序
  this.selectionSort = function() { ... }		// 选择排序
  this.insertionSort = function() { ... }		// 插入排序
  this.mergeSort = function() { ... }		// 归并排序
  this.quickSort = function() { ... }		// 快速排序
}
```

1. bubbleSort（冒泡排序）

   冒泡排序在所有的排序算法中是最简单最容易理解的，但是从运行时间的角度来看的话，却是最差的一个。主要的思想就是：**通过比较任何两个相邻的项，如果第一个比第二个大，则交换它们两个对应的位置**。最后值大的那个元素就会向上移动到正确的位置，就好像气泡升至表面一样。

   ```javascript
   this.bubbleSort = function() {
     let length = array.length,
         i = -1
     while(i++ < length) {
       let j = -1
       while(j++ < length-1) {
         if (array[j] > array[j+1]) swapItem(j, j+1)
       }
     }
   }
   ```

   需要注意的是，冒泡排序是要两层的循环遍历。外层循环控制的是数组经过多少轮的排序，内层循环进行的是当前项和下一项的比较。以下就是冒泡排序的工作过程：

   ![](http://ppu8vcpyg.bkt.clouddn.com/dubbleSort.png)

   ![dubbleSort](/Users/andraw-lin/Mine/Personal/FE_Images/Data-Structure/dubbleSort.png)

   有同学可能已经注意到，其实每经过一轮的比较后，最大元素都会往后挪，这时候重新开始的遍历就没必要再跟这些已筛出的最大元素进行比较。因此改善如下：

   ```javascript
   this.dubbleSort = function() {
     let length = array.length,
         i = -1
     while(i++ < length) {
       let j = -1
       while(j++ < length-1-i) {
         if (array[j] > array[j+1]) {
           swapItem(j, j+1)
         }
       }
     }
   }
   ```

   改善后的意识图如下：

   ![](http://ppu8vcpyg.bkt.clouddn.com/improve-dubble-sort.png)

   ![improve-dubble-sort](/Users/andraw-lin/Mine/Personal/FE_Images/Data-Structure/improve-dubble-sort.png)

   可以看到，已排序的元素就没必要再进行比较，因此使用`length-1-i`来减少无谓的比较即可。另外，**即使是改善了冒泡排序的代码，也依然不推荐使用冒泡排序，因为其复杂度依然是O（n\^2）**。

2. selectionSort

   选择排序是一种通过遍历选出最小元素，然后放到数组的前面。其中心思想就是，**通过一个变量保存当前遍历的位置，然后再在这个位置开始遍历一遍去寻找最小元素，最后跟之前保存的遍历位置进行对换**。

   ```javascript
   this.selectionSort = function() {
     let length = array.length,
         i = -1
     while(i++ < length) {
       let currentMin = i,
           j = i - 1
       while(j++ < length) {
         if (array[currentMin] > array[j]) {
           currentMin = j
         } 
       }
       if (i !== currentMin) {
       	swapItem(i, currentMin)
       }
     }
   }
   ```

   同样的道理，外层循环控制的是数组遍历的次数（其实也是记录当前遍历位置），内层循环则是控制选出最小元素的位置，最后一次遍历完后就与之前记录的当前遍历位置进行对换即可。选择排序和冒泡排序同样都是只适合用在只有少数元素的数组比较中。

3. insertionSort

   插入排序的中心思想就是，**从第二项开始遍历，每一次遍历都先把当前元素拿出来，然后与前面数组项元素进行比较，当比该元素大时就与其对换，以此类推，直到找到一个比其小的即可停止**。示意图如下：

   ![](http://ppu8vcpyg.bkt.clouddn.com/insertionSort.png)

   ![insertionSort](/Users/andraw-lin/Mine/Personal/FE_Images/Data-Structure/insertionSort.png)

   

   实现如下：

   ```javascript
   this.insertionSort = function() {
     let length = array.length,
         i = 0
     while(i++ < length - 1) {
       let j = i,
           currentElement = array[i]
       while(j > 0 && array[j-1] > currentElement) {
         array[j] = array[j-1]
         j--
       }
       array[j] = currentElement
     }
   }
   ```

   可以看到，从第二项开始，会先把该元素拿出来放到缓存中，然后开始向前遍历，当前一项比该元素大时就与其交换，直到`j = 0`或比该项元素小的时候。**另外，在排序小型数组时，插入排序要比选择排序和冒泡排序的性能要好。**

4. mergeSort

   归并排序是第一个可以被实际使用的排序算法。其性能不错，**复杂度为O（nlog\^n）**。

   归并排序是一种分治算法。中心思想就是：**使用递归，来不断地将原数组按一半进行切分，直到每个小数组只有一个元素为止，然后在合并时，通过比较左右两个小数组，小的元素先Push，然后再将大的元素Push，以此类推**。示意图如下：

   ![](http://ppu8vcpyg.bkt.clouddn.com/mergeSort.png)

   ![mergeSort](/Users/andraw-lin/Mine/Personal/FE_Images/Data-Structure/mergeSort.png)

   

   实现如下：

   ```javascript
   this.mergeSort = function() {
     array = mergeSortRec(array)
   }
   let mergeSortRec = function(arr) {
     let length = arr.length
     if (length === 1) {
       return arr
     }
     let mid = Math.floor(length/2),
         left = arr.slice(0, mid),
         right = arr.slice(mid, length)
     return merge(mergeSortRec(left), mergeSortRec(right))
   }
   let merge = function(left, right) {
     let newArray = [],
     		lIndex = 0,
         rIndex = 0
     while(lIndex < left.length && rIndex < right.length) {
       if (left[lIndex] < right[rIndex]) {
         newArray.push(left[lIndex++])
       } else {
         newArray.push(right[rIndex++])
       }
     }
     while(lIndex < left.length) newArray.push(left[lIndex++])
     while(rIndex < right.length) newArray.push(right[rIndex++])
     return newArray
   }
   ```

   可以看到，mergeSortRec就是用来拆飞数组用的递归方法，而merge则是用来合并左右两个数组的。

5. quickSort

   快速排序的**复杂度同样是O（nlog^n）**，且它的性能通常比其他的复杂度为O（nlog^n）的排序算法要好。

   快速排序在理解上不好理解，其主要思想就是：

   1. **先从数组中选择中间项为主元**。
   2. **创建两个指针，一个指向数组第一项，一个指向数组的最后一项。接着开始遍历，移动左指针找到一个比主元大的项，移动右指针找到一个比主元小的项，然后将它们两项进行交换，重复该过程，直到左指针大于右指针**。这样一来，比主元大的值都排在右边， 比主元小的值都排在左边。
   3. **接着，比主元小的子数组和比主元大的子数组继续重复两个过程，直到整个数组完全排序为止**。
   
   ```javascript
   this.quickSort = function() {
     quick(array, 0, array.length - 1)
   }
   let quick = function(arr, min, max) {
   	let length = arr.length
     if (length > 1) {
       let index = partition(arr, min, max)
       if (index - 1 > min) {
         quick(arr, min, index - 1)
       }
       if (index < max) {
         quick(arr, index, max)
       } 
     } 
   }
   let partition = function(arr, min, max) {
     let midElement = arr[Math.floor((min + max) / 2)],
         minIndex = min,
         maxIndex = max
     while(minIndex <= maxIndex) {
       while(arr[minIndex] < midElement) {
         minIndex++
       }
       while(arr[maxIndex] > midElement) {
         maxIndex--
       }
       if (minIndex <= maxIndex) {
         swapItem(minIndex, maxIndex)
         minIndex++
         maxindex--
       }
     }
     return minIndex
   }
   ```



---

> About Search（搜索算法）

在前面的数据机构中，我们都基本实现过在指定的数据结构中搜索某个元素的方法，例如LinkedList类中的indexOf方法，还有BinarySearchTree类中search方法，搜索算法一般分为两种：**顺序搜索和二分搜索**。

LinkedList类中的indexOf方法实现的就是顺序搜索，而BinarySearchTree类中search方法实现的则是二分搜索。另外需要注意的是，**二分搜索的前提条件是该数据结构中的数据必须已排序**。

继上述实现的排序类中，我们继续添加两个方法代表顺序搜索和二分搜索，分别为：`sequentialSearch`和`binarySearch`

1. sequentialSearch

   顺序搜索（也叫线性搜索）是最基本、简单的搜索算法，即遍历数据结构中数据，直到找到一个能够跟目的元素相匹配。但是**顺序搜索是最低效的一种搜索算法**。

   ```javascript
   this.sequentialSearch = function(element) {
     let index = -1,
         length = array.length
     while(index++ < length) {
       if (array[index] === element) {
         return index
       }
     }
     return -1
   }
   ```

2. binarySearch

   二分搜索的中心思想就是：**先对数组中的元素排好序，然后找出其中间元素（有余数时向下取整），要是判断到中间元素比目标元素小时，则以中间元素为中心取左边小数组，再继续以上面形式继续找，当判断到中间元素比目标元素大时，则以中间元素为中心取右边小数组，以此类推，直到左边遍历索引大于右边遍历索引**。基本步骤如下：

   - 选择数组中的中间值；
   - 如果选中值是待搜索值，那么算法执行完毕（即值找到了）；
   - 如果待搜索值比选中值要小，则返回步骤1并在选中值左边的子数组中寻找；
   - 如果待搜索值比选中值要大，则返回步骤1并在选中值右边的子数组中寻找；

   ```javascript
   this.binarySearch = function(element) {
     this.quickSort()		// 必须先执行排序，前提条件是已排序的数组
     let length = array.length,
         minIndex = 0,
         maxIndex = length - 1
     while(minIndex <= maxIndex) {
       let midIndex = Math.floor(minIndex + maxIndex) / 2,
       		midELement = array[midIndex]
       if (midElement < element) {
         minIndex = midIndex + 1
       } else if (midElement > element) {
         maxIndex = midIndex - 1
       } else {
         return midIndex
       }
     }
     return -1
   }
   ```






```js
var arr = [6, 3, 8, 2, 9, 1]
// 冒泡排序
function bubbleSort(arr) {
  let length = arr.length
  let i = 0
  while(i++ < length) {
    let j = 0
    while(j++ < length) {
      if(arr[j - 1] > arr[j]) [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
    }
  }
  return arr
}
// 优化冒泡排序
function optimizeBubbleSort(arr) {
  let length = arr.length
	let i = 0
  while(i++ < length) {
    let j = 0
    while(j++ < length - i) {
      if(arr[j - 1] > arr[j]) [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
    }
  } 
  return arr
}
// 选择排序
function selectionSort(arr) {
  let length = arr.length
  let i = 0
  while(i < length) {
    let minIndex = i
    let j = i
    while(j < length) {
      if(arr[j] < arr[minIndex]) minIndex = j
      j++
    }
    if(minIndex !== i) {
     	[arr[minIndex], arr[i]] = [arr[i], arr[minIndex]]
    }
    i++
  }
  return arr
}
// 插入排序
function insertionSort(arr) {
	let length = arr.length
  let i = 0
  while(i++ < length - 1) {
    let j = i
    let currentVal = arr[j]
    while(j > 0 && arr[j - 1] > currentVal) {
    	arr[j] = arr[j - 1]
      j--
    }
    arr[j] = currentVal
  }
  return arr
}
// 归并排序
function mergeSort(arr) {
  function merge(leftArr, rightArr) { // 用于将拆分后的数组进行合并
    let newArr = []
    let lIndex = 0
    let rIndex = 0
    while(lIndex < leftArr.length && rIndex < rightArr.length) {
      if(leftArr[lIndex] < rightArr[rIndex]) newArr.push(leftArr[lIndex++])
      else newArr.push(rightArr[rIndex++])
    }
    while(lIndex < leftArr.length) newArr.push(leftArr[lIndex++])
    while(rIndex < rightArr.length) newArr.push(rightArr[rIndex++])
    return newArr
  }
  // 先拆分数组
 	let length = arr.length
  if(length === 1) {
    return arr
  }
  let midIndex = Math.floor(length/2)
  let leftArr = arr.slice(0, midIndex)
  let rightArr = arr.slice(midIndex, length)
  return merge(mergeSort(leftArr), mergeSort(rightArr))
}
// 快速排序
function quickSort(arr) {
  function quick(sortArr, left, right) {
    if(sortArr.length > 1) {
      let index = handleQuick(sortArr, left, right)
      if(index - 1 > left) {
        quick(sortArr, left, index - 1)
      }
      if (index < right) {
        quick(sortArr, index, right)
      }
      return arr
    }
  }
  function handleQuick(sortArr, left, right) {
    let midOption = sortArr[Math.floor((left + right)/2)]
    while(left <= right) {
    	while(arr[left] < midOption) left++
      while(arr[right] > midOption) right--
      if(left <= right) {
        [arr[left], arr[right]] = [arr[right], arr[left]]
        left++
        right--
      }
    }
    return left
  }
  let length = arr.length
  if(length === 1) {
    return arr
  }
  return quick(arr, 0, arr.length - 1)
}
```