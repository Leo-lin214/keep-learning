



---

> React Concept

**一、Create A React Component**

目前以创建一个简单的点击计数器组件为例：

```javascript
// ClickCounter.js
import React, { Component } from 'react'

class ClickCounter extends Component {
  constructor(props) {
    super(props)
    // 绑定事件
    this.onClickButton = this.onClickButton.bind(this)
    // 设置状态属性
    this.state = {
      count: 0
    }
  }
  onClickButton() {
    this.setState({ count: this.state.count + 1 })
  }
  render() {
    return (
    	<div>
        <button onClick={ this.onClickButton }>Click Me</button>
        Click Count: { this.state.count }
      </div>
    )
  }
}
export default ClickCounter
```

**React 中的组件命名和文件命名都是统一使用驼峰原则**。对于事件的定义，都需要统一进行绑定 this 的指向，才能在其函数体内使用该组件中定义的函数以及属性。对于组件的局部属性，都是统一挂载在 state 中，才能响应状态。

**二、HTML onclick VS JSX onclick**

使用 HTML onclick 添加在元素中，主要有以下缺陷：

- onclick 添加的事件处理函数是在全局环境下执行的，会污染了全局环境；
- 对于使用 onclick 的 DOM 元素，如果动态滴从 DOM 树中删掉的话，还需要相对应滴将其时间处理器注销（所谓时间处理器，就是在事件处理函数中添加有例如 setTimeout 、setInterval 等时间处理器），否则就会导致内存泄漏；

而 JSX 中 onClick 事件处理函数中，上述出现的问题都不会出现，其挂载的事件处理函数，都控制在组件范围内，并不会污染到全局空间。同时，React 控制了组件的生命周期，在 unmount 时会自动消除相关的所有的事件处理函数，进而避免内存泄漏。



---

> Design React Component

组件的划分要满足高内聚和低耦合的原则。

- 高内聚：指的是把逻辑紧密相关的内容放在一个组件中；
- 低耦合：指的是不同的组件之间的依赖关系要尽量弱化，也就是每个组件要尽量独立；

**一、React 组件的数据**

1. React 组件的数据分为两种：prop 和 state 。prop 或者 state 的改变，都可能引发组件的重新渲染。而**prop 是组件的对外接口，state 是组件的内部状态（即对外用prop，内部用state）**。

2. 一个 React 组件通过定义自己能够接受的 prop 就定义了自己的对外公共接口。举个栗子🌰：

   ```javascript
   <Button id='button' 
   	borderWidth={ 2 } 
   	onClick={ onButtonClick } 
   	style={{ style: 'red' }}
   />
   ```

   HTML 组件属性的值都是字符串类型，当 prop 的类型不是字符串类型时，在 JSX 中必须用花括号 {} 把 prop 的值包住，因此上面 style 属性，外层花括号代表是 JSX 语法，内层则代表是一个对象常量。

   当 prop 的类型为函数类型时，相当于父组件给子组件一个回调函数，就类似于 Vue 中，`props down, events up.`

3. React 要求 render 函数只能返回一个元素。

4. 使用 propTypes 可声明自己的接口规范（即规定好每个 prop 应该是怎么养的格式）。举个栗子🌰：

   ```javascript
   Counter.propTypes = {
     caption: PropTypes.string.isRequired,
     number: PropTypes.number
   }
   ```

   propTypes 检查只是一个辅助开发的功能，并不会改变组件的行为。定义类的 propTypes 属性，无疑是要占用一些代码空间，而且  propTypes 检查也是要消耗 CPU 计算资源的，因此，**propTypes 只能是建议用在开发环境，不建议用在生产环境**。现有的`babel-react-optimize`可用于针对生产环境时，自动去掉 propTypes。

5. 组件的 state 必须是一个 Javascript 对象，不能是 string 或 number 类型。当想给组件提供给外部的 Prop 一个默认值时，可以按如下做法：

   ```javascript
   Counter.defaultProps = {
     initValue: 0
   }
   
   // 这时就可在组件的 state 中直接使用 prop 的默认值
   this.state = {
     count: props.initValue
   }
   ```

   **更改组件中 state 值时，必须使用 this.setState 方法，不能直接去修改 this.state**。

   不能直接修改 this.state 值的原因：直接修改 state 对象中的值，不会触发组件进行重新渲染（即 UI 上的值是不会直接响应变化的），而 this.setState 方法则是既改变 this.state 的值，同时也会触发组件重新渲染。

6. prop 和 state 的区别

   - prop 用于定义外部接口，state 则用于记录内部状态；
   - prop 的赋值在外部世界使用组件时，state 的赋值则在组件的内部；
   - 组件不应该改变 prop 的值，而 state 存在的目的就是让组件来改变的；



**二、React 组件生命周期**

React 的生命周期主要经历如下三个过程：

- 装载过程（Mount）：把组件第一次在 DOM 树中渲染的过程；
- 更新过程（Update）：当组件被重新渲染的过程；
- 卸载过程（Unmount）：组件从 DOM 中删除的过程；

每个生命周期过程，都会包含多个生命周期函数，以下就介绍一下：

1. 装载过程

   在组件装载的过程中，第一次被渲染时，会依次按顺序调用以下生命周期函数：

   ```javascript
   constructor --> getInitialState --> getDefaultProps --> componentWillMount --> render --> componentDidMount
   ```

   - constructor

     一个 React 组件需要构造函数，主要是以下目的：

     - 初始化 state ；

     - 绑定成员函数的 this 环境（在 ES6 语法下，类的每个成员函数在执行时的 this 并不是和类实例自动绑定的），举个栗子🌰：

       ```javascript
       this.onClickFun = this.onClickFun.bind(this)
       
       // 还有一种方法就是，下面两个冒号::操作符也叫bind操作符
       this.foo = ::this.foo
       ```

     需注意的是，只有在 ES6 中才会优先调用该生命周期函数，而在 ES5 中则会调用下面 getInitialState 和 getDefaultProps 生命周期函数来进行初始化。

   - getInitialState 和 getDefaultProps

     getInitialState 和 getDefaultProps两个方法只在 ES5 中用`React.createClass`方法创造的组件类才会发生作用。而在 ES6 语法中，则会使用 constructor，这两个函数在其中不会产生作用。

     - getInitialState：该函数的返回值会用来初始化组件的 this.state；
     - getDefaultProps：该函数返回值会作为 props 的初始值；

     举个栗子🌰：

     ```javascript
     // 只能使用 ES5 语法才可以使用上述两个方法
     const Sample = React.createClass({
       getInitialState: function() {
         return { foo: 'bar' }
       },
       getDefaultProps: function() {
         return { sampleProp: 0 }
       }
     })
     ```

     相比于 ES6 的语法，ES6 则是使用构造函数 constructor 来给 this.state 赋值来完成状态的初始化，并且给类属性 defaultProps 赋值来指定 props 初始值。对比如下：

     ```javascript
     // 使用 ES6 语法来实现上述的生命周期函数
     class Sample extends React.Component {
       constructor(props) {
         super(props)
         this.state = { foo: 'bar' }
       }
     }
     Sample.defaultProps = {
       return {
       	sampleProp: 0	
     	}
     }
     ```

     另外，需注意是，getInitialState 只出现在装载过程中，也就是说在一个组件的整个生命周期过程中，该函数只会被调用一次。

   - render

     **render函数不做实际的渲染动作，它只是返回一个 JSX 描述的结构，最终由 React 来操作渲染过程**。

     render函数返回一个 null 或者 false 时，相当于告诉 React 该组件这次不需要渲染任何 DOM 元素（可用于提高性能）。

     render函数是一个纯函数，完全根据 this.state 和 this.props 来决定返回的结果。需要注意的是，**在 render 函数中去调用 this.setState 毫无疑问是错误的，因为一个纯函数不应该引起状态的更改**。

   - componentWillMount 和 componentDidMount

     **componentWillMount 会在 render 函数之前调用，而 componentDidMount 则会在 render 函数之后被调用**。

     一般情况下，是不会在 componentWillMount 生命周期函数中做任何操作的，因为该生命周期函数发生在**将要挂载**时。因此建议在 componentWillMount 生命周期中做的事情，都可以提前到 constructor 生命周期函数中来做。

     至于 componentDidMount 生命周期函数，只有当整个文档中的元素或组件 render 完后，才会按顺序来执行，举个栗子🌰：

     ```javascript
     // Button 组件
     import React, { Component } from 'react'
     class Button extends Component {
       constructor(props) {
         super(props)
         conosle.log('constructor: ' + this.props.num)
       }
       componentWillMount() {
         console.log('componentWillMount: ' + this.props.num);
       }
       componentDidMount() {
         console.log('componentDidMount: ' + this.props.num)
       }
       render() {
         console.log('render: ' + this.props.num)
         return (
         	<button>Click Me!!!</button>
         )
       }
     }
     
     // index
     import React from 'react'
     import ReactDOM from 'react-dom'
     import Button from './Button'
     class ButtonPanel from React.Component {
       render() {
         return (
         	<div>
           	<Button num={1} />
       			<Button num={2} />
             <Button num={3} />
           </div>
         )
       }
     }
     ReactDOM.render()
     
     // 当执行以上代码后，会发现输出效果
     constructor: 1
     componentWillMount: 1
     render: 1
     constructor: 2
     componentWillMount: 2
     render: 2
     constructor: 3
     componentWillMount: 3
     render: 3
     componentDidMount: 1
     componentDidMount: 2
     componentDidMount: 3
     ```

     另外，需要注意的是，**componentWillMount 可在服务器端被调用，也可以在浏览器端被调用**。而 **componentDidMount 则只能在浏览器端被调用**（原因是："装载过程"即创建 DOM Tree 过程，而在服务端不会产生 DOM Tree，而只是产生最终字符串模版而已）。

2. 更新过程

   在 React 组件的更新过程中，会依次执行以下的更新过程生命周期函数：

   ```javascript
   componentWillReceiveProps --> shouldComponentUpdate --> componentWillUpdate --> render --> componentDidUpdate
   ```

   需注意的是，并不是 React 组件在更新的过程中就会调用上述的所有更新过程生命周期函数，具体看下面：

   - componentWillReceiveProps（nextProps）

     **只要父组件的 render 函数被调用**，在 render 函数里面被渲染的子组件就会经历更新过程，同时不管**父组件传给子组件的 props 有没有改变，都会触发子组件的 componentWillReceiveProps 生命周期函数**。

     **使用`this.forceUpdate`方法可强行引发一次重新绘制**。

     在 JSX 中用直接把匿名函数赋值给 onClick 的方法，并不是一种提倡方法，因为每次渲染（即调用 render 时）都只会创造一个新的匿名方法对象。

     componentWillReceiveProps 方法接受一个参数 nextProps ，而 nextProps 代表的是这次渲染传入的 props 值，this.props 代表的上一次渲染时的 props 值。该生命周期函数是有必要把传入参数 nextProps 和 this.props 作对比，然后根据需要来调用 this.setState 方法来更改本组件的对应状态。举个栗子🌰：

     ```javascript
     componentWillReceiveProps(nextProps) {
       console.log(nextProps)
     } 
     ```

     另外需注意的是，**组件中`this.setState`的调用，不会触发 componentWillReceiveProps 生命周期函数**。

   - shouldComponentUpdate（nextProps, nextState）

     除了 render 函数外，shouldComponentUpdate 可以说是 React 组件生命周期中最重要的一个函数。

     **在更新过程中，React 库会先调用 shouldComponentUpdate 函数，如果这个函数返回 true，那就回继续更新过程（即接下来就会调用 render 函数）；反之，如果返回一个 false，那就立刻停止更新过程，也就不会引发后续的渲染了**。（说 shouldComponentUpdate 重要，是因为对于一些没必要渲染的组件，可不用渲染进而让速度更快）

     需注意的是，React 中默认定义的 shouldComponentUpdate 函数都是返回 true 的，因此当 nextProps 与 this.props 或者 nextState 与 this.state 不同时，才去进行重新渲染，否则不重新渲染。举个栗子🌰：

     ```javascript
     shouldComponentUpdate(nextProps, nextState) {
       return (nextProps.name !== this.props.name) || (nextState.age !== this.state.age)
     }
     
     // 需注意的是：nextProps针对的是父组件更改props的场景，nextState针对的是组件更改其内部状态的场景
     ```

   - componentWillUpdate 和 componentDidUpdate

     componentWillUpdate 和 componentDidUpdate 这对函数都是一前一后地把 render 函数夹在中间。（该对函数与 componentWillMount 和 componentDidMount是类似的）。需要注意的是，**componentDidUpdate 函数与 componentDidMount 有一个区别就是，并不是只在浏览器端才执行的，无论更新过程发生在服务器端还是浏览器端，该函数都会被调用**。

     实际上，使用 React 做服务器端渲染时，基本不会经历更新过程，因为服务器端只需要产生出 HTML 字符串。所以正常情况下服务端不会调用 componentDidUpdate 函数，如果调用了，说明我们的程序有错误需改进。

3. 卸载过程

   React 组件的卸载过程只涉及一个生命周期函数 ComponentWillUnmount 。

   **在 componentDidMount 中用非 React 的方法创造一些 DOM 元素，如果撒手不管可能会造成内存泄漏，那就需要在 componentWillUnmount 中把这些创造的 DOM 元素清理掉**。



---

> Flux And Redux

Flux 和 Redux 都是由Facebook在同一时间推出的，可以说，Flux 是作为一个第三方数据管理库，而 redux 则是在 Flux 的基础上改造的数据管理扩展。

一、About Flux

Flux 主要包含由四个部分：

- **Dispatcher**：处理动作的分发，维持 Store 之间的依赖关系；
- **Store**：负责存储数据和处理数据相关逻辑；
- **Action**：驱动 Dispatcher 的 Javascript 对象；
- **View**：视图部分，负责显示用户界面；

示例图如下：

![Flux 示例图](https://raw.githubusercontent.com/Andraw-lin/FE-Knowledge-Summary/master/Know-More-About-React/react-flux-structor.png)

当需要扩充应用所能处理的请求时，MVC方法就需要增加新的 Controller，而对于 Flux 则只是增加新的 Action。直接上栗子🌰：

```javascript
// AppDispatcher.js（全局定义，用于暴露出去进行分发 action）
import { Dispatcher } from 'flux'
export default new Dispatcher()

// ActionTypes.js（全局定义，用于定义所有的 action 类型）
export const INCREMENT = 'increment'
export const DECREMENT = 'decrement'

// Actions.js（全局定义，利用全局定义 Dispatcher 来分发对应的 action）
import * as ActionTypes from './ActionTypes'
import AppDispatcher from './AppDispatcher'
export const increment = counterCaption => {
  AppDispatcher.dispatch({
    type: ActionTypes.INCREMENT,
    counterCaption: counterCaption
  })
}
export const decrement = counterCaption => {
  AppDispatcher.dispatch({
    type: ActionTypes.DECREMENT,
    counterCaption: counterCaption
  })
}

// store/CounterStore.js（用于定义每个数据源 store，同时注册后根据传来的 action 来触发更新 store 中的值）
const counterValues = {
  'First': 0,
  'Second': 10,
  'Third': 20
}
export const Counter = Object.assign({}, EventEmitter.prototype, {
  getCounterValues() {
    return counterValues
  },
  emitChange() {
    this.emit('singleCounter')
  },
  addChangelistener(callback) {
    this.on('singleCounter', callback)
  },
  removeChangeListener(callback) {
    this.removeListener('singleCounter', callback)
  }
})
Counter.dispatchToken = AppDispatcher.register(action => {
  if (action.type === ActionTypes.INCREMENT) {
    counterValue[action.counterCaption]++
    CounterStore.emitChange()
  } else if (action.type === ActionTypes.DECREMENT) {
    counterValue[action.counterCaption]--
    CounterStore.emitChange()
  }
})

// views/Counter.js
constructor(props) {
  super(props)
  this.onChange = this.onChange.bind(this)
  this.onClickButton = this.onClickButton.bind(this)
  this.state = {
    count: CounterStore.getCounterValues()[props.caption]
  }
}
componentDidMount() {
  CounterStore.addChangeListener(this.onChange)	// 为了添加监听事件，用于实时更新View上的数据
}
componentWillUnmount() {
  CounterStore.removeChangeListener(this.onChange)	// 同样地，在组件销毁时需要更新对应View上的数据
}
onChange() {
  this.setState({ 
  	count: CounterStore.getCounterValues()[props.caption]
  })
}
onClickButton() {
  Actions.increment(this.props.caption)	// 当主动触发行为时，需要进行分发行为
}
```

除了上述的情况，还会存在一种情景，就是在 views 中组件挂载时所添加的 Store 事件监听，Flux 默认并不是根据我们所调用的顺序去执行各个回调函数的，当然我们也无法把握各个 Store 哪个先加载从而调用 register 函数。

说白点，就是当我们想在父组件中将每个 Counter 组件中的数值取和时，需要额外增多一个 Store 用于将 CounterStore 中的值进行相加，如下：

```javascript
// store/SummaryCounter.js
function computedCounter(obj) {
  let summary = 0
  for (let key in obj) {
    if (obj.hasOwnProperty[key]) summary += obj[key]
  }
  return summary
}
export const SummaryCounter = Object.assign({}, EventEmitter.prototype, {
	getSummaryValues() {
  	return computedCounter(CounterStore.getCounterValues())
  },
  emitChange() {
    this.emit('summaryCounter')
  },
  addChangeListener(callback) {
    this.on('summaryCounter', callback)
  },
  removeChangeListener(callback) {
    this.removeListener('summaryCounter', callback)
  }
})
```

由于在 Counter 组件中点击 + 按钮后，按我们的理解肯定是，先执行 CounterStore 中的数据源，然后更新完后再去直接执行 SummaryStore 中的数据源。但是上面说过，**Flux 是无法确保每个数据源的真正执行顺序的**，这就需要用到 Flux 中 waitFor 函数来进行等待处理。如下：

```javascript
// 接着上述的栗子
SummaryCounter.dispatchToken = AppDispatcher.register(action => {
  AppDispatcher.waitFor([CounterStore.dispatchToken])
  SummaryStore.emitChange()
})
```

waitFor 函数会告诉当前的 SummaryStore ，当前的处理必须要暂停，直到 dispatchToken 代表的那些以注册回调函数执行结束才能继续。

接下来，就对比一个 Flux 框架的优缺点：

1. Flux 优势
   - 在 Flux 架构下，应用的状态都被放在了 Store 中，组件只是扮演 View 的作用，被动根据 Store 的状态来渲染；
   - **Flux 中最重要的就是“单向数据流”的管理方式**。在 Flux 理念里，若想改变界面，得先改变 Store 中的状态，如果想改变 Store 中的状态，就得必须派发一个 action 对象（相比于 MVC，MVC 最大的问题就是无法禁绝 View 和 Model 之间的直接对话，MVC 中的 View 就是 Flux 中的 View，而其 Model 就是 Flux 中的 Store）。在 Flux 中，Store 只有 get 方法，没有 set 方法，根本无法直接去修改其内部状态，而 View 想要更改 Store 状态的话，只有派发一个 action 对象给 Dispatcher；
2. Flux 缺陷
   - **Store 之间的依赖关系**：在 Flux 中，两个 Store 之间有逻辑依赖关系，就必须用上 Dispatcher 的 waitFor 函数，而这就让多个 Store 之间产生了依赖关系；
   - **难以进行服务端渲染**：在服务端渲染时，输出的不是一个 DOM Tree，而是一个字符串（即 HTML 字符串）。由于只有一个全局的 Dispatcher，然后每一个 Store 都是一个全局唯一的对象，对于浏览器端来说是没什么问题的，但对于服务器来说简直就是个灾难（因为当服务器同时接受很多用户的请求时，若每个 Store 都是全局唯一的对象，则不同的请求就会很容易出现乱套）。当然官方也说明了，Flux 并不是打算用来服务端使用的。
   - **Store 混杂了逻辑和状态**；



二、About Redux

众所周知，Flux 基本原则是**单向数据流**，Redux 在此基础上强调了三个基本原则：

- **唯一数据源**（Single Source Of Truth）；

  应用的状态数据只能存储在唯一的一个 Store 上，Flux 中往往根据功能把应用的状态数据划分给若干个 Store 分别存储管理（造成数据冗余，同时 WaitFor 方法虽染科保证多个 Store 之间更新顺序，但却产生了不同的 Store 之间的依赖），而 Redux 只保持一个 Store，所有组件的数据源就是该 Store 上的状态。

- **保持状态只读**（State is read-only）；

  要修改 Store 的状态，必须得通过派发一个 action 对象完成。

- **数据改变只能通过纯函数完成**（Change are made with pure functions）；

  通过一个 Reducer 纯函数完成数据改变：

  ```javascript
  reducer(state, action)
  ```

  第一个参数 state 是当前的状态，第二个参数 action 是接收到的 action 对象，最后根据 state 和 action 的值产生一个新的对象返回。需要注意的是，**不能直接修改参数 state 和 action 对象**。**Redux 的 reducer 只负责计算状态，并不负责存储状态**。

接下里直接上栗子🌰：

```javascript
// ActionType.js
export const INCREMENT = 'increment'
export const DECREMENT = 'decrement'

// Actions.js
import * as ActionTypes from './ActionType'
export const increment = counterCaption => {
  type: ActionTypes.INCREMENT,
	counterCaption: counterCaption
}
export const decrement = counterCaption => {
  type: ActionTypes.DECREMENT,
  counterCaption: counterCaption
}

// Reducer.js
import * as ActionTypes from './ActionType'
export default (state, action) => {
 	const { counterCaption } = action
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return {...state, [counterCaption]: state[counterCaption] + 1}
    case ActionTypes.DECREMENT:
      return {...state, [counterCaption]: state[counterCaption] - 1}
    default:
      return state
  }
}

// Store.js
import {createStore} from 'redux'
import Reducer from './Reducer'
const initValues = { // 创建原始数据源
	'First': 0,
  'Second': 10,
  'Third': 20
}
export default createStore(Reducer, initValues) // 将 Reducer 与原始数据源建立关系

// views/ClickButton.js
import Store '../Store'
import Actions from '../Actions'
constructor(props) {
  this.onClickButton = this.onClickButton.bind(this)
  this.onChange = this.onChange.bind(this)
  this.state = {
    counterNum: Store.getState()[props.counterCaption]
  }
}
componentDidMount() {
  Store.subscribe(this.onChange)
}
componentWillUnMount() {
  Store.unsubscribe(this.onChange)
}
onClickButton() {
	Store.dispatch(Actions.increment)
}
onChange() {
 	this.setState({
    counterNum: Store.getState()[props.counterCaption]
  })
}

// views/SummaryCounter.js（接下来的计算总值组件就不需要再定一个新的 Store 了）
import Store from '../Store'
consturctor(props) {
  super(props)
  this.getSummaryCounter = this.getSummaryCounter.bind(this)
  this.onChange = this.onChange.bind(this)
  this.state = {
    summaryCounter: this.getSummaryCounter(Store.getState())
  }
}
componentDidMount() {
  Store.subscribe(this.onChange)
}
componentWillUnmount() {
  Store.unsubscribe(this.onChange)
}
getSummaryCounter(state) {
  let summary = 0
  for (let key in state) {
  	summary += state[key]
  }
  return summary
}
onChange() {
  this.setState({
    summaryCounter: this.getSummaryCounter(Store.getState())
  })
}
```



三、容器组件和傻瓜组件

所谓的容器组件和傻瓜组件，就是：

- 容器组件：承担第一个任务的组件，也就是负责和 Redux Store 打交道以及数据初始化、方法定义等功能的组件，处于外层（也叫聪明组件）；
- 傻瓜组件：承担第二个任务的组件，也就是负责渲染界面的组件，处于内层（一般来说，只负责 UI）；

示例图如下：

![容器组件和傻瓜组件](https://raw.githubusercontent.com/Andraw-lin/FE-Knowledge-Summary/master/Know-More-About-React/container-component-and-follish-component.png)



举个栗子🌰：

```javascript
// views/Counter.js
class Counter extends Component {
  render() {
    const { caption, onIncrement, value } = this.props
    return {
      <div>
      	<button onClick={onIncrement}>+</button>
    		<span>{caption} count: {value}</span>
      </div>
    }
  }
}
class CounterContainer extends Component {
  render() {
    return (
    	<Counter caption={this.props.caption}
  			onIncrement={this.onIncrement}
				onDecrement={this.onDecrement}
				value={this.state.value}
  		>
    )
  }
}
export default CounterContainer
```

可以看到，Counter 组件完全没有 state，只有一个 render 方法，所有的数据都来自于 props，也叫**无状态组件**。而 CounterContainer 组件承担了所有的和 Store 关联的工作，它的 render 函数所做的就是渲染傻瓜组件 Counter 而已，只负责传递必要的 props 即可。

当然，无状态组件还可以进一步缩减代码，用一个函数代表如下：

```javascript
function Counter(props) {
  const {caption, onIncrement, onDecrement, value} = props
  return (
  	<div>
    	<button onClick={onIncrement}>+</button>
			<span>{caption} count: {value}</span>
    </div>
  )
}
```



四、About React-Redux

由上述的 Redux 栗子可以看到，当组件需要用到 Store 时，就需要引入 Store，并且需要在组件挂载后开始订阅对应的事件数据的变化，无疑中就产生了代码的冗余。为了避免这些尴尬的情况，才有了`react-redux`包装库产生。

简单滴说，react-redux 就是 redux 的一个语法糖，它可以很方便地让初学者适用。同时，**react-redux 的实现就是通过 context 和 容器傻瓜组件实现的**。话不多说，直接上栗子：

```javascript
// Store.js
import { createStore } from 'redux'
import Reducer from './Reducer'
import 
const initValue = { // 定义数据源
  'First': 0,
  'Second': 10,
  'Thrid': 20
}
export default createStore(Reducer, initValue)

// Reducer.js
import * as ActionTypes from './ActionType'
export default (state, action) => {
 	const { counterCaption } = action
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return {...state, [counterCaption]: state[counterCaption] + 1}
    case ActionTypes.DECREMENT:
      return {...state, [counterCaption]: state[counterCaption] - 1}
    default:
      return state
  }
}

// ActionTypes.js
export const INCREMENT = 'increment'
export const DECREMENT = 'decrement'

// Actions.js
import * as ActionTypes from './ActionType'
export const increment = counterCaption => {
  type: ActionTypes.INCREMENT,
	counterCaption: counterCaption
}
export const decrement = counterCaption => {
  type: ActionTypes.DECREMENT,
  counterCaption: counterCaption
}

// ClickCounter.js
import {connect} from 'react-redux'
import * as Action from './Actions.js'
class ClickCounter extends Component {
  constructor() {
    super(...arguments)
  }
  render() {
    return (
      <div>
        <Button onClickButton={ this.props.onClickButton }  />
        Click Count: { this.props.count }
      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ClickCounter)
// 需要说明的是，mapStateToProps作为一个数据源接口，其中 state 相当于 Store.getState(), ownProps 则是上级父组件传给该组件的 Props（即相当于一个中介者）
const mapStateToProps = function(state, ownProps) {
  return {
    count: state[ownProps.counterCaption]
  }
}
// 同样是，mapDispatchToProps 就是相当于动作的执行的包装（也是可以看成一个中介者）,其中 dispatch 就是 Store 中dispatch 方法，ownProps 同上
const mapDispatchToProps (dispatch, ownProps) {
  return {
    onClickButton() {
      dispatch(Action.increment(ownProps.counterCaption))
    }
  }
}
// index.js
import {Provider} from 'react-redux' 
import Store form './Store'
ReactDOM.render(
  <Provider store={Store}>
    <ConnectCounterPanel />
  </Provider>,
  document.getElementById('root')
);
```

通过上述的栗子，也许你会有疑惑，因为在上面的 redux 栗子中，当 Store 数据更改时，订阅到该数据源的组件都会直接调用一个 callback的，但是现在使用 react-redux 该何去何从呢？

其实一样好简单，就是当数据源改变时，mapStateToProps 方法都会被调用，也即是该方法除了中介者作用外，还作为一个订阅方法所用。

最后，可以总结出，**使用 react-redux 的两个重要点就是：Provider 和 connect 方法**。其中 Provider 的作用就是作为一个 context，然后把数据源传递下去，而 connect 方法则是使组件按需引入数据源并且订阅作用。



---

> React 组件性能优化

在日常开发中，推荐的依然是，**一个组件如果能够在开头计算 Virtual DOM 之前就可以判断渲染结果不会有变化，那样就不必要进行 Virtual DOM 来计算和比较**。

一、单个组件渲染优化

React 中 shouldComponentUpdate 生命周期默认是返回 false 的，若需要检测到组件传入的 Props 并没有改变时，就没必要进行重新渲染比较了，举个栗子🌰：

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return (nextProps.completed !== this.props.completed) || (nextProps.text !== this.props.props)
}
```

方法很简单，只需要判断当下旧有的 props 和 新的 props 中属性是否相等即可决定是否要重新渲染比较了。

上述方法，针对一个简单组件来说会很简单，但是对于一个拥有多个复杂 props 的组件来说就是，就会写的很麻烦。**而 react-redux 库中 connect 方法默认就是实现了所有比较**。

**connect 的过程中实际上产生了一个无名的 React 组件类，而这个类定制了 shouldCompnentUpdate 函数的实现，实现逻辑是比这次传递给内层傻瓜组件的 Props 和 上一次的 Props**。语法简单滴就可以写成如下：

```javascript
export default connect()(ClickCounter)
```

使用 connect 来包裹组件的唯一目的，就是利用那个聪明的 shouldComponentUpdate 函数。

但是，在 react-redux 的实现 shouldComponentUpdate 的方式，就是：**做的就是“浅层比较”，即用 JavaScript 的 === 操作符来进行比较，如果 prop 的类型是字符串或者数字，只要值相同即可，而对于复杂对象，则只会判断这两个 prop 是不是同一个对象的引用，如果不是则会被认为是两个不同的 prop**。为解决上述的问题，需设置**保证 prop 是指向同一个 JavaScript 对象**。举个栗子🌰：

```javascript
// 以下情况会导致重新执行更新
<Foo style={{ color: 'red' }} />
  
// 需改成下面情况即可，引用相同的对象即可
const fooStyle = {color: 'red'}
<Foo style={ fooStyle } />
```

当然，对于 prop 为函数类型都需要指向同一个 Function ，否则都会导致更新。有两种方式来处理：

- 通过 mapDispatchToProps 设置中间函数

  直接上栗子🌰：

  ```javascript
  <Item 
  	key={item.id}
  	id={item.id}
  	text={item.text}
  	completed={item.completed}
  	onToggle={onToggleFun}
  	onRemove={onRemoveFun}
  />
  const mapDispatchToProps = (dispatch, ownProps) => ({
    onToggleItem: () => ownProps.onToggle(ownProps.id)
  })
  ```

  当父组件进行更新时，由于父组件都会传入一个新的函数给到 Item 组件，这样就会直接导致 Item 不可避免滴更新。而 mapDispatchToProps 设置中间函数后，都会引用同一个函数从而避免 Item 组件更新。

- 不用父组件传递操作函数，而是直接通过组件自己搞定

  实质上也是通过 mapDispatchToProps 进行实现，直接上栗子🌰：

  ```javascript
  <Item 
  	key={item.id}
  	id={item.id}
  	text={item.text}
  	completed={item.completed}
  />
  const mapDispatchToProps = (dispatch, ownProps) => {
    const {id} = ownProps
    return {
      onToggle: () => dispatch(toggleTodo(id)),
      onRemove: () => dispatch(removeTodo(id))
    }
  }
  ```

  推荐方式为第二种方法，因符合高内聚的要求。



二、Key 优化

当遍历一个数组进行输出对应数据时，为了避免在进行遍历组件 Item 随着数组中数据的更改而更新，就需要添加一个唯一的 Key 值来让计算识别出来，直接上栗子🌰：

```javascript
// 未添加元素前
<ul>
  <Item key={1} text="First" />
  <Item key={2} text="Second" />
</ul>

// 添加元素后
<ul>
  <Item key={0} text="Third" />
  <Item key={1} text="First" />
  <Item key={2} text="Second" />
</ul>
```

由于上面使用 key 后，React 会根据 Key 值来判断是否有变化，一旦没有就不会更新组件，明显滴，上述例子在添加元素后，key 值为1和2的组件都不会跟着改变。



三、通过 reselect 来提高获取数据的性能

reselect 库实质上是用于缓存第一次获取的数据，当第二次调用后，会判断当前数据和缓存的数据是否变化，一旦没变化就会直接返回。[github传送门](https://github.com/reduxjs/reselect)。



---

> 高阶组件

一个高阶组件就是一个函数，该函数**接受一个组件作为输入**，然后**返回一个新的组件作为结果**。而且，返回的新数组拥有了输入组件所不具有的功能。直接上栗子：

```javascript
import React from 'react'
function highComponent(MyComponent) {
  return class MyNewComponent extends React.component {
    render() {
      const {user, ...otherProps} = this.props
      return (
      	<MyComponent {...otherProps}/>
      )
    }
  }
}
```

定义高阶组件的意义主要体现在：

- 重用代码；

  当多个组件共用一个逻辑时，就没必要每个组件都实现一遍，类似于 Minxin 功能。

- 修改现有 React 组件行为；

  通过一个独立于原有组件的函数，可以产生新的组件，对原有组件没任何侵害。

另外，高阶组件的实现方式有两种：

1. 代理方式的高阶组件；

2. 继承方式的高阶组件；

   

一、代理方式的高阶组件

**代理方式的高阶组件，主要用于以下场景：操纵 props、访问ref、抽取状态、包装组件**。代理方式的特点就是返回的新组件类型直接继承自 React.Component 类，另外在新组建的 render 函数中，把被包裹组件渲染出来。

- 操纵 props；

  在 render 函数中，this.props 包含新组件接收到的所有 props，直接上栗子：

  ```javascript
  const addNewProps = (MyComponent, newProps) => {
    return class MyNewComponent extends React.Component {
      render() {
        return <MyComponent {...this.props} {...newProps} />
      }
    }
  }
  ```

- 访问 ref；

  需注意的是，访问 ref 不是值得推荐的 React 组件使用方式。直接上栗子🌰：

  ```javascript
  const refsHOC = (MyComponent) => {
    return class HOCComponent extends React.Component {
      constructor() {
      	super(...arguments)
        this.linkRef = this.linkRef.bind(this)
      }
      linkRef(myComponentInstance) {
        this._root = myComponentInstance
      }
      render() {
        const props = {...this.props, ref: this.linkRef}
        return <myComponent {...props} />
      }
    }
  }
  ```

- 抽取状态；

  所谓的抽取状态，就是让傻瓜组件不要管理自己的状态，只要做一个无状态的组件就好，所有状态的管理都交给外面的容器组件。主要通过闭包来实现。直接上栗子🌰：

  ```javascript
  const doNothing = () => ({})
  
  function connect(mapStateToProps=doNothing, mapDispatchToProps=doNothing) {
    return function(MyComponent) {
      class HOCComponent extends React.Component {
        // 这里定义 HOCComponent 的生命周期函数
      }
      HOCComponent.contextType = {
        store: React.PropTypes.object
      }
      return HOCComponent
    }
  }
  ```

  上述栗子实现的是仿 react-redux 中一个简约版的 connect 方法，其中 MyComponent 就是一个傻瓜组件，只专注于渲染，而在闭包里的 HOCComponent 则是作为一个容器组件进行逻辑处理。

- 包装组件；

  render 函数的 JSX 中完全可以引入其他元素，甚至可以组合多个 React 组件。直接上栗子🌰：

  ```javascript
  const styleHOC = (MyComponent, style) => {
    return class HOCComponent extends React.Component {
      render() {
        return (
        	<div style={style}>
          	<MyComponent {...this.props} />
          </div>
        )
      }
    }
  }
  // 使用时
  const style = {color: 'red'}
  const NewComponent = styleHOC(MyComponent, style)
  ```

  包装组件的栗子跟操作 Props 是差不多的思路。



二、继承方式的高阶组件

继承方式的高阶组件采用继承关系关联作为参数的组件和返回组件，假如传入的组件参数是 MyComponent，那么返回的组件就直接继承自 MyComponent 组件。直接看一个跟简单的栗子🌰：

```javascript
const MyNewComponent = (MyComponent) => {
  return class NewComponent extends MyComponent {
    render() {
      const {user, ...otherProps} = this.props
      this.props = otherProps
      return super.render()
    }
  }
}
```

**代理方式和继承方式最大的区别，就是代理方式是包裹传入的组件返回新组件，而继承则是继承传入组件来返回新组件**。需注意的是，代理方式下，返回新组件是如下返回：

```javascript
return <MyComponent {...this.props} />
```

而对于继承模式，则是按如下进行返回新组件：

```javascript
return super.render()
```

**在代理方式下产生的新组件和参数组件是两个不同的组件，一次渲染，两个组件都要经历各自的生命周期。而在继承方式下两者合二为一，只有一个生命周期**。

继承方式的高阶组件可以应用以下场景：

1. 操作 prop

   对于操作 prop，官方是推荐使用代理方式来进行，而对于继承方式只有一个场景是用得上的，就是高阶组件需根据参数组件 MyComponent 渲染结果来决定如何修改 prop。直接上栗子🌰：

   ```javascript
   const modifyComponent = MyComponent => {
     return class MyNewComponent extends MyComponent {
       render() {
         const elements = super.render()
         const style = {
           color: elements && elements.type === 'div' ? 'red' : 'orange'
         }
         const props = {
           ...this.props,
           style: style
         }
         return React.cloneElement(elements, props)
       }
     }
   }
   ```

   cloneElement 方法用于复制指定组件，其实还有第三个可选参数，就是为新生成的 React 元素添加子元素，进而取替掉原有的子元素。

2. 操作生命周期函数

   上面提到过，新生成组件和参数组件会合二为一，只有一个生命周期，所以可以重新定义任何一个 React 组件的生命周期（相当于重写）。而代理方式无法则无法修改传入组件的生命周期函数。直接上栗子🌰：

   ```javascript
   const cacheHOC = MyComponent => {
     return class MyNewComponent extends MyComponent {
       shouldComponentUpdate(nextProps, nextState) {
         return !nextProps.useCache
       }
       render() {
         if (this.props.loggedIn) {
            return super.render()
         } else {
           return null
         }
       }
     }
   }
   ```

   上述栗子，就是直接重写了 shouldComponentUpdate 生命周期函数。不过，**官方推荐的是，优先考虑组合，然后才考虑继承**。


