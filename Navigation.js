import React, { Component } from "react";
import { BackHandler, ToastAndroid, AsyncStorage } from "react-native";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import Favorite from "./Bottom-tabs/Favorite/Favorite";
import Home from "./Bottom-tabs/Home/Home";
import Mypage from "./Bottom-tabs/Mypage/Mypage";
import Search from "./Bottom-tabs/Search/Search";

const BottomTab = createBottomTabNavigator(
  {
    home: {
      screen: Home
    },
    search: {
      screen: Search
    },
    favorite: {
      screen: Favorite
    },
    mypage: {
      screen: Mypage
    }
  },
  { initialRouteName: "home" }
);

const BottomNav = createAppContainer(BottomTab);

export default class Navigation extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = { favoriteData: [] };
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem("token");
    let favoriteData;
    if (token) {
      favoriteData = await fetch("http://3.17.152.1:8000/user/favorite/info/", {
        headers: { token }
      })
        .then(res => res.json())
        .then(res => res)
        .catch(err => console.error(err));
      favoriteData = favoriteData.map(el => {
        el.isFavorite = true;
        return el;
      });
    } else {
      favoriteData = [];
    }

    await AsyncStorage.setItem("favoriteData", JSON.stringify(favoriteData));

    this.setState({ favoriteData });
  }

  handleBackButtonClick() {
    if (this.exitApp === undefined || !this.exitApp) {
      ToastAndroid.show("한번 더 누르시면 종료됩니다.", ToastAndroid.SHORT);
      this.exitApp = true;

      this.timeout = setTimeout(
        () => {
          this.exitApp = false;
        },
        2000 // 2초
      );
    } else {
      clearTimeout(this.timeout);

      BackHandler.exitApp(); // 앱 종료
    }
    return true;
  }

  render() {
    //REVIEW Nav에서 스테이트에 즐겨찾기를 저장하고, Home탭에 전달해주려고 하는데 전달되지 않음

    return <BottomNav favoriteData={this.state.favoriteData} />;
  }
}
