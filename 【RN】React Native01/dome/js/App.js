import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Image
} from "react-native";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "kkb"
    };
  }
  componentDidMount() {
    const timer = setTimeout(() => {
      this.setState({
        name: "开课吧"
      });
    }, 2000);
  }
  componentWillUnmount() {
    if (timer) {
      clearTimeout(timer);
    }
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "green"
        }}
      >
        <View style={([style.item], { alignItems: "center" })}>
          <Text style={style.color}>1</Text>
        </View>
        <View style={[style.item, style.itemCenter]}>
          <Test sex={"男"} />
        </View>
        <View style={[style.item, style.itemCenter]}>
          <Image
            style={{ width: 50, height: 50 }}
            source={{
              uri:
                "https://img.alicdn.com/imgextra/i1/2245141975/TB2Rghto7yWBuNjy0FpXXassXXa_!!2245141975-0-beehive-scenes.jpg_360x360xzq90.jpg"
            }}
          />
          <Image source={require("../img/taobao.jpg")} />
          <Button
            title="按钮"
            onPress={() => {
              alert("hello react native");
            }}
          />
          <Text style={style.color}>{this.state.name}</Text>
        </View>
        <ActivityIndicator
          animating={false}
          size="large"
          color="#0000ff"
          hidesWhenStopped={false}
        />
      </View>
    );
  }
}

class Test extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Text>{this.props.sex}</Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  item: {
    flex: 1,
    backgroundColor: "red",
    marginLeft: 5,
    marginRight: 5,
    color: "gold"
  },
  itemCenter: {
    justifyContent: "center"
  },
  color: {
    color: "blue"
  },
  text: {
    color: "#000"
  }
});
