作业：尝试实现Form（布局、提交）、FormItem（错误信息）、Input（前缀图标）

```
// FormItem组件定义
class FormItem extends Component {
  render() {
    return (
      <div className="formItem">
        {this.props.children}
        {this.props.validateStatus === "error" && (
          <p style={{ color: "green" }}>{this.props.help}</p>
        )}
      </div>
    );
  }
}

// kFormCreate中扩展touch判断、错误获取功能
getFieldDec = (field, option, InputComp) => {
    ...
    {React.cloneElement(InputComp, {
    	onFocus: this.handleFocus
    })}
    ...
};

handleFocus = e => {
    const field = e.target.name;
    this.setState({
        [field + "Focus"]: true
    });
};
isFieldTouched = field => {
    return !!this.state[field + "Focus"];
};

getFieldError = field => {
    return this.state[field + "Message"];
};

render() {
    return (
        <Comp ...
            isFieldTouched={this.isFieldTouched}
            getFieldError={this.getFieldError}
            />
    );
}
// 使用FormItem
render() {
    const { isFieldTouched, getFieldError } = this.props;
    const unameError = isFieldTouched("uname") && getFieldError("uname");
    return (
      <div>
        <FormItem
          validateStatus={unameError ? "error" : ""}
          help={unameError || ""}>
         ...
        </FormItem>
      </div>
    );
  }

// KInput实现
class KInput extends Component {
  render() {
    const {name, onChange, value, type, prefix, onFocus} = this.props;
    return (
      <div>
        {prefix}
        <input name={name} type={type} onChange={onChange} value={value}
        onFocus={onFocus}/>
      </div>
    );
  }
}
// 使用
<KInput type="text" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} ></Icon>}/>
```

