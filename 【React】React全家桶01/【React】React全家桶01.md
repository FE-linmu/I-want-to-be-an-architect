# 引言
***
此篇文章主要涉及以下内容：
1. `redux`
2. `redux`中间件
3. `react-router4`
# 学习资源
***
- [redux](https://redux.js.org/)
- [react-redux](https://github.com/reduxjs/react-redux)
- [react-router](https://reacttraining.com/react-router/web/guides/quick-start)
# 起步
***
![](https://upload-images.jianshu.io/upload_images/15424855-2263d188b12e4fad.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
#redux上手
***
## 安装
```
npm i redux --save
```
`redux`中首先我们要了解的就是`store`，这就是帮咱们管理数据的政委，具有全局唯一性，所有的数据都在这一个数据源里进行管理，但是本身`redux`和`react`并没有直接的联系，可以单独试用，复杂的项目才需要`redux`来管理数据，简单项目`state+props+context`足矣。
`redux`之所以难上手，是因为上来就有太多的概念需要学习，用一个累加器举例：
1. 需要一个`store`来存储数据
2. `store`里的`state`是放置数据的地方
3. 通过`dispatch`一个`action`来提交对数据的修改
4.   请求提交到`reducer`函数里，根据传入的`action`和`state`，返回新的`state`

有点绕，贴代码
##使用
store.js
```
import { createStore } from 'redux'

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'add':
      return state + 1
    case 'minus':
      return state - 1
    default:
      return state
  }
}

const store = createStore(counterReducer)

export default store
```
##应用
app.js
```
import React from 'react'
import store from './store'
class App extends React.Component{
  render(){
    return <div>
      <p>{store.getState()}</p>
      <div>
        <button onClick={()=>store.dispatch({type:"add"})}>+</button>
        <button onClick={()=>store.dispatch({type:"minus"})}>-</button>
      </div>
    </div>
 }
}
export default App
```
##订阅
index.js
```
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
import store from './store'
const render = ()=>{
 ReactDom.render(
  <App/>,
  document.querySelector('#root')
)
}
render()
store.subscribe(render)
```
#react-redux
***
`react`整合`redux`，简化使用难度，需要`react-redux`的支持
提供了两个`api`
1. `provider`顶级组件，提供数据
2. `connect`高阶组件，提供数据和方法
## 安装
```
npm i react-redux --save
```
##注入store
index.js
```
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
import store from './store'

import { Provider } from 'react-redux'

ReactDom.render(
  // 内部是使用的上下文进行的传值
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)
```
## 使用状态
app.js
```
import React from 'react'
import { connect } from 'react-redux'
const mapStateToProps = state => {
  return {
    num: state
  }
}
const mapDispatchToProps = dispatch => {
  return {
    add: () => dispatch({ type: 'add' }),
    minus: () => dispatch({ type: 'minus' })
  }
}
class App extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.num}</p>
        <div>
          <button onClick={() => this.props.add()}>+</button>
          <button onClick={() => this.props.minus()}>-</button>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
```
##装饰器写法
```
import React from 'react'
import { connect } from 'react-redux'

@connect(
  state => ({ num: state }),
  dispatch => ({
    add: () => dispatch({ type: 'add' }),
    minus: () => dispatch({ type: 'minus' })
  })
)
class App extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.num}</p>
        <div>
          <button onClick={() => this.props.add()}>+</button>
          <button onClick={() => this.props.minus()}>-</button>
        </div>
      </div>
    )
  }
}

export default App
```
##异步
`redux`默认只支持同步，实现异步任务比如延迟，网络请求，需要中间件的支持，比如我们试用最简单的`redux-thunk`和`redux-logger`
```
npm i redux-thunk --save
```
![](https://upload-images.jianshu.io/upload_images/15424855-1b20689e1f919930.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/15424855-1ba70a7bdd869a13.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

1. `Reducer`：纯函数，只承担计算`State`的功能，不适合承担其他功能，也承担不了，因为理论上，纯函数不能进行读写操作。
2. `View`：与`state`一一对应，可以看作`state`的视觉层，也不合适承担其他功能。
3. `Action`：存放数据的对象，即消息的载体，只能被别人操作，自己不能进行任何操作。
4. 实际的`reducer`和`action store`都需要独立拆分文件。
## 试用redux-logger
store.js
```
import {applyMiddleware,createStore} from 'redux'
import logger from 'redux-logger'

const counterReducer = (state=0,action)=>{...}
const store=createStore(counterReducer,applyMiddleware(logger));

export default store
```
## 试用redux-thunk
```
import {applyMiddleware,createStore} from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

const counterReducer = (state=0,action)=>{...}
const store=createStore(counterReducer,applyMiddleware(logger,thunk));

export default store
```
##应用
App.js
```
import React from 'react'
import { connect } from 'react-redux'
@connect(
  state => ({ num: state }),
  {
    add: () => ({ type: 'add' }),
    minus: () => ({ type: 'minus' }),
    asyncAdd: () => dispatch => {
      setTimeout(() => {
        // 实际的异步不在这里写
        // 异步结束后，手动执行dispatch
        dispatch({ type: 'add' })
      }, 1000)
    }
  }
)
class App extends React.Component {
  render() {
    return (
      <div>
           <p>{this.props.num}</p>
        <div>
              <button onClick={() => this.props.add()}>+</button>
              <button onClick={() => this.props.minus()}>-</button>
              <button onClick={() => this.props.asyncAdd()}>延迟添加</button>
        </div>
      </div>
    )
  }
}
export default App
```
> 代码需重构：抽离reducer和action，详情看代码中的store文件夹
#react-router-4
***
##安装
```
npm i --save react-router-dom
```
##应用路由
index.js
```
import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'

import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { counterReducer } from './counter.redux'
import App from './App'

import { BrowserRouter } from 'react-router-dom'

const store = createStore(counterReducer, applyMiddleware(logger, thunk))

ReactDom.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.querySelector('#root')
)
```
##配置、导航
app.js
```
import React from 'react'
import { connect } from 'react-redux'
import { add, minus, asyncAdd } from './counter.redux'
import { Route, Link } from 'react-router-dom'
function About() {
  return <div>About</div>
}
function Detail() {
  return <div>Detail</div>
}
@connect(
  state => ({ num: state }),
  { add, minus, asyncAdd }
)
class Counter extends React.Component {
  render() {
    return (
      <div>
           <p>{this.props.num}</p>
        <div>
              <button onClick={() => this.props.add()}>+</button>
              <button onClick={() => this.props.minus()}>-</button>
              <button onClick={() => this.props.asyncAdd()}>延迟添加</button>
        </div>
      </div>
    )
  }
}
class App extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <Link to="/">累加器</Link> 
          <Link to="/about">About</Link> 
          <Link to="/detail">Detail</Link>
        </ul>
        <div>
          <Route exact path="/" component={Counter} />
          <Route path="/about" component={About} />
          <Route path="/detail" component={Detail} />
        </div>
      </div>
    )
  }
}
export default App
```
## 动态路由
使用`:id`的形式定义参数
```
<Route path="/detail/:id" component={Detail} />
function Detail(props){
 return <div>Detail :{props.match.params.id}</div>
}
```
## 路由守卫
```
// 路由守卫
// 希望用法：<PrivateRoute component={About} path="/about" ...>
const PrivateRoute = connect(state => ({ isLogin: state.user.isLogin }))(
  ({ component: Comp, isLogin, ...rest }) => {
    // 做认证
    // render:根据条件动态渲染组件
    return (
      <Route
        {...rest}
        render={props =>
          isLogin ? (
            <Comp />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { redirect: props.location.pathname }
              }}
            />
          )
        }
      />
    );
  }
);
```
重点看RouteSample.js文件