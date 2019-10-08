import React from "react";
import { BarChart, XAxis } from "react-native-svg-charts";
import { Text } from "react-native-svg";
import { View, Dimensions, StyleSheet } from "react-native";

const { height } = Dimensions.get("window");

class Top5Price extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      top5: [],
      originData: []
    };
  }

  componentDidMount() {
    fetch("http://3.17.152.1:8000/api/top5/")
      .then(res => res.json())
      .then(res => {
        const color = ["#82ccdd", "#fad390", "#b8e994", "#6a89cc", "#f8c291"];
        this.setState({
          originData: res.map(el => ({ ...el }))
        });
        for (const i in res) {
          res[i].svg = {
            fill: color[i]
          };
        }
        this.setState({
          top5: res
        });
      })
      .catch(err => console.error(err));
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
          fontSize={15}
          fill="black"
          alignmentBaseline="middle"
          textAnchor="middle"
        >
          {value.averge_price}
        </Text>
      ));
    return this.state.top5[0] ? (
      <View style={styles.chart}>
        <BarChart
          style={{ height: height * 0.4 }}
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
  labelsContainer: {},
  chart: {
    marginBottom: "5%"
  }
});

export default Top5Price;
