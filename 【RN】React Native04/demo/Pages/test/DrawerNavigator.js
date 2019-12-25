import React, { Component } from "react";
import {} from "react-native";

import { createAppContainer, createDrawerNavigator } from "react-navigation";

import HomePage from "../HomePage";
import DetailPage from "../DetailPage";
import MyPage from "../MyPage";

class DrawerNavigatorPage extends Component {
  render() {
    return createDrawerNavigator({});
  }
}

export default createAppContainer(DrawerNavigatorPage);
