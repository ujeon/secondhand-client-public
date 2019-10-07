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
  console.log("홈 props", props.screenProps);
  return <HomeStack screenProps={props.screenProps} />;
};

export default Home;
