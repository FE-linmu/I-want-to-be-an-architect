import React from 'react'
import { connect } from 'react-redux'
import { add, minus, asyncAdd } from './counter.redux'
import { Route, Link } from 'react-router-dom'
function About() {
  return <div>About</div>
}
function Detail() {
  return <div>Detail</div>
}
@connect(
  state => ({ num: state }),
  { add, minus, asyncAdd }
)
class Counter extends React.Component {
  render() {
    return (
      <div>
           <p>{this.props.num}</p>
        <div>
              <button onClick={() => this.props.add()}>+</button>
              <button onClick={() => this.props.minus()}>-</button>
              <button onClick={() => this.props.asyncAdd()}>延迟添加</button>
        </div>
      </div>
    )
  }
}
class App extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <Link to="/">累加器</Link> 
          <Link to="/about">About</Link> 
          <Link to="/detail">Detail</Link>
        </ul>
        <div>
          <Route exact path="/" component={Counter} />
          <Route path="/about" component={About} />
          <Route path="/detail" component={Detail} />
        </div>
      </div>
    )
  }
}
export default App
