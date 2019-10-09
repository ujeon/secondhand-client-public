import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions } from "react-native";
import ProductList from "../components/productList";
import AverageMonthly from "./averageMonthly";
import Loading from "../components/loading";

const { width, height } = Dimensions.get("window");

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      model: this.props.navigation.getParam("model"),
      favoriteData: null,
      averageByMonth: [],
      loadComplete: false
    };
  }

  async componentDidMount() {
    this.props.screenProps.listener(this.checkFavoriteStatus);
    const brand = this.props.navigation.getParam("brand");
    const model = this.props.navigation.getParam("model");

    const data = await fetch(
      `http://3.17.152.1:8000/api/${brand}/${model}/info`
    )
      .then(res => res.json())
      .then(res => res)
      .catch(err => console.error(err));

    const { favoriteData } = this.props.screenProps.fav;
    const filteredData = data.filtered_data.map(el => {
      for (let i = 0; i < favoriteData.length; i++) {
        if (favoriteData[i].id === el.id) {
          el.isFavorite = true;
          break;
        } else {
          el.isFavorite = false;
        }
      }
      return el;
    });

    data.filtered_data = filteredData;

    this.setState({
      data,
      favoriteData
    });

    if (this.state.model !== "etc") {
      await fetch("http://3.17.152.1:8000/api/average/monthly/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model: this.state.model })
      })
        .then(res => res.json())
        .then(res =>
          this.setState({
            averageByMonth: res
          })
        )
        .catch(err => console.error(err));
    }
    this.setState({ loadComplete: true });
  }

  checkFavoriteStatus = () => {
    if (this.state.data !== null) {
      const newFavoriteData = this.props.screenProps.fav.favoriteData.slice();
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

    this.props.screenProps.fav.handleFavorite(clonedFavoriteData);

    this.setState({
      data: clonedData,
      favoriteData: clonedFavoriteData
    });
  };

  render() {
    if (this.state.loadComplete) {
      return (
        // NOTE 종단 스크롤 뷰 안에 횡단 스크롤 뷰를 넣으면 가로, 세로 스크롤 모두 가능!
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate={0}
          snapToInterval={width - 60}
          snapToAlignment="center"
          contentInset={{
            top: 0,
            left: 30,
            bottom: 0,
            right: 30
          }}
        >
          {this.state.model !== "etc" ? (
            <ScrollView
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
              <AverageMonthly
                model={this.state.model}
                averageByMonth={this.state.averageByMonth}
              />
            </ScrollView>
          ) : (
            <View style={styles.chartContainer}>
              <Text>평균가격 정보를 보시려면 특정 모델을 선택해주세요</Text>
            </View>
          )}
          <ProductList
            data={this.state.data}
            toggleFavorite={this.toggleFavorite}
          />
        </ScrollView>
      );
    }
    return <Loading />;
  }
}

export default Result;

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    height: height * 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
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
