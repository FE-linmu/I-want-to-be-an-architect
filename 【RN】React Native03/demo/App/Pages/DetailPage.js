import React, { Component } from "react";
import { Platform, Button, StyleSheet, Text, View } from "react-native";

export default class DetailPage extends Component {
  constructor(props) {
    super(props);
  }
  //   static navigationOptions = ({ navigation }) => {
  //     return {
  //       headerLeft: (
  //         <Button
  //           title="后退xxx"
  //           onPress={() => {

  //             navigation.pop();
  //           }}
  //         />
  //       )
  //     };
  //   };
  //生命周期钩子
  componentWillUnmount() {
    alert("关掉");
  }
  render() {
    const { navigation } = this.props;
    const { state } = navigation;
    const { params } = state;

    return (
      <View style={styles.container}>
        <Button
          title={"Go Back"}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button
          title={"改变参数"}
          onPress={() => {
            navigation.setParams({
              title: "web10"
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
