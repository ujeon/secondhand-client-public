import React from "react";
import { View, Button, AsyncStorage } from "react-native";
import { Input, Icon } from "react-native-elements";
import * as Crypto from "expo-crypto";

export default class SignIn extends React.Component {
  constructor() {
    super();
    this.state = {
      email: undefined,
      password: undefined,
      isSignIn: undefined,
      errMsg: ""
    };
  }

  handleSignInButtonClicked = async () => {
    let { email, password } = this.state;
    password = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    await fetch("http://10.0.2.2:8000/user/signin/", {
      method: "POST",
      body: JSON.stringify({ email, password })
    })
      .then(async res => {
        const token = res.headers.get("token");
        if (!token) {
          this.setState({
            isSignIn: false,
            errMsg: "아이디 혹은 비밀번호를 다시 확인해주세요."
          });
        } else {
          this.setState({ isSignIn: true });
          await AsyncStorage.setItem("token", token);
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    console.log("로그인 페이지 상태", this.state);
    return (
      <View>
        <Input
          onChangeText={email =>
            this.setState({
              email
            })
          }
          placeholder="   E-mail"
          leftIcon={
            <Icon name="envelope" size={24} color="grey" type="font-awesome" />
          }
        />
        <Input
          onChangeText={password =>
            this.setState({
              password
            })
          }
          placeholder="   Password"
          errorMessage={this.state.errMsg}
          secureTextEntry={true}
          leftIcon={
            <Icon name="lock" size={26} color="grey" type="font-awesome" />
          }
        />
        <Button
          title="로그인"
          onPress={async () => {
            await this.handleSignInButtonClicked();
            if (this.state.isSignIn === true) {
              this.props.navigation.navigate("nav", {
                greeting: "로그인 되었습니다."
              });
            } else {
              console.log("로그인에 실패했습니다");
            }
          }}
        />
        <Button
          title="회원가입"
          onPress={() =>
            this.props.navigation.navigate("signup", {
              greeting: "Hallo"
            })
          }
        />
      </View>
    );
  }
}
