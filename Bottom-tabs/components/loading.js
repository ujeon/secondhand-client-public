import React from "react";
import { View, Text, Image } from "react-native";

const Loading = () => {
  return (
    <View style={{ backgroundColor: "#03AEEF", alignSelf: "center" }}>
      <Image source={require("./jellyfish2.gif")} />
      <Text style={{ textAlign: "center" }}> Loading... </Text>
    </View>
  );
};

export default Loading;
