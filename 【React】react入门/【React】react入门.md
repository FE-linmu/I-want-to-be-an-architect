# 引言
***
此篇文章主要涉及以下内容：
1. `react`基础语法
2. 官方`create-react-app`脚手架
3. `JSX`语法
4. `setState`
5. `react`生命周期
6. `props`传递参数
7. `react`组件通信
# 学习资源
***
- [react](https://zh-hans.reactjs.org/)
- [create-react-app](https://github.com/facebook/create-react-app)
# 起步
***
## 上手
1. `npm install -g create-react-app`  安装官方脚手架
2. `create-react-app react01`初始化
3. `react`的`api`比较少，基本学一次，就再也不用看文档了，核心就是`js`的功力
4. [demo体验](http://react.shengxinjing.cn/)
## 文件结构
```
|——README.md            文档
|——package-lock.json
|——package.json         npm依赖
|——public               静态资源
|      |——favicon.ico
|      |——index.html      
|      |——manifest.json
|——src                  源码
      |——App.css
      |——App.js         根组件
      |——App.test.js    测试
      |——index.css      全局样式
      |——index.js       入口
      |——logo.svg
      |——serviceWorker.js pwa支持
```
# React和ReactDom
***
 `React`设计之初，就是使用`JSX`来描述`UI`，所以解耦和`dom`操作，`react`只做逻辑层，`reactDom`去渲染实际的`dom`，如果换做移动端，就使用别的渲染库。

删除`src`下面所有代码，新建`index.js`
```
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'

ReactDom.render( < App / > , document.querySelector('#root'))
```
新建`App.js`
```
import React,{Component} from 'react'

export default class App extends Component{
  render(){
    return (
      <div>
        <button>nihao</button>
      </div>
    )
  }
}

export default AppTest
```
## JSX
上面的代码会有一些困惑的地方，首先就是`JSX`语法。
```
ReactDom.render(<App/>,document.querySelector('#root'));
```
看起来就是`js`和`html`的混合体，被称之为`JSX`，实际核心的逻辑完全是`js`实现的。
## JSX实质
`jsx`实质就是`React.createElement`的调用，对比下图：

![](https://upload-images.jianshu.io/upload_images/15424855-eb3efaa669c8db4f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/15424855-f657459c7fd50252.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## class VS 函数组件
如果一个组件只根据`props`渲染页面，没有内部的`state`，我们完全可以用函数组件的形式来实现（`hooks`的到来会改变这个现状）
```
import React from "react";

// 函数类型的组件
export function Welcome1(props) {
  return <div>Welcome1, {props.name}</div>;
}

// 基于类的组件
export class Welcome2 extends React.Component {
  render() {
    return <div>Welcome2, {this.props.name}</div>;
  }
}
```
## props属性传递
```
ReactDOM.render(<App title="react真不错" />, document.querySelector('#root'));
...
<h2>{this.props.title}</h2>
```
## State和setState
在`APP`组件里，我们可以通过{}在`jsx`中渲染变量
```
import React from 'react'

class Test extends React.Component {
  render() {
    const name = 'test'
    return (
      <div>
        <button> {name} </button>{' '}
      </div>
    )
  }
}

export default Test
```
如果数据需要修改，并且同时页面响应变化，我们需要放在`state`中，并且使用`setState`来修改数据
```
```
【注意】：
1. 请不要直接修改状态值
```
this.state.counter+=1
```
2. 批量执行，新值依赖老的值，使用函数式写法。
```
// 会统一进入队列，如果不是函数式写法只会执行一次
this.setState(obj,cb)
this.setState(fn,cb)

this.setState(prevState=>{
  return {
    counter:prevState.counter+1
  }
})
this.setState(prevState=>{
  return {
    counter:prevState.counter+1
  }
})
```
 ## 条件渲染和循环
`React`的`api`不多，条件渲染和循环，都是普通的`js`语法。
```
import React from 'react'

class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'test-name',
      showTitle: true,
      goods: [
        { text: '百万年薪架构师', price: 100, id: 1 },
        { text: 'web全栈架构师', price: 80, id: 2 },
        { text: 'Python爬虫', price: 60, id: 3 }
      ]
    }
    setTimeout(() => {
      this.setState({
        showTitle: false
      })
    }, 2000)
  }
  render() {
    return (
      <div>
            {this.state.showTitle && <h2>{this.props.title}</h2>} 
        <ul>
          {this.state.goods.map((good, i) => {
            return (
              <li key={good.id}>
                     <span>{good.text}</span>
                     <span>{good.price}</span>元      
                <button onClick={() => this.handleClick(i)}>添加购物车</button>
              </li>
            )
          })}
                
        </ul>
           
      </div>
    )
  }
}
```
## 事件监听
`React`中使用`onClick`类似的写法来监听事件，注意`this`绑定问题`react`里严格遵循单向数据流，没有数据双向绑定，所以输入框要设置`value`和`onChange`
```
handleChange(e){
  this.setState({
   name:e.target.value
 })
}
// 写法1 箭头函数自动修正this
<input
  type="text"
  value={this.state.name} 
  onChange={(e)=>this.handleChange(e)}
  />
// 写法2 需要在构造函数里手动绑定this，否则会报错
this.addGood = this.addGood.bind(this);
addGood() {
    this.setState(prevState => {
      return {
        goods: [
          ...prevState.goods,
          {
            id: prevState.goods.length + 1,
            text: prevState.text
          }
        ]
      };
    });
  }
// 写法3
handleChange=(e)=>{
  this.setState({
    name:e.target.value
  })
}
```
## 组件通信
做个小购物车
**所有的处理尽可能在父组件处理，子组件抽为一个无状态组件。**
```
import React, { Component } from "react";

export default class CartSample extends Component {
  //   状态初始化一般放在构造器中
  constructor(props) {
    super(props);

    this.state = {
      goods: [
        { id: 1, text: "web全栈架构师" },
        { id: 2, text: "python全栈架构师" }
      ],
      text: "",
      cart: []
    };

    this.addGood = this.addGood.bind(this);
  }

  //   回调函数声明为箭头函数
  textChange = e => {
    this.setState({ text: e.target.value });
  };

  addGood() {
    this.setState(prevState => {
      return {
        goods: [
          ...prevState.goods,
          {
            id: prevState.goods.length + 1,
            text: prevState.text
          }
        ]
      };
    });
  }

  //   加购函数
  addToCart = good => {
    // 创建新购物车
    const newCart = [...this.state.cart];
    const idx = newCart.findIndex(c => c.id === good.id);
    const item = newCart[idx];
    if (item) {
      newCart.splice(idx, 1, { ...item, count: item.count + 1 });
    } else {
      newCart.push({ ...good, count: 1 });
    }
    // 更新
    this.setState({ cart: newCart });
  };

  //   处理数量更新
  add = good => {
    // 创建新购物车
    const newCart = [...this.state.cart];
    const idx = newCart.findIndex(c => c.id === good.id);
    const item = newCart[idx];
    newCart.splice(idx, 1, { ...item, count: item.count + 1 });

    // 更新
    this.setState({ cart: newCart });
  };

  minus = good => {
    // 创建新购物车
    const newCart = [...this.state.cart];
    const idx = newCart.findIndex(c => c.id === good.id);
    const item = newCart[idx];

    newCart.splice(idx, 1, { ...item, count: item.count - 1 });

    // 更新
    this.setState({ cart: newCart });
  };

  render() {
    //   const title = this.props.title ? <h1>this.props.title</h1> : null;
    return (
      <div>
        {/* 条件渲染 */}
        {this.props.title && <h1>{this.props.title}</h1>}

        {/* 列表渲染 */}
        <div>
          <input
            type="text"
            value={this.state.text}
            onChange={this.textChange}
          />
          <button onClick={this.addGood}>添加商品</button>
        </div>
        <ul>
          {this.state.goods.map(good => (
            <li key={good.id}>
              {good.text}
              <button onClick={() => this.addToCart(good)}>加购</button>
            </li>
          ))}
        </ul>

        {/* 购物车 */}
        <Cart data={this.state.cart} minus={this.minus} add={this.add} />
      </div>
    );
  }
}

function Cart({ data, minus, add }) {
  return (
    <table>
      <tbody>
        {data.map(d => (
          <tr key={d.id}>
            <td>{d.text}</td>
            <td>
              <button onClick={() => minus(d)}>-</button>
              {d.count}
              <button onClick={() => add(d)}>+</button>
            </td>
            {/* <td>{d.price*d.count}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```
## 大名鼎鼎的虚拟DOM
浏览器渲染图
![](https://upload-images.jianshu.io/upload_images/15424855-6f7bbb2ae861bc1f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`dom`操作成本实在是太高，所以才有了在`js`里模拟和对比，`JSX`里使用`react.createElement`构架虚拟`dom`，每次有修改，先对比`js`里的虚拟`dom`树
![](https://upload-images.jianshu.io/upload_images/15424855-77c2f2c8b02ac05e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## 生命周期
`React V16.3`之前的生命周期
![](https://upload-images.jianshu.io/upload_images/15424855-078452894873da28.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
```
import React, { Component } from "react";
export default class Lifecycle extends Component {
  constructor(props) {
    super(props);
    // 常用于初始化状态
    console.log("1.组件构造函数执行");
  }
  componentWillMount() {
    // 此时可以访问状态和属性，可进行api调用等
    console.log("2.组件将要挂载");
  }
  componentDidMount() {
    // 组件已挂载，可进行状态更新操作
    console.log("3.组件已挂载");
  }
  componentWillReceiveProps() {
    // 父组件传递的属性有变化，做相应响应
    console.log("4.将要接收属性传递");
  }
  shouldComponentUpdate() {
    // 组件是否需要更新，需要返回布尔值结果，优化点
    // 可以拿到props、state，当props或者state没有更新时，return false做优化
    console.log("5.组件是否需要更新？");
    return true;
  }
  componentWillUpdate() {
    // 组件将要更新，可做更新统计
    console.log("6.组件将要更新");
  }
  componentDidUpdate() {
    // 组件更新
    console.log("7.组件已更新");
  }
  componentWillUnmount() {
    // 组件将要卸载, 可做清理工作
    console.log("8.组件将要卸载");
  }
  render() {
    console.log("组件渲染");
    return <div>生命周期探究</div>;
  }
}
```
激活更新阶段：App.js
```
import Lifecycle from "./【React】react入门1/react01/src/components/Lifecycle";

class App extends Component{
  state={prop:'some content'};
  componentDidMount(){
    this.setState({props:'new Content'});
  }
  render(){
    return (
      <div>
        <Lifecycle prop={this.state.prop}></Lifecycle>
      </div>
    )
  }
}
```
激活卸载阶段，App.js
```
import Lifecycle from './【React】react入门1/react01/src/components/Lifecycle'

class App extends Component {
  state = { prop: 'some content' }
  componentDidMount() {
    this.setState({ props: 'new Content' })
    setTimeout(() => {
      this.setState({ prop: '' })
    }, 2000)
  }
  render() {
    return (
      <div>
        {this.state.prop && <Lifecycle prop={this.state.prop}></Lifecycle>}
      </div>
    )
  }
}
``` 
## React v16.4的生命周期
![](https://upload-images.jianshu.io/upload_images/15424855-90681c750cab3534.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## 变更缘由
原来（ `React v16.0`之前）的生命周期在`React v16`推出的`Fiber`之后就不合适了，因为如果要开启`async rendering`，在`render`函数之前的所有函数，都有可能被执行多次。
原来（`React v16.0`前）的生命周期有哪些是在`render`前执行的呢？
- componentWillMount
- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate

如果开发者开了`async rendering`，而且又在以上这些`render`前执行的生命周期方法做`AJAX`请求的话，那`AJAX`将被无谓的多次调用。明显不是我们期望的结果，而且在`componentWillMount`里发起`AJAX`，不管多快得到结果也赶不上首次`render`，而且`componentWillMount`在服务器端渲染也会被调用到（当然，也许这是预期的结果），这样的`IO`操作放在`componentDidMount`里更合适。
禁止不能用比劝导开发者不要这样用的效果更好，所以除了`shouldComponentUpdate`，其他在`render`函数之前的所有函数（`componentWillMount,componentWillReceiveProps,componentWillUpdate`）都被`getDerivedStateFromProps`替代。
也就是用一个静态函数`getDerivedStateFromProps`来取代被`deprecate`的几个生命周期函数，就是强制开发者在`render`之前只做无副作用的操作，而且能做的操作局限在根据`props`和`state`决定新的`state`。
`React v16.0`刚推出的时候，是增加了一个`componentDidCatch`生命周期函数，这只是一个增量式修改，完全不影响原有生命周期函数；但是，到了`React v16.3`，大改动来了，引入了两个新的生命周期函数。
## 新引入了两个新的生命周期函数：getDerivedStateFromProps，getSnapshotBeforeUpdate
### getDerivedStateFromProps
`static getDerivedStateFromProps(props, state)`在组件创建时和更新时的render方法之前调用，它应该返回一个对象来更新状态，或者返回null来不更新任何内容。
### getSnapshotBeforeUpdate
`getSnapshotBeforeUpdate()` 被调用于`render`之后，可以读取但无法使用`DOM`的时候。它使您的组件可以在可能更改之前从`DOM`捕获一些信息（例如滚动位置）。此生命周期返回的任何值都将作为参数传递给`componentDidUpdate（）`。
官网给的例子：
```
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    //我们是否要添加新的 items 到列表?
    // 捕捉滚动位置，以便我们可以稍后调整滚动.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //如果我们有snapshot值, 我们已经添加了 新的items.
    // 调整滚动以至于这些新的items 不会将旧items推出视图。
    // (这边的snapshot是 getSnapshotBeforeUpdate方法的返回值)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```