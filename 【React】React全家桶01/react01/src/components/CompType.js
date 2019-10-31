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
