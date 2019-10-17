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
    this.setState({ averageByMonth: this.props.averageByMonth });
  }

  render() {
    return !Array.isArray(this.state.averageByMonth) ? (
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: this.state.averageByMonth.daily.map(el => {
              let month = el.date.slice(5, 7);
              if (month[0] === "0") {
                month = month.slice(1);
              }
              let date = el.date.slice(8);
              if (date[0] === "0") {
                date = date.slice(1);
              }
              return `${month} / ${date}`;
            }),
            datasets: [
              {
                data: this.state.averageByMonth.daily.map(
                  el => el.average_price
                )
              }
            ]
          }}
          width={width * 2} // from react-native
          height={height * 0.32}
          yAxisLabel=""
          chartConfig={{
            backgroundGradientFrom: "#9151BD",
            backgroundGradientTo: "#FE8C8C",
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
          }}
          fromZero={true}
          bezier
          style={styles.chart}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            width: width * 2,
            marginLeft: "0.5%",
            marginRight: "0.5%"
          }}
        >
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
    height: height * 0.42
  },
  chart: {
    marginVertical: 10
  },
  avgPriceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#a773ca",
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
    backgroundColor: "#FE8C8C",
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
    backgroundColor: "#9151BD",
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
