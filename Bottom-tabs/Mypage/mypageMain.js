import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import { Text, Button } from "react-native-elements";

export default class MypageMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null
    };
  }

  goCredit = () => {
    this.props.navigation.push("credit");
  };

  logOut = async () => {
    await AsyncStorage.removeItem("token");
    const token = await AsyncStorage.getItem("token");
    this.setState({ token });
    this.props.screenProps();
  };

  getUserInfo = () => {};

  componentDidMount = async () => {
    const token = await AsyncStorage.getItem("token");
    this.setState({ token });
  };

  componentDidUpdate(prevProps) {
    const prevToken = prevProps.navigation.getParam("token");
    const newToken = this.props.navigation.getParam("token");
    if (prevToken !== newToken) {
      this.setState({ token: newToken });
    }
  }

  render() {
    return this.state.token ? (
      <View>
        <Text h4> 여기에 유저 정보가 표시됩니다 </Text>
        <Button title="Credit" onPress={this.goCredit} />
        <Button title="로그아웃" onPress={this.logOut} />
      </View>
    ) : (
      <View />
    );
  }
}
