import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import Constants from "expo-constants";

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
    <View style={styles.maincontainer}>
      <View style={styles.statusBar} />
      <Text style={styles.title}>CREDIT</Text>
      {users.map((user, index) => (
        <View key={index}>
          <Card
            containerStyle={{
              padding: 50,
              flex: 1,
              marginBottom: "1%",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#FEF68C",
              borderRadius: 10,
              position: "relative",
              backgroundColor: "#FEF68C",
              elevation: 6
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
  cardTitle: {
    fontSize: 20,
    color: "#676666",
    position: "relative",
    padding: "1%",
    marginBottom: "1%"
  },
  cardContent: {
    fontSize: 20,
    color: "#676666",
    position: "relative",
    padding: "1%",
    marginBottom: "1%"
  }
});
