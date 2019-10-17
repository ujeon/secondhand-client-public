import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React from "react";

import Credit from "./credit";
import MypageMain from "./mypageMain";

const StackOfMypage = createStackNavigator(
  {
    mypageMain: {
      screen: MypageMain,
      navigationOptions: {
        header: null
      }
    },
    credit: {
      screen: Credit,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "mypageMain"
  }
);

const MypageStack = createAppContainer(StackOfMypage);

const Mypage = props => {
  return <MypageStack screenProps={props.screenProps.popToTop} />;
};

export default Mypage;
