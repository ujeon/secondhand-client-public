import React, { Component } from 'react';
import { View, Text, Linking, StyleSheet, Picker } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: {},
      data: this.props.data,
      selectedValue: '최신순'
    };
  }

  async componentDidMount() {
    await this.getLocationAsync();
    const stateData = this.state.data;
    stateData.filtered_data.sort(
      (a, b) => new Date(b.posted_at) - new Date(a.posted_at)
    );
    const sortedData = this.state.data.filtered_data.map(data => {
      if (data.location !== '-') {
        const arrLoc = data.location.split('-');
        const distance = this.getDistanceFromLatLonInKm(
          this.state.currentLocation.latitude,
          this.state.currentLocation.longitude,
          Number(arrLoc[0]),
          Number(arrLoc[1])
        );
        data.distance = distance;
        return data;
      }
      if (data.location === '-') {
        data.distance = Infinity;
        return data;
      }
    });

    stateData.filtered_data = sortedData;

    this.setState({
      data: stateData
    });
  }

  getLocationAsync = async () => {
    await Permissions.askAsync(Permissions.LOCATION);

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });

    const coordinates = {};
    coordinates.latitude = location.coords.latitude;
    coordinates.longitude = location.coords.longitude;
    this.setState({
      currentLocation: { ...coordinates }
    });
  };

  getDistanceFromLatLonInKm = (lat1, lng1, lat2, lng2) => {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  sortResultData = e => {
    this.setState({
      selectedValue: e
    });
    const stateData = this.state.data;
    if (e === '최신순') {
      stateData.filtered_data.sort(
        (a, b) => new Date(b.posted_at) - new Date(a.posted_at)
      );
    } else if (e === '가격내림차순') {
      stateData.filtered_data.sort((a, b) => b.price - a.price);
    } else if (e === '가격오름차순') {
      stateData.filtered_data.sort((a, b) => a.price - b.price);
    } else if (e === '거리순') {
      stateData.filtered_data.sort((a, b) => a.distance - b.distance);
    }
    this.setState({
      data: stateData
    });
  };

  render() {
    // NOTE 어느 리스트를 전달 받는지에 따라 변수 할당을 다르게 합니다. (즐겨찾기 리스트인지, 제품 검색 결과인지)
    let filteredData;
    let averagePrice;
    let favoriteList;
    if (this.state.data) {
      filteredData = this.state.data.filtered_data;
      averagePrice = this.state.data.average_price;
    } else if (this.state.favoriteList) {
      favoriteList = this.state.favoriteList;
    }

    // NOTE 즐겨찾기가 추가 되어 있으면 빈 하트 아이콘, 아니면 일반 하트 아이콘(prop으로 전달 받아야 함)
    // FIXED 빈 하트 아이콘 로딩이 안되요 ㅠㅠ
    const isFavorite = false;
    let favoriteIcon;
    isFavorite
      ? (favoriteIcon = 'favorite')
      : (favoriteIcon = 'favorite-border');

    // NOTE average_price 변수가 존재하면 해당 객체에 존재하는 평균가격을 할당하고, 그렇지 않으면 '정보 없음' 이라고 표시합니다.
    let average;
    averagePrice
      ? (average = averagePrice.average_price)
      : (average = '정보 없음');

    // NOTE filteredData(검색 결과)가 존재하면 list 변수는 filteredData를 할당받고, favoriteList(즐겨찾기)가 존재하면 list는 favoriteList를 할당받습니다.
    let list;
    if (filteredData) {
      list = filteredData;
    } else {
      list = favoriteList;
    }

    return (
      <View>
        <Picker
          selectedValue={this.state.selectedValue}
          style={{ height: 50, width: 200 }}
          onValueChange={itemValue => this.sortResultData(itemValue)}
        >
          <Picker.Item label='최신순' value='최신순' key='최신순' />
          <Picker.Item
            label='가격오름차순'
            value='가격오름차순'
            key='가격오름차순'
          />
          <Picker.Item
            label='가격내림차순'
            value='가격내림차순'
            key='가격내림차순'
          />
          <Picker.Item label='거리순' value='거리순' key='거리순' />
        </Picker>
        {list.map(l => {
          // NOTE 데이터에 지역정보가 존재하면 해당 지역을 표시하고, 그렇지 않은 경우 대체 문구를 표시합니다.
          let location;
          l.location === '-'
            ? (location = '지역정보 없음')
            : (location = l.location);

          return (
            <ListItem
              key={l.id}
              leftAvatar={{ source: { uri: l.img_url }, size: 70 }}
              title={`${l.brand} / ${l.model}`}
              subtitle={
                <View>
                  <Text>{`판매가: ${l.price} / 평균가: ${average}`}</Text>
                  <View style={styles.details}>
                    <Icon name='md-pin' type='ionicon' size={18} />
                    <View style={styles.location}>
                      <Text>{location}</Text>
                    </View>
                  </View>
                  <View>
                    <Text>{l.market}</Text>
                  </View>
                </View>
              }
              onPress={() => Linking.openURL(l.url)}
              rightIcon={
                <Icon
                  name={favoriteIcon}
                  type='material'
                  color='#f9b0c3'
                  size={40}
                  onPress={() =>
                    console.log('즐겨 찾기 상태를 변경해야 합니다.')
                  }
                />
              }
              bottomDivider
            />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  details: { flex: 1, flexDirection: 'row', marginBottom: '5%' },
  location: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: '1%'
  },
  market: {
    flex: 1,
    justifyContent: 'space-between',
    width: '50%'
  }
});

export default ProductList;
