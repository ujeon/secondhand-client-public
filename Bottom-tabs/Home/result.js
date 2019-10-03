import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import ProductList from "../components/productList";

import { data as fakeData } from "../../fakeData";

const { width } = Dimensions.get("window");

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: fakeData
    };
  }

  render() {
    return (
      // NOTE 종단 스크롤 뷰 안에 횡단 스크롤 뷰를 넣으면 가로, 세로 스크롤 모두 가능!
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>저의 제목을 지어주세요</Text>
        </View>
        <ScrollView
          style={styles.container}
          pagingEnabled={true}
          horizontal={true}
          decelerationRate={0}
          snapToInterval={width - 60}
          snapToAlignment="center"
          contentInset={{
            top: 0,
            left: 30,
            bottom: 0,
            right: 30
          }}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.view} />
          <View style={styles.view} />
          <View style={styles.view} />
          <View style={styles.view} />
          <View style={styles.view} />
        </ScrollView>
        <ProductList data={this.state.data} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    paddingTop: "5%"
  },
  title: {
    fontSize: 26
  },
  view: {
    marginTop: "1.5%",
    backgroundColor: "#2e2e2e",
    width: width - 80,
    margin: 10,
    height: 300,
    borderRadius: 10,
    paddingHorizontal: 30
  }
});
