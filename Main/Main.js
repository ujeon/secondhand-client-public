import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import SignIn from './signIn'
import SignUp from './signUp'
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
    initialRouteName: "signin"
  }
);

const MainStack = createAppContainer(MainStackNav);

const Main = () => {
  return <MainStack />;
};

export default Main;

// class UserMain extends Component {
//   render() {
//     return (
//       <View>
//         <Text> textInComponent </Text>
//         <Input />
//         <Button
//           title="로그인"
//           onPress={() => {
//             this.props.navigation.navigate("nav");
//           }}
//         />
//         <Button
//           title="회원가입"
//           onPress={() => {
//             this.props.navigation.navigate("nav");
//           }}
//         />
//       </View>
//     );
//   }
// }