import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { showMessage } from "react-native-flash-message";

export default class AverageMonthly extends Component {
  constructor() {
    super();
    this.state = {
      averageByMonth: []
    };
  }

  componentDidMount() {
    fetch("http://3.17.152.1:8000/api/average/monthly/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: "HARVEY" })
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          averageByMonth: res
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return this.state.averageByMonth.average_price ? (
      <View>
        <LineChart
          data={{
            labels: this.state.averageByMonth.daily
              .map(el => el.date)
              .reverse(),
            datasets: [
              {
                data: this.state.averageByMonth.daily
                  .map(el => el.average_price)
                  .reverse()
              }
            ]
          }}
          width={Dimensions.get("window").width * 3} // from react-native
          height={350}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
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
          //   onDataPointClick={({ value, getColor }) => {
          //     showMessage({
          //       message: `${value}`,
          //       description: "You selected this value",
          //       backgroundColor: getColor(0.9)
          //     });
          //   }}
        />
      </View>
    ) : (
      <View />
    );
  }
}
