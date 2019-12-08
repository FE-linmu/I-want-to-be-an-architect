import React, { Component } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  SwipeableFlatList,
  Text,
  TouchableHighlight,
  View
} from "react-native";

type Props = {};
const CITY_NAMES = [
  "北京",
  "上海",
  "广州",
  "深圳",
  "杭州",
  "苏州",
  "成都",
  "武汉",
  "郑州",
  "洛阳",
  "厦门",
  "青岛",
  "拉萨"
];
export default class SwipeableFlatListDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: CITY_NAMES
    };
  }

  _renderItem(data) {
    return (
      <View style={styles.item}>
        <Text style={styles.text}>{data.item}</Text>
      </View>
    );
  }

  genQuickActions(rowData, sectionID, rowID) {
    return (
      <View style={styles.quickContainer}>
        <TouchableHighlight
          onPress={() => {
            alert("确认删除");
          }}
        >
          <View style={styles.quick}>
            <Text style={styles.text}>删除</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SwipeableFlatList
          ref={swipe => (this.swipe = swipe)}
          data={this.state.dataArray}
          renderItem={data => this._renderItem(data)}
          //默认false,如果设置为true，会向用户展示滑动效果，提示用户可以滑动
          bounceFirstRowOnMount={false}
          //设置最大滑动距离
          maxSwipeDistance={60}
          //用于创建侧滑菜单
          renderQuickActions={() => this.genQuickActions()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    height: 100,
    backgroundColor: "#169",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "white",
    fontSize: 20
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: "red",
    margin: 10
  },
  quickContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 15,
    marginBottom: 15
  },
  quick: {
    backgroundColor: "red",
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 10,
    width: 200
  }
});
