import React from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
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
      nickErrMsg: "",
      passwordErrMsg: ""
    };
  }

  handleSignUpButtonClicked = async () => {
    let { email, nickname, password } = this.state;

    if (!email && !nickname && !password) {
      this.setState({
        isSignUp: false,
        emailErrMsg: "이메일을 입력해주세요.",
        nickErrMsg: "닉네임을 입력해주세요.",
        passwordErrMsg: "비밀번호를 입력해주세요."
      });
    } else if (!email || !nickname || !password) {
      if (!email && !nickname) {
        this.setState({
          isSignUp: false,
          emailErrMsg: "이메일을 입력해주세요.",
          nickErrMsg: "닉네임을 입력해주세요.",
          passwordErrMsg: ""
        });
      } else if (!email && !password) {
        this.setState({
          isSignUp: false,
          emailErrMsg: "이메일을 입력해주세요.",
          nickErrMsg: "",
          passwordErrMsg: "비밀번호를 입력해주세요."
        });
      } else if (!nickname && !password) {
        this.setState({
          isSignUp: false,
          emailErrMsg: "",
          nickErrMsg: "닉네임을 입력해주세요.",
          passwordErrMsg: "비밀번호를 입력해주세요."
        });
      } else if (!email) {
        this.setState({
          isSignUp: false,
          emailErrMsg: "이메일을 입력해주세요.",
          nickErrMsg: "",
          passwordErrMsg: ""
        });
      } else if (!nickname) {
        this.setState({
          isSignUp: false,
          emailErrMsg: "",
          nickErrMsg: "닉네임을 입력해주세요.",
          passwordErrMsg: ""
        });
      } else if (!password) {
        this.setState({
          isSignUp: false,
          emailErrMsg: "",
          nickErrMsg: "",
          passwordErrMsg: "비밀번호를 입력해주세요."
        });
      }
    }

    if (email && nickname && password) {
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
              nickErrMsg: "이미 존재하는 닉네임이에요.",
              passwordErrMsg: ""
            });
          } else if (res.emailErrMsg === "이미 존재하는 이메일이에요.") {
            this.setState({
              isSignUp: false,
              emailErrMsg: "이미 존재하는 이메일이에요.",
              nickErrMsg: "",
              passwordErrMsg: ""
            });
          } else if (res.nickErrMsg === "이미 존재하는 닉네임이에요.") {
            this.setState({
              isSignUp: false,
              nickErrMsg: "이미 존재하는 닉네임이에요.",
              emailErrMsg: "",
              passwordErrMsg: ""
            });
          } else {
            this.setState({ isSignUp: true, emailErrMsg: "", nickErrMsg: "" });
          }
        })
        .catch(err => console.error(err));
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Input
          onChangeText={email =>
            this.setState({
              email
            })
          }
          placeholder="   E-mail"
          errorMessage={this.state.emailErrMsg}
          placeholderTextColor="grey"
          leftIcon={
            <Icon
              name="envelope"
              size={18}
              color="#9151BD"
              type="font-awesome"
              containerStyle={{
                marginRight: 10
              }}
            />
          }
          inputContainerStyle={{
            borderBottomColor: "#9151BD"
          }}
        />
        <Input
          onChangeText={nickname =>
            this.setState({
              nickname
            })
          }
          placeholder="   nickname"
          placeholderTextColor="grey"
          errorMessage={this.state.nickErrMsg}
          leftIcon={
            <Icon
              name="user"
              size={24}
              color="#9151BD"
              type="font-awesome"
              containerStyle={{
                marginRight: 10
              }}
            />
          }
          inputContainerStyle={{
            borderBottomColor: "#9151BD"
          }}
        />
        <Input
          onChangeText={password =>
            this.setState({
              password
            })
          }
          placeholder="   Password"
          placeholderTextColor="grey"
          errorMessage={this.state.passwordErrMsg}
          secureTextEntry={true}
          leftIcon={
            <Icon
              name="lock"
              size={26}
              color="#9151BD"
              type="font-awesome"
              containerStyle={{
                marginRight: 10
              }}
            />
          }
          inputContainerStyle={{
            borderBottomColor: "#9151BD"
          }}
        />
        <Button
          title="회원가입"
          onPress={async () => {
            await this.handleSignUpButtonClicked();
            if (this.state.isSignUp) {
              this.props.navigation.navigate("signin");
            }
          }}
          buttonStyle={{
            backgroundColor: "#9151BD",
            height: 50,
            marginTop: 20,
            marginBottom: 5,
            borderRadius: 10
          }}
        />
        <Button
          title="뒤로가기"
          onPress={() => this.props.navigation.goBack()}
          buttonStyle={{
            backgroundColor: "#9151BD",
            height: 50,
            marginBottom: 5,
            borderRadius: 10
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FEF68C",
    padding: 20,
    borderWidth: 1
  }
});
