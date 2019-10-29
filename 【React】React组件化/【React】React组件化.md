# 引言
***
此篇文章主要涉及以下内容：
1. `react`组件化
2. 容器组件 VS 展示组件
3. 高阶组件
4. `PureComponent`
5. `render props`
6. 异步渲染组件
7. 函数化组件`Hooks`
# 学习资源
***
- [antd](https://ant.design/docs/react/use-with-create-react-app-cn)
# 组件
***
`React`没有`Vue`那么多`api`，基本全部都是组件，`react`的开发模式，大体可以用一个公式表达
> UI=F(state)
# 试用ant-design组件库
***
安装：`npm i antd -S`
试用`button`
```
import React,{Component} from 'react'
import Button from 'antd/lib/button'
import 'antd/dist/antd.css'

class App extends Component{
  render(){
    return (
      <div className='App'>
        <Button type='primary'>Button</Button>
      </div>
    )
  }
}

export default App
```
# 配置按需加载
***
安装`react-app-rewired`取代 `react-scripts`，可以扩展`webpack`的配置，类似`vue.config.js`
```
npm i react-app-rewired@2.0.2-next.0 babel-plugin-import --save
```
```
// config-overrides.js  根目录
const { injectBabelPlugin } = require("react-app-rewired");
module.exports = function override(config, env) {
  config = injectBabelPlugin(
    // 在默认配置基础上注入
    // 插件名，插件配置
    ["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }],
    config
  );

  return config;
};
```
# 容器组件 VS 展示组件
***
基本原则：容器组件负责数据获取，展示组件负责根据`props`显示信息
优势：
1. 如何工作和如何展示分离
2. 重用性高
3. 更高的可用性
4. 更易于测试
```
import React, { Component } from "react";
// 容器组件
export default class CommentList extends Component {
 constructor(props) {
  super(props);
  this.state = {
   comments: []
 };
}
 componentDidMount() {
  setTimeout(() => {
   this.setState({
    comments: [
    { body: "react is very good", author: "facebook" },
    { body: "vue is very good", author: "youyuxi" }
   ]
  });
 }, 1000);
}
 render() {
  return (
   <div>
   {this.state.comments.map((c, i) => (
     <Comment key={i} data={c} />
   ))}
   </div>
 );
}
}
// 展示组件
function Comment({ data }) {
 return (
  <div>
   <p>{data.body}</p>
   <p> --- {data.author}</p>
  </div>
);
}
```
# PureComponent
代码尽量写成展示组件，使用`PureComponent`。
定制了`shouldComponentUpdate`后的`Component`(浅比较）。
```
class Comp extends React.PureComponent{

}
```
缺点是必须要用`class`形式，只能传值类型的数据，或者引用地址不能改变，因为内部只会做一个浅比较。
```
import shallowEqual from './shallowEqual'
import Component from './Component'

export default function PureComponent(props, context) {
  Component.call(this, props, context)
}

PureComponent.prototype = Object.create(Component.prototype)
PureComponent.prototype.constructor = PureComponent
PureComponent.prototype.isPureReactComponent = true
PureComponent.prototype.shouldComponentUpdate = shallowCompare

function shallowCompare(nextProps, nextState) {
  return (
    !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  )
}
```
```
export default function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true
  }
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }
  var keysA = Object.keys(objA)
  var keyB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }
  // test for A's keys different from b
  for (var i = 0; i < keys.length; i++) {
    if (!objB.hasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false
    }
  }
  return true
}
```
# React.memo
***
`react v16.6.0`之后的版本，可以使用`React.memo`让函数式的组件也有`PureComponent`的功能
```
// memo高阶组件
const Joke = React.memo(() => {
  <div>
    {this.props.value || 'loading...'}
  </div>
));
```
# 高阶组件
***
在`React`里就有了`HOC(Higher-Order Components)`的概念
高阶组件也是一个组件，但是他返回另外一个组件，产生新的组件可以对属性进行包装，甚至重写部分生命周期
```
const withKai = (Component) => {
  const NewComponent = (props) => {
    return <Component {...props} name="这是高阶组件" />;
  };
  return NewComponent;
};
```
上面的`withKai`组件，其实就是代理了`Component`，只是多传递了一个`name`参数
# 高阶链式调用
***
高阶组件最巧妙的一点，是可以链式调用。
但是这种写法会比较累赘，推荐使用装饰器的写法。
```
import React, { Component } from 'react'
import { Button } from 'antd'

const withKai = Component => {
  const NewComponent = props => {
    return <Component {...props} name="高阶组价" />
  }
  return NewComponent
}

const withLog = Component => {
  class NewComponent extends React.component {
    render() {
      return <Component {...this.props} />
    }
    componentDidMount() {
      console.log('didMount', this.props)
    }
  }
  return NewComponent
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h2>hi,{this.props.name}</h2>
        <Button type="primary"></Button>
      </div>
    )
  }
}

export default withKai(withLog(App))
```
# 高阶组件装饰器写法
***
`ES7`装饰器可用于简化高阶组件写法
```
npm i --save-dev babel-plugin-transform-decorators-legacy
```
安装插件，更改配置
```
const { injectBabelPlugin } = require("react-app-rewired");
module.exports = function override(config, env) {
  config = injectBabelPlugin(
    // 在默认配置基础上注入
    // 插件名，插件配置
    ["import", { libraryName: "antd", libraryDirectory: "es", style: "css" }],
    config
  );

  config = injectBabelPlugin(
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    config
  );

  return config;
};
```
使用装饰器
```
import React, { Component } from 'react'
import { Button } from 'antd'

const withKai = Component => {
  const NewComponent = props => {
    return <Component {...props} name="高阶组价" />
  }
  return NewComponent
}

const withLog = Component => {
  class NewComponent extends React.component {
    render() {
      return <Component {...this.props} />
    }
    componentDidMount() {
      console.log('didMount', this.props)
    }
  }
  return NewComponent
}

@withKai
@withLog
class App extends Component {
  render() {
    return (
      <div className="App">
        <h2>hi,{this.props.name}</h2>
        <Button type="primary"></Button>
      </div>
    )
  }
}

export default App
```
# 组件复合-Composition
复合组件给与你足够的敏捷去定义自定义组件的外观和行为，而且是以一种明确和安全的方式进行。如果组件间有公用的非`UI`逻辑，将他们抽取为`JS`模块导入使用而不是继承它。
等同于`vue`中的`slot`
```
// Dialog作为容器不关心内容和逻辑
// props.footer就相当于是具名插槽，props.children相当于匿名插槽
// children是固定的（取决于使用者传进来的是什么）
function Dialog(props){
  return <div style={{border:'4px solid blue'}}>
              {props.children}  
              <div className='footer'>
                {props.footer}
            </div>
}
// WelcomeDialog通过复合提供内容
function WelcomeDialog(props){
  return (
    <Dialog {...props}>
      <h1>你好</h1>
      <p>嘿嘿...</p>
    </Dialog>
  )
}

const Api = {
 getUser(){
    return {name:'jerry',age:20}
  } 
}

function Fetcher(props){
  const user = Api[props.name]()
  return pops.children(user)  // 这里的children是一个函数
}

// 过滤器组件
function Filter({children,type}){
  return (
    <div>
      {React.Children.map(children,child => {
        if(child.type !== type){
          return;
        }
          return child;
      })}
  )
}

// 修改children
function RadioGroup(props){
  return (
    <div>
      {React.Children.map(props.children,child=>{
        // 返回东西叫做虚拟dom，是不可更改的，若要更改的话，需克隆一个新的进行更改
        React.cloneElement(child,{name:props.name})
      })}
    </div>
  )
}
function Radio({children,...rest}){
  return (
    <label htmlFor=''>
      <input type='radio' {...props} />
      {children}
    </label>
  )
}
export default function(){
  const footer=<button onClick={()=>alert('确定')}></button>
  return (
    <div>
      <Fetcher name='getUser'>
        {({name,age})=>(
          <p>
            {name}-{age}
          </p>
        )}
      </Fetcher>
    </div>
  )
  {/* <WelcomeDialog footer={footer} />*/}
  {/* 过滤器，可以过滤出指定标签类型 */}
  <Filter type='p'>
    <h1>react</h1>
    <p>vue</p>
  </Filter>
  {/* 修改children */}
  <RadioGroup name='mvvm'>
    <Radio value='vue'>vue</Radio>
    <Radio value='vue'>react</Radio>
    <Radio value='vue'>angular</Radio>
  </RadioGroup>
}
```