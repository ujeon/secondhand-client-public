import React from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";

import ProductList from "../components/productList";

export default class Favorite extends React.Component {
  constructor() {
    super();
    this.state = {
      isSignIn: undefined,
      favoriteData: []
    };
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      let favoriteData = await AsyncStorage.getItem("favoriteData").then(res =>
        JSON.parse(res)
      );

      let temp = {};
      temp.filtered_data = favoriteData;

      this.setState({
        favoriteData: temp,
        isSignIn: true
      });
    } else {
      this.setState({
        isSignIn: false
      });
    }
  }

  toggleFavorite = id => {
    const clonedFavoriteData = this.state.favoriteData.filtered_data.slice();

    for (let i = 0; i < clonedFavoriteData.length; i++) {
      if (clonedFavoriteData[i].id === id) {
        clonedFavoriteData.splice(i, 1);
      }
    }

    AsyncStorage.setItem("favoriteData", JSON.stringify(clonedFavoriteData));

    let temp = {};
    temp.filtered_data = clonedFavoriteData;

    this.setState({
      favoriteData: temp
    });
  };

  render() {
    if (this.state.isSignIn) {
      return (
        <View style={styles.containter}>
          <View style={styles.header}>
            <Text>favorite tab</Text>
          </View>
          <View style={styles.content}>
            <ProductList
              data={this.state.favoriteData}
              toggleFavorite={this.toggleFavorite}
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.containter}>
        <View style={styles.header}>
          <Text>favorite tab</Text>
        </View>
        <View style={styles.content}>
          <Text>회원가입을 하시면 즐겨찾기 추가가 가능합니다.</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containter: { flex: 1 },
  header: { flex: 1, marginBottom: "5%", backgroundColor: "blue" },
  content: {
    flex: 5
  }
});
