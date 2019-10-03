import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React from "react";

import Credit from "./credit";
import MypageMain from "./mypageMain";

const StackOfMypage = createStackNavigator(
  {
    mypageMain: {
      screen: MypageMain
    },
    credit: {
      screen: Credit
    }
  },
  {
    initialRouteName: "mypageMain"
  }
);


const MypageStack = createAppContainer(StackOfMypage);

const Mypage = () => {
  return <MypageStack />;
};

export default Mypage;
