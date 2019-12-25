import React, { Component } from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";
import NavigatorBriage from "../Navigator/NavigatorBriage";

import DataStore from "../Http/AsDemo";

import {
  createAppContainer,
  createStackNavigator,
  createMaterialTopTabNavigator
} from "react-navigation";

export default class NewsPage extends Component {
  constructor(props) {
    super(props);
    this.NAMES = ["推荐", "视频", "热点", "社会", "娱乐", "军事"];
  }
  _genTabs() {
    const obj = {};
    this.NAMES.forEach((item, index) => {
      obj[`${item}`] = {
        screen: props => {
          return <NewsItem {...props} name={item} />;
        }
      };
    });
    return obj;
  }
  render() {
    const Tab = createAppContainer(
      createMaterialTopTabNavigator(this._genTabs())
    );
    return <Tab />;
  }
}

class NewsItem extends Component {
  constructor(props) {
    super(props);
    this.dataStore = new DataStore();
  }
  componentDidMount() {
    let url = `https://api.github.com/search/repositories?q=NodeJS`;
    this.dataStore
      .fetchData(url)
      .then(response => {
        console.log(response);
      })
      .catch(e => {
        console.log(e);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>{this.props.name}</Text>
        <Button
          title={"点我进入详情页"}
          onPress={() => {
            NavigatorBriage.navigation.navigate("DetailPage");
          }}
        />
      </View>
    );
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
