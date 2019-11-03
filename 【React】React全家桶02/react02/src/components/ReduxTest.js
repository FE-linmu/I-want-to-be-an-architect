import React from "react";
// import store from "../store";
import { connect } from "react-redux";
import { add, minus, asyncAdd } from "../store/count.redux";

const mapStateToProps = state => ({ num: state.counter });
const mapDispatchToProps = { add, minus, asyncAdd };
// function ReduxTest({ num, add, minus }) {
//   return (
//     <div>
//       <p>{num}</p>
//       <div>
//         <button onClick={minus}>-</button>
//         <button onClick={add}>+</button>
//       </div>
//     </div>
//   );
// }
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(ReduxTest);

// 装饰器写法
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class ReduxTest extends React.Component {
  render() {
    const { num, minus, add, asyncAdd } = this.props;
    return (
      <div>
        <p>{num}</p>
        <div>
          <button onClick={minus}>-</button>
          <button onClick={add}>+</button>
          <button onClick={asyncAdd}>AsyncAdd</button>
        </div>
      </div>
    );
  }
}
export default ReduxTest;
