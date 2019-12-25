import React, { Component } from "react";
import { Image, Platform, Button, StyleSheet, Text, View } from "react-native";

import {
  createAppContainer,
  createBottomTabNavigator,
  createDrawerNavigator,
  createStackNavigator
} from "react-navigation";

import HomePage from "../Pages/HomePage";
import DetailPage from "../Pages/DetailPage";
import MyPage from "../Pages/MyPage";
// import { FontAwesome, Feather } from "react-native-vector-icons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

const AppDrawerNavigator = createDrawerNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      drawerLabel: "首页",
      drawerIcon: ({ tintColor, focused }) => {
        return <FontAwesome name={"home"} size={26} color={tintColor} />;
      }
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      drawerLabel: "详情",
      drawerIcon: ({ tintColor, focused }) => {
        if (focused) {
          pic = require("../img/icon_deal_anytime_refund.png");
        } else {
          pic = require("../img/icon_homepage_beauty_category.png");
        }
        return <Image source={pic} />;
      }
    }
  },
  MyPage: {
    screen: MyPage
  }
});

export default createAppContainer(AppDrawerNavigator);
