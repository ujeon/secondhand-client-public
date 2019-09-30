import React, { Component } from "react";
import { Text, View, Button } from "react-native";

export default class Select extends Component {
  render() {
    return (
      <View>
        <Text> select page </Text>
        <Button
          title="가즈앗"
          onPress={() => {
            this.props.navigation.push("result");
          }}
        />
      </View>
    );
  }
}
