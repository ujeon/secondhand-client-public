import React, { Component } from "react";
import { View, AsyncStorage, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-elements";
import Constants from "expo-constants";

export default class MypageMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      userData: null
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
    const token = await AsyncStorage.getItem("token");
    const userData = await this.getUserInfo(token);
    console.log("유저정보", userData);
    this.setState({ token, userData });
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
      <View style={styles.statusBar}>
        <View>
          <Card
            containerStyle={{
              padding: 50,
              flex: 1,
              margin: 5,
              justifyContent: "space-around",
              marginTop: 20,
              borderStyle: "solid",
              borderWidth: 1,
              borderRadius: 0.5,
              borderColor: "#972DDE"
            }}
          >
            <Text style={styles.cardTitle}>{this.state.userData.email}</Text>
            <Text style={styles.cardText}>{this.state.userData.nickname}</Text>
          </Card>
        </View>
        <Button
          title="Credit"
          onPress={this.goCredit}
          buttonStyle={{
            backgroundColor: "#972DDE",
            height: 50,
            marginTop: 20,
            marginBottom: 5
          }}
        />
        <Button
          title="로그아웃"
          onPress={this.logOut}
          buttonStyle={{
            backgroundColor: "#972DDE",
            height: 50,
            marginTop: 20,
            marginBottom: 5
          }}
        />
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  statusBar: {
    height: Constants.statusBarHeight
  },
  text: {
    margin: 20,
    justifyContent: "center",
    textAlign: "center",
    color: "#972DDE",
    fontSize: 20,
    fontWeight: "200"
  },
  container: {
    padding: 0,
    flex: 1,
    margin: 20,
    justifyContent: "center",
    marginTop: 80,
    borderStyle: "solid",
    borderColor: "#972DDE"
  },
  cardTitle: {
    fontSize: 20,
    color: "#6a89cc",
    position: "relative"
  },
  cardText: {
    fontSize: 15,
    color: "#6a89cc",
    position: "relative"
  }
});
