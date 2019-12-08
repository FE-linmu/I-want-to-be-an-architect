import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  SwipeableListView,
  TouchableHighlight,
  FlatList,
  TextInput,
  WebView,
  Image
} from "react-native";

export default class FlatDemo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    };
    console.disableYellowBox = true;
  }
  _renderItem = ({ item, index }) => {
    return (
      <TouchableHightlight>
        <View style={{ height: 120, backgroundColor: "skyblue" }}>
          <Text>{item}</Text>
        </View>
      </TouchableHightlight>
    );
  };
  _ItemSeparatorComponent() {
    return <View style={{ height: 2, backgroundColor: "#000" }} />;
  }
  _ListEmptyComponent() {
    return (
      <View>
        <Text>数据没有啦</Text>
      </View>
    );
  }
  _ListFooterComponent() {
    return (
      <View>
        <Text>我也是有底线的</Text>
      </View>
    );
  }
  _onRefresh() {
    alert("ok ");
  }
  _onEndReached = () => {
    const data = this.state.data;
    const newData = data.concat(this.state.data);
    this.setState({
      data: newData
    });
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "red" }}>
        <FlatList
          data={this.state.data}
          renderItem={this._renderItem}
          refreshing={this.state.isLoading}
          onRefresh={this._onRefresh}
          ItemSeparatorComponent={this._ItemSeparatorComponent}
          ListEmptyComponent={this._ListEmptyComponent}
          ListFooterComponent={this._ListFooterComponent}
          ListHeaderComponent={this.ListHeaderComponent}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.4}
        />
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({});
