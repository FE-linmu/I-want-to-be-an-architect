import React, { Component } from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

export default class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      isLogin: true
    };
  }
  // componentDidMount() {
  //   this.timer = setInterval(() => {
  //     this.props.navigation.navigate("Main");
  //   }, 3000);
  // }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title={"点我进入App"}
          onPress={() => {
            this.props.navigation.navigate(
              this.state.isLogin ? "Main" : "Auth"
            );
          }}
        />
        <Button
          title={"清空数据库"}
          onPress={() => {
            AsyncStorage.clear();
          }}
        />
        <Text style={styles.welcome}>欢迎 欢迎 请看会广告!</Text>
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
