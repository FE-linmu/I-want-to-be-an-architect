import React, { Component } from "react";
import { Platform, StyleSheet, SafeAreaView, Text, View } from "react-native";
import DynamicBottomNavigator from "./Navigator/DynamicBottomNavigator";
// import AppNavigator from "./Navigator/AppNavigator";
// import AppTopNavigator from "./Navigator/AppTopNavigator";
// import AppDrawerNavigator from "./Navigator/AppDrawerNavigator";
// import AppSwitchNavigator from "./Navigator/AppSwitchNavigator";
export default class App extends Component {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
  }
  render() {
    return <DynamicBottomNavigator />;
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
