
# 如何优雅地改善程序中for循环

众所周知，在我们的日常编码里，对于一些数据的迭代以及遍历，首先想到的是`for循环`

这没毛病，`for循环`编写语法很简单，只需要知道数据列表的长度即可进行遍历取值，举个例子：

![for循环](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/for--%E6%96%B0%E5%BE%AA%E7%8E%AF.png)

有点编程基础的童鞋，都可以很快想到上面的编写方法。那不知道大家是否会跟我一样对于写for循环时，功能是没毛病，但编写起来总会觉得很不优雅，例如还要定义对应的`i变量（拿上述举例）以及还要自主控制i变量的变化`，这样无疑会变得繁琐起来，也会让我们编写代码效率有所下降

好了，那我们有没有一些优雅的方法处理上述案例呢？答案是肯定的，这就回到这篇文章的主题：`如何优雅地改善for循环`

ForEach
---

相信学过ES6的童鞋，很快就会想到这种方法，下面我就拿上面的例子改造一下：

![forEach遍历](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/forEach--%E6%96%B0%E5%BE%AA%E7%8E%AF.png)

这种方式，看起来优雅了许多，省去了不必要的队列长度对比变量的定义和控制以及队列长度判断

到这里，`ForEach是不是就是最好的优雅方案？有没有存在问题？`，相信一部分童鞋未必能答出来，那我就不卖关子了。如果我们遇到一种情况，就是对列表遍历处理后，需要返回一个处理后的数组，那我们继续使用forEach是否能够达到我们的目的呢？我们也许会有以下做法：

![forEach全局污染](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/forEach--%E6%96%B0%E9%97%AE%E9%A2%98.png)

可以看到，第一种处理是希望处理完后直接赋值给一个变量，然而`forEach循环返回的是undefined`，第二种处理虽然最终的确能够达到我们目标，拿到处理完的数据，却导致了一个问题--`全局变量的污染`。当然也可以在外部定一个数组，然后push处理后的数据到新数组来实现我们的目标，但整体看起来依然不是很优雅。

那有木有一种方法能够返回一个新数组，并且又不会影响到原来的数据呢？答案是肯定的，这就要提到强大的[Functional Programing(简称FP)](http://www.ruanyifeng.com/blog/2012/04/functional_programming.html)

Functional Programing
---

FP是什么？又是用来干什么的？

> Functional programmings(FP) means coding in functions

这是比较简洁和官方的说法，那是什么意思？简单地说，就是，`用函数的方式处理问题`，今天就会用到它的其中一个核心思想：`纯函数（对于相同的输入，永远得到相同的输出，而且不会有任何的副作用）`

看到这里是不是有点头绪了😄，好啦，回到正题，那在js里面有那些方法是纯函数，而且又能优雅地替代for循环？相信童鞋们都会想到了`map()`

Map()
---

`Map`方法会对原始数组中的每个元素进行遍历一次，并调用callback，最终返回一个新的数组而不会影响到原始数组。

我们现在就拿上述forEach存在问题的栗子进行改造一下：

![Map循环](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/map--%E5%BE%AA%E7%8E%AF.png)

好明显，曾经的多行循环代码只需要一行就可以完成，看着也优雅了好多，而且返回一个新的处理后的素组以及不会对原有的数组产生污染

Filter()
---

`Filter`方法，简单滴说就是对数组进行筛选或过滤，然后返回一个新的数组，并不会对原始数组产生任何的影响

看到这里，我们又要回到for循环那个栗子，使用`Filter方法`是否可以让代码优雅起来？现在就来动手看看：

![filter循环](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/filter--%E5%BE%AA%E7%8E%AF.png)

明显，使用`Filter方法`只能达到了第一步目标就是优雅了`for循环`里的条件语句，那该怎么办？

我们会发现，`Filter方法`是会返回一个新数组，那我们就可以联系到了`Map方法`，两者结合会产生什么火花？

![filter与map结合](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/map%E4%B8%8Efilter--%E7%BB%93%E5%90%88.png)

至此，是否会觉得看起来舒服好多，而且也通俗易懂，而这也是最终优雅方案。那么问题来了，什么时候该用forEach，什么时候又该用map呢？

`forEach比较适用于不改变原始数组数据，仅仅拿数组数据进行做一些事情，而map则适用于改变数据值并且返回一个新数组`，当然不同情景又不同的做法，这仅仅只是作为一个参考

Extension
---

除了上述提到的常用情景外，我们还会遇到很多其他地方可以继续优雅for循环，这就不得不提`some方法和every方法以及reduce方法（reduce也属于FP）`

 1. **Every()和Some()**

    现在有一种情景，就是要根据后端返回的一个列表里费用低于0时就展示提示语。结合上述学过的方法，也许我们会有以下做法：
    
    ![for循环](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/for--%E8%BF%94%E5%9B%9Eboolean.png)
    
    除了上述比较的直接方法外，也许有些童鞋会想到直接使用forEach来进行优雅一下：
    
    ![forEach循环](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/forEach--%E8%BF%94%E5%9B%9Eboolean.png)
    
    因为forEach处理数据是在callback上，因此使用`break语法`明显会导致语法错误，因此，就算去掉`break`，也需要遍历完所有元素，而主角来了，some和every：
    
    - some：遍历数组元素，只要遇到条件为true则直接返回true，否则直到遍历最后并返回false
    
    - every：遍历数组元素，只要遇到条件为false则直接返回false，否则直到遍历最后并返回true
 
    ![some和every](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/some--every.png)
    
    明显看着代码量就简洁了好多，而且也不失优雅。

 2. **reduce()**
 
    可能有些童鞋对于`reduce方法`有点陌生，它究竟是用来干嘛的？应用场景又是什么？

    > reduce() 方法接收一个函数作为累加器（accumulator），数组中的每个值（从左到右）开始缩减，最终为一个值
    
    上面为官方的说法，简单地理解，就是对一个列表进行遍历，第一次取两个元素进行处理得到一个新值，然后到下一次循环时就拿该新值与第三个元素进行处理，以此类推，最终得到一个值并返回。文字太复杂，直接图解：
    
    ![reduce解析](https://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/reduce--%E8%A7%A3%E6%9E%90.jpg)
    
    是不是清晰很多了，那应用的优雅情景又有哪些？在这里我就不卖关子了，例如，后端返回一个对象，而我们需要对这个对象进行处理只需要得到指定属性值，多余的属性就过滤掉。日常做法：
    
    ![对象遍历](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/%E5%AF%B9%E8%B1%A1%E9%81%8D%E5%8E%86%E5%AF%BB%E6%89%BE%E5%88%B6%E5%AE%9A%E5%B1%9E%E6%80%A7%E5%80%BC.png)
    
    可以看到，双层循环让人看起来的确复杂很多，而且稍微不小心就会很容易出问题。然而使用`reduce方法`就可以优雅起来。
    
    ![reduce遍历](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/reduce--%E5%BE%AA%E7%8E%AF.png)
    
    看了这个，是不是觉得reduce用了后特别简洁和优雅。
    
    如果你觉得它还不够强大，再看看下面一个栗子，就可以觉得它的厉害`（这是额外话题了，大家有空可以研究一下）`。我们经常会遇到一种情况就是，后端返回一个嵌套很深的对象，然后前端拿到这个复杂的对象中某个属性时，难免会需要每一个值都要判断是否存在，然后直到指定的属性为止，这就是`链式取值`问题：
    
    ![链式取值最死板方法](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/%E6%AD%BB%E6%9D%BF%E9%93%BE%E5%BC%8F%E5%8F%96%E5%80%BC.png)
    
    其实`链式取值`问题在网上有很多处理方案，那如果是最优雅方案，我觉得就是使用reduce，那么使用reduce怎么编写呢？直接上图
    
    ![reduce链式取值](http://learning-every-day.oss-cn-shenzhen.aliyuncs.com/%E5%A6%82%E4%BD%95%E4%BC%98%E9%9B%85%E5%9C%B0%E6%94%B9%E5%96%84%E7%A8%8B%E5%BA%8F%E4%B8%ADfor%E5%BE%AA%E7%8E%AF/reduce%E9%93%BE%E5%BC%8F%E5%8F%96%E5%80%BC%E9%97%AE%E9%A2%98.png)
    
    至此，对于for循环的优雅性，不同场景可以有很多的优雅方案（lodash等等），但我想说的是，原生js本身提供的api其实有很多方法是可以让我们的程序变得便捷以及简洁的，只有你多点用用它，就会体会到它的强大。`哈哈，如果上文如果有不妥之处，欢迎各位大佬指点一下`
    

Last
---

最后，看完上文，相信大家对for循环有一定的认识了`（我猜的）`，那就用一道常见的面试题作为结尾来让大家回去思考一下用什么方法最好吧：
    
`实现一个方法，计算出一个字符串中每个字符出现的次数？`

方法我就不写了，让大家来一场头脑风暴吧🙈