import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      num: 5
    };
  }
  componentDidMount() {
    this.timer = setTimeout(() => {
      this.props.navigation.navigate("Main");
    }, 5000);
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{this.state.num}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
