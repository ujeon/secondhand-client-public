import React, { Component } from "react";
import { View, Picker, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import Top5Quantity from "./top5Quantity";
import Top5Price from "./top5Price";
import AverageMonthly from "./averageMonthly";

const { width } = Dimensions.get("window");

export default class Select extends Component {
  constructor(props) {
    super();
    this.state = {
      brand: [],
      model: [],
      selectedBrand: "",
      selectedModel: ""
    };
  }

  async componentDidMount() {
    // 브랜드와 모델을 fetch해서 state에 저장 후 드롭다운 메뉴에 뿌려주기
    let brand = await fetch('http://3.17.152.1:8000/api/category/유모차/brand/')
    .then(res => res.json())
    .then(res => res)
    brand = brand.map(element => element.brand)
    this.setState({ brand })
  }

  goResult = () => {
    if (this.state.selectedBrand === "" || this.state.selectedModel === "") {
      this.setState({
        selectBrand: this.state.brand[0],
        selectModel: this.state.model[0]
      });
    }
    this.props.navigation.push("result", {brand: this.state.selectedBrand, model: this.state.selectedModel});
  };

  selectBrand = async event => {
    let model = await fetch(`http://3.17.152.1:8000/api/category/유모차/${event}/model/`)
    .then(res => res.json())
    .then(res => res)
    model = model.map(element => element.model)
    this.setState({ selectedBrand: event, model });
  };

  selectModel = event => {
    this.setState({ selectedModel: this.state.model[Number(event)] });
  };

  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
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
          <View style={styles.view}>
            <Top5Quantity />
          </View>
          <View style={styles.view}>
            <Top5Price />
          </View>
          <AverageMonthly />
        </ScrollView>

        <Picker
          selectedValue={this.state.selectedBrand}
          style={{ height: 50, width: 200 }}
          onValueChange={itemValue => this.selectBrand(itemValue)}
        >
          {this.state.brand.map(brand => (
            <Picker.Item label={brand} value={brand} key={brand} />
          ))}
        </Picker>
        <Picker
          selectedValue={this.state.selectedModel}
          style={{ height: 50, width: 200 }}
          onValueChange={itemValue =>
            this.setState({ selectedModel: itemValue })
          }
        >
          {this.state.model.map(model => (
            <Picker.Item label={model} value={model} key={model} />
          ))}
        </Picker>
        <Button title="조건 선택" onPress={this.goResult} />
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
