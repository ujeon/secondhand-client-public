import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import Slider from 'react-native-slider';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Search extends Component {
  constructor() {
    super();
    this.state = {
      sliderPrice: 1000,
      selectedBrand: null,
      selectedModel: null,
      brandModelList: [
        {
          id: 1,
          name: 'REBECA - model1'
        },
        {
          id: 2,
          name: 'REKA - model2'
        },
        {
          id: 3,
          name: 'BERO - model3'
        },
        {
          id: 4,
          name: 'AIR - model4'
        },
        {
          id: 5,
          name: 'TEST - model5'
        },
        {
          id: 6,
          name: 'WINGS23 - model6'
        }
      ],
      searchResult: []
    };
  }

  componentDidMount() {
    // fetch('http://127.0.0.1:8000/crawler/all')
    //   .then(res => res.json())
    //   .then(res => {
    //     let count = 0;
    //     const result = [];
    //     let temp = {};
    //     for (const value of res) {
    //       temp.id = count;
    //       temp.name = value;
    //       result.push(temp);
    //       temp = {};
    //       count++;
    //     }
    //     this.setState({
    //       brandModelList: this.state.brandModelList.concat(result)
    //     });
    //   });
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
            placeholder: 'search Brand / Model',
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
          onPress={() => {
            console.log({
              min_price: 1000,
              max_price: sliderPrice,
              brand: selectedBrand,
              model: selectedModel
            });
            // return fetch(`http://127.0.0.1:8000/crawler/search`, {
            //   method: 'POST',
            //   body: JSON.stringify({
            //     min_price: 1000,
            //     max_price: sliderPrice,
            //     brand: selectedBrand,
            //     model: selectedModel
            //   })
            // })
            //   .then(res => res.json())
            //   .then(res => {
            //     this.setState({
            //       searchResult: searchResult.concat(res)
            //     });
            //   })
            //   .catch(err => console.error(err));
          }}
        />
        <View>
          <Text>Result Component will be located below here</Text>
        </View>
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
