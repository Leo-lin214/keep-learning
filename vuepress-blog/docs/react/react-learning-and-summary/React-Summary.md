# React Summary(全总结)

本文的目的在于对`React`快速复习的知识点总结，便于后期快速阅览。🤔当然，你可以把它当成是一个`React`知识点大纲，对于面试前的准备也是一个很好的复习哈 💪。

后期若有新的知识点内容，会继续更新 😄。



## 目录

- [<span>组件</span>](#组件)
- [<span>JSX</span>](#JSX)
- [<span>生命周期</span>](#生命周期)
- [<span>组件的属性和状态</span>](#组件的属性和状态)
- [<span>事件处理</span>](#事件处理)
- [<span>组件通信</span>](#组件通信)
- [<span>表单处理</span>](#表单处理)
- [<span>样式处理</span>](#样式处理)
- [<span>组件的抽象与复用</span>](#组件的抽象与复用)
- [<span>DOM 相关</span>](#dom-相关)
- [<span>Hook</span>](#hook)


## 组件

1. 创建组件的方式可分为两种，分别为 ES5 和 ES6 两种方式。

   ```javascript
   // ES5
   var React = require('react')
   var Hello = React.createClass({
     propTypes: { // 类型检查
       name: React.PropTypes.string
     },
     getDefaultProps: function() { // 获取默认属性
       return {
         name: 'Andraw-lin'
       }
     },
     getInitialState: function() { // 初始化状态state
       return {
         count: 1
       }
     },
     render: function() {
       return <div>hello, { this.props.name } { this.state.count }</div>
     }
   })
   
   // ES6
   import React from 'react'
   import PropTypes from 'prop-types'
   class Hello extends React.Component {
     static propTypes = { // 类型检查
       name: PropTypes.string
     }
     static defaultProps = { // 获取默认属性
       name: 'Andraw-lin'
     }
     constructor(props) {
       super(this)
       this.state = { // 初始化状态state
         count: 1
       }
     }
     render() {
       return <div>Hello, { this.props.name } { this.state.count }</div>
     }
   }
   ```

2. 无状态组件，也叫函数式组件。无状态组件只传入 props 和 context 两个参数，简单滴说，**无状态组件不存在 state，也没有生命周期方法，只有一个 render 方法**。 

   ```javascript
   function Button({ color = 'blue', text = 'OK' }) {
     return (
       <button className={`btn-${color}`}>
         <em>{text}</em>
       </button>
     )
   }
   ```

3. `PureComponent`是 react 15.3 后引入的，和普通的`Component`功能几乎一致，但**`PureComponent`的`shouldComponentUpdate`不会直接返回`true`**，而是会对属性进行浅层比较，也就是仅比较直接属性是否相等。

   下面模拟`PureComponent`组件的实现。

   ```javascript
   class Demo extends Component {
     shouldComponentUpdate(nextProps, nextState) {
       const {props, state} = this
       function shallowCompare(a, b) {
         if (a === b) return true
         if (Object.keys(a).length !== Object.keys(b).length) return false
         return Object.keys(a).every(k => a[k] === b[key])
       }
       return !shallowCompare(nextProp, props) && !shallowCompare(nextState, state)
     }
   }
   ```



**总结：一般情况下，都是使用普通`Component`，若组件只是作为渲染使用，那么使用无状态组件`Functional Component`，若组件是基本不变化组件，那么使用纯组件`PureComponent`**。



## JSX

1. 在 React 中创建的虚拟元素可以分为两类：**DOM 元素（DOM elment）、组件元素**（component element），分别对应着原声 DOM 元素与自定义元素。

   其中，**DOM 元素标签的首字母是小写，而组件元素则是大写**。

2. 针对模板中需要根据浏览器 IE 来输出标签时，需进行如何转化：

   ```javascript
   // 日常使用
   <!--[if IE]>
     <p>work in IE brower</p>
   <![endif]-->
   
   // JSX 中使用需进行转化
   {
     (!!window.ActiveXObject || 'ActiveXObject' in window) ?
      <p>work in IE brower</p> : ''
   }
   ```

3. 在 JSX 中使用元素属性时，有两个属性需要注意的是：

   - class 属性改为 className；
   - for 属性改为 htmlFor；

4. 在 JSX 中表单标签**使用 disabled、required、checked、readOnly 等时，若不设置值时，都会默认为 true**。直接上栗子🌰：

   ```html
   <Checkbox checked />
   // 相当于
   <Checkbox checked={true} />
   
   // 一旦设置false时，就需要自行设置而无法简化
   <Checkbox checked={false} />
   ```

5. **React 提供 dangerouslySetInnerHTML 属性，可用于转译 HTML 标签的内容，同时可避免 React 转义字符**。直接上栗子🌰：

   ```html
   <div dangouslySetInnerHTML={{__html: 'cc &copy; 2015'}} />
   ```



## 生命周期

组件的生命周期主要分为三个阶段，分别为：**挂载阶段、更新阶段和卸载阶段**。

1. 挂载阶段会执行以下回调函数。

   - constructor()
   - componentWillMount()
   - render()
   - componentDidMount()

2. 更新阶段会分为三种情况，分别是**父组件更新、自身状态更新、`forceUpdate`强制更新**。

   - 父组件更新时，会执行以下回调函数。
     - componentWillReceiveProps()
     - shouldComponentUpdate()
     - render()
     - componentDidUpdate()
   - 自身状态更新时，会执行以下回调函数。
     - shouldComponentUpdate()
     - componentWillUpdate()
     - render()
     - componentDidUpdate()
   - `forceUpdate`强制更新时，会执行以下回调函数。
     - componentWillUpdate()
     - render()
     - componentDidUpdate()

   注意：**`shouldComponentUpdate`主要用于提升性能，`componentWillReceiveProps`主要用来将新的`props`同步到`state`中**。

3. 卸载阶段只会执行`componentWillUnmount`回调函数，主要用于**清除定时器、解绑自定义事件**，避免内存泄漏。



## 组件的属性和状态

1. `props`都是只读的，不能进行更改。

   其中有一个比较特殊的属性——`children`，代表当前组件的子组件集合，自定义属性名不能与该名字重复。

   ```javascript
   class List extends Component {
     render() {
       return <ol>{ this.props.children }</ol>
     }
   }
   
   <list>
     <li>1</li>
     <li>2</li>
   </list>
   ```

2. 通过**配置静态属性`defaultProps`能给予组件默认属性值**。

   ```javascript
   class User extends Component {
     static defaultProps = {
       name: 'Andraw-lin'
     }
   }
   ```

3. 类型检测`PropTypes`在版本`15.5`前都是在`React`包中，后面的版本都是分离到单独的`prop-types`包中，需单独引入。

   ```javascript
   import PropTypes from 'prop-types'
   
   class User extends Component {
     static propTypes = {
       name: PropTypes.string.isRequired
     }
   }
   ```

4. 初始化`state`方式有两种。分别为构造函数中定义和普通属性定义。（其中普通属性定义还不是语言标准，属于提案，不过`babel`已经支持）

   ```javascript
   // 构造函数中定义
   class User extends Component {
     constructor() {
       super(this)
       this.state = {
         name: 'Andraw-lin'
       }
     }
   }
   
   // 普通属性定义（还不是语言标准，属于提案，不过babel已经支持）
   class User extends Component {
     state = {
       name: 'Andraw-lin'
     }
   }
   ```

5. **`setState`方法是一个异步方法，`React`会在一个生命周期内将多次`setState`操作合并成一次**。（这也是为什么在`setState`后立马取值，是无法取到更新的值原因）

   若想立马获取`setState`更新后的值，有两种方式，分别是**将计算结果存储下来**和**使用`setState`方法第二个参数回调函数**。

   ```javascript
   // 将计算结果存储下来（最简单方式）
   state = { time: 1 }
   componentWillMount() {
     const newTime = this.state.time + 1
     this.setState({ time: newTime })
     console.log(newTime) // 2
   }
   
   // 使用setState方法第二个参数回调函数
   state = { time: 1 }
   componentWillMount() {
     this.setState({ time: this.state.time + 1 }, () => {
       console.log(this.state.time) // 2
     })
   }
   ```

6. 不要将什么数据都定义到`state`里，坚持一个基本原则：**能发到局部作用中的，能放到`this`普通属性中的，都不要放到`state`中**。

   ```javascript
   // 局部作用域
   let name = 'Andraw-lin'
   class ...
   
   // this普通属性
   class User extends Component {
     name: 'Andraw-lin'
   }
   ```



## 事件处理

1. React 基于 Virtual DOM 实现了一个 **SyntheticEvent（合成事件）层**，组件中定义的事件处理器会接收到一个 SyntheticEvent 对象的实例，**与原生的浏览器事件一样拥有同样的接口，同样支持事件的冒泡机制**（即使用 stopPropagation 和 preventDefault 方法来中断）。

2. `React`中绑定事件方式和`HTML`绑定事件区别。

   - `React`绑定事件是驼峰原则（如 onClick），`HTML`绑定事件是全部小写原则（如 onclick）。
   - `React`绑定事件处理的是一个函数，`HTML`绑定事件处理的是一个字符串。

3. `React`合成事件实现中，采用了**事件代理机制**。

   不会把处理函数直接绑定到真实的节点上，而是把所有事件绑定到结构的最外层，使用一个统一的事件监听器。该事件监听器维持了一个映射来保存所有组件内部的事件监听和处理函数。当组件挂载或卸载时，只是在这个统一的事件监听器上插入或删除一些对象。当事件发生时，首先被该统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用。

4. 在使用 ES6 class 时，无法进行自动绑定 this 为 React 组件本身实例，而需要手动绑定。手动绑定方式有三种，分别为`bind`方法、构造函数声明和箭头函数。

   ```react
   // bind方法（传参数或不传参数）
   render() {
     return (
       <button onClick={ this.handleClick.bind(this, 'test') }>Test</button>
     )
   }
   // bind方法（不传参数还可以使用双冒号，还是stage0草案中提供方案，babel已支持）
   render() {
     return (
       <button onClick={ ::this.handleClick.bind }>Test</button>
     )
   }
   
   // 构造函数声明
   constructor(props) {
     super(props)
     this.handleClick = this.handleClick.bind(this)
   }
   
   // 箭头函数（第一种方式）
   handleClick = () => {
     console.log('hanldeClick')
   }
   render() {
     return (
       <button onClick={this.handleClick}>
       	Click me
       </button>
     )
   }
   // 箭头函数（第二种方式）
   handleClick() {}
   render() {
     return (
       <button onClick={ (e) => this.handleClick(e) }>
       	Click me
       </button>
     )
   }
   ```

5. `React`中若想对绑定事件传入相应的参数，有两种方式，分别是`bind`方式和箭头函数。

   ```html
   // bind方法
   <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
   
   // 箭头函数
   <button onClick={(e) => this.deleteRow(id, e)}></button>
   ```

6. 阻止 React 事件冒泡的行为只能用于 React 合成事件系统中，而无法阻止原生事件的冒泡**。**在原生事件中的阻止冒泡行为，却可以阻止 React 合成事件的传播。

7. 合成事件和原生事件区别。

   - 合成事件只支持冒泡机制，原生事件则支持 DOM 事件流（即事件捕获阶段、目标对象本身的事件处理程序调用、事件冒泡阶段三个阶段）。

   - 合成事件只是原生事件的一个子集。

   - 合成事件处理的是函数，原生事件处理的则是字符串。

   - 绑定方式不同，主要有以下区别。

     绑定原生事件的方式有很多种，具体如下：

     + 直接在 DOM 元素中绑定

       ```html
       <button onclick="alert(1);">Test</button>
       ```

     + 通过元素的事件属性赋值方式实现绑定

       ```javascript
       el.onclick = e => { alert(1); }
       ```

     + 通过事件监听函数来实现绑定

       ```javascript
       el.addEventListener('click', () => {})
       el.attachEvent('onclick', () => {})
       ```

     React 合成事件则简单很多，如下：

     ```javascript
     <button onClick={this.handleClick}>Test</button>
     ```



## 组件通信

组件间通信分为四种情况，分别为：**父组件向子组件通信、子组件向父组件通信、跨级组件间通信、没有嵌套关系的组件间通信**。

1. 父组件向子组件通信

   父组件通过 props 向子组件传递需要的信息。直接上🌰：

   ```javascript
   // Parent.js
   import React, {Component} from 'react'
   import Child from './Child'
   export default class Parent extends Component {
     constructor(props) {
       super(props)
       this.state = {
         text: 'Parent'
       }
     }
     render() {
       return (
       	<Child text={this.state.text} />
       )
     }
   }
   
   // Child.js
   import React, {Component} from 'react'
   export default class Child extends Component {
     render() {
       return (
       	<span>{ this.props.text }</span>
       )
     }
   }
   ```

2. 子组件向父组件通信

   子组件若要和父组件进行通信，有两种处理方式：

   - 回调函数

     类似于 Props 传递，只是这次传递的是一个函数，父组件可获取到子组件运行时的状态。直接上🌰：

     ```react
     // Parent.js
     render() {
       return (
         <Child parentClick={this.parentClickFun} />
       )
     }
     
     // Child.js
     render() {
       return (
         <span onClick={this.props.parentClick}></span>
       )
     }
     ```

   - 自定义事件机制

     自定义事件可用于子组件向父组件之间的通信，但是使用次数不多，**一般是用于没有嵌套关系的组件间通信**，下面会讲解。

3. 跨级组件间通信

   **通过`context`可以让祖先组件直接把属性传递给后代组件**。

   定义`context`需双向声明，即在祖先组件中声明静态属性`childContextTypes`，在后代组件中再次声明静态属性`contextTypes`，最后在祖先组件普通方法`getChildContext`中定义传输属性，这样后代组件便可以直接获取相应属性了。

   ```react
   import PropTypes from 'prop-types'
   // 祖先组件
   class Ancestor extends Component {
     static childContextTypes = {
       name: PropTypes.string
     }
     getChildContext() {
       return {
         name: 'Andraw-lin'
       }
     }
   }
   // 后代组件
   class Child extends Component {
     static contextTypes = {
       name: PropTypes.string
     }
   }
   ```

4. 没有嵌套关系的组件间通信

   对于无嵌套关系的组件间通信，可使用自定义事件机制。需注意是，**在 componentDidMount 事件中，在组件挂载完成再订阅事件，而在 componentWillUnmount 事件中，在组件卸载再取消订阅事件**。使用的是 Nodejs Events 模块实现自定义事件机制，直接上栗子🌰：

   ```javascript
   // events.js
   import { EventEmitter } from 'events'
   export default new EventEmitter()
   
   // one.js
   import emitter from './events'
   myClick() {
     emitter.emit('test', { a: 1 })
   }
   
   // two.js
   import emitter from './events'
   componentDidMount() {
     this.clickEvent = emitter.on('test', data => {
       console.log(data)
     })
   }
   componentWillUnmount() {
     emitter.removeLister(this.clickEvent)
   }
   ```

当然除了上述列举通信方法外，还可以通用 redux 进行管理。



## 表单处理

React 对于表单处理上，主要分为两种类型：**受控组件和非受控组件**。

1. 受控组件

   当表单的状态发生变化时，都会被写入到组件的 state 中，在 React 中被称为受控组件。

   在受控组件中，组件渲染出的状态和它的 value 或 checked prop 相对应。

   React 受控组件更新 state 的流程主要如下：

   - 可通过在初始 state 中设置表单的默认值；
   - 当表单的值发生变化时，调用 onChange 事件处理器；
   - 事件处理器通过合成事件对象 e 拿到改变后的状态，并更新应用的 state；
   - 通过 setState 方法来触发视图的重新渲染，完成表单组件值的更新；

   直接上🌰：

   ```javascript
   import React, { Component } from 'react'
   
   class App extends Component {
     constructor(props) {
       super(props)
       this.handleChange = this.handleChange.bind(this)
       this.state = {
         selectValue: 'guangzhou'
       }
     }
     handleChange(e) {
       const { value } = e.target.value
       this.setState({ selectValue: value })
     }
     render() {
       return (
         <select value={selectValue} onChange={handleChange}>
           <option value="guangzhou">广州</option>
           <option value="shanghai">上海</option>
           <option value="beijing">北京</option>
         </select>
       )
     }
   }
   ```

   可以睇到，React 本身是一个单向数据流绑定，而在表单上使用 onChange 事件后，就实现了双向数据绑定。

2. 非受控组件

   如果一个表单组件没有 value props（单选按钮和复选框对应的是 checked prop）时，就可以称为非受控组件。

   **非受控组件和受控组件都可以使用 defaultValue 和 defaultChecked 来设置组件的默认状态**。

   在 React 中，非受控组件是一种反模式，它的值不受组件自身的 state 或 props 控制。**一般情况下，都需要通过为其添加 ref 属性来访问渲染后的底层 DOM 元素**。

   直接上栗子🌰：

   ```javascript
   import React, { Component } from 'react'
   
   class App extends React {
     constructor(props) {
       super(props)
       this.handleSubmit = this.handleSubmit.bind(this)
     }
     handleSubmit(e) {
       e.preventDefault()
       const { value } = this.refs.name
       console.log(value)
     }
     render() {
       return (
         <form onSubmit={this.handleSubmit}>
         	<input ref='name' type='text' defaultValue='Andraw-lin' />
           <button type='submit'>submit</button>
         </form>
       )
     }
   }
   ```

3. 对比受控组件和非受控组件

   通过 defaultValue 或者 defaultChecked 来设置表单的默认值，仅仅只会被渲染一次，在后续的渲染中并不会起到作用。举个栗子🌰：

   ```javascript
   // 受控组件
   <input 
     value={this.state.value}
     onChange={e => {this.setState({
       value: e.target.value.toUpperCase()
     })}}>
       
   // 非受控组件
   <input 
     defaultValue={this.state.value}
     onChange={e => {this.setState({
       value: e.target.value.toUpperCase()
     })}}>
   ```

   上述例子中，受控组件可以将用户输入的英文字母转化为大写后输出展示，而在非受控组件中则不会。**多数情况下，对于非受控组件，并不需要通过 change 事件**。

   受控组件和非受控组件的最大区别就是：**非受控组件的状态并不会受用用状态的控制，应用中也多了局部组件状态，而受控组件的值来自于组件的 state**。具体体现在如下方面：

   - 性能上的问题

     受控组件在表单值每次发生变化时，都会调用一次 onChange 事件处理器，导致了一部分的性能损耗。

     使用非受控组件不会出现这些问题，但**在 React 中仍然是不提倡使用非受控组件**。

   - 是否需要事件绑定

     受控组件必须使用 onChange 事件，而非受控可以选择性滴使用。

4. 表单组件的几个重要属性

   - 状态属性

     React 的 form 组件提供了几个属性来展示组件的状态：

     + **value**： 类型为 text 的 input 组件、textarea 组件以及 select 组件都借助 value 属性来展示应用的状态；
     + **checked**：类型为 radio 或 checkbox 的组件值为 boolean 类型的 selected 属性 来展示应用的状态；
     + **selected**：该属性可用于 select 组件下面的 option 上，**React 并不建议使用这种方法表示状态，而推荐使用 value 方法**。

   - 事件属性

     在状态属性发生变化时，会触发 onChange 事件属性，**受控组件中的 change 事件与 HTML DOM 中提供的 input 事件行为类似**。



## 样式处理

React 中可通过 style prop 来给组件设置行内样式，但需注意的是，**style prop 必须是一个对象**。在设置样式时，需要注意两点：

- 自定义组件建议支持 className prop，让用户使用时添加自定义样式；
- 设置行内样式时要使用对象；

直接上栗子🌰：

```javascript
// className Prop
render() {
  const myClass = this.state.name ? 'myNameClass' : 'myClass'
  return (
    <span className={myClass}>className</span>
  )
}

// style Prop
const style = {
  color: 'white',
  msTransition: 'all'
}
const component = <span style={style} />
```

1. React 样式处理

   - 样式中像素值

     **React 会自动对支持数值px的属性添加 px**，直接上🌰：

     ```javascript
     const style = { height: 10 }
     ```

     另外，有些属性除了支持 px 为单位的像素值，还支持数字直接作为值，此时 React 对这些支持数字的属性则不会自动添加 px，如 lineHeight。

   - 使用 classnames 库

     在上述 className prop 栗子中，可以看到，动态类名需根据状态来决定是否添加，一旦一个标签需要特别多样式名也就导致产生多个定义，因此并不友好。使用 classnames 库则可以进行解决，利用语法糖提高开发效率，对上述 className prop 栗子使用 classnames 库进行改造：

     ```javascript
     import classNames from 'classnames'
     
     render() {
       const myClassContainer = classNames({
         'myNameClass': this.state.name,
         'myClass': !this.state.name
       })
       return (
         <span className={myClassContainer}>className</span>
       )
     }
     ```

2. CSS Modules

   有兴趣的可以先理解一下 [CSS Modules](https://github.com/css-modules/css-modules)。目前就先上一个 CSS Modules 结合 React 实践，直接上栗子🌰：

   ```javascript
   // index.css
   .root { ... }
   .confirm { ... }
   .disabledConfirm { ... }
   
   // index.js
   import React, { Component } from 'react'
   import classNames from 'classnames'
   import indexStyles from './index.css'
   
   class Index extends Component {
     render() {
       const cx = classNames({
         confirm: !this.state.disabled,
         disabledConfirm: this.state.disabled
       })
       return (
         <div className={indexStyles.root}>
           <a className={indexStyles[cx]}>Confirm</a>
         </div>
       )
     }
   }
                     
   ```

   一般情况下，组件最外层的节点对应的 class 名称为 root。也许有人会发现，我们需要拼命地写 style.* 来获取对应的类名，这是一个很繁琐和重复的工作，因此可以使用 react-css-modules 库。直接上栗子🌰：

   ```react
   // index.js
   import React, { Component } from 'react'
   import classNames from 'classnames'
   import CSSModule from 'react-css-modules'
   import indexStyles from './index.css'
   
   class Index extends Component {
     render() {
       const cx = classNames({
         confirm: !this.state.disabled,
         disabledConfirm: this.state.disabled
       })
       return (
         <div styleName={root}>
           <a styleName={cx}>Confirm</a>
         </div>
       )
     }
   }
   export default CSSModules(Index, indexStyles)
   ```

   使用 react-css-module 对比原有的 CSS Module，具体有如下特点：

   - 不再需要关注是否使用驼峰来命名 class 名；

   - 不用每一次使用 CSS Module 的时候都关联 style 对象；

   - 使用 CSS Module 容易使用 :global 去解决特殊情况。而使用 react-css-module 则是使用 styleName 来表示局部，使用 className 表示全局。直接上栗子：

     ```html
     // CSS Module
     <div className={indexStyle['test']}></div>
     
     // react css module
     <div styleName={global-css} ></div>
     ```

   - 当 styleName 关联了一个 undefined CSS Module 时，react-css-module 会发出一个警告；



## 组件的抽象与复用

在旧版本`React`里，实现组件间的抽象和复用主要通过`mixin`实现。由于`mixin`方法一致存在重名覆盖问题，对于大型项目将会是一个致命缺陷，因此在新版本中已被消除。

目前**要实现组件的抽象与复用**，主要有三种方法，分别是**继承、组合和高阶组件**。

1. 继承

   处理A is B问题。若两个以上的组件一部分功能是一样的，那么可抽象为一个父类，通过继承解决重复问题。

   ```javascript
   class PureComponent extends Component {
     shouldComponentUpdate(nextProp, nextState) {
       const {props, state} = this
       function shallowCompare(a, b) {
         if (a === b) return true
         if (Object.keys(a).length !== Object.keys(b).length) return false
         return Object.keys(a).every(k => a[k] === b[key])
       }
       return !shallowCompare(nextProp, props) && !shallowCompare(nextState, state)
     }
   }
   class Parent extends PureComponent {}
   class Child extends PureComponent {}
   ```

   关于继承一定要谨慎，如果想不清楚就不要抽象父类。继承设计不好，到后面就会非常脆弱并且不好维护。

2. 组合

   处理A has B问题。比如汽车和人都会跑，人和跑不是“是”关系，而是“拥有”关系，若使用继承的方法实现抽线，父类就很难抽象出来。而组合却可以很好实现

   **`javascript`中实现组合方式有多种，以下就介绍三种，分别为内部调用、拷贝、ES5中`mixin`方法**。

   - 内部调用

     ```javascript
     const map = {
       run() {
         this.runState = true
       }
       stop() {
         this.runState = false
       }
     }
     class People {
       run(...args) {
         return map.run.call(this, ...args)
       }
       stop(...args) {
         return map.stop.call(this, ...args)
       }
     }
     ```

   - 拷贝

     实现一个`extend`函数，也可以借用`jQuery`中`$.extends`方法，又或者`ES6`中的`Object.assign`方法。

     ```javascript
     function extend(obj1, obj2) {
       Object.keys(obj2).forEach(key => {
         obj1[key] = obj2[key]
       })
     }
     class People {}
     // 使用时
     extend(People.prototype, map)
     $.extends(People.prototype, map)
     Object.assign(People.prototype, map)
     ```

   - React ES5 mixin

     ```javascript
     var setIntervalMixin = {
       componentWillMount() {
         this.intervals = []
       },
       setInterval() {
         this.intervals.push(setInterval.apply(null, arguments))
       },
       componentWillUnmount() {
         this.intervals.forEach(clearInterval)
       }
     }
     const Demo1 = React.createClass({
       mixins: [setIntervalMixin]
     })
     const Demo2 = React.createClass({
       mixins: [setIntervalMixin]
     })
     ```

     不推荐的做法。

3. 高阶组件

   实现高阶组件的方式有两种：**调用传入的组件**和**继承传入的组件**。

   ```javascript
   // 调用传入的组件
   function HOC1(InnerComponnet) {
     return class WrapComponent extends Component {
       render() {
         return (
         	<InnerComponent ...this.props>
           	{ this.props.children }
           </InnerComponent>
         )
       }
     }
   }
   let Demo1 = class extends Component {}
   Demo1 = HOC1(Demo1)
   
   // 继承传入的组件
   function HOC2(InnerComponent) {
     return class WrapComponent extends InnerComponent {}
   }
   let Demo2 = class extends Component {}
   Demo2 = HOC2(Demo2)
   ```

   注意：**一般只在传入组件外围进行一些操作时，建议使用第一种方法。如果想在传入组件的内部进行一些操作，比如改写`render`，则使用第二种方法**。



## DOM 相关

1. `React`通过`ref`给了我们饮用组件和`DOM`元素的能力。

   ```javascript
   class User extends Component {
     render() {
       return (
         <input ref={(input) => this.nameInput = input} type="text" />
       )
     }
   }
   ```

   `ref`中值若为函数时，会在`componentDidMount`和`componentDidUpdate`后执行。

2. `React`会对输出内容进行`XSS`过滤，但在某些情况下不想要这个功能，比如在接口返回`HTML`片段情况下，需要用到**`dangerouslySetInnerHTML`，它可以将`HTML`设置到`DOM`上**。



## Hook

1. 使用`Hook`的目的在于以下几个方面。

   - **组件间的重复逻辑进行复用**。虽然可使用`render props`和高阶组件方案，但这两类方案都需要重新组织组结构，导致代码难以理解以及不好维护。
   - **对组件内相关联的状态以及逻辑统一管理**。如获取后端数据相关变量以及逻辑、订阅事件以及消除事件等。
   - **对函数式组件进行扩展**，避免了旧版本函数式组件需要增添状态管理或生命周期等逻辑时，必要地转化为不好理解的`class`组件。

   另外，需注明的是，`Hook`并不打算替代`class`，只是更好滴拓展函数式组件、复用组件间逻辑以及讲相关联逻辑统一管理。**最重要的是，Hook 和现有代码可以同时工作，你可以渐进式地使用他们，采用的是渐进策略。**

2. `Hook`的本质就是 Javascript 函数，使用它时必须遵循两条规则。

   - **只在函数组件内的最顶层使用`Hook`**。即不能在例如`for`循环、条件语句等里面使用`Hook`。
   - **只在`React`函数组件内调用`Hook`**。

3. 在单个组件中使用多个`State Hook`或`Effect Hook`时，`React`是如何知道哪个`state`对应哪个`useState`或`useEffect`的？

   答案就是**`React`靠的是`Hook`调用的顺序**。直接上个栗子🌰。

   ```react
   function Form() {
     const [name, setName] = useState('Mary')
     useEffect(() => {
       localStorage.setItem('name', name)
     })
     
     const [surname, setSurname] = useState('haha')
     useEffect(() => {
       document.title = name + ' ' + surname
     })
   }
   // 首次渲染
   useState('Mary')
   useEffect()
   useState('haha')
   useEffect()
   // 二次渲染
   useState('Mary')
   useEffect()
   useState('haha')
   useEffect()
   ```

   只要`Hook`的调用顺序在多次渲染之间保持一致，`React`就能正确滴奖内部`state`和对应`Hook`进行关联，**一旦部分中间某个`useState`或`useEffect`处于条件语句中，那么后面的`useState`或`useEffect`都无法正确运行或获取正确的值**。

4. `State Hook`中使用的 API 是`useState`，格式如下。

   ```react
   const [name, setName] = useState(initialState)
   // 返回一个state，以及更新state的函数
   // 在初始渲染期间，返回的状态state和传入第一个参数initialState值相同
   // 在后续重新渲染中，useState返回的第一个值将始终是更新后最新的state
   ```

   `setName`更新函数参数可以是数字、字符串或回调函数等。**当参数是回调函数时，回调函数的参数就是更新对应`state`前的值**，看栗子🌰。

   ```react
   <button onClick={() => setName(preName => preName + 'haha.')}></button>
   // 参数preName就是状态Name上一次更新的值
   ```

   **与 class 组件中`setState`方法不同，`useState`不会自动合并更新对象**。直接看🌰。

   ```react
   const [name, setName] = useState({ name: 'haha', age: 12 })
   console.log(name)
   // 第一次输出：{ name: 'haha', age: 12 }
   // 第二次输出：{ name: 'hehe' }
   return <button onClick={() => setName({ name: 'hehe' })}>test</button>
   
   // 针对不会合并情况，处理方案有useReducer以及使用展开运算，下面就介绍一下展开运算符做法
   return <button onClick={() => setName(preName => {...preName, ...{ name: hehe }})}>test</button>
   ```

   最后，**`setName`更新函数中参数，其内部采用的是`Object.is`比较算法进行比较的，若传入参数不变，则将会跳过子组件的渲染以及`effect`的执行**。

5. `Effect Hook`中使用的 API 是`useEffect`，格式如何。

   ```react
   useEffect(function)
   // 接收一个包含共同逻辑的函数，如改变DOM、订阅取消事件等
   ```

   默认情况下，**`effect`将在每轮渲染结束后执行，但你可以选择让它某些值改变时才执行**。

   **React 允许`effect`返回一个函数代表生命周期`componentWillUnmount`回调**。直接看🌰。

   ```react
   // useEffect中函数就是componentDidMount和componentDidUpdate结合，而返回函数则是componentWillUnmount
   useEffect(() => {
     const subscription = props.source.subscribe()
     return () => {
       subscription.unsubscribe() // 清除订阅
     }
   })
   ```

   组件在多次渲染时，则**在执行下一个`effect`之前，上一个`effect`就已被清除**。在上述例子中，组件的每一次更新都会创建新的订阅。

   `useEffect`与生命周期`componentDidMount`和`componentDidUpdate`不同的是，**在浏览器完成布局与绘制后，才会按顺序执行`useEffect`中的函数**。若**想同步进行，可使用`useLayoutEffect`来处理**。

   默认情况下，`effect`会在每轮组件渲染完成后执行，一旦`effect`的一来发生变化，它就会被重新创建。**给`useEffect`传递第二个参数，就是作为`effect`所依赖的数组，只有当依赖的数组中的元素值变化时才会执行**。看栗子🌰。

   ```react
   useEffect(() => {
     const subscription = props.source.subscribe()
     return () => {
       subscription.unsubscribe() // 清除订阅
     }
   }, [props.source])
   // 只有当props.source改变时，useEffect的回调才会执行
   ```

   如果想执行只运行一次的`effect`（仅在组件挂载和卸载时执行），可**传递一个空数组`[]`作为第二个参数**。就是说，**当前的`effect`不依赖于`props`或`state`中的任何值，永远只会在初次渲染后执行一次**。

   

















































