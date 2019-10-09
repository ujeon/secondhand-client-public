import React, { Component } from "react";
import {
  View,
  Picker,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text
} from "react-native";
import Constants from "expo-constants";
import { Button } from "react-native-elements";
import Top5Quantity from "./top5Quantity";
import Top5Price from "./top5Price";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

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
    let brand = await fetch("http://3.17.152.1:8000/api/category/유모차/brand/")
      .then(res => res.json())
      .then(res => res);
    brand = brand.map(element => element.brand);
    this.setState({ brand });
  }

  goResult = () => {
    if (this.state.selectedBrand === "" || this.state.selectedModel === "") {
      this.setState({
        selectBrand: this.state.brand[0],
        selectModel: this.state.model[0]
      });
    }
    this.props.navigation.push("result", {
      brand: this.state.selectedBrand,
      model: this.state.selectedModel
    });
  };

  selectBrand = async event => {
    let model = await fetch(
      `http://3.17.152.1:8000/api/category/유모차/${event}/model/`
    )
      .then(res => res.json())
      .then(res => res);
    model = model.map(element => element.model);
    this.setState({ selectedBrand: event, model });
  };

  selectModel = event => {
    this.setState({ selectedModel: this.state.model[Number(event)] });
  };

  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statusBar} />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>차트에 대한 제목</Text>
        </View>
        <ScrollView
          style={styles.chartContainer}
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
          <View style={styles.chartCard}>
            <View style={styles.chartTitleContainter}>
              <Text style={styles.chartTitle}>TOP5 제품 가격</Text>
            </View>
            <Top5Price />
          </View>
          <View style={styles.chartCard}>
            <View style={styles.chartTitleContainter}>
              <Text style={styles.chartTitle}>게시글 TOP5</Text>
            </View>
            <Top5Quantity />
          </View>
        </ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>브랜드와 모델을 검색해보세요</Text>
        </View>
        <View style={styles.pickerContainer}>
          <View style={styles.picker}>
            <Picker
              selectedValue={this.state.selectedBrand}
              onValueChange={itemValue => this.selectBrand(itemValue)}
            >
              {this.state.brand.map(brand => (
                <Picker.Item label={brand} value={brand} key={brand} />
              ))}
            </Picker>
          </View>
          <View style={styles.picker}>
            <Picker
              selectedValue={this.state.selectedModel}
              style={styles.picker}
              onValueChange={itemValue =>
                this.setState({ selectedModel: itemValue })
              }
            >
              {this.state.model.map(model => (
                <Picker.Item label={model} value={model} key={model} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <Button
            title="선택 하기"
            type="solid"
            buttonStyle={styles.btnStyle}
            onPress={this.goResult}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: Constants.statusBarHeight
  },
  chartContainer: {
    height: height * 0.6,
    padding: "2%",
    backgroundColor: "#bd96d7"
  },
  chartCard: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "space-between",
    marginTop: "1.5%",
    marginRight: 20,
    width: width * 0.9,
    height: height * 0.53,
    borderRadius: 20,
    elevation: 6,
    backgroundColor: "#ffffff"
  },

  chartTitleContainter: {
    marginTop: "5%"
  },
  chartTitle: {
    marginLeft: "5%",
    fontSize: 18
  },

  titleContainer: {
    padding: "2%"
  },
  title: {
    fontSize: 20
  },
  btnContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: "4%"
  },
  pickerContainer: {
    width,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  picker: {
    height: 50,
    width: 200
  },
  btnStyle: {
    width: width * 0.5,
    borderRadius: 20,
    backgroundColor: "#9151bd"
  }
});
