import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  WebView,
  Image
} from "react-native";

class FlatListDemo extends PureComponent {
  render() {
    return <View />;
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "kkb",
      showText: "",
      url: "https://www.baidu.com"
    };
    console.disableYellowBox = true;
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "green" }}>
        <WebView
          injectedJavaScript={`changText()`}
          source={require("./index.html")}
        />
        {/* <View
          style={{
            flex: 1,
            backgroundColor: "red",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{ color: "blue", fontSize: 40 }}
            numberOfLines={1}
            ellipsizeMode={"middle"}
          >
            {this.state.showText}
          </Text>

          <TextInput
            keyboardType={"numeric"}
            autoCapitalize={"words"}
            onChangeText={val => {
              this.setState({
                showText: val
              });
            }}
            style={{
              height: 40,
              width: 200,
              borderWidth: 1,
              borderColor: "#fff"
            }}
          />
        </View> */}
      </SafeAreaView>
    );
  }
}
const style = StyleSheet.create({});
