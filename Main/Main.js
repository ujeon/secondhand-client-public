import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import SignIn from "./signIn";
import SignUp from "./signUp";
import Navigation from "../Navigation";

const MainStackNav = createStackNavigator(
  {
    signin: {
      screen: SignIn
    },
    signup: {
      screen: SignUp,
      navigationOptions: {
        header: null
      }
    },
    nav: {
      screen: Navigation,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "signin",
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);

const MainStack = createAppContainer(MainStackNav);

const Main = () => {
  return <MainStack />;
};

export default Main;
