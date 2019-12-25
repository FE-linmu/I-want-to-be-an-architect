import React, { Component } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  Button,
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator
} from "react-navigation";

import HomePage from "../Pages/HomePage";
import DetailPage from "../Pages/DetailPage";
import MyPage from "../Pages/MyPage";

const Tab = {
  HomePage: {
    screen: HomePage
  },
  HomePage: {
    screen: HomePage
  }
};

class AppTop extends Component {
  constructor(props) {
    super(props);
    this.NAMES = ["Html", "Css", "JavaScript", "Vue", "React", "NodeJS"];
  }
  _genTab() {
    const tabs = {};
    this.NAMES.forEach((item, index) => {
      tabs[`${item}`] = {
        screen: props => {
          return <AppTopDetail {...props} name={item} />;
        }
      };
    });
    return tabs;
  }
  render() {
    const Tabs = createAppContainer(
      createMaterialTopTabNavigator(this._genTab(), {
        lazy: true,
        tabBarOptions: {
          upperCaseLabel: false,
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

class AppTopDetail extends Component {
  render() {
    return (
      <View>
        <Text>{this.props.name}</Text>
      </View>
    );
  }
}

// const AppTopNavigator = createMaterialTopTabNavigator(
//   {
//     HomePage: {
//       screen: HomePage,
//       navigationOptions: {}
//     },
//     DetailPage: {
//       screen: DetailPage
//     },
//     MyPage: {
//       screen: MyPage
//     }
//   },
//   {
//     lazy: true,
//     tabBarOptions: {
//       upperCaseLabel: false,
//       indicatorStyle: { backgroundColor: "#000", height: 2 },
//       scrollEnabled: true
//     }
//   }
// );

export default AppTop;
