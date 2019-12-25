import React, { Component } from "react";
import {} from "react-native";

import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator
} from "react-navigation";

import HomePage from "../HomePage";
import DetailPage from "../DetailPage";
import MyPage from "../MyPage";
import TabItem from "./common/TabItem";
import { BottomTabBar } from "react-navigation-tabs";

const TABS = {
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      tabBarLabel: "首页",
      tabBarIcon: ({ tintColor, focused }) => {
        return (
          <TabItem
            tintColor={tintColor}
            focused={focused}
            selectedImage={require("../img/icon_deal_anytime_refund.png")}
            unSelectedImage={require("../img/icon_homepage_beauty_category.png")}
          />
        );
      }
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      tabBarLabel: "详情"
    }
  },
  MyPage: {
    screen: MyPage
  }
};

class DynamicHomePage extends Component {
  render() {
    const Tabs = createAppContainer(
      createBottomTabNavigator(TABS, {
        tabBarComponent: TabBarComponent,
        tabBarOptions: {
          activeTintColor: "red"
        }
      })
    );
    return <Tabs />;
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
        activeTintColor={this.theme.tintColor || this.props.activeTintColor}
      />
    );
  }
}
export default DynamicHomePage;
