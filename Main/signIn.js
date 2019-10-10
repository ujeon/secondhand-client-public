import React from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  ToastAndroid,
  BackHandler
} from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import * as Crypto from "expo-crypto";
import { emitNotification } from "expo/build/Notifications/Notifications";
import getAuth from "../fetchFns/fetchFns";

const { width, height } = Dimensions.get("window");

export default class SignIn extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isValid: false,
      email: undefined,
      password: undefined,
      isSignIn: undefined,
      errMsg: ""
    };
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  async componentDidMount() {
    const secure = await AsyncStorage.getItem("token");
    const status = await getAuth(secure);
    if (status === 200) {
      this.setState({ isValid: true });
    } else if (status === 403) {
      this.setState({ isValid: false });
    }
    if (this.state.isValid) {
      this.props.navigation.push("nav", {
        popToTop: this.props.navigation.popToTop
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  requestUserSignIn = async () => {
    let { email, password } = this.state;
    if (!email && !password) {
      this.setState({
        errMsg: "아이디와 비밀번호를 입력해주세요."
      });
    } else if (!email || !password) {
      if (!email) {
        this.setState({
          errMsg: "이메일을 입력해주세요."
        });
      } else {
        this.setState({
          errMsg: "비밀번호를 입력해주세요."
        });
      }
    } else if (email && password) {
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
        .catch(err => console.error(err));
    }
  };

  handleSignInBtn = async () => {
    await this.requestUserSignIn();

    const token = await AsyncStorage.getItem("token");

    if (this.state.isSignIn === true) {
      this.props.navigation.push("nav", {
        popToTop: this.props.navigation.popToTop,
        token
      });
    } else {
      console.error("로그인에 실패했습니다");
    }
  };

  handleBackButtonClick() {
    if (this.exitApp === undefined || !this.exitApp) {
      ToastAndroid.show("한번 더 누르시면 종료됩니다.", ToastAndroid.SHORT);
      this.exitApp = true;

      this.timeout = setTimeout(
        () => {
          this.exitApp = false;
        },
        2000 // 2초
      );
    } else {
      clearTimeout(this.timeout);

      BackHandler.exitApp(); // 앱 종료
    }
    return true;
  }

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
          onChangeText={password =>
            this.setState({
              password
            })
          }
          placeholder="  Password"
          placeholderTextColor="grey"
          errorMessage={this.state.errMsg}
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
          title="로그인"
          onPress={() => {
            this.handleSignInBtn();
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
          title="회원가입"
          onPress={() =>
            this.props.navigation.navigate("signup", {
              greeting: "Hallo"
            })
          }
          buttonStyle={{
            backgroundColor: "#9151BD",
            height: 50,
            borderRadius: 10
          }}
        />
        <Text
          style={{
            alignSelf: "center",
            marginTop: height * 0.15,
            color: "#9151BD"
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
    backgroundColor: "#FEF68C",
    padding: 20,
    paddingBottom: height * 0.05,
    borderWidth: 1
  }
});
