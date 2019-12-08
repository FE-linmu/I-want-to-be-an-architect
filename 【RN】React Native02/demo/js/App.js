import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image
} from "react-native";
const { Width, Height } = Dimensions.get("window");
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "kkb"
    };
  }

  render() {
    return (
      <View
        style={{
          height: 40,
          width: Width,
          alignItems: "center",
          backgroundColor: "red"
        }}
      />
    );
  }
}

const style = StyleSheet.create({});
