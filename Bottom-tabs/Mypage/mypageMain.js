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
      <View>
        <Text h4> 로그인 해 주세요 </Text>
        <Button title="Credit" onPress={this.goCredit} />
        <Button
          title="로그인 하러가기"
          onPress={() => {
            this.props.navigation.navigate("signin", { page: "mypageMain" });
          }}
        />
      </View>
    );
  }
}
