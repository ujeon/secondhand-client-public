import React from "react";

import { AsyncStorage } from "react-native";

import Main from "./Main/Main";
import Navigation from "./Navigation";

import getAuth from "./fetchFns/fetchFns";

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isValid: false
    };
  }

  async componentDidMount() {
    const secure = await AsyncStorage.getItem("token");
    const status = await getAuth(secure);
    if (status === 200) {
      this.setState({ isValid: true });
    } else if (status === 403) {
      this.setState({ isValid: false });
    }
  }

  //TOFIX 처음에 로딩 페이지를 보여주면 잠시 로그인 화면이 보이는 현상을 로딩 페이지로 숨기는 것 필요
  render() {
    if (this.state.isValid) {
      return <Navigation />;
    }
    return <Main />;
  }
}

export default App;
