import React, { Component } from "react";
import { func } from "prop-types";

// 容器组件
export default class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
    };
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        comments: [
          { body: "react is very good", author: "facebook" },
          { body: "vue is very good", author: "youyuxi" }
        ]
      });
    }, 1000);
  }
  render() {
    return (
      <div>
        {this.state.comments.map((c, i) => (
          <Comment key={i} {...c} />
        ))}
      </div>
    );
  }
}
// 展示组件
// memo高阶组件
const Comment = React.memo(function(props) {
  console.log("render Comment");

  return (
    <div>
      <p>{props.body}</p>
      <p> --- {props.author}</p>
    </div>
  );
});

// class Comment extends React.PureComponent{

// //   shouldComponentUpdate(nextProps){
// //       if (nextProps.data.body === this.props.data.body &&
// //         nextProps.data.author === this.props.data.author) {
// //           return false;
// //       }
// //       return true;
// //   }

//   render() {
//     console.log("render comment");

//     return (
//       <div>
//         <p>{this.props.body}</p>
//         <p> --- {this.props.author}</p>
//       </div>
//     );
//   }
// }
