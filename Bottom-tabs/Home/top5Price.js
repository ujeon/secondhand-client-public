import React from "react";
import { BarChart, XAxis } from "react-native-svg-charts";
import { Text } from "react-native-svg";
import { View } from "react-native";

class Top5Price extends React.PureComponent {
  render() {
    const data = [
      {
        model: "XARI",
        averge_price: 436043,
        value: 120,
        svg: {
          fill: "red"
        }
      },
      {
        model: "MINI BUGGY",
        averge_price: 103142,
        value: 51,
        svg: {
          fill: "orange"
        }
      },
      {
        model: "URBO2",
        averge_price: 85307,
        value: 40,
        svg: {
          fill: "yellow"
        }
      },
      {
        model: "HARVEY",
        averge_price: 304374,
        value: 37,
        svg: {
          fill: "green"
        }
      },
      {
        model: "MOODD",
        averge_price: 124225,
        value: 36,
        svg: {
          fill: "blue"
        }
      }
    ];

    const data2 = [
      {
        model: "XARI",
        averge_price: 436043,
        value: 120
      },
      {
        model: "MINI BUGGY",
        averge_price: 103142,
        value: 51
      },
      {
        model: "URBO2",
        averge_price: 85307,
        value: 40
      },
      {
        model: "HARVEY",
        averge_price: 304374,
        value: 37
      },
      {
        model: "MOODD",
        averge_price: 124225,
        value: 36
      }
    ];

    const CUT_OFF = data[0].averge_price;
    const Labels = ({ x, y, bandwidth, data }) =>
      data.map((value, index) => (
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

    return (
      <View style={{ height: 200, padding: 20, margin: 20 }}>
        <BarChart
          style={{ height: 200 }}
          data={data}
          gridMin={0}
          yAccessor={({ item }) => item.averge_price}
          contentInset={{ top: 20, bottom: 20 }}
        >
          <Labels />
        </BarChart>
        <XAxis
          style={{ marginHorizontal: 0 }}
          data={data2}
          formatLabel={(value, index) => {
            return data2[index].model;
          }}
          contentInset={{ left: 30, right: 30 }}
        />
      </View>
    );
  }
}

export default Top5Price;
