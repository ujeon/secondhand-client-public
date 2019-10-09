import React from "react";
import { View, Text, Image } from "react-native";

const Loading = () => {
  return (
    <View
      style={{
        backgroundColor: "#03AEEF",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Image source={require("./jellyfish2.gif")} />
      <Text style={{ textAlign: "center" }}> Loading... </Text>
    </View>
  );
};

export default Loading;
