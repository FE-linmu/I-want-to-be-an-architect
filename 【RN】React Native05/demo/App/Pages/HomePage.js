import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import NavigatorBriage from "../Navigator/NavigatorBriage";

import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import NewsPage from "./NewsPage";
import MyPage from "./MyPage";

const TABS = {
  NewsPage: {
    screen: NewsPage,
    navigationOptions: {
      tabBarLabel: "新闻"
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: "我的"
    }
  }
};

export default class HomePage extends Component {
  render() {
    NavigatorBriage.navigation = this.props.navigation;
    const Tab = createAppContainer(createBottomTabNavigator(TABS));
    return <Tab />;
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
