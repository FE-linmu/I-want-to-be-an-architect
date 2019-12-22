import React from "react";
import { Platform, Button, StyleSheet, Text, View } from "react-native";

import { createAppContainer, createStackNavigator } from "react-navigation";

import HomePage from "../Pages/HomePage";
import DetailPage from "../Pages/DetailPage";
import MyPage from "../Pages/MyPage";

const styles = StyleSheet.create({
  TitleFont: {
    fontSize: 28
  }
});

const AppNavigator = createStackNavigator(
  {
    HomePage: {
      screen: HomePage,
      navigationOptions: {
        header: null,
        headerBackTitle: "后退"
      }
    },
    DetailPage: {
      screen: DetailPage,
      navigationOptions: {
        title: "详情",
        headerTitleStyle: styles.TitleFont,
        headerRight: <Button title="分享" />
      }
    },
    MyPage: {
      screen: MyPage,
      navigationOptions: ({ navigation }) => {
        const { state } = navigation;
        const { params } = state;
        return {
          title: params.test ? params.test : "哈哈"
        };
      }
    }
  },
  {
    //
    defaultNavigationOptions: {
      //   title: "a"
    }
    // mode: "modal"
  }
);

export default createAppContainer(AppNavigator);
