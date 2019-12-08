import React, { Component } from "react";

import {
  View,
  Text,
  Button,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  WebView,
  SafeAreaView,
  Image
} from "react-native";

export default class WebViewDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "kkb"
    };
    console.disableYellowBox = true;
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1
        }}
      >
        <TouchableOpacity>
          <View style={{ height: 100, backgroundColor: "red" }}>
            <Text>1</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({});
