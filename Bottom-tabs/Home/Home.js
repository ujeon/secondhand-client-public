import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React from "react";
import Select from "./select";
import Result from "./result";

const StackNav = createStackNavigator(
  {
    select: {
      screen: Select,
      navigationOptions: {
        header: null
      }
    },
    result: {
      screen: Result
    }
  },
  {
    initialRouteName: "select"
  }
);

const HomeStack = createAppContainer(StackNav);

const Home = props => {
  onLoad = callback => {
    props.navigation.addListener("willFocus", () => {
      callback();
    });
  };
  return (
    <HomeStack
      screenProps={{
        fav: props.screenProps,
        listener: this.onLoad,
        remover: this.remover
      }}
    />
  );
};

export default Home;
