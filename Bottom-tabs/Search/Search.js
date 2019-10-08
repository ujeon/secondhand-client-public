import React, { Component } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  Dimensions
} from "react-native";
import { Button } from "react-native-elements";
import Slider from "react-native-slider";
import SearchableDropdown from "react-native-searchable-dropdown";
import ProductList from "../components/productList";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderPrice: 20000,
      selectedBrand: null,
      selectedModel: null,
      brandModelList: [],
      data: null,
      favoriteData: null
    };
  }

  async componentDidMount() {
    let brandModel = await fetch("http://3.17.152.1:8000/api/list/")
      .then(res => res.json())
      .then(res => res);

    brandModel = brandModel.map((element, i) => {
      const temp = {};
      temp.id = i;
      temp.name = `${element.brand} - ${element.model}`;
      return temp;
    });

    const { favoriteData } = this.props.screenProps;

    this.setState({ brandModelList: brandModel, favoriteData });
    this.onLoad();
  }

  selectedBrandModel = async () => {
    let searchData = await fetch("http://3.17.152.1:8000/api/search/", {
      method: "POST",
      body: JSON.stringify({
        min_price: 20000,
        max_price: this.state.sliderPrice,
        brand: this.state.selectedBrand,
        model: this.state.selectedModel
      })
    })
      .then(res => res.json())
      .then(res => res)
      .catch(err => console.error(err));

    const result = {};
    searchData = searchData.map(el => {
      for (let i = 0; i < this.state.favoriteData.length; i++) {
        if (this.state.favoriteData[i].id === el.id) {
          el.isFavorite = true;
          break;
        } else {
          el.isFavorite = false;
        }
      }
      return el;
    });

    result.filtered_data = searchData;

    this.setState({
      data: result
    });
  };

  onLoad = () => {
    this.props.navigation.addListener("willFocus", () => {
      this.checkFavoriteStatus();
    });
  };

  checkFavoriteStatus = () => {
    if (this.state.data !== null) {
      const newFavoriteData = this.props.screenProps.favoriteData.slice();
      const newFavLength = newFavoriteData.length;

      const result = {};
      const stateData = { ...this.state.data };
      data = stateData.filtered_data.map(el => {
        if (newFavLength !== 0) {
          for (let i = 0; i < newFavLength; i++) {
            if (newFavoriteData[i].id === el.id) {
              el.isFavorite = true;
              break;
            } else {
              el.isFavorite = false;
            }
          }
          return el;
        }
        el.isFavorite = false;
        return el;
      });

      result.filtered_data = data;

      this.setState({
        data: result,
        favoriteData: newFavoriteData
      });
    }
  };

  toggleFavorite = id => {
    const clonedData = { ...this.state.data };
    const clonedFavoriteData = this.state.favoriteData.slice();
    const favoriteIds = clonedFavoriteData.map(el => el.id);
    let target;

    clonedData.filtered_data = clonedData.filtered_data.map(el => {
      if (el.id === id) {
        target = el;
        if (el.isFavorite === true) {
          el.isFavorite = false;
        } else {
          el.isFavorite = true;
        }
      }
      return el;
    });

    if (favoriteIds.includes(target.id)) {
      clonedFavoriteData.splice(favoriteIds.indexOf(target.id), 1);
    } else {
      clonedFavoriteData.push(target);
    }

    this.props.screenProps.handleFavorite(clonedFavoriteData);

    this.setState({
      data: clonedData,
      favoriteData: clonedFavoriteData
    });
  };

  render() {
    const { sliderPrice, brandModelList } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>SEARCH</Text>
        <Text>원하는 가격범위를 설정해 주세요</Text>
        <Slider
          style={{ width: Dimensions.get("screen").width - 45 }}
          minimumValue={20000}
          maximumValue={1000000}
          step={10000}
          value={sliderPrice}
          onValueChange={select => {
            this.setState({
              sliderPrice: select
            });
          }}
          minimumTrackTintColor="#1e3799"
          maximumTrackTintColor="#6a89cc"
          thumbTintColor="#000"
        />
        <Text>{sliderPrice}원 미만</Text>
        <SearchableDropdown
          multi={false}
          onItemSelect={item => {
            const separateBrandModel = item.name.split(" - ");
            const brand = separateBrandModel[0];
            const model = separateBrandModel[1];
            this.setState({
              selectedBrand: brand,
              selectedModel: model
            });
          }}
          containerStyle={{ padding: 5, marginTop: 30 }}
          itemStyle={{
            padding: 10,
            marginTop: 5,
            backgroundColor: "#fff",
            borderColor: "#6a89cc",
            borderWidth: 1,
            borderRadius: 10
          }}
          itemTextStyle={{ color: "#000" }}
          itemsContainerStyle={{ maxHeight: 300 }}
          items={brandModelList}
          resetValue={false}
          textInputProps={{
            placeholder: "찾으시는 브랜드 또는 모델을 입력해주세요",
            underlineColorAndroid: "transparent",
            style: {
              padding: 12,
              borderWidth: 1.5,
              borderColor: "#1e3799",
              borderRadius: 10
            }
          }}
          listProps={{
            nestedScrollEnabled: true
          }}
        />
        <Button
          title="검   색"
          onPress={() => this.selectedBrandModel()}
          buttonStyle={{
            backgroundColor: "#6a89cc",
            height: 50
          }}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.data ? (
            <ProductList
              data={this.state.data}
              toggleFavorite={this.toggleFavorite}
            />
          ) : (
            <View style={{ height: 200 }}>
              <Text
                style={{
                  position: "relative",
                  top: 100,
                  left: Dimensions.get("screen").width / 3.5
                }}
              >
                브랜드와 모델을 선택해주세요.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: "center",
    marginTop: 80
  },
  title: {
    fontSize: 50,
    color: "#6a89cc",
    position: "relative",
    top: -40
  }
});
