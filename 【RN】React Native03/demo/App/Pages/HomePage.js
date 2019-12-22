import React, { Component } from "react";
import { Platform, Button, StyleSheet, Text, View } from "react-native";

export default class HomePage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to HomePage!</Text>
        <Button
          title={"Go to DetailPage"}
          onPress={() => {
            this.props.navigation.navigate("DetailPage", {
              name: "web9",
              title: "标题"
            });
          }}
        />
        <Button
          title={"Go Back"}
          onPress={() => {
            this.props.navigation.goBack();
          }}
        />
        <Button
          title={"Go MyPage"}
          onPress={() => {
            this.props.navigation.navigate("MyPage", {
              test: ""
            });
          }}
        />
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
