import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView, Dimensions, AsyncStorage } from "react-native";
import ProductList from "../components/productList";
import AverageMonthly from "./averageMonthly";

const { width } = Dimensions.get("window");

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      model: this.props.navigation.getParam("model")
      favoriteData: null
    };
  }

  async componentDidMount() {
    const brand = this.props.navigation.getParam('brand')
    const model = this.props.navigation.getParam('model')
   
    const data = await fetch(`http://3.17.152.1:8000/api/${brand}/${model}/info`)
    .then(res => res.json())
    .then(res => res)
    .catch(err => console.error(err))
    
    const token = await AsyncStorage.getItem("token");
    const favoriteData = await fetch('http://3.17.152.1:8000/user/favorite/info/', {
      headers: { token }
    }).then(res => res.json())
    .then(res => res)
    .catch(err => console.error(err))

    const filteredData = data.filtered_data.map((el) => {
      for(let i=0 ; i<favoriteData.length ; i++) {
        if(favoriteData[i].id === el.id) {
          el.isFavorite = true
          break
        } else {
          el.isFavorite = false
        }
      } 
      return el
    })
    data.filtered_data = filteredData
    this.setState({
      data, favoriteData
    })
  }

  toggleFavorite = (id) => {
    const clonedData = { ...this.state.data}
    clonedData.filtered_data = clonedData.filtered_data.map((el) => {
      if(el.id === id) {
        if(el.isFavorite === true) {
          el.isFavorite = false
        } else {
          el.isFavorite = true
        }
      }
      return el
    })
    const clonedFavoriteData = this.state.favoriteData.slice()
    for(let i=0 ; i<clonedFavoriteData.length ; i++) {
      if(clonedFavoriteData[i].id === id) {
        clonedFavoriteData.splice(i, 1)
      } 
    }
    this.setState({
      data: clonedData, 
      favoriteData: clonedFavoriteData
    })
  }

  render() {
    if (this.state.data) {
      return (
        // NOTE 종단 스크롤 뷰 안에 횡단 스크롤 뷰를 넣으면 가로, 세로 스크롤 모두 가능!
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView
            style={styles.container}
            pagingEnabled={true}
            horizontal={true}
            decelerationRate={0}
            snapToInterval={width - 60}
            snapToAlignment="center"
            contentInset={{
              top: 0,
              left: 30,
              bottom: 0,
              right: 30
            }}
            showsHorizontalScrollIndicator={false}
          >
            <AverageMonthly model={this.state.model} />
          </ScrollView>
          <ProductList data={this.state.data} toggleFavorite={this.toggleFavorite}/>
        </ScrollView>
      );
    }
    return (
      <View>
        <Text>로딩중</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    paddingTop: "5%"
  },
  title: {
    fontSize: 26
  },
  view: {
    marginTop: "1.5%",
    backgroundColor: "#2e2e2e",
    width: width - 80,
    margin: 10,
    height: 300,
    borderRadius: 10,
    paddingHorizontal: 30
  }
});
