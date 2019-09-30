import React, { Component } from "react";
import { Text, View, Button } from "react-native";

export default class Main extends Component {
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
        <Button
          title="눌러봐"
          onPress={() => {
            this.props.navigation.navigate("nav");
          }}
        />
      </View>
    );
  }
}
