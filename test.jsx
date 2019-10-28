import Lifecycle from './【React】react入门1/react01/src/components/Lifecycle'

class App extends Component {
  state = { prop: 'some content' }
  componentDidMount() {
    this.setState({ props: 'new Content' })
    setTimeout(() => {
      this.setState({ prop: '' })
    }, 2000)
  }
  render() {
    return (
      <div>
        {this.state.prop && <Lifecycle prop={this.state.prop}></Lifecycle>}
      </div>
    )
  }
}
