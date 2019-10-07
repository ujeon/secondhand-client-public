import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React from "react";
import Select from "./select";
import Result from "./result";

const StackNav = createStackNavigator(
  {
    select: {
      screen: Select
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
  //REVIEW Nav에서 프롭이 전달되지 않음
  return <HomeStack />;
};

export default Home;
