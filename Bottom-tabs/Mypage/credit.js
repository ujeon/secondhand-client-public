import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Card, Icon } from "react-native-elements";

const credit = users => {
  users = [
    {
      name: "육광휘",
      githubID: "githubID @KHwii"
    },
    {
      name: "장우전",
      githubID: "githubID @Ujeon"
    },
    {
      name: "박찬현",
      githubID: "githubID @ekklesia11"
    },
    {
      name: "김정은",
      githubID: "githubID @kjeunn"
    }
  ];

  return (
    <View>
      <Text style={styles.text}>만든 해파리들</Text>
      {users.map((user, index) => (
        <View key={index}>
          <Card
            containerStyle={{
              padding: 50,
              flex: 1,
              margin: 5,
              justifyContent: "center",
              marginTop: 20,
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "#972DDE"
            }}
          >
            <Text style={styles.cardTitle}>{user.name}</Text>
            <Text style={styles.cardContent}>{user.githubID}</Text>
          </Card>
        </View>
      ))}
    </View>
  );
};

export default credit;

const styles = StyleSheet.create({
  text: {
    margin: 20,
    justifyContent: "center",
    textAlign: "center",
    color: "#972DDE",
    fontSize: 20,
    fontWeight: "200"
  },
  cardText: {
    fontSize: 20,
    color: "#6a89cc",
    position: "relative"
  }
});
