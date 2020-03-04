# About React Render And Update(个人见解)

`React`主打函数式思想，设计理念就是`all in js`，另外推崇的是数据不可变性，所有的数据更新都需手动去操作，便于提高应用的可控性。

本文就是以`React`为主体，简单滴谈一谈个人对于`React`在渲染层面以及更新层面的一些见解，当中难免会出现一些错误的观点，还请各位童鞋大大们多多指点一下哈 🙈。

## 目录
1. [Render（渲染）](#1)

   1.1 [第一次渲染情况](#11)

   1.2 [后续渲染情况](#12)

2. [Update（更新之调度任务）](#2)

## Render（渲染）

在分析`Render`前，我先引一段代码。

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.component {
  // ...
  // 省略
}

ReactDOM.render(<App />, document.querySelector('#root'))
```

相信大家对于上述这坨代码尤为熟悉，不管编写的`App`组件有多复杂，终究都会通过`React.render`方法来挂载到相应的`DOM`元素下。

那么问题来了，在`ReactDOM.render`方法中究竟发生了什么事情？

在这里，我会说明一下，`Render`过程中会分为两种情况，分别是：

- **第一次渲染情况，从`root`开始，先创建一个`Virtual DOM`，再直接渲染出一个真实`DOM`**。
- **后续渲染情况，先创建一个新`Virtual DOM`，与旧`Virtual DOM`进行`diff`，再批量滴渲染到真实`DOM`中**。

> <span id="11">第一次渲染情况</span>

先来看看第一次渲染情况中到底发生了什么事情？下面我就不对源码贴出，直接说出来（当中对于部分不理解童鞋难免会有些难以理解，后面有时间我会单独讲讲`React`源码哈～）

1. 首先在调用`ReactDOM.render`时，其内部会执行一个`legacyRenderSubtreeIntoContainer`方法，该方法会判断是否已存在`root`。

2. 当判断不存在`root`时，就会使用`legacyCreateRootFromDOMContainer`方法创建一个`root`对象，并挂载在`container._reactRootContainer`（即`document.querySelector('#root')._reactRootContainer`）中。

3. 在方法`legacyCreateRootFromDOMContainer`中，会先将容器内部的所有节点进行移除。

   ```html
   <div id="root"></div>
   ```

   在很多情况下，我们我像上面这样去编写根模板。接着就会**使用`ReactRoot`构造函数创建`root`对象**。（即**`root`对象 --> `new ReactRoot()`**）。

4. 在构造函数`ReactRoot`中，会使用`createContainer`方法创建一个`FiberRoot`对象，并挂载在`root`对象的`_internalRoot`属性中，其中`createContainer`方法使用的是`createFiberRoot`方法创建。

   需要说明的是，**`fiber`是一个树结构，和`DOM`树中节点一一对应，即每一个`DOM`节点都会对应一个`fiber`对象，而`FiberRoot`对象对应根节点`Root`**。

5. 在`createFiberRoot`方法中，使用`FiberRootNode`构造函数创建`FiberRoot`对象，然后使用`createHostRootFiber`方法创建一个`RootFiber`对象，并挂载到`FiberRoot`对象的`current`属性中（**即`FiberRoot.current === RootFiber`**）。

6. 对于`FiberRoot`对象，只需理解其两个属性，分别是`containerInfo`和`current`属性。其中前者代表是`document.querySelector('#root')`，后者代表的是`RootFiber`。

7. 对于`RootFiber`对象，我们先来看看要理解的属性。

   ```javascript
   {
     // ...
     stateNode: any,
     return: Fiber | null,
     child: Fiber | null,
     sibling: Fiber | null,
     effectTag: SideEffectTag,
     alternate: Fiber | null
     // ...
   }
   ```

   - stateNode：指向`FiberRoot`对象。
   - return：指向当前节点的父节点。
   - child：指向当前节点的子节点。
   - sibling：指向当前节点的兄弟节点。
   - effectTag：指代记录`DOM`操作，如增删改。
   - alternate：指向其旧树对应的节点。需要清楚的是，**存在新旧两个`fiber`树，旧树称为`old tree`，新树称为`workInProgress tree`，其中前者代表渲染好的`DOM`树，后者则代表正在执行更新的`fiber`树，当更新结束后，`workInProgress tree`将会替换`old tree`**。

下面我们就以一张图简单看看下面这段代码在第一次渲染时，所存在的关系。

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

function App() {
  return (
  	<div>
    	<p></p>
    	<span></span>
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#root'))
```

![React第一次渲染关系图](https://raw.githubusercontent.com/Andraw-lin/keep-Learning/master/asset/React第一次渲染关系图.jpg)

> <span id="12">后续渲染情况</span>

接下来就要说的就是后续渲染情况，上面已经说过，当发现已经存在旧的`Virtual DOM`后（即已存在`root`对象），则会创建一个新的`Virtual DOM`，并且通过`diff`算法，批量更新到真实`DOM`中。

那么在后续的渲染过程中，又是如何处理的？我们接着看 🤔

1. 由于已存在`root`对象（即`new ReactRoot()`），会直接调用`root.render(children, callback)`方法（即`ReactRoot.prototype.render`）。在该方法中，首先先取得`root._internalRoot`即`FiberRoot`对象，然后直接构建`new ReactWork()`（该构建对象作用是便于组件渲染或更新后把`render`中的`callback`全部调用一遍）。

2. 接着调用`updateContainer`方法，该方法中会通过`FiberRoot`对象中的`current`属性获取到`fiber tree`（即旧树）。然后通过`requestCurrentTime`方法计算`currentTime`任务的当前时间，通过`computeExpirationForFiber`方法计算任务过期时间。

3. 在方法`requestCurrentTime`中，通过`performance.now() - orginalStartTimeMs`得到`currentTime`当前时间，其中`performance.now()`是当前时间，`orginalStartTimeMs`则是整个`React`应用初始化时间（初始化时就创建，固定不变的常量），得到的**`currentTime`则是当前任务距离应用初始化时间的时间间隔**。

   最后得到`currentTime` 时间间隔进行**取整处理，即(currentTime | 0)**。

4. 接着计算`expirationTime`过期时间，该时间**和优先级相关，值越大，优先级就越高**。在方法`computeExpiration`中，其实就是**将当前时间`performance.now()`加上一个优先级常量得到`expiration`过期时间**。

   在`React`中共分为五种优先级，分别是

   |                  类型                  | 优先级 |           优先级常量            |
   | :------------------------------------: | :----: | :-----------------------------: |
   |  ImmediatePriority（立即执行优先级）   |   1    |               -1                |
   | UserBlockingPriority（用户交互优先级） |   2    |               250               |
   |      NormalPriority（正常优先级）      |   3    |              5000               |
   |        LowPriority（低优先级）         |   4    |              10000              |
   |       IdlePriority（空闲优先级）       |   5    | maxSigned31BitInt(约1073741823) |

5. 最后会创建一个`update`对象，该对象主要跟`setState`相关联，主要理解属性包括

   ```javascript
   // update对象
   {
     // ...
     expirationTime: expirtationTime, // 这次更新的过期时间
     payload: null, // setState的第一个参数
     callback: null, // setState的第二个参数
     next: null, // 用于寻找队列中的下一个节点
     nextEffect: null, // 用于执行队列中下一个节点的DOM相关操作
     // ...
   }
   ```

   **对于任何一个触发`render`的操作，都会创建一个`update`对象，使用队列方式进行存储，其中`next`属性就是用于查找下一个`update`节点**。

   对于批量更新的过程中，由于创建多个`update`对象，在等到浏览器客户端空闲时，就会按优先级大小进行批量更新，但是也需要重点结合`expirationTime`过期时间，这个过程也是所谓的调度任务。（这也是能解释为什么多次调用`setState`，最后都只是更新一次～🤔）



## Update（更新之调度任务）

先抛一个问题，当我们`setState`时，在后续取到的值依然是旧的值？相信大家都清楚，在`React`中会通过调度任务进行分配，那么`setState`由于后续需要批量更新，优先级不高，所以都会延后处理，这就导致为什么`setState`后取到的值依然是旧的值。

那么问题来了，调度的作用是什么？

我们知道，当点击一个按钮时，若`setState`更新状态，就会触发组件进行渲染，由于`js`是单线程的，若此时还要等待组件渲染结束后再去做一些关键`js`逻辑处理，只会让用户感觉到卡顿的感觉，为此，调度的作用就是来处理这些事情的。

调度的作用就是，**`react`会根据任务的优先级计算出各自的`expirationTime`过期时间，然后根据过期时间逐个放入到一个队列中进行管理，当浏览器空闲时，就会先处理优先级高的任务，并且优先级高的任务可以中断优先级低的任务**。

那么剩下一个问题，它是如何实现的呢？

答案就是**根据任务优先级计算过期时间**和**通过`requestIdleCallback`方法**。

对于计算过期时间，在上面已经提及，现在就不再论述。

现在就来看看`requestIdleCallback`方法，到底该方法做了哪些事情。

该方法其实就是在浏览器空闲时期依次调用事件队列中的任务，内部实现采用的是宏任务`requestAnimationFrame`事件以及`setTimeout`定时器来实现的。

```javascript
rAFID = requestAnimationFrame(function(timestamp) {
	localClearTimeout(rAFTimeoutID);
	callback(timestamp);
});
rAFTimeoutID = setTimeout(function() {
	localCancelAnimationFrame(rAFID);
	callback(getCurrentTime());
}, 100)
```

可以看到的是，当不支持`requestAnimationFrame`时，就会使用`setTimeout`进行补救～

现在我们就来总结一下，调度任务的过程：

1. 当有更新任务发生时，调度器会先根据策略分配其一个优先级，比如动画的优先级会高于更新状态优先级。
2. 接着根据分配好的优先级计算出过期时间（即当前时间 + 优先级），优先级越高那么时间就越近。
3. 计算好过期时间后就会存储到一个任务队列中。
4. 等待到浏览器空闲时，即主线程的代码都执行完后，接着调用`requestIdleCallback`方法来执行任务队列中方法，先判断任务过期时间是否过期，若过期则会立即优先执行该任务，若无则会按照优先级大小执行。



需要特别说明的是，在`React 15`版本之前，当组件更新时，就需要递归向下遍历整个虚拟`DOM`判断需要更新的地方，这种处理存在的弊端在于无法中断，必须更新完所有组件才会停止。因此在更新耗时长的过程中将会阻塞主线程，从而导致用户的交互、动画等不能及时响应。

在`React 16`版本后，采用新的`Fiber`架构（即虚拟`DOM`升级版），将整个更新任务拆分成一个个小的任务，并且控制这些任务的执行。简单来说，**`Fiber`架构实现的就是，任务都是按照优先级高低执行，优先级高的任务可以中断优先级低任务**。其**核心包括`fiber`数据结构和调度器**。

在`diff`流程上，和`Vue`实现是差不多的，有兴趣的童鞋，可以看看我这篇文章[ 【Vue 源码分析 】如何在更新 Patch 中进行 Diff](https://github.com/Andraw-lin/about-Vue/blob/master/docs/%E3%80%90%20Vue%20%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90%20%E3%80%91%E5%A6%82%E4%BD%95%E5%9C%A8%E6%9B%B4%E6%96%B0%20Patch%20%E4%B8%AD%E8%BF%9B%E8%A1%8C%20Diff.md)。































