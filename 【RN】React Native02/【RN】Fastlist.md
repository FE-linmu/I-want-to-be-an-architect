## FlatList

在RN0.43版本中引入了FlatList，SectionList与VirtualizedList，其中VirtualizedList是FlatList和SectionList的底层实现。

## VirtualizedList

VirtualizedList是FlatList和SectionList的底层实现。VirtualizedList通过维护一个有限的渲染窗口(其中包含可见的元素)，并将渲染窗口之外的元素全部用合适的定长空白空间代替的方式，极大的改善了内存使用，提高了大量数据情况下的渲染性能。这个渲染窗口能响应滚动行为，元素离可视区越远优先级越低，越近优先级越高，当用户滑动速度过快时，会出现短暂空白的情况。

# PureComponent

PureComponent是Component的一个优化组件，在React中的渲染性能有了大的提升，可以减少不必要的 render操作的次数，从而提高性能。PureComponent 与Component 的生命周期几乎完全相同，但 PureComponent 通过prop和state的浅对比可以有效的减少shouldComponentUpate()被调用的次数。

###特性

完全跨平台。

支持水平布局模式。

行组件显示或隐藏时可配置回调事件。

支持单独的头部组件。

支持单独的尾部组件。

支持自定义行间分隔线。

支持下拉刷新。

支持上拉加载。

支持跳转到指定行（ScrollToIndex）。
如果需要分组/类/区（section），请使用`SectionList`(这个我们会在之后的文章中介绍)

- # 使用

  FlatList如果只做简单使用也是很简单的，这里我们会分难以程度，逐渐介绍：

  ## 直接使用

  ```react
  <FlatList
  data={[{key: 'a'}, {key: 'b'}]}
  renderItem={({item}) => <Text>{item.key}</Text>}
  />复制代码
  ```

  可以看出跟之前的ListView很像，但是其中少了dataSource，这里，我们只需要传递数据，其它的都交给FlatList处理好了。

  ## 属性说明

- ItemSeparatorComponent
  行与行之间的分隔线组件。不会出现在第一行之前和最后一行之后。在这里可以根据需要插入一个view

- ListEmptyComponent
  列表为空时渲染该组件。可以是React Component, 也可以是一个render函数， 或者渲染好的element。

- ListFooterComponent
  尾部组件

- ListHeaderComponent
  头部组件

- columnWrapperStyle
  如果设置了多列布局（即将numColumns
  值设为大于1的整数），则可以额外指定此样式作用在每行容器上。

- data
  为了简化起见，data属性目前只支持普通数组。如果需要使用其他特殊数据结构，例如immutable数组，请直接使用更底层的VirtualizedList
  组件。

- extraData
  如果有除data以外的数据用在列表中（不论是用在renderItem
  还是Header或者Footer中），请在此属性中指定。同时此数据在修改时也需要先修改其引用地址（比如先复制到一个新的Object或者数组中），然后再修改其值，否则界面很可能不会刷新。

- getItem
  获取每个Item

- getItemCount
  获取Item属相

- getItemLayout
  是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。如果你的行高是固定的`getItemLayout`
  用起来就既高效又简单，类似下面这样：
  `getItemLayout={(data, index) => ( {length: 行高, offset: 行高 * index, index} )}`注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中。

- horizontal
  设置为true则变为水平布局模式。

- initialNumToRender
  指定一开始渲染的元素数量，最好刚刚够填满一个屏幕，这样保证了用最短的时间给用户呈现可见的内容。注意这第一批次渲染的元素不会在滑动过程中被卸载，这样是为了保证用户执行返回顶部的操作时，不需要重新渲染首批元素。

- initialScrollIndex
  指定渲染开始的item index

- keyExtractor
  此函数用于为给定的item生成一个不重复的key。Key的作用是使React能够区分同类元素的不同个体，以便在刷新时能够确定其变化的位置，减少重新渲染的开销。若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标。

- legacyImplementation
  设置为true则使用旧的ListView的实现。

- numColumns
  多列布局只能在非水平模式下使用，即必须是horizontal={false}
  。此时组件内元素会从左到右从上到下按Z字形排列，类似启用了flexWrap的布局。组件内元素必须是等高的——暂时还无法支持瀑布流布局。

- onEndReached
  当列表被滚动到距离内容最底部不足onEndReachedThreshold
  的距离时调用。

  https://github.com/facebook/react-native/issues/14015

  两次触发

- onEndReachedThreshold
  决定当距离内容最底部还有多远时触发onEndReached
  回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。

- onRefresh
  如果设置了此选项，则会在列表头部添加一个标准的RefreshControl
  控件，以便实现“下拉刷新”的功能。同时你需要正确设置refreshing
  属性。

- onViewableItemsChanged
  在可见行元素变化时调用。可见范围和变化频率等参数的配置请设置`viewabilityconfig`属性

- refreshing
  在等待加载新数据时将此属性设为true，列表就会显示出一个正在加载的符号。

- renderItem
  根据行数据data，渲染每一行的组件。这个参照下面的demo

  
  

## 方法

- scrollToEnd
  滚动到底部。如果不设置getItemLayout
  属性的话，可能会比较卡。
- scrollToIndex
  滚动到指定index的item
  如果不设置getItemLayout
  属性的话，无法跳转到当前可视区域以外的位置。
- scrollToItem
  滚动到指定item，如果不设置getItemLayout
  属性的话，可能会比较卡。
- scrollToOffset
  滚动指定距离

## Demo

### FlatList

```react
import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator
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
export default class FlatListDemo extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: CITY_NAMES,
      isLoading: false
    };
  }

  _renderItem(data) {
    return (
      <View style={styles.item}>
        <Text style={styles.text}>{data.item}</Text>
      </View>
    );
  }

  loadData(refresh) {
    if (refresh) {
      this.setState({
        isLoading: true
      });
    }
    setTimeout(() => {
      let dataArray = [];
      if (refresh) {
        for (let i = this.state.dataArray.length - 1; i >= 0; i--) {
          dataArray.push(this.state.dataArray[i]);
        }
      } else {
        dataArray = this.state.dataArray.concat(CITY_NAMES);
      }
      this.setState({
        dataArray: dataArray,
        isLoading: false
      });
    }, 2000);
  }

  genIndicator() {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
          size="large"
          animating={true}
        />
        <Text>正在加载更多</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.dataArray}
          renderItem={data => this._renderItem(data)}
          // refreshing={this.state.isLoading}
          // onRefresh={() => {
          //     this.loadData();
          // }}
          refreshControl={
            <RefreshControl
              title="Loading..."
              colors={["red"]}
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={"orange"}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            setTimeout(()=>{
              if(this.canLoadMore){
                 	this.loadData();
                	this.canLoadMore = false
              }  
            },100)  
          }}
          onMomentumScrollBegin={()=>{
            this.canLoadMore = true;
          }}
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
    height: 200,
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
  }
});

```



### SwipeableFlatListDemo

```react
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
export default class SwipeableFlatListDemo extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: CITY_NAMES,
      isLoading: false
    };
  }

  _renderItem(data) {
    return (
      <View style={styles.item}>
        <Text style={styles.text}>{data.item}</Text>
      </View>
    );
  }

  loadData(refresh) {
    if (refresh) {
      this.setState({
        isLoading: true
      });
    }
    setTimeout(() => {
      let dataArray = [];
      if (refresh) {
        for (let i = this.state.dataArray.length - 1; i >= 0; i--) {
          dataArray.push(this.state.dataArray[i]);
        }
      } else {
        dataArray = this.state.dataArray.concat(CITY_NAMES);
      }
      this.setState({
        dataArray: dataArray,
        isLoading: false
      });
    }, 2000);
  }

  genIndicator() {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
          size="large"
          animating={true}
        />
        <Text>正在加载更多</Text>
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
          refreshControl={
            <RefreshControl
              title="Loading..."
              colors={["red"]}
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={"orange"}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            this.loadData();
          }}
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

```

### SectionListDemo

```react
import React, { Component } from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator
} from "react-native";

type Props = {};
const CITY_NAMES = [
  { data: ["北京", "上海", "广州", "深圳"], title: "一线" },
  {
    data: ["杭州", "苏州", "成都", "武汉"],
    title: "二三线1"
  },
  { data: ["郑州", "洛阳", "厦门", "青岛", "拉萨"], title: "二三线2" }
];
export default class SectionListDemo extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: CITY_NAMES,
      isLoading: false
    };
  }

  _renderItem(data) {
    return (
      <View style={styles.item}>
        <Text style={styles.text}>{data.item}</Text>
      </View>
    );
  }

  _renderSectionHeader({ section }) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.text}>{section.title}</Text>
      </View>
    );
  }

  loadData(refresh) {
    if (refresh) {
      this.setState({
        isLoading: true
      });
    }
    setTimeout(() => {
      let dataArray = [];
      if (refresh) {
        for (let i = this.state.dataArray.length - 1; i >= 0; i--) {
          dataArray.push(this.state.dataArray[i]);
        }
      } else {
        dataArray = this.state.dataArray.concat(CITY_NAMES);
      }
      this.setState({
        dataArray: dataArray,
        isLoading: false
      });
    }, 2000);
  }

  genIndicator() {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator
          style={styles.indicator}
          size="large"
          animating={true}
        />
        <Text>正在加载更多</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          //数据源
          sections={this.state.dataArray}
          renderItem={data => this._renderItem(data)}
          //分组标题组件
          renderSectionHeader={data => this._renderSectionHeader(data)}
          
          refreshControl={
            <RefreshControl
              title="Loading..."
              colors={["red"]}
              refreshing={this.state.isLoading}
              onRefresh={() => this.loadData(true)}
              tintColor={"orange"}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            this.loadData();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa"
  },
  item: {
    height: 80,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  sectionHeader: {
    height: 50,
    backgroundColor: "#93ebbe",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontSize: 20
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: "red",
    margin: 10
  }
});

```



