import React, { Component } from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-elements";

export default class mypageMain extends Component {
  constructor(props) {
    super();
    this.state = {
      // 유저의 정보를 확인(토큰이나 세션 정보로 대체 필요)
      userId: 1
    };
  }

  // 유저가 로그인을 했을 때 유저 정보와 로그아웃 버튼을 보여주고
  // 로그인 정보가 없을 경우 크레딧 버튼만 보여준다

  goCredit = () => {
    this.props.navigation.push("credit");
  };

  logOut = () => {
    this.setState({ userId: 0 });
    this.props.navigation.navigate("main");
  };

  getUserInfo = () => {};

  render() {
    return this.state.userId ? (
      <View>
        <Text h4> 여기에 유저 정보가 표시됩니다 </Text>
        <Button title="Credit" onPress={this.goCredit} />
        <Button title="로그아웃" onPress={this.logOut} />
      </View>
    ) : (
      <View>
        <Text h4> 로그인 해 주세요 </Text>
        <Button title="Credit" onPress={this.goCredit} />
      </View>
    );
  }
}
