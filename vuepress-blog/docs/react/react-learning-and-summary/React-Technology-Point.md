# React Technology Point

- [About JSX](#1)

- [React 组件的构建](#2)

- [React 数据流](#3)

- [React 生命周期](#4)

- [React 与 DOM](#5)

- [事件系统](#6)

- [表单处理](#7)

- [样式处理](#8)

- [组件间通信](#9)

- [高阶组件](#10)

- [组件性能优化](#11)

  

---

> **<span id="1">About JSX</span>**

1. 在 React 中创建的虚拟元素可以分为两类：DOM 元素（DOM elment）、组件元素（component element），分别对应着原声 DOM 元素与自定义元素；

   所谓的 React 组件，是使用递归渲染的方式构建出完全的 DOM 元素树（即一个 React Component 在渲染时，就是递归其子元素，当遇到一个 React 子组件时就会继续递归下去渲染并返回，直到标签解析成原生 DOM 元素并最终输出 DOM Tree ）；

2. 一个标签在 React 中会被转译成对应的 React.createElement 调用调用方法，因此需注意两点：

   - 定义标签时，只允许被一个标签包裹；
   - 标签一定要闭合；

   另外需要注意的是，**DOM 元素标签的首字母是小写，而组件元素则是大写**；

3. 针对模板中需要根据浏览器 IE 来输出标签时，需进行如何转化：

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

4. 在 JSX 中使用元素属性时，有两个属性需要注意的是：

   - class 属性改为 className；
   - for 属性改为 htmlFor；

5. 在 JSX 中表单标签**使用 disabled、required、checked、readOnly 等时，若不设置值时，都会默认为 true**。直接上栗子🌰：

   ```javascript
   <Checkbox checked />
   // 相当于
   <Checkbox checked={true} />
   
   // 一旦设置false时，就需要自行设置而无法简化
   <Checkbox checked={false} />
   ```

6. **React 提供 dangerouslySetInnerHTML 属性，可用于转译 HTML 标签的内容，同时可避免 React 转义字符**。直接上栗子🌰：

   ```javascript
   <div dangouslySetInnerHTML={{__html: 'cc &copy; 2015'}} />
   ```



---

> **<span id="2">React 组件的构建</span>**

React 的本质就是关系元素的构成，React 组件即为组件元素，基本上由三部分构成——属性（props）、状态（state）、生命周期方法。

React 组件在官方上提供3种不同构建方法：

1. React.createClass

   ```javascript
   const Button = React.createClass({
     getDefaultProps() {
       return {
         color: 'blue',
         text: 'OK'
       }
     },
     render() {
       const { color, text } = this.props
       return {
         <button className={`btn-${color}`}>
   				<em>{text}</em>
   			</button>
       }
     }
   })
   ```

   当一个组件需要调用 Button 组件时，只要写一次`<Button />`，就可以被**解析成 React.createElement(Button) 方法来创建 Button 实例**，意味着在一个应用中调用几次 Button，就会创建几次 Button 实例。

2. ES6 classes

   ```javascript
   import React, { Component } from 'react'
   class Button extends Component {
     constructor(props) {
       super(props)
     }
    	static defaultProps = {
       color: 'blue',
       text: 'OK'
     }
   	render() {
       const { color, text } = this.props
       return (
       	<button className={`btn-${color}`}>
   				<em>{text}</em>
   			</button>
       )
     }
   }
   ```

   **与 createClass 的结果相同的是，调用类实现的组件会创建实例对象**。如果非要说区别，就是在语法上一个沿用 ES5 语法，另一个沿用 ES6 语法。

3. 无状态函数（stateless function）

   使用无状态函数构建的组件成为无状态组件。无状态组件只传入 props 和 context 两个参数，简单滴说，**无状态组件不存在 state，也没有生命周期方法，只有一个 render 方法**。 直接上栗子🌰：

   ```javascript
   function Button({ color = 'blue', text = 'OK' }) {
     return (
     	<button className={`btn-${color}`}>
   			<em>{text}</em>
   		</button>
     )
   }
   ```

   无状态组件就是一个普通的 Function 函数，工作只是返回对应的标签。因此无状态组件不像上述两种方法在调用时创建新的实例，创建时始终保持了一个实例，避免了不必要的检查和内存分配，做到了内部优化。



---

> **<span id="3">React 数据流</span>**

在 React 中，数据是自顶向下单向流动的，即从父组件到子组件。

把组件看成一个函数，那么它接受了 props 作为参数，内部由 state 作为函数的内部参数，返回一个 Virtual DOM 的实现。

1. state

   使用 React 库中内置的 setState 方法时，最大的表现行为就是该组件会尝试重新渲染。

   **setState 是一个异步方法，一个生命周期内所有的 setState 方法会合并操作**。

   随着内容的深入，并不推荐开发者滥用 state，过多的内部状态会让数据流混乱，程序变得难以维护。

2. props

   props 是 React 用来让组件之间互相联系的一种机制，就像方法的参数一样。

   **React 的单向数据流，主要的流动管道就是 props ，props 本身是不可变的**。

   React 为 props 同样提供了默认配置，通过 defaultProps 静态变量的方式来定义默认值，直接上栗子🌰：

   ```javascript
   static defaultProps = {
     color: 'blue',
     onChange: () => {}
   }
   ```

   在 React 中有一个重要且内置的 prop —— children，代表组件的子组件集合。即 React.Children 就代表了组件中设置的内容。

3. 使用 function prop 与父组件进行通信

   对于 props 来说，它的通信是父组件向子组件的传播，而且父组件也可传递方法到子组件中，便于子组件通过该方法来通知父组件做进一步的操作。直接上栗子🌰：

   ```javascript
   hanleTabClick(index) {
     this.props.onChange(index)
   }
   ```

4. propTypes

   propTypes 用于规范 props 的类型与必需的状态。直接上栗子🌰：

   ```javascript
   static propTypes = {
     color: React.PropTypes.string,
     onChange: React.PropTypes.func
   }
   ```

   需要注意的是，**新版 React 不再把 propTypes 放在 React 库中内置，而是会单独抽离出来**。直接上栗子🌰：

   ```javascript
   import { PropTypes } from 'prop-types';
   
   static propTypes = {
     color: PropTypes.string,
     onChange: PropTypes.func
   }
   ```



---

> **<span id="4">React 生命周期</span>**

React 组件生命周期主要分为**挂载、更新和卸载**三个阶段。

1. 挂载阶段

   组件的挂载，主要涉及组件状态的初始化。直接看栗子🌰：

   ```javascript
   import React, { Component } from 'react'
   
   class App extends Component {
     static propTypes = {
       //...
     }
   	
   	static defaultProps = {
       //...
     }
   
   	constructor(props) {
       super(props)
       this.state = {
         //...
       }
     }
   	
   	componentWillMount() {
       //...
     }
   
   	componentDidMount() {
       //...
     }
   
   	render() {
       // return ...
     }
   }
   ```

   其中 propTypes 和 defaultProps 分别代表 props 类型检查和默认类型。

   **componentWillMount 方法会在 render 方法之前执行，而 componentDidMount 方法会在 render 方法之后执行**，分别代表渲染前后的时刻。**在 componentWillMount 中执行 setState 方法，组件会更新 state，但组件只渲染一次（无意义的执行，因为这时候还没有 state 状态，可以直接放在 constructor 中执行）**。在 componentDidMount 中执行 setState 方法，组件会再次更新，不过在初始化过程中就渲染了两次组件并不是一件值得推荐的事情。

2. 卸载阶段

   组件卸载只涉及到一个生命周期方法，就是 componentWillUnmount ，直接上栗子🌰：

   ```javascript
   import React, { Component } from 'react'
   
   class App extends Componet {
     componentWillUnmount() {
       //...
     }
   }
   ```

   在 componentWillUnmount 方法中，常常会执行一些清理方法，包括**事件回收、清除定时器**等等。

3. 更新阶段

   组件更新指的是**父组件向下传递 props 或组件本身执行 setState 方法时发生的一系列更新动作**。涉及的过程直接看栗子🌰：

   ```javascript
   import React, { Component } from 'react'
   
   class App extends Component {
     componentWillReceiveProps(nextProps) {
       // this.setState({})
     }
     
     shouldComponentUpdate(nextProps, nextState) {
       // return true
     }
     
     componentWillUpdate(nextProps, nextState) {
       // ...
     }
     
     componentDidUpdate(prevProps, prevState) {
       // ...
     }
     
     render() {
       // return ...
     }
   }
   ```

   更新过程会分为两种情况，一种是自身 state 更新，一种是父组件更新 props 而导致的更新。

   - 自身 state 更新

     该过程会依次**执行 shouldComponentUpdate、componentWillUpdate、render 和 componentDidUpdate 生命周期方法**。

     shouldComponentUpdate 是一个特别的方法，接收需要更新的 props 和 state，当方法返回 false 时，组件就不会向下执行生命周期方法，便于组件渲染优化。默认是返回 true。

     特别注意，**无状态组件是没有生命周期方法的（即无 shouldComponentUpdate）**，意味着渲染该组件时，每次都会重新渲染，因此需要使用 **Recompose 库的 pure 方法（做的就是将无状态组件转换成 class 语法加上 PureRender 后的组件）**，直接上栗子🌰：

     ```javascript
     const MyNewComponent = pure(MyComponent)	// 其中 MyComponent 是无状态组件
     ```

     另外，**不能在 componentWillUpdate 中执行 setState！！**

   - 父组件更新 props 而导致的更新

     该过程会依然执行上一种情况的生命周期方法，只不过在这些生命周期执行前，还会执行一个 componentWillReceiveProps 方法，该方法**会在 props 传入后，渲染之前来初始化更新其组件内部的状态 state**。相当于**让子组件中 props 更新到最新版**，因此在此方法中**调用 setState 是不会二次渲染的**。

   用一张流程图来理清生命周期之间的关系：

   ![生命周期之间的关系](https://raw.githubusercontent.com/Andraw-lin/FE-Knowledge-Summary/master/Know-More-About-React/React生命周期间关系流程图.jpg)

   

   若使用 createClass 的 ES5 语法来构建组件时，生命周期跟使用 ES6 会有不同，区别如下：

   ![Es6和Es5之间react生命周期区别](https://raw.githubusercontent.com/Andraw-lin/FE-Knowledge-Summary/master/Know-More-About-React/Es6和Es5之间react生命周期区别.png)



ES6 classes 中的静态方法用静态关键词 static 声明即可。**mixin 属性被移除，可使用高阶组件（higher-order component）替代**。



---

> **<span id="5">React 与 DOM</span>**

ReactDOM 的关注点在 DOM 上，只适用于 Web 端，因此从 React 库中拆了出来。**在 React 组件开发实现中，不会用到 ReactDOM ，只有在顶层组件以及由于 React 模型所限而不得不操作 DOM 时候，才会用到它**。

1. ReactDOM

   有三个 API ，分别为：findDOMNode、unmountComponentAtNode、render。

   - findDOMNode

     只有在 componentDidMount 和 componentDidUpdate 生命周期方法内，才可以获取到真正的 DOM 元素。findDOMNode 返回该 React 组件实例响应的 DOM 节点，**主要用于获取表单的 value 或者 DOM 的测量问题**。直接上栗子🌰：

     ```javascript
     import React, { Component } from 'react'
     import ReactDOM from 'react-dom'
     
     class App extends Component {
       componentDidMount() {
         // this 为当前组件实例
         const appDom = ReactDOM.findDOMNode(this)
       }
       render() {
         // return
       }
     }
     ```

     findDOMNode **只对已经挂载的组件有效**，**若在 render 中返回 null ，那么 findDOMNode 也会返回 null**。

   - render

     要把 React 渲染的 Virtual DOM 渲染到浏览器的 DOM 中，就需要使用 render 方法。

     ```javascript
     ReactDOM.render(element, container, [callback])
     ```

     当 container 是 DOM 元素或 React 组件时，render 会返回 element 实例（即 refs 引用），当 container 是一个无状态组件时，render 会返回 null。当组件装载完毕时，callback 就会被调用。

   - unmountComponentAtNode

     用于卸载操作，极少使用。

2. refs

   在组件内，JSX 不会返回一个组件的实例，只是一个 ReactElement。而 refs 就是用于附加在任何一个组件上，然后通过`this.refs.xxx`来返回该 React 组件的实例。

   **尽管不是 React 推崇方式，仍然可使用，只是在原则上，组件状态维护中不建议使用这种方式**。

   **当卸载一个组件时，组件里所有的 refs 就会变成 null**。

   同时，findDOMNode 和 refs 都无法用于无状态组件中，原因是，**无状态组件挂载时只是方法调用，没有创建实例**。



---

> **<span id="6">事件系统</span>**

React 基于 Virtual DOM 实现了一个 **SyntheticEvent（合成事件）层**，组件中定义的事件处理器会接收到一个 SyntheticEvent 对象的实例，**与原生的浏览器事件一样拥有同样的接口，同样支持事件的冒泡机制**（即使用 stopPropagation 和 preventDefault 方法来中断）。

在 **JSX** 中，必须使用**驼峰形式来书写事件的属性名**（例如onClick），而 **HTML 事件**则需要使用全部**小写的属性名**（例如onclick）。HTML 属性只能是 Javascript 代码字符串，而在 JSX 中，props 的值则可以是任意类型。

1. 合成事件的绑定方式

   在 React 底层，主要**对合成事件做了两件事情**：**事件委托和自动绑定**。

   - 事件委托

     React 事件代理机制：**并不会把处理函数直接绑定到真实的节点上，而是把所有事件绑定到结构的最外层，使用一个统一的事件监听器。该事件监听器维持了一个映射来保存所有组件内部的事件监听和处理函数。当组件挂载或卸载时，只是在这个统一的事件监听器上插入或删除一些对象。当事件发生时，首先被该统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用，从而简化了事件处理和回收机制，效率得到提升**。

   - 自动绑定

     在使用 ES6 classes 或者纯函数时，无法进行自动绑定 this 为 React 组件本身实例，而需要手动绑定。方法如下：

     + bind 方法

       可用于绑定事件处理器内的 this，并向事件处理器中传递参数，直接上栗子🌰：

       ```javascript
       render() {
         return (
         	<button onClick={ this.handleClick.bind(this, 'test') }>Test</button>
         )
       }
       ```

       若方法只用于绑定，不传参，可用 stage0 草案中提供的便捷方案——双冒号语法，如下：

       ```javascript
       render() {
         return (
         	<button onClick={ ::this.handleClick }>Test</button>
         )
       }
       ```

     + 构造函数声明

       在组件的构造函数内完成的 this 的绑定，好处就是在于仅需要进行一次绑定，而不需要每次调用事件监听时去执行绑定操作。如下🌰：

       ```javascript
       constructor(props) {
         super(props)
         this.handleClick = this.handleClick.bind(this)
       }
       ```

     + 箭头函数

       箭头函数不仅是函数的语法糖，还自动绑定了定义此函数作用域的 this。如下🌰：

       ```javascript
       const handleClick = () => {}
       render() {
         <button onClick={ this.handleClick }>Test</button>
       }
       
       // 相当于
       handleClick() {}
       render() {
         <button onClick={ () => {this.handleClick} }>Test</button>
       }
       ```

2. React 中使用原生事件

   componentDidMount 会在组件已经完成安装并且浏览器中存在真实的 DOM 后调用，此时可完成原生事件的绑定。如下栗子🌰：

   ```javascript
   componentDidMount() {
     this.refs.button.addEventListener('click', e => {
       this.handleClick(e)
     })
   }
   ```

   **在 React 中使用 DOM 原生事件时，一定要在组件卸载时手动移除，否则可能会出现内存泄漏的问题**。使用合成事件系统时则不需要，React 内部会帮我们妥善处理。

3. 合成事件与原生事件混用

   React 合成事件系统的委托机制，在合成事件内部仅仅对最外层的容器进行了绑定，并且依赖事件的冒泡机制完成委派（所以才需要手动绑定 this 为本组件实例）。因此在原生事件点击后，若想阻止，在合成事件中使用 e.stopPropagation() 是无法进行中断原生事件冒泡的，解决方案如下：

   - 不要将合成事件与原生事件混用

     ```javascript
     componentDidMount() {
       document.body.addEventListener('click', e => { ... })
       document.querySelector('.app').addEventListener('click', e => {
         e.stopPropagation()
       })
     }
     ```

     通过原生事件进行中断。

   - 通过 e.target 判断来避免

     ```javascript
     componentDidMount() {
       document.body.addEventListener('click', e => {
         if (e.target && e.target.matches('.app')) {
           return;
         }
         // ...
       })
     }
     ```

   尽量避免在 React 中混用合成事件和原生 DOM 事件。另外，用 reactEvent.nativeEvent.stopPropagation() （即合成事件）来阻止冒泡是不行的。**阻止 React 事件冒泡的行为只能用于 React 合成事件系统中，而无法阻止原生事件的冒泡**。**在原生事件中的阻止冒泡行为，却可以阻止 React 合成事件的传播**。

   因此，**React 的合成事件系统只是原生 DOM 事件系统的一个子集**。

4. 对比 React 合成事件与 Javascript 原生事件

   - 事件传播与阻止事件传播

     浏览器的原生 DOM 事件传播可分为 3 个阶段：**事件捕获阶段、目标对象本身的事件处理程序调用、事件冒泡阶段**。

     React 的合成事件仅仅支持事件冒泡机制。

     阻止原生事件和合成事件的冒泡都需使用 e.preventDefault() 方法。

   - 事件类型

     React 合成事件的事件类型是 Javascript 原生事件类型的一个子集。

   - 事件绑定方式

     绑定原生事件的方式有很多种，具体如下：

     + 直接在 DOM 元素中绑定

       ```javascript
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

     

---

> **<span id="7">表单处理</span>**

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



---

> **<span id="8">样式处理</span>**

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

   ```javascript
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

     ```javascript
     // CSS Module
     <div className={indexStyle['test']}></div>
     
     // react css module
     <div styleName={global-css} ></div>
     ```

   - 当 styleName 关联了一个 undefined CSS Module 时，react-css-module 会发出一个警告；



---

> **<span id="9">组件间通信</span>**

React 中组件的通信主要有以下情况：**父组件向子组件通信、子组件向父组件通信、跨级组件间通信、没有嵌套关系的组件间通信**。

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

     ```javascript
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

   跨级组件间的通信，可以使用 Props 传递的方式来实现，但会有一个问题，就是当组件间跨级数很多时，Props 传递到那些不需要该属性的中间组件时，未免过于浪费，而且不好管理。因此，**在 React 中，提供了 context 来实现跨级父子组件间的通信**。直接上栗子🌰：

   ```javascript
   // Parent.js
   static childContextType = {
     text: PropTypes.string
   }
   getChildContext() {
     return {
       text: 'Parent'
     }
   }
   
   // Child.js
   static contextType = {
     text: PropTypes.string
   }
   render() {
     return (
     	<span>{ this.context.text }</span>
     ) 
   }
   ```

   **实现一个 context 通信，父组件需要定义静态属性 childContextType 和 方法 getChildContext，而子组件则需要定义静态属性 contextType** 。

   在 React 官方文档里并不推荐大量使用 context ，尽管它**可以有效滴减少逐层传递，但当组件结构复杂时，出现 bug 时候，我们是很难滴找出 context 是从哪传过来的**（而应该尽量使用高阶组件进行实现）。

   context 最好的应用场景就是，**全局信息且不会更改，例如界面主题、用户信息等等**。

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



---

> **<span id="10">高阶组件</span>**

高阶组件（higher-order component，简称HOC），类似于高阶函数，接受 React 组件作为输入，输出一个新的 React 组件。

高阶组件主要分为两种类型，分别是：**属性代理和反向继承**。

1. 属性代理

   使用属性代理构建高阶组件时，调用顺序不同于 mixin，执行生命周期过程类似于堆栈调用：

   **didmount --> HOC didmount --> (HOCs didmount) --> (HOCs will unmount) --> HOC will unmount --> unmount**

   属性代理主要分为以下功能：控制 props、通过 refs 使用引用、抽象 state、使用其他元素包裹装饰。

2. 反向继承

   因为依赖于继承的机制，HOC 的调用顺序和队列一样的：

   **didmount --> HOC didmount --> (HOCs didmount) --> will unmount --> HOC will unmount --> (HOCs will unmount)**

   在反向继承中，高阶组件可以使用传递进来的组件 Mycomponent 参数引用，意味着可使用 Mycomponent 的 state、props、生命周期和 render 方法。但是有一点很重要的就是，它不能保证完整的子组件树被解析。

   **反向继承不能保证完整的子组件树被解析的意思的解析的元素树中包含了组件(函数类型或者Class类型)，就不能再操作组件的子组件了，这就是所谓的不能完全解析**。



---

> **<span id="11">组件性能优化</span>**

影响网页性能最大的因素就是浏览器的重绘（reflow）和重排（repaint）。而 Virtual DOM 就是尽可能地减少浏览器的重绘和重排。

1. 纯函数

   关于纯函数，最主要关注三点：给**定相同的输入，总是返回相同的输出、过程无副作用、没有额外的状态依赖**。

   - 给定定相同的输入，总是返回相同的输出

     所谓给定相同的输入，总是返回相同的输出（即相同的参数输入后，总是返回一样的值）好比如：

     ```javascript
     // 纯函数
     function sum(a, b) {
     	return a + b
     }
     sum(1, 2)	// 3
     sum(1, 2) // 3
     sum(1, 2) // 3
     
     // 非纯函数
     Math.random() // 1
     Math.random() // 3
     ```

     当然，会出现不同的输入会返回相同的输出，这也属于纯函数，例如：

     ```javascript
     function compare(a, b) {
       return a > b
     }
     compare(1, 2) // true
     compare(2, 3) // true
     ```

   - 过程无副作用

     传递进来的参数，经过方法执行后，是不会改变其本身的。举个栗子：

     ```javascript
     var arr = [1, 2, 3]
     var newArr = arr.map(item => item + 2)
     console.log(arr) // [1, 2, 3]
     console.log(newArr) // [3, 4, 5]
     ```

   - 无额外的状态依赖

     **不能在纯函数中使用共享变量（即外部的全局变量）**。

2. PureRender

   PureRender 中的 Pure 指的是组件满足纯函数条件（即组件的渲染是相同的 props 和 state 渲染进而得到相同的结果，也符合了纯函数的给定相同的输入，总是返回相同的输出）。

   react-addons-pure-render-mixin 插件，原理就是**重新实现了 shouldComponentUpdate 生命周期方法，让当前传入的 props 和 state 与之前的作浅比较**，如果返回 false，那么组件就不会执行 render 方法。

   接下来运用 PureRender 栗子：

   ```javascript
   import PureRenderMixin from 'react-addons-pure-render-mixin'
   
   constructor(props) {
     super(props)
     this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
   }
   ```

   当然，若你想使用 decorator 装饰器来实现的话，同样有一个库是实现了的，那就是 pure-render-decorator。

   由于 PureRender 实现的是浅比较，这是因为深比较是一个相当昂贵的方式。当出现以下情况时，都会触发 PureRender 为 true。

   - 直接在元素上为 props 设置为对象或数组

     由于传入的对象或数组值没有改变时，但它们的引用地址已经改变，就会触发 PureRender 为 true。直接上栗子：

     ```javascript
     // 触发 PureRender 为 true 的情况
     <Account style={{ color: 'black' }} />
     
     // 需使用外部定义常量来解决
     const myStyle = { color: 'black' }
     <Account style={myStyle}>
     ```

     当使用外部常量来编写时，每次的重新渲染时 myStyle 都是指向了同一个地址，因此不会重新渲染。

   - 在元素上直接进行事件的绑定

     同上一个栗子一样，如果方法的绑定直接放到元素上，就会在每次渲染时都会触发。直接上栗子：

     ```javascript
     // 触发 PureRender 为 true 的情况
     <Account onChange{(e) => this.handleClick(e)} />
     
     // 解决方法就是在构造函数中进行绑定
     constructor() {
       super(...arguments)
       this.handleClick = this.handleClick.bind(this)
     }
     render() {
       retrun(
       	<Account onChange={this.handleClick} />
       )
     }
     ```

   - 设置子组件

     在 React 组件中（即自定义组件）设置子组件时，每次调用 shouldComponentUpdate 时都会返回 true。直接看栗子找原因：

     ```javascript
     // 设置子组件的 React 组件，每次调用 shouldComponentUpdate 时都会返回 true
     render() {
       return (
       	<Account>
         	<span>account</span>
         <Account/>
       )
     }
     
     // 每次重新渲染时，就会转化如下
     <Account children={React.createElement('span', {}, 'account')} />
     ```

     可以看到，每次重新渲染都会调用了 React.createElement 方法。为此，处理方案就是使用 react-addons-pure-render-mixin 插件。

     ```javascript
     // 对父组件的 shouldComponentUpdate 生命周期进行绑定如下
     constructor(props) {
       super(props)
       this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
     }
     ```



---





































