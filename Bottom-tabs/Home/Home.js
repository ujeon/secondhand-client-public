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
      screen: Result,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "select"
  }
);

const HomeStack = createAppContainer(StackNav);

const Home = props => {
  const onLoad = callback => {
    props.navigation.addListener("willFocus", () => {
      callback();
    });
  };
  return (
    <HomeStack
      screenProps={{
        fav: props.screenProps,
        listener: onLoad
      }}
    />
  );
};

export default Home;
