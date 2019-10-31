import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Welcome1, Welcome2 } from "./components/CompType";
import Clock from "./components/Clock";
import StateTest from "./components/StateTest";
import CartSample from "./components/CartSample";
import Lifecycle from "./components/Lifecycle";
import AntdTest from "./components/AntdTest";
import CommentList from "./components/CommentList";
import Hoc from "./components/Hoc";
import Composition from "./components/Composition";
import HookTest from "./components/HookTest";
import ContextTest from "./components/ContextTest";
import WrappedNormalLoginForm from "./components/AntdForm";
import KForm from "./components/KForm";
import ReduxTest from "./components/ReduxTest";
import { Provider } from "react-redux";
import store from "./store";
import RouteSample from "./components/RouteSample";

function formatName(user) {
  return user.firstName + " " + user.lastName;
}

class App extends Component {
  state = { prop: "some prop" };
  componentDidMount() {
    this.setState({ prop: "a new prop" });

    setTimeout(() => {
      this.setState({ prop: "" });
    }, 2000);
  }
  render() {
    const name = "jerry";
    const user = { firstName: "tom", lastName: "jerry" };
    const jsx = <p>hello, jerry</p>;
    return (
      <div>
        {/* 表达式 */}
        {/* <h1>{name}</h1>
        <h1>{formatName(user)}</h1> */}

        {/* 属性 */}
        {/* <img src={logo} style={{width:'100px'}} /> */}

        {/* jsx也是表达式 */}
        {/* {jsx} */}
        {/* 使用其他组件 */}
        {/* <Welcome1 name="some content"></Welcome1>
        <Welcome2 name="some content"></Welcome2> */}

        {/* State和状态改变setState */}
        {/* <Clock></Clock> */}
        {/* <StateTest></StateTest> */}

        {/* 条件与循环 */}
        {/* <CartSample title="购物车"></CartSample> */}

        {/* 生命周期 */}
        {/* {this.state.prop && <Lifecycle prop={this.state.prop}></Lifecycle>} */}

        {/* antd */}
        {/* <AntdTest></AntdTest> */}

        {/* 展示组件和容器组件 */}
        {/* <CommentList></CommentList> */}

        {/* 高阶组件 */}
        {/* <Hoc></Hoc> */}

        {/* 组件复合 */}
        {/* <Composition></Composition> */}

        {/* Hook */}
        {/* <HookTest></HookTest> */}

        {/* Context */}
        {/* <ContextTest></ContextTest> */}

        {/* <WrappedNormalLoginForm></WrappedNormalLoginForm> */}

        {/* kForm */}
        {/* <KForm></KForm> */}

        {/* Redux */}
        <Provider store={store}>
          {/* <ReduxTest /> */}
          <RouteSample />
        </Provider>
      </div>
    );
  }
}

export default App;
