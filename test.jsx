import React from 'react'

class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'test-name',
      showTitle: true,
      goods: [
        { text: '百万年薪架构师', price: 100, id: 1 },
        { text: 'web全栈架构师', price: 80, id: 2 },
        { text: 'Python爬虫', price: 60, id: 3 }
      ]
    }
    setTimeout(() => {
      this.setState({
        showTitle: false
      })
    }, 2000)
  }
  render() {
    return (
      <div>
            {this.state.showTitle && <h2>{this.props.title}</h2>} 
        <ul>
          {this.state.goods.map((good, i) => {
            return (
              <li key={good.id}>
                     <span>{good.text}</span>
                     <span>{good.price}</span>元      
                <button onClick={() => this.handleClick(i)}>添加购物车</button>
              </li>
            )
          })}
                
        </ul>
           
      </div>
    )
  }
}
