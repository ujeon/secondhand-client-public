import React, { Component } from "react";
import { View, AsyncStorage, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-elements";
import Constants from "expo-constants";
import Loading from "../components/loading";

export default class MypageMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      userData: null,
      loading: false
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

  getUserInfo = async token => {
    const userInfo = await fetch("http://3.17.152.1:8000/user/info/", {
      headers: {
        token
      }
    })
      .then(res => res.json())
      .then(res => res)
      .catch(err => console.error(err));
    return userInfo;
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    const token = await AsyncStorage.getItem("token");
    const userData = await this.getUserInfo(token);
    const signupDate = userData.signup_date.split("-");
    userData.signup_date = `${signupDate[0]}년 ${signupDate[1]}월 ${
      signupDate[2]
    }일`;
    this.setState({ token, userData, loading: false });
  };

  componentDidUpdate(prevProps) {
    const prevToken = prevProps.navigation.getParam("token");
    const newToken = this.props.navigation.getParam("token");
    if (prevToken !== newToken) {
      this.setState({ token: newToken });
    }
  }

  render() {
    return !this.state.loading ? (
      this.state.token ? (
        <View style={styles.maincontainer}>
          <View style={styles.statusBar} />
          <Text style={styles.title}>MY PAGE</Text>
          <View>
            <Card
              containerStyle={{
                paddingLeft: 30,
                paddingRight: 30,
                marginTop: "3%",
                marginBottom: "3%",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "#9151BD",
                borderRadius: 10,
                position: "relative",
                elevation: 6
              }}
            >
              <Text style={styles.cardTitleFirst}>이메일</Text>
              <Text style={styles.cardText}>{this.state.userData.email}</Text>
              <Text style={styles.cardTitle}>사용자이름</Text>
              <Text style={styles.cardText}>
                {this.state.userData.nickname}
              </Text>
              <Text style={styles.cardTitle}>가입일</Text>
              <Text style={styles.cardText}>
                {this.state.userData.signup_date}
              </Text>
            </Card>
          </View>
          <Button
            title="Credit"
            onPress={this.goCredit}
            buttonStyle={{
              backgroundColor: "#9151BD",
              height: 50,
              borderRadius: 10,
              marginTop: 20,
              marginBottom: 5
            }}
          />
          <Button
            title="로그아웃"
            onPress={this.logOut}
            buttonStyle={{
              backgroundColor: "#9151BD",
              height: 50,
              borderRadius: 10
            }}
          />
        </View>
      ) : (
        <View />
      )
    ) : (
      <Loading />
    );
  }
}

const styles = StyleSheet.create({
  maincontainer: {
    padding: 20
  },
  statusBar: {
    height: Constants.statusBarHeight
  },
  title: {
    color: "#a773ca",
    fontSize: 40
  },
  cardTitleFirst: {
    fontSize: 15,
    color: "#676666",
    position: "relative",
    padding: "1%",
    marginTop: "5%",
    letterSpacing: 1,
    textAlign: "center"
  },
  cardTitle: {
    fontSize: 15,
    color: "#676666",
    position: "relative",
    padding: "1%",
    marginBottom: "1%",
    letterSpacing: 1,
    textAlign: "center"
  },
  cardText: {
    fontSize: 18,
    color: "#676666",
    position: "relative",
    padding: "1%",
    marginBottom: "5%",
    letterSpacing: 1,
    textAlign: "center"
  }
});
