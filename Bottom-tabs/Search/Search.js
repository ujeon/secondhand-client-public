import React, { Component } from "react";
import { Text, View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Button, Slider } from "react-native-elements";
import SearchableDropdown from "react-native-searchable-dropdown";
import Constants from "expo-constants";
import ProductList from "../components/productList";
import Loading from "../components/loading";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderPrice: 20000,
      selectedBrand: null,
      selectedModel: null,
      brandModelList: [],
      data: null,
      favoriteData: null,
      loading: "standby"
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
    if (this.state.selectedBrand && this.state.selectedModel) {
      this.setState({
        loading: "loading"
      });
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
        data: result,
        loading: "standby"
      });
    }
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
      const data = stateData.filtered_data.map(el => {
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

    return this.state.loading === "loading" ? (
      <Loading />
    ) : (
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.container}>
          <View style={styles.statusBar} />
          <Text style={styles.title}>SEARCH</Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            원하는 가격범위를 설정해 주세요
          </Text>
          <Slider
            style={{
              width: Dimensions.get("screen").width * 0.9,
              margin: 5,
              alignSelf: "center",
              padding: 5
            }}
            minimumValue={20000}
            maximumValue={1000000}
            step={10000}
            value={sliderPrice}
            trackStyle={{ height: 10, borderRadius: 10 }}
            thumbStyle={{ height: 20, width: 20, borderRadius: 20 }}
            onValueChange={select => {
              this.setState({
                sliderPrice: select
              });
            }}
            minimumTrackTintColor="#A7A7A7"
            maximumTrackTintColor="#D5D5D5"
            thumbTintColor="#9151BD"
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              alignSelf: "center"
            }}
          >
            {sliderPrice}원 미만 상품
          </Text>
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
            containerStyle={{ padding: 5, marginTop: 15 }}
            itemStyle={{
              padding: 10,
              marginTop: 5,
              backgroundColor: "#fff",
              borderColor: "#bd96d7",
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
                borderColor: "#a773ca",
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
              backgroundColor: "#9151BD",
              height: 50,
              borderRadius: 10
            }}
            containerStyle={{ marginTop: 10 }}
          />

          {this.state.data ? (
            <ProductList
              data={this.state.data}
              toggleFavorite={this.toggleFavorite}
            />
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  statusBar: {
    height: Constants.statusBarHeight
  },
  title: {
    fontSize: 40,
    color: "#a773ca",
    marginBottom: 20
  }
});
