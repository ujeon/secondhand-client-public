import React from "react";
import { BarChart, XAxis } from "react-native-svg-charts";
import { Text } from "react-native-svg";
import { View } from "react-native";

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
        const color = ["red", "orange", "green", "yellow", "blue"];
        this.setState({
          originData: res.map(el => Object.assign({}, el))
        });
        for (const i in res) {
          res[i].svg = {
            fill: color[i]
          };
        }
        this.setState({
          top5: res
        });
        console.log(this.state.top5, this.state.originData);
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
              : y(value.averge_price) + 15
          }
          fontSize={14}
          fill={value.averge_price >= CUT_OFF ? "white" : "black"}
          alignmentBaseline={"middle"}
          textAnchor={"middle"}
        >
          {value.averge_price}
        </Text>
      ));
    return this.state.top5[0] ? (
      <View style={{ height: 200, padding: 20, margin: 20 }}>
        <BarChart
          style={{ height: 200 }}
          data={this.state.top5}
          gridMin={0}
          yAccessor={({ item }) => item.averge_price}
          contentInset={{ top: 20, bottom: 20 }}
        >
          <Labels />
        </BarChart>
        <XAxis
          style={{ marginHorizontal: 0 }}
          data={this.state.originData}
          formatLabel={(value, index) => {
            return this.state.originData[index].model;
          }}
          contentInset={{ left: 30, right: 30 }}
        />
      </View>
    ) : (
      <View />
    );
  }
}

export default Top5Price;
