import React from "react";
import { View, Text, AsyncStorage, ScrollView } from "react-native";

import ProductList from "../components/productList";

export default class Favorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignIn: undefined,
      favoriteData: {}
    };
  }

  async componentDidMount() {
    this.onLoad();
    console.log(this.state.isSignIn);

    // const favoriteData = this.props.screenProps.favoriteData;
    // let temp = {};
    // temp.filtered_data = favoriteData;

    // this.setState({
    //   favoriteData: temp
    // });
  }

  onLoad = () => {
    this.props.navigation.addListener("willFocus", () => {
      this.checkIsSignIn();
      this.checkFavoriteStatus();
    });
  };

  checkFavoriteStatus = () => {
    let temp = {};
    temp.filtered_data = this.props.screenProps.favoriteData;
    this.setState({ favoriteData: temp });
  };

  checkIsSignIn = () => {
    AsyncStorage.getItem("token", (err, result) => {
      if (result !== null) {
        this.setState({ isSignIn: true });
      } else {
        this.setState({ isSignIn: false });
      }
    });
  };

  toggleFavorite = id => {
    const clonedFavoriteData = this.state.favoriteData.filtered_data.slice();

    for (let i = 0; i < clonedFavoriteData.length; i++) {
      if (clonedFavoriteData[i].id === id) {
        clonedFavoriteData.splice(i, 1);
      }
    }

    this.props.screenProps.handleFavorite(clonedFavoriteData);

    let temp = {};
    temp.filtered_data = clonedFavoriteData;

    this.setState({
      favoriteData: temp
    });
  };

  render() {
    if (this.state.isSignIn === true) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ProductList
            data={this.state.favoriteData}
            toggleFavorite={this.toggleFavorite}
          />
        </ScrollView>
      );
    }
    return (
      <View>
        <Text>회원가입을 하시면 즐겨찾기 추가가 가능합니다.</Text>
      </View>
    );
  }
}
