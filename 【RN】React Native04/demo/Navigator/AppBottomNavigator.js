import React, { Component } from "react";
import { Image, Platform, Button, StyleSheet, Text, View } from "react-native";

import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";

import { BottomTabBar } from "react-navigation-tabs";

import HomePage from "../Pages/HomePage";
import DetailPage from "../Pages/DetailPage";
import MyPage from "../Pages/MyPage";
// import { FontAwesome, Feather } from "react-native-vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

const BottomTabNavigator = createBottomTabNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      tabBarLabel: "首页",
      tabBarIcon: (
        <Image
          style={{ width: 30, height: 30 }}
          source={require("../img/icon_homepage_beauty_category.png")}
        />
      )
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      tabBarLabel: "详情",
      tabBarIcon: ({ tintColor, focused }) => {
        return <FontAwesome name="list-alt" size={26} color={tintColor} />;
      }
    }
  },
  MyPage: {
    screen: MyPage,
    navigationOptions: {
      tabBarLabel: "我的"
    }
  }
});

const TabBarComponent = props => {
  return <BottomTabBar {...props} />;
};

export default createAppContainer(BottomTabNavigator);
