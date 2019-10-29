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
