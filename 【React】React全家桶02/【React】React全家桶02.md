# 引言
***
此篇文章主要涉及以下内容：
1. `redux`、`react-redux`、`redux-thunk`原理
2. `umi`
3. `redux`解决方案--`dva`
4. `generator`
5. `redux-saga`
# 学习资源
***
1. [umi](https://umijs.org/zh/)
2. [dva](https://dvajs.com/)
3. [redux-saga](https://redux-saga-in-chinese.js.org/)
4. [generator](https://www.liaoxuefeng.com/wiki/1022910821149312/1023024381818112)
#原理
***
## redux原理
```
// enhancer强化器
export function createStore(reducer, enhancer) {
  if (enhancer) {
    return enhancer(createStore)(reduce)
  }
  let currentState = {}
  let currentListeners = []

  function getState() {
    return currentState
  }
  function subscribe(listener) {
    currentListeners.push(listener)
  }
  function dispatch(action) {
    currentState = reducer(currentState, action)
    currentListeners.forEach(v => v())
    return action
  }
  dispatch({ type: '@IMOOC/WONIU-REDUX' })
  return { getState, subscribe, dispatch }
}

export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch
    const midApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    const middlewareChain = middlewares.map(middleware => middleware(midApi))
    dispatch = compose(...middlewareChain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((ret, item) => (...args) => ret(item(...args)))
}
function bindActionCreator(creator, dispatch) {
  return (...args) => dispatch(creator(...args))
}
export function bindActionCreators(creators, dispatch) {
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = bindActionCreator(creators[item], dispatch)
    return ret
  }, {})
}
```
##react-redux原理
```
import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from './woniu-redux'

export const connect =
  (mapStateToProps = state => state), (mapDispatchToProps = {})=>(WrapComponent)=>{
    return class ConnectComponent extends React.Component{
      static contextTypes={
        store:PropTypes.object
      }
      constructor(props,context){
        super(props,context)
        this.state={
          props:{}
        }
      }
      componentDidMount(){
        const {store} = this.context
        store.subscribe(()=>this.update())
        this.update()
      }
      update(){
        const {store}=this.context
        const stateProps=mapStateToProps(store.getState())
        const dispatchProps=bindActionCreators(mapDispatchToProps,store.dispatch)
        this.setState({
          props:{
            ...this.state.props,
            ...stateProps,
            ...dispatchProps
          }
        })
      }
      render(){
        return <WrapComponent {...this.state.props}></WrapComponent>
      }
    }
  }
 
  export class Provider extends React.Component{
    static childContextTypes={
      store:PropTypes.object
    }
    getChildContext(){
      return {store:this.store}
    }
    constructor(props,context){
      super(props,context)
      this.store=props.store
    }
    render(){
      return this.props.children
    }
  }
```
## redux-thunk原理
> 当异步特别麻烦时，thunk不足以支持，推荐使用redux-saga
```
const thunk = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }
  return next(action)
}
export default thunk
```
# redux-saga使用
***
- 概念：`redux-saga`使副作用（数据获取、浏览器缓存获取）易于管理、执行、测试和失败处理
- 地址：https://github.com/redux-saga/redux-saga
- 安装：`npm i --save redux-saga`
- 使用：用户登录
1. 创建一个./store/sagas.js处理用户登录请求
```
import { call, put, takeEvery } from "redux-saga/effects";

// 模拟登录
const UserService = {
  login(uname) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (uname === "Jerry") {
          resolve({ id: 1, name: "Jerry", age: 20 });
        } else {
          reject("用户名或密码错误");
        }
      }, 1000);
    });
  }
};

// worker Saga
function* login(action) {
  try {
    yield put({ type: "requestLogin" });
    const result = yield call(UserService.login, action.uname);
    yield put({ type: "loginSuccess", result });
  } catch (message) {
    yield put({ type: "loginFailure", message });
  }
}

function* mySaga() {
  // 提前拦截到action，takeEvery是中间件的作用，工作中会拆出来
  yield takeEvery("login", login);
}

export default mySaga;
```
2. 修改user.redux.js
```
export const user = (
  state = { isLogin: false, loading: false, error: "" },
  action
) => {
  switch (action.type) {
    case "requestLogin":
      return { isLogin: false, loading: true, error: "" };
    case "loginSuccess":
      return { isLogin: true, loading: false, error: "" };
    case "loginFailure":
      return { isLogin: false, loading: false, error: action.message };
    default:
      return state;
  }
};
export function login(uname) {
  return { type: "login", uname };
}
// export function login() {
//   return dispatch => {
//     dispatch({ type: "requestLogin" });
//     setTimeout(() => {
//       dispatch({ type: "login" });
//     }, 2000);
//   };
// }
```
3. 注册`redux-saga`，./store/index.js
```
import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import { counterReducer } from "./count.redux";
import { user } from "./user.redux";
import createSagaMiddleware from "redux-saga";
import mySaga from "./sagas";

// 1.创建saga中间件并注册
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({ user }),
  applyMiddleware(logger, sagaMiddleware)
);
// 2.中间件运行saga
sagaMiddleware.run(mySaga);
export default store;
```
4. 使用状态，RouteSample.js
```
// 登录组件
const Login = connect(
  state => ({
    isLogin: state.user.isLogin,
    loading: state.user.loading,
    error: state.user.error // 登录错误信息
  }),
  { login }
)(function({ location, isLogin, login, loading, error }) {
  const redirect = location.state.redirect || "/";
  const [uname, setUname] = useState(""); // 用户名输入状态
  if (isLogin) {
    return <Redirect to={redirect} />;
  }

  return (
    <div>
      <p>用户登录</p>
      <hr />
      {/* 登录错误信息展示 */}
      {error && <p>{error}</p>}
      {/* 输入用户名 */}
      <input
        type="text"
        onChange={e => setUname(e.target.value)}
        value={uname}
      />
      <button onClick={() => login(uname)} disabled={loading}>
        {loading ? "登录中..." : "登录"}
      </button>
    </div>
  );
});
```
> redux-saga基于generator实现，使用前搞清楚generator相当重要
# Generator
***
## es6的Generator
`function*` 这种声明方式（`function`关键字后跟一个星号）会定义一个**生成器函数**(`generator function`)，它返回一个`Generator`对象。
```
// 定义生成器函数
function* g() {
  yield 'a'
  yield 'b'
  yield 'c'
  return 'ending'
}
// 返回generator对象
console.log(g()) // g{<suspended>}
console.log(g().toString()) // [object Generator]
```
**生成器函数**在执行时能暂停，后面又能从暂停处继续执行：
```
function* g() {
  yield 'a'
  yield 'b'
  yield 'c'
  return 'ending'
}
var gen = g()
console.log(gen.next()) // {value: "a", done: false}
console.log(gen.next()) // {value: "b", done: false}
console.log(gen.next()) // {value: "c", done: false}
console.log(gen.next()) // {value: "ending", done: true}
```
利用递归执行生成器中所有步骤
```
function next(){
    let { value, done } = gen.next()
    console.log(value) // 依次打印输出 a b c end
    if(!done) next() // 直到全部完成
}
next()
```
通过next（）传值
```
function* say() {
    let a = yield '1'
    console.log(a)
    let b = yield '2'
    console.log(b)
}

let it = say() // 返回迭代器

// 输出 { value: '1', done: false }
// a的值并非该返回值，而是下次next参数
console.log(it.next()) 
// 输出'我是被传进来的1'
// 输出{ value: '2', done: false }
console.log(it.next('我是被传进来的1'))

// 输出'我是被传进来的2'
// 输出{ value: undefined, done: true }
console.log(it.next('我是被传进来的2'))
```
结合promise使用
```
// 使用Generator顺序执行两次异步操作
function* r(num) {
  const r1 = yield compute(num);
  yield compute(r1);
}

// compute为异步操作，结合Promise使用可以轻松实现异步操作队列
function compute(num) {
  return new Promise(resolve => {
    setTimeout(() => {
      const ret = num * num;
      console.log(ret); // 输出处理结果
      resolve(ret); // 操作成功
    }, 1000);
  });
}

// 不使用递归函数调用
let it = r(2);
it.next().value.then(num => it.next(num));

// 修改为可处理Promise的next
function next(data) {
  let { value, done } = it.next(data); // 启动
  if (!done) {
    value.then(num => {
      next(num);
    });
  }
}
```
next();
#umi
***
![](https://upload-images.jianshu.io/upload_images/15424855-26edbddb52adb455.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/15424855-75588e42b63d81b8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## dva
![](https://upload-images.jianshu.io/upload_images/15424855-abb6ae997e51523b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## dva+umi的约定
1. `src`源码
- pages页面
- components组件
- layout布局
- model
2. config配置
3. mock数据模拟
4. test测试等
## umi基本使用
###项目骨架
```
npm init
npm i umi -D
```
###新建index页
```
umi g page index
umi g page about
```
###起服务看效果
```
umi dev
```
### 动态路由：以$开头的文件或目录
```
// 创建users/$id.js,内容和其他页面相同，显示一下传参
export default function(props){
  return (
    <div>
      <h1>user id:{props.match.params.id}</h1>
    </div>
  )
}
```
###嵌套路由
```
// 创建父组件 umi g page users/_layout
export default function(props) {
 return (
  <div>
   <h1>Page _layout</h1>
   <div>{props.children}</div>
  </div>
)
}
// 创建兄弟组件 umi g page users/inde
```
###页面跳转
```
// 用户列表跳转至用户详情页, users/index.js
import Link from "umi/link";
import router from "umi/router";
export default function() {
 // 模拟数据
 const users = [{ id: 1, name: "tom" }, { id: 2, name: "jerry" }];
 return (
  <div className={styles.normal}>
   <h1>用户列表</h1>
   <ul>
   {users.map(u => (
     // 声明式
     // <li key={u.id}>
     //  <Link to={`/users/${u.id}`}>{u.name}</Link>
     // </li>
     // 命令式
     <li key={u.id} onClick={()=>router.push(`/users/${u.id}`)}>{u.name}</li>
   ))}
   </ul>
  </div>
);
}
```
###配置式路由
默认路由为声明式，根据pages下面内容自动生成路由，业务复杂后仍需配置路由
```
// 创建config/config.js
export default {
 routes: [
 { path: "/", component: "./index" },
 {
   path: "/users",
   component: "./users/_layout",
   routes: [
   { path: "/users/", component: "./users/index" },
   { path: "/users/:id", component: "./users/$id" }
  ]
 }
]
};
```
###404页面
- 创建404页面：`umi g page NotFound`
- 添加不带path的路由配置项：`{compoennt:'./NotFound'}
###权限路由
- 通过配置路由的`Routes`属性来实现
```
{
  path: "/about",
  component: "./about",
  Routes: ["./routes/PrivateRoute.js"] // 这里相对根目录，文件名后缀不能少
}
```
- 创建./routes/PrivateRoute.js
```
import Redirect from "umi/redirect";
export default props => {
 // 50%概率需要去登录页面
 if (Math.random()>0.5) {
  return <Redirect to="/login" />;
}
 return (
  <div>
   <div>PrivateRoute (routes/PrivateRoute.js)</div>
  {props.children}
  </div>
);
};
```
- 创建登录页面：`umi g page login`，并配置路由：`{path:'/login',component:'./login'}`
```
export default function() {
 return (
  <div className={styles.normal}>
   <h1>Page login</h1>
  </div>
);
}
```
###引入antd
- 添加antd：`npm i antd -S`
- 添加umi-plugin-react：`npm i umi-plugin-react -D`
>Win10有权限错误，通过管理员权限打开vscode

- 修改./config/config.js
```
plugins: [
['umi-plugin-react', {
   antd: true
 }],
],
```
```
import {Button} from 'antd'
export default () => {
 return <div>
<Button>登录</Button>
 </div>
}
```
###引入dva
**软件分层**：回顾`react`，为了让数据流更易于维护，我们分成了`store,reducer,action`等模块，各司其职，软件开发也是一样。
1. `Page`负责与用户直接打交道：渲染页面、接受用户的操作输入，侧重于展示型交互型逻辑。
2. `Model`负责处理业务逻辑，为`Page`做数据、状态的读写、变换、暂存等。
3. `Service`负责与`HTTP`接口对接，进行纯粹的数据读写。
`DVA`是基于`redux、redux-saga和react-router`的轻量级前端框架及最佳实践沉淀，核心`api`如下：
1. `model`
- `state`
- `action`
- `dispatch`
- `reducer`
- `effect`副作用，处理异步
2. `subscriptions`订阅
3. `router`路由
#### 配置dva
```
export default {
 plugins: [
 ['umi-plugin-react', {
   antd: true,
   dva: true,
 }],
],
 // ...
}
```
#### 创建model：维护页面数据状态
- 新建./models/goods.js
```
export default {
 namespace: 'goods', // model的命名空间，区分多个model
 state: [{ title: "web全栈" },{ title: "java架构师" }], // 初始状态
 effects:{}, // 异步操作
 reducers: { // 更新状态 }
}
```
#### 使用状态
- 创建页面goods.js：`umi g page goods`，并配置路由：`{path:'/goods.js',component:'./goods'}`
```
import React, { Component } from "react";
import { Button, Card } from "antd";
import { connect } from "dva";
@connect(
 state => ({
  goodsList: state.goods // 获取指定命名空间的模型状态
}),
{
  addGood: title => ({
   type: "goods/addGood", // action的type需要以命名空间为前缀+reducer名称
   payload: { title }
 })
}
)
class Goods extends Component {
 render() {
  return (
   <div>
   {/* 商品列表 */}
    <div>
    {this.props.goodsList.map(good => {
      return (
       <Card key={good.title}>
        <div>{good.title}</div>
       </Card>
     );
    })}
     <div>
      <Button
       onClick={() =>
        this.props.addGood("商品" + new Date().getTime())
      }
      >
      添加商品
      </Button>
     </div>
    </div>
   </div>
 );
}
}
export default Goods;
```
- 更新模型src/models/goods.js
```
export default {
 reducers: {
  addGood(state, action) {
   return [...state, {title: action.payload.title}];
 }
}
}
```
####数据mock：模拟数据接口
`mock`目录和`src`平级，新建mock/goods.js
```
let data = [
{title:"web全栈"},
{title:"java架构师"}
];
export default {
 'get /api/goods': function (req, res) {
  setTimeout(() => {
   res.json({ result: data })
 }, 250)
},
}
```
####effect处理异步：基于redux-saga，使用generator函数来控制异步流程
- 请求接口，models/goods.js
```
// 首先安装axios
import axios from 'axios';
// api
function getGoods(){
 return axios.get('/api/goods')
}
export default {
 state: [
  // {title:"web全栈"},
  // {title:"java架构师"},
  // {title:"百万年薪"}
],
 effects: { // 副作用操作，action-动作、参数等，saga-接口对象
  *getList(action, {call, put}){   
   const res = yield call(getGoods)
   yield put({ type: 'initGoods', payload: res.data.result })
 }
},
 reducers: {
  initGoods(state,{payload}){
   return payload
 }
}
}
```
- 组件调用，goods.js
```
@connect(
 state => ({...}),
{
  ...,
  getList: () => ({ // 映射getList动作
   type: 'goods/getList'
 })
}
)
class Goods extends Component {
 componentDidMount(){ // 调用getList动作
  this.props.getList();
}
}
```