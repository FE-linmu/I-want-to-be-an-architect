import React, { Component } from "react";
import { SafeAreaView, View, Text } from "react-native";

import {
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator
} from "react-navigation";

import HomePage from "./HomePage";
import DetailPage from "./DetailPage";
import MyPage from "./MyPage";
import TabItem from "./common/TabItem";
import { BottomTabBar } from "react-navigation-tabs";

class DynamicTop extends Component {
  constructor(props) {
    super(props);
    this.NAMES = ["HTML", "CSS", "JS", "NodeJS", "Vue", "React"];
  }
  _genTab() {
    const tabs = {};
    this.NAMES.forEach((item, index) => {
      tabs[`${item}`] = {
        screen: props => {
          return <DetailTop {...props} name={item} />;
        }
      };
    });
    return tabs;
  }
  render() {
    const Tabs = createAppContainer(
      createMaterialTopTabNavigator(this._genTab(), {
        // swipeEnabled: true,
        tabBarOptions: {
          scrollEnabled: true
        }
      })
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Tabs />
      </SafeAreaView>
    );
  }
}

class DetailTop extends Component {
  render() {
    return (
      <View>
        <Text>{this.props.name}</Text>
      </View>
    );
  }
}
export default DynamicTop;
