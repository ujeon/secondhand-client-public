import React, { Component } from "react";
import {
  View,
  Text,
  Linking,
  StyleSheet,
  Picker,
  AsyncStorage,
  Dimensions
} from "react-native";
import { ListItem, Icon } from "react-native-elements";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import env from "./env";

const { width, height } = Dimensions.get("window");

class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocation: {},
      data: null,
      selectedValue: "최신순",
      isFavPage: false
    };
  }

  async componentDidMount() {
    await this.getLocationAsync();
    await this.refineData();
    this.setState({ isFavPage: this.props.isFavPage });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      console.log(this.state.selectedValue);
      this.setState({ data: this.props.data });
      // this.refineData();
    }
  }

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        currentLocation: "-"
      });
    } else {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const coordinates = {};
      coordinates.latitude = location.coords.latitude;
      coordinates.longitude = location.coords.longitude;
      this.setState({
        currentLocation: { ...coordinates }
      });
    }
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
    // this.setState({
    //   selectedValue: e
    // });
    const stateData = this.state.data;
    if (e === "최신순") {
      stateData.filtered_data.sort(
        (a, b) => new Date(b.posted_at) - new Date(a.posted_at)
      );
    } else if (e === "가격내림차순") {
      stateData.filtered_data.sort((a, b) => b.price - a.price);
    } else if (e === "가격오름차순") {
      stateData.filtered_data.sort((a, b) => a.price - b.price);
    } else if (e === "거리순") {
      stateData.filtered_data.sort((a, b) => a.distance - b.distance);
    }
    this.setState({
      selectedValue: e,
      data: stateData
    });
  };

  getActualAddress = async (lat, long) => {
    try {
      const address = await fetch(
        `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${long},${lat}&orders=legalcode&output=json`,
        {
          method: "GET",
          headers: {
            "X-NCP-APIGW-API-KEY-ID": env.ID,
            "X-NCP-APIGW-API-KEY": env.KEY
          }
        }
      )
        .then(res => res.json())
        .then(res => res)
        .catch(err => err);
      const location = `${address.results[0].region.area2.name} ${address.results[0].region.area3.name}`;
      return location;
    } catch (err) {
      console.error(err);
    }
  };

  refineData = async () => {
    const stateData = this.props.data;
    stateData.filtered_data.sort(
      (a, b) => new Date(b.posted_at) - new Date(a.posted_at)
    );

    const sortedData = await Promise.all(
      stateData.filtered_data.map(async data => {
        try {
          if (data.location !== "-") {
            const arrLoc = data.location.split("-");
            if (this.state.currentLocation !== "-") {
              const distance = this.getDistanceFromLatLonInKm(
                this.state.currentLocation.latitude,
                this.state.currentLocation.longitude,
                Number(arrLoc[0]),
                Number(arrLoc[1])
              );

              data.distance = distance;
            } else {
              data.distance = Infinity;
            }

            // 좌표를 동으로 바꿔준다.
            const address = await this.getActualAddress(
              Number(arrLoc[0]),
              Number(arrLoc[1])
            );

            data.address = address;
            return data;
          }

          data.distance = Infinity;
          return data;
        } catch (err) {
          console.error(err);
        }
      })
    ).then(res => res);

    stateData.filtered_data = sortedData;

    this.setState({
      data: stateData
    });
  };

  render() {
    let list;
    if (this.state.data) {
      list = this.state.data.filtered_data;
    } else {
      return (
        <View style={styles.loading}>
          <Text>결과를 가져오는 중입니다. 잠시만 기다려주세요.</Text>
        </View>
      );
    }

    return (
      <View>
        {!this.state.isFavPage ? (
          <Picker
            selectedValue={this.state.selectedValue}
            style={styles.picker}
            onValueChange={itemValue => this.sortResultData(itemValue)}
          >
            <Picker.Item label="최신순" value="최신순" key="최신순" />
            <Picker.Item
              label="가격오름차순"
              value="가격오름차순"
              key="가격오름차순"
            />
            <Picker.Item
              label="가격내림차순"
              value="가격내림차순"
              key="가격내림차순"
            />
            <Picker.Item label="거리순" value="거리순" key="거리순" />
          </Picker>
        ) : (
          <View />
        )}
        <View style={styles.itemList}>
          {list.map(l => {
            // NOTE 데이터에 지역정보가 존재하면 해당 지역을 표시하고, 그렇지 않은 경우 대체 문구를 표시합니다.
            let location;
            l.location === "-"
              ? (location = "지역정보 없음")
              : l.distance === Infinity
              ? (location = `${l.address}`)
              : (location = `${l.address} ${parseInt(l.distance)}km`);

            // NOTE 즐겨찾기가 추가 되어 있으면 빈 하트 아이콘, 아니면 일반 하트 아이콘
            let favoriteIcon;
            l.isFavorite
              ? (favoriteIcon = "favorite")
              : (favoriteIcon = "favorite-border");

            return (
              <ListItem
                key={l.id}
                leftAvatar={{ source: { uri: l.img_url }, size: 85 }}
                title={`${l.brand} / ${l.model}`}
                titleStyle={styles.titleStyle}
                subtitle={
                  <View style={styles.details}>
                    <Text>{`판매가: ${l.price}`}</Text>

                    <View style={styles.locationContainer}>
                      <Icon name="md-pin" type="ionicon" size={15} />
                      <View style={styles.location}>
                        <Text>{location}</Text>
                      </View>
                    </View>

                    <Text>{l.market}</Text>
                  </View>
                }
                onPress={() => Linking.openURL(l.url)}
                rightIcon={
                  <Icon
                    name={favoriteIcon}
                    type="material"
                    color="#FE8C8C"
                    size={40}
                    onPress={async () => {
                      const token = await AsyncStorage.getItem("token");

                      this.props.toggleFavorite(l.id);

                      if (token) {
                        fetch("http://3.17.152.1:8000/user/favorite/", {
                          method: "POST",
                          headers: { token },
                          body: JSON.stringify({ list_id: l.id })
                        });
                      }
                    }}
                  />
                }
                bottomDivider
                containerStyle={styles.itemCard}
                underlayColor="#ffffff"
              />
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    width: width * 0.5,
    marginLeft: "50%"
  },
  itemList: {
    flex: 1,
    alignItems: "center"
  },
  itemCard: {
    marginBottom: 10,
    borderRadius: 20,
    width: width * 0.95,
    height: height * 0.155,
    elevation: 6
  },
  titleStyle: {
    marginTop: "6%",
    marginBottom: "2%",
    width: width * 0.9
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  location: {
    width: width * 0.9
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ProductList;
