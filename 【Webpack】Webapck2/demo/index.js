import _ from "lodash";
console.log(_.join(["a", "b", "c"], "***")); //1mb

// import { add } from "./a";

// add(1, 2);

// import React, { Component } from "react";
// import ReactDom from "react-dom";
// import Child from "./index.jsx";

// class App extends Component {
//   render() {
//     return (
//       <div>
//         <Child />
//       </div>
//     );
//   }
// }

// ReactDom.render(<App />, document.getElementById("app"));

// import "@babel/polyfill";
// let obj = {};
// const str = "";
// const arr = [new Promise(() => {}), new Promise(() => {})];
// arr.map(item => {
//   console.log(item);
// });

// import a from "./a";
// import b from "./b";
// b();
// a();

// if (module.hot) {
//   module.hot.accept("./a", () => {
//     document.body.removeChild(document.getElementById("number"));
//     a();
//   });
// }

//HMR默认对css模块支持较好，对js模块需要额外的处理，通过module.hot.accept来对需要更新模块进行监控
