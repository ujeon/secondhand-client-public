import React from "react";
import { View, Text, StyleSheet, AsyncStorage } from "react-native";

import ProductList from "../components/productList";


export default class Favorite extends React.Component {
  constructor() {
    super()
    this.state = {
      isSignIn: undefined,
      favoriteData: null,
    }
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem("token");
    if(token) {
      let favoriteData = await fetch('http://3.17.152.1:8000/user/favorite/info/', {
      headers: { token }
      }).then(res => res.json())
      .then(res => res)
      .catch(err => console.error(err))
      
      favoriteData = favoriteData.map((el) => {
        el.isFavorite = true
        return el
      })
      this.setState({
        favoriteData,
        isSignIn: true
      })
    } else {
      this.setState({
        isSignIn: false
      })
    }
  }
  
  toggleFavorite = (id) => {
    const favoriteData = this.state.favoriteData.slice()
    for(let i=0 ; i<favoriteData.length ; i++) {
      if(favoriteData[i].id === id) {
        favoriteData.splice(i,1)
      }
    }
    this.setState({
      favoriteData
    })
  }
  
  render() {
    if (this.state.isSignIn) {
      return (
        <View style={styles.containter}>
          <View style={styles.header}>
            <Text>favorite tab</Text>
          </View>
          <View style={styles.content}>
            <ProductList favoriteList={this.state.favoriteData} toggleFavorite={this.toggleFavorite} />
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
};

const styles = StyleSheet.create({
  containter: { flex: 1 },
  header: { flex: 1, marginBottom: "5%", backgroundColor: "blue" },
  content: {
    flex: 5
  }
});

