import React from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  Image,
  Text,
  Dimensions
} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import * as Crypto from "expo-crypto";

const { width, height } = Dimensions.get("window");

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

  requestUserSignIn = async () => {
    let { email, password } = this.state;
    password = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    await fetch("http://3.17.152.1:8000/user/signin/", {
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

  handleSignInBtn = async () => {
    await this.requestUserSignIn();

    const token = await AsyncStorage.getItem("token");

    if (this.state.isSignIn === true) {
      const page = this.props.navigation.getParam("page", "mypageMain");

      if (page) {
        this.props.navigation.navigate("mypageMain", { token });
      }
      this.props.navigation.navigate("nav");
    } else {
      console.log("로그인에 실패했습니다");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{
            width: width * 0.8,
            height: height * 0.25,
            alignSelf: "center",
            top: -30
          }}
          source={require("./logo.png")}
          resizeMode="contain"
        />
        <Input
          onChangeText={email =>
            this.setState({
              email
            })
          }
          placeholder="  E-mail"
          placeholderTextColor="#ffcccc"
          leftIcon={
            <Icon
              name="envelope"
              size={18}
              color="#972DDE"
              type="font-awesome"
              containerStyle={{
                marginRight: 10
              }}
            />
          }
          inputContainerStyle={{
            borderBottomColor: "#972DDE"
          }}
        />
        <Input
          onChangeText={password =>
            this.setState({
              password
            })
          }
          placeholder="  Password"
          placeholderTextColor="#ffcccc"
          errorMessage={this.state.errMsg}
          secureTextEntry={true}
          leftIcon={
            <Icon
              name="lock"
              size={26}
              color="#972DDE"
              type="font-awesome"
              containerStyle={{
                marginRight: 10
              }}
            />
          }
          inputContainerStyle={{
            borderBottomColor: "#972DDE"
          }}
        />
        <Button
          title="로그인"
          onPress={() => {
            this.handleSignInBtn();
          }}
          buttonStyle={{
            backgroundColor: "#972DDE",
            height: 50,
            marginTop: 20,
            marginBottom: 5
          }}
        />
        <Button
          title="회원가입"
          onPress={() =>
            this.props.navigation.navigate("signup", {
              greeting: "Hallo"
            })
          }
          buttonStyle={{
            backgroundColor: "#972DDE",
            height: 50
          }}
        />
        <Text
          style={{
            alignSelf: "center",
            marginTop: height * 0.15,
            color: "#972DDE"
          }}
        >
          copyright @ 2019
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F4E632",
    padding: 20,
    paddingBottom: height * 0.05,
    borderWidth: 1,
    borderColor: "red"
  }
});
