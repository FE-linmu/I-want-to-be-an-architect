import React, { Component } from "react";

const withKaikeba = Comp => {
  // 获取name,name可能来自于接口或其他手段
  const name = "高阶组件";
  console.log("do something");
  return class extends React.Component {
    componentDidMount() {
      
    }
    render() {
      return <Comp {...this.props} name={name} />;
    }
  };
};

const withLog = Comp => {
  console.log(Comp.name + "渲染了");
  return props => <Comp {...props} />;
};

@withLog
@withKaikeba
@withLog
class Kaikeba extends Component {
  render() {
    return (
      <div>
        {this.props.stage}-{this.props.name}
      </div>
    );
  }
}

// const NewKaikeba = withLog(withKaikeba(withLog(Kaikeba)));

export default class Hoc extends Component {
  render() {
    return (
      <div>
        <Kaikeba stage="React" />
      </div>
    );
  }
}
