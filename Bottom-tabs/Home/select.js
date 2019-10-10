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
import Loading from "../components/loading";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

export default class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand: [],
      model: [],
      selectedBrand: "",
      selectedModel: "",
      top5: [],
      originData: []
    };
  }

  async componentDidMount() {
    let brand = await fetch("http://3.17.152.1:8000/api/category/유모차/brand/")
      .then(res => res.json())
      .then(res => res);
    brand = brand.map(element => element.brand);

    this.setState({ brand });

    await fetch("http://3.17.152.1:8000/api/top5/")
      .then(res => res.json())
      .then(res => {
        const color = ["#a3586d", "#5c4a72", "#f3b05a", "#f4874b", "#f46a4e"];
        this.setState({
          originData: res.map(el => ({ ...el }))
        });
        for (const i in res) {
          res[i].svg = {
            fill: color[i]
          };
        }
        this.setState({
          top5: res
        });
      })
      .catch(err => console.error(err));

    await this.selectBrand(this.state.brand[0]);
    this.setState({
      selectedBrand: this.state.brand[0],
      selectedModel: this.state.model[0]
    });
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
    return this.state.top5[0] ? (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContainer}
      >
        <View style={styles.statusBar} />
        <View style={styles.titleContainer}>
          <Text style={styles.tabTitle}>HOME</Text>
        </View>

        <ScrollView
          style={styles.chartContainer}
          pagingEnabled={true}
          horizontal={true}
          decelerationRate={0}
          snapToInterval={width - 20}
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
              <Text style={styles.chartTitle}>
                게시물이 가장 많은 TOP5 유모차 평균 거래 가격 (원)
              </Text>
            </View>
            <Top5Price
              top5={this.state.top5}
              originData={this.state.originData}
            />
          </View>
          <View style={styles.chartCard}>
            <View style={styles.chartTitleContainter}>
              <Text style={styles.chartTitle}>
                게시물이 가장 많은 TOP5 유모차 모델
              </Text>
            </View>
            <Top5Quantity top5={this.state.top5} />
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

        <Button
          title="검   색"
          type="solid"
          buttonStyle={styles.btnStyle}
          onPress={this.goResult}
        />
      </ScrollView>
    ) : (
      <Loading />
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20
  },
  statusBar: {
    height: Constants.statusBarHeight
  },
  chartContainer: {
    height: height * 0.6,
    padding: "2%"
  },
  chartCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "1.5%",
    marginRight: 25,
    marginLeft: 5,
    width: width * 0.86,
    height: height * 0.52,
    borderRadius: 20,
    elevation: 6,
    backgroundColor: "#ffffff"
  },

  chartTitleContainter: {
    marginTop: "5%"
  },
  chartTitle: {
    marginLeft: "5%",
    fontSize: 13,
    fontStyle: "italic"
  },
  titleContainer: {
    marginBottom: "3%"
  },
  tabTitle: {
    fontSize: 40,
    color: "#a773ca"
  },
  title: {
    marginTop: "5%",
    fontSize: 25
  },

  pickerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: "3%"
  },
  picker: {
    height: 50,
    width: width * 0.4
  },
  btnStyle: {
    borderRadius: 10,
    backgroundColor: "#9151bd"
  }
});
