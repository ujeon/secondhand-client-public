import React, { Component } from 'react';
import { Text, View, Button, ScrollView, StyleSheet } from 'react-native';
import Slider from 'react-native-slider';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductList from "../components/productList";


export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      sliderPrice: 1000,
      selectedBrand: null,
      selectedModel: null,
      brandModelList: [],
      searchResult: null,
    };
  }

  async componentDidMount() {
    let brandModel = await fetch('http://3.17.152.1:8000/api/list/')
      .then(res => res.json())
      .then(res => res)
      brandModel = brandModel.map((element, i) => {
        const temp = {}
        temp.id = i
        temp.name = `${element.brand} - ${element.model}`
        return temp
      })
      this.setState({brandModelList: brandModel})
  }

    selectedBrandModel = async () => {
      const searchData = await fetch('http://3.17.152.1:8000/api/search/', {
      method: 'POST',
      body: JSON.stringify({
        min_price: 1000,
        max_price: this.state.sliderPrice,
        brand: this.state.selectedBrand,
        model: this.state.selectedModel
      })
    })
      .then(res => res.json())
      .then(res => res)
      .catch(err => console.error(err));
      console.log("검색결과", searchData)
      const result = {}
      result.filtered_data = searchData
      this.setState({
        searchResult: result
      })
    }

  render() {
    const {
      sliderPrice,
      selectedBrand,
      selectedModel,
      brandModelList,
      searchResult
    } = this.state;

    return (
      <View style={styles.container}>
        <Text>원하는 가격범위를 설정해 주세요</Text>
        <Slider
          style={{ width: 350, height: 40 }}
          minimumValue={1000}
          maximumValue={1000000}
          step={1000}
          value={sliderPrice}
          onValueChange={select => {
            this.setState({
              sliderPrice: select
            });
          }}
          minimumTrackTintColor='#000'
          maximumTrackTintColor='#ccc'
        />
        <Text>{sliderPrice}원 미만</Text>
        <SearchableDropdown
          multi={false}
          onItemSelect={item => {
            const separateBrandModel = item.name.split(' - ');
            const brand = separateBrandModel[0];
            const model = separateBrandModel[1];
            this.setState({
              selectedBrand: brand,
              selectedModel: model
            });
          }}
          containerStyle={{ padding: 5 }}
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: '#fff',
            borderColor: '#00a8ff',
            borderWidth: 1,
            borderRadius: 5
          }}
          itemTextStyle={{ color: '#222' }}
          itemsContainerStyle={{ maxHeight: 140 }}
          items={brandModelList}
          resetValue={false}
          textInputProps={{
            placeholder: '찾으시는 브랜드 또는 모델을 입력해주세요',
            underlineColorAndroid: 'transparent',
            style: {
              padding: 12,
              borderWidth: 1,
              borderColor: '#2f3640',
              borderRadius: 5
            }
          }}
          listProps={{
            nestedScrollEnabled: true
          }}
        />
        <Button
          icon={<Icon name='search' size={15} color='white' />}
          title='검색'
          iconRight={true}
          onPress={() => this.selectedBrandModel()}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
        {this.state.searchResult ? <ProductList data={this.state.searchResult} /> : <View><Text>브랜드와 모델을 선택해주세요</Text></View>  }
        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: 'center'
  }
});
