import React, { Component } from "react";
import { BackHandler, ToastAndroid } from "react-native";
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
    return <BottomNav />;
  }
}
