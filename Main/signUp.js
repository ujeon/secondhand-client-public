import React from "react";
import { View, Button } from "react-native";
import { Input, Icon } from "react-native-elements";
import * as Crypto from "expo-crypto";

export default class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      email: undefined,
      nickname: undefined,
      password: undefined,
      isSignUp: undefined,
      emailErrMsg: "",
      nickErrMsg: ""
    };
  }

  handleSignUpButtonClicked = async () => {
    let { email, nickname, password } = this.state;
    password = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
    await fetch("http://3.17.152.1:8000/user/signup/", {
      method: "POST",
      body: JSON.stringify({ email, nickname, password })
    })
      .then(res => res.json())
      .then(res => {
        if (
          res.emailErrMsg === "이미 존재하는 이메일이에요." &&
          res.nickErrMsg === "이미 존재하는 닉네임이에요."
        ) {
          this.setState({
            isSignUp: false,
            emailErrMsg: "이미 존재하는 이메일이에요.",
            nickErrMsg: "이미 존재하는 닉네임이에요."
          });
        } else if (res.emailErrMsg === "이미 존재하는 이메일이에요.") {
          this.setState({
            isSignUp: false,
            emailErrMsg: "이미 존재하는 이메일이에요.",
            nickErrMsg: ""
          });
        } else if (res.nickErrMsg === "이미 존재하는 닉네임이에요.") {
          this.setState({
            isSignUp: false,
            nickErrMsg: "이미 존재하는 닉네임이에요.",
            emailErrMsg: ""
          });
        } else {
          this.setState({ isSignUp: true, emailErrMsg: "", nickErrMsg: "" });
        }
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <View>
        <Input
          onChangeText={email =>
            this.setState({
              email
            })
          }
          placeholder="   E-mail"
          errorMessage={this.state.emailErrMsg}
          leftIcon={
            <Icon name="envelope" size={24} color="grey" type="font-awesome" />
          }
        />
        <Input
          onChangeText={nickname =>
            this.setState({
              nickname
            })
          }
          placeholder="   nickname"
          errorMessage={this.state.nickErrMsg}
          leftIcon={
            <Icon name="user" size={24} color="grey" type="font-awesome" />
          }
        />
        <Input
          onChangeText={password =>
            this.setState({
              password
            })
          }
          placeholder="   Password"
          secureTextEntry={true}
          leftIcon={
            <Icon name="lock" size={26} color="grey" type="font-awesome" />
          }
        />
        <Button
          title="회원가입"
          onPress={async () => {
            await this.handleSignUpButtonClicked();
            if (this.state.isSignUp) {
              this.props.navigation.navigate("signin");
            }
          }}
        />
      </View>
    );
  }
}
