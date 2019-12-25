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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import ImageItem from "../Pages/ImageItem";

const TABS = {
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      tabBarLabel: "首页",
      tabBarIcon: ({ tintColor, focused }) => {
        return <Feather name={"home"} size={26} color={tintColor} />;
      }
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      tabBarIcon: ({ tintColor, focused }) => {
        return (
          <ImageItem
            tintColor={tintColor}
            focused={focused}
            seletedPic={require("../img/icon_deal_anytime_refund.png")}
            unselectedPic={require("../img/icon_homepage_beauty_category.png")}
          />
        );
      }
    }
  },
  MyPage: {
    screen: MyPage
  }
};

class DynamicBottomNavigator extends Component {
  render() {
    const { HomePage, DetailPage, MyPage } = TABS;
    const Tabs = { HomePage, DetailPage, MyPage };
    Tabs.HomePage.navigationOptions.tabBarLabel = "xxx";
    const TabItem = createAppContainer(
      createBottomTabNavigator(Tabs, {
        tabBarComponent: TabBarComponent
      })
    );
    return <TabItem />;
  }
}
class TabBarComponent extends Component {
  constructor(props) {
    super(props);
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime()
    };
  }
  render() {
    const { routes, index } = this.props.navigation.state;
    if (routes[index].params) {
      const { theme } = routes[index].params;
      if (theme.updateTime > this.theme.updateTime) {
        this.theme = theme;
      }
    }
    return (
      <BottomTabBar
        {...this.props}
        style={{
          backgroundColor: this.theme.tintColor || this.props.activeTintColor
        }}
        activeTintColor={this.theme.tintColor || this.props.activeTintColor}
      />
    );
  }
}
export default DynamicBottomNavigator;
