import React, { Component } from "react";
import { BackHandler, ToastAndroid, AsyncStorage } from "react-native";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Icon } from "react-native-elements";

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
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        let iconSize;
        if (routeName === "home") {
          iconName = "home";
          iconSize = 25;
        } else if (routeName === "search") {
          iconName = "search";
          iconSize = 25;
        } else if (routeName === "favorite") {
          iconName = "favorite";
          iconSize = 25;
        } else if (routeName === "mypage") {
          iconName = "person";
          iconSize = 28;
        }
        // You can return any component that you like here!
        return (
          <Icon
            name={iconName}
            type="ioicon"
            size={iconSize}
            color={tintColor}
          />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: "#9151bd",
      inactiveTintColor: "gray"
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

  componentDidUpdate(prevProp, prevState) {
    if (prevState.favoriteData !== this.state.favoriteData) {
      this.setState({ favoriteData: this.state.favoriteData });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleFavorite = data => {
    this.setState({ favoriteData: data });
  };

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
    return (
      <BottomNav
        screenProps={{
          favoriteData: this.state.favoriteData,
          handleFavorite: this.handleFavorite,
          popToTop: this.props.navigation.getParam("popToTop")
        }}
      />
    );
  }
}
