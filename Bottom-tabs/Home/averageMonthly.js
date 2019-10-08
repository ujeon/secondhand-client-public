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
      <View style={styles.chartContainer}>
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
          height={height * 0.25}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#e5b2ca",
            backgroundGradientTo: "#7028e4",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          fromZero={true}
          bezier
          style={styles.chart}
        />
        <View style={{ flex: 1, flexDirection: "row", width: width * 2 }}>
          <View style={styles.minPriceContainer}>
            <Text style={styles.infoText}>
              {`최근 1달 내 최저 가격: ${String(
                this.state.averageByMonth.lowest_price
              ).slice(0, -3)},000 원`}
            </Text>
          </View>
          <View style={styles.avgPriceContainer}>
            <Text style={styles.infoText}>
              {`최근 1달 내 평균 가격: ${String(
                this.state.averageByMonth.average_price
              ).slice(0, -3)},000 원`}
            </Text>
          </View>
          <View style={styles.maxPriceContainer}>
            <Text style={styles.infoText}>
              {`최근 1달 내 최고 가격: ${String(
                this.state.averageByMonth.highest_price
              ).slice(0, -3)},000 원`}
            </Text>
          </View>
        </View>
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  chartContainer: {
    height: height * 0.4
  },
  chart: {
    flex: 2,
    marginVertical: 10,
    borderRadius: 16
  },
  avgPriceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#AB6DD7",
    borderRadius: 20,
    padding: 3,
    marginEnd: 10,
    color: "white",
    textAlign: "center",
    height: height * 0.05
  },
  maxPriceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7028e4",
    borderRadius: 20,
    padding: 3,
    marginEnd: 10,
    color: "white",
    textAlign: "center",
    height: height * 0.05
  },
  minPriceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e5b2ca",
    borderRadius: 20,
    padding: 3,
    marginEnd: 10,
    color: "white",
    textAlign: "center",
    height: height * 0.05
  },
  infoText: {
    fontSize: 15,
    color: "#ffffff"
  }
});
