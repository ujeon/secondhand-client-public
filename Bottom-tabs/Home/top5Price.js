import React from "react";
import { BarChart, XAxis } from "react-native-svg-charts";
import { Text } from "react-native-svg";
import { View, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

class Top5Price extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      top5: [],
      originData: []
    };
  }

  componentDidMount() {
    this.setState({
      top5: this.props.top5,
      originData: this.props.originData
    });
  }

  render() {
    const CUT_OFF = this.state.originData[0]
      ? this.state.originData[0].averge_price
      : 0;
    const Labels = ({ x, y, bandwidth }) =>
      this.state.originData.map((value, index) => (
        <Text
          key={index}
          x={x(index) + bandwidth / 2}
          y={
            value.averge_price < CUT_OFF
              ? y(value.averge_price) - 10
              : y(value.averge_price) + 20
          }
          fontSize={10}
          fill={value.averge_price >= CUT_OFF ? "white" : "black"}
          alignmentBaseline="middle"
          textAnchor="middle"
        >
          {value.averge_price}
        </Text>
      ));
    return this.state.top5[0] ? (
      <View style={styles.chart}>
        <BarChart
          style={styles.barChart}
          data={this.state.top5}
          gridMin={0}
          yAccessor={({ item }) => item.averge_price}
          contentInset={{ top: 20, bottom: 20 }}
          spacingInner={0.5}
          spacingOuter={0.3}
        >
          <Labels />
        </BarChart>
        <XAxis
          style={{ marginHorizontal: 0 }}
          data={this.state.originData}
          formatLabel={(value, index) => {
            return this.state.originData[index].model;
          }}
          contentInset={{ left: 37, right: 36 }}
        />
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  chart: {
    marginBottom: "5%"
  },
  barChart: { height: height * 0.4, width: width * 0.9 }
});

export default Top5Price;
