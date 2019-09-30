import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Main from "./Main/Main";
import Signin from "./Main/signIn";
import Navigation from "./Navigation";

const MainStackNav = createStackNavigator(
  {
    main: {
      screen: Main
    },
    signin: {
      screen: Signin
    },
    nav: {
      screen: Navigation,
      navigationOptions: {
        header: null
      }
    }
  },
  { initialRouteName: "main" }
);

const MainStack = createAppContainer(MainStackNav);

const App = () => {
  return <MainStack />;
};

export default App;
