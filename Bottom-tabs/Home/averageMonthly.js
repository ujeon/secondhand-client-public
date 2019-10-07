import React, { Component } from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width, height } = Dimensions.get("window");

export default class AverageMonthly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      averageByMonth: []
    };
  }

  componentDidMount() {
    if (this.props.model !== "etc") {
      fetch("http://3.17.152.1:8000/api/average/monthly/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model: this.props.model })
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            averageByMonth: res
          });
        })
        .catch(err => console.error(err));
    }
  }

  render() {
    return this.state.averageByMonth.average_price ? (
      <View>
        <LineChart
          data={{
            labels: this.state.averageByMonth.daily.map(el => el.date),
            datasets: [
              {
                data: this.state.averageByMonth.daily.map(
                  el => el.average_price
                )
              }
            ]
          }}
          width={width * 2} // from react-native
          height={height * 0.4}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#3c6382",
            backgroundGradientFrom: "#0a3d62",
            backgroundGradientTo: "#60a3bc",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          fromZero={true}
          bezier
          style={{
            marginVertical: 10,
            borderRadius: 16
          }}
        />
        <View style={{ flex: 1, flexDirection: "row", width: width * 2 }}>
          <Text
            style={{
              flex: 1,
              backgroundColor: "#38ada9",
              borderRadius: 15,
              padding: 5,
              marginEnd: 10,
              color: "white",
              textAlign: "center"
            }}
          >
            {`최근 1달 내 평균 가격: ${String(
              this.state.averageByMonth.average_price
            ).slice(0, -3)},000 원`}
          </Text>
          <Text
            style={{
              flex: 1,
              backgroundColor: "#1e3799",
              borderRadius: 15,
              padding: 5,
              marginEnd: 10,
              color: "white",
              textAlign: "center"
            }}
          >
            {`최근 1달 내 최저 가격: ${String(
              this.state.averageByMonth.lowest_price
            ).slice(0, -3)},000 원`}
          </Text>
          <Text
            style={{
              flex: 1,
              backgroundColor: "#eb2f06",
              borderRadius: 15,
              padding: 5,
              marginEnd: 10,
              color: "white",
              textAlign: "center"
            }}
          >
            {`최근 1달 내 최고 가격: ${String(
              this.state.averageByMonth.highest_price
            ).slice(0, -3)},000 원`}
          </Text>
        </View>
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  text: {
    borderRadius: 10
  }
});
