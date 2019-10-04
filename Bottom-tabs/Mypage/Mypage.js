import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import React from "react";

import Credit from "./credit";
import MypageMain from "./mypageMain";
import SignIn from "../../Main/signIn";
import SignUp from "../../Main/signUp";

const StackOfMypage = createStackNavigator(
  {
    mypageMain: {
      screen: MypageMain
    },
    credit: {
      screen: Credit
    },
    signin: {
      screen: SignIn,
      navigationOptions: {
        header: null
      }
    },
    signup: {
      screen: SignUp,
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

const Mypage = () => {
  return <MypageStack />;
};

export default Mypage;
