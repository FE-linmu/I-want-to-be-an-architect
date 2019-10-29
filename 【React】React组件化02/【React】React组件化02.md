# 引言
***
此篇文章主要涉及以下内容：
1. 函数化组件`Hook`
2. 上下文的使用
3. 设计并实现一个表单组件
# 学习资源
***
- [Hook](https://zh-hans.reactjs.org/docs/hooks-intro.html)
- [Context](https://zh-hans.reactjs.org/docs/context.html)
# Hook
***
`Hook`是`React 16.8`一个新增项，它可以让你在不编写`class`的情况下使用`state`以及其他的`React`特性。
`Hook`的特点：
- 使你在无需修改组件结构的情况下复用状态逻辑
- 可将组件中相互关联的部分拆分成更小的函数，复杂组件将变得更容易理解
- 更简洁、更易理解的代码
##准备工作
- 升级`react、react-dom`
```
npm i react react-dom -S
```
## 状态钩子-State Hook
- 创建HookTest.js
```
import React, { useState } from 'react'
export default function HooksTest() {
  // useState(initialState),接收初始状态，返回一个状态变量和其更新函数
  const [count, setCount] = useState(0)
  // 多个状态
  const age = useAge();
  const [fruit, setFruit] = useState("banana");
  const [input, setInput] = useState("");
  const [fruits, setFruits] = useState(["apple", "banana"]);
  return (
    <div>
      <p>点击了{count}次</p>
      <button onClick={() => setCount(count + 1)}>点击</button>

      <p>年龄：{age ? age : 'loading...'}</p>
      <p>选择的水果：{fruit}</p>
      <p>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={() => setFruits([...fruits, input])}>新增水果</button>
      </p>
      <ul>
        {fruits.map(f => (
          <li key={f} onClick={() => setFruit(f)}>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
```
## 副作用钩子-Effect Hook
`userEffect`就是一个`Effect Hook`，给函数组件增加了操作副作用的能力。它跟`class`组件中的`componentDidMount、componentDidUpdate`和`componentWillUnmount`具有相同的用途，只不过被合并成了一个`api`。
- 更新HooksTest.js
```
import React, { useState, useEffect } from 'react'
// 副作用钩子会在每次渲染时都执行
// 如果仅打算执行一次，传递第二个参数为[]
//   componentDidMount
useEffect(() => {
  // api调用
  console.log("api调用");
}, []);
useEffect(() => {
  // Update the documnet title using the browser api
  document.title = `点击了${count}次`
})
```
## 自定义钩子-Custom Hook
自定义`Hook`是一个函数，其名称以`use`开头，函数内部可以调用其他的`Hook`。
```
function useAge() {
  const [age, setAge] = useState(0)
  useEffect(() => {
    setTimeout(() => {
      setAge(20)
    }, 2000)
  })
  return age
}

// 使用
const age = useAge()
<p>年龄{age ? age : 'loading...'}</p>
```
## 其他Hook
`useContext`，`useReducer`，`useCallback`，`useMemo`
#组件跨层级通信-Context
***
上下文提供一种不需要每层设置`props`就能跨多级组件传递数据的方式
## Context相关API
- [React.createContext](https://reactjs.org/docs/context.html#reactcreatecontext)
- [Context.Provider](https://reactjs.org/docs/context.html#contextprovider)
- [Class.contextType](https://reactjs.org/docs/context.html#classcontexttype)
- [Context.Consumer](https://reactjs.org/docs/context.html#contextconsumer)
## 基本用法
创建文件contextText.js
- 创建上下文
```
const MyContext = React.createContext();
```
- 提供上下文
```
const { Provider } = MyContext
export default function App() {
  return (
    <div>
      <Provider value={{ foo: 'bar' }}>
        <Child></Child>
      </Provider>
    </div>
  )
}
```
- 消费上下文
```
function Child3(props) {
  return <div>{props.foo}</div>
}

export default function App() {
  return (
    <div>
      <Provider value={{ foo: 'bar' }}>
        <Consumer>{value => <Child2 {...value} />}</Consumer>
      </Provider>
    </div>
  )
}
```
#组件设计与实现
***
## 表单组件实现
```
import React from 'react'
import { Input, Button } from 'antd'
import { log } from 'util'

/* 
  创建一个高阶组件：
    1、扩展现有表单
    2、事件处理
    3、数据收集
    4、校验1
*/
function kFromCreate(Comp) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.options = {}
      this.state = {}
    }
    handleChange = e => {
      const { name, value } = e.target
      console.log(name, value)
      this.setState({ [name]: value }, () => {
        // 确保值发生变化再校验
        this.validateField(name)
      })
    }
    validateField = field => {
      // 1.获取校验规则
      const rules = this.options[field].rules
      // 任意一项失败则返回false
      const ret = !rules.some(rule => {
        if (rule.required) {
          if (!this.state[field]) {
            // 校验失败
            this.setState({
              [field + 'Message']: rule.message
            })
            return true
          }
        }
      })
      if (ret) {
        this.setState({
          [field + 'Message']: ''
        })
      }
      return ret
    }
    // 校验所有字段
    validate = cb => {
      const rets = Object.keys(this.options).map(field =>
        this.validateField(field)
      )
      const ret = rets.every(v => v === true)
      cb(ret, this.state)
    }
    // 创建input包装器
    getFieldDec = (field, option) => {
      // 保存当前输入项配置
      this.options[field] = option
      return InputComp => (
        <div>
          {React.cloneElement(InputComp, {
            name: field,
            value: this.state[field] || '',
            onChange: this.handleChange
          })}
          {/* 校验错误信息 */}
          {this.state[field + 'Message'] && (
            <p style={{ color: 'red' }}>{this.state[field + 'Message']}</p>
          )}
        </div>
      )
    }
    render() {
      return (
        <Comp getFieldDec={this.getFieldDec} validate={this.validate}></Comp>
      )
    }
  }
}

@kFromCreate
class KForm extends React.Component {
  onSubmit = () => {
    console.log('submit')
    // 校验所有项
    this.props.validate((isValid, data) => {
      if (isValid) {
        //提交登录
        console.log('denglu:', data)
        // 后续登录逻辑
      } else {
        alert('校验失败')
      }
    })
  }
  render() {
    const { getFieldDec } = this.props
    return (
      <div>
        {getFieldDec('uname', {
          rules: [{ required: true, message: '用户名必填' }]
        })(<input type="text" />)}
        {getFieldDec('pwd', {
          rules: [{ required: true, message: '密码必填' }]
        })(<input type="password" />)}
        <button onClick={this.onSubmit}> 登录 </button>
      </div>
    )
  }
}
export default KForm
```