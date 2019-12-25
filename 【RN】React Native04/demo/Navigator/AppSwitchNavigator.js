import React, { Component } from "react";
import { Image, Platform, Button, StyleSheet, Text, View } from "react-native";

import {
  createAppContainer,
  createBottomTabNavigator,
  createDrawerNavigator,
  createStackNavigator,
  createSwitchNavigator
} from "react-navigation";

import WelcomePage from "../Pages/WelcomePage";
import HomePage from "../Pages/HomePage";
import DetailPage from "../Pages/DetailPage";

const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null
    }
  }
});

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage
  },
  DetailPage: {
    screen: DetailPage
  }
});

const AppSwitchNavigator = createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator
});

export default createAppContainer(AppSwitchNavigator);
