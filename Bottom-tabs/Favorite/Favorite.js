import React from "react";
import { View, Text, AsyncStorage, ScrollView, StyleSheet } from "react-native";
import Constants from "expo-constants";

import ProductList from "../components/productList";

export default class Favorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignIn: undefined,
      favoriteData: {}
    };
  }

  async componentDidMount() {
    this.onLoad();
  }

  onLoad = () => {
    this.props.navigation.addListener("willFocus", () => {
      this.checkIsSignIn();
      this.checkFavoriteStatus();
    });
  };

  checkFavoriteStatus = () => {
    const temp = {};
    temp.filtered_data = this.props.screenProps.favoriteData;
    this.setState({ favoriteData: temp });
  };

  checkIsSignIn = () => {
    AsyncStorage.getItem("token", (err, result) => {
      if (result !== null) {
        this.setState({ isSignIn: true });
      } else {
        this.setState({ isSignIn: false });
      }
    });
  };

  toggleFavorite = id => {
    const clonedFavoriteData = this.state.favoriteData.filtered_data.slice();

    if (clonedFavoriteData.length !== 0) {
      for (let i = 0; i < clonedFavoriteData.length; i++) {
        if (clonedFavoriteData[i].id === id) {
          clonedFavoriteData.splice(i, 1);
        }
      }
    }

    this.props.screenProps.handleFavorite(clonedFavoriteData);

    const temp = {};
    temp.filtered_data = clonedFavoriteData;

    this.setState({
      favoriteData: temp
    });
  };

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.mainContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusBar} />
        <View style={styles.titleContainer}>
          <Text style={styles.tabTitle}>FAVORITE</Text>
        </View>
        {this.state.isSignIn === true ? (
          <ProductList
            data={this.state.favoriteData}
            toggleFavorite={this.toggleFavorite}
            isFavPage={true}
          />
        ) : (
          <Text>회원가입을 하시면 즐겨찾기 추가가 가능합니다 :)</Text>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 20
  },
  statusBar: {
    height: Constants.statusBarHeight
  },
  titleContainer: {
    marginBottom: "2%"
  },
  tabTitle: {
    fontSize: 40,
    color: "#a773ca"
  }
});
