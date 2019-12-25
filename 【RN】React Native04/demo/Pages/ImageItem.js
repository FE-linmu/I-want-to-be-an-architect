import React, { Component } from "react";
import { Image, Platform, Button, StyleSheet, Text, View } from "react-native";

class ImageItem extends Component {
  render() {
    return (
      <Image
        source={
          this.props.focused ? this.props.seletedPic : this.props.unselectedPic
        }
        style={styles.pic}
      />
    );
  }
}

const styles = StyleSheet.create({
  pic: {
    width: 25,
    height: 25
  }
});

export default ImageItem;
