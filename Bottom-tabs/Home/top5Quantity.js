import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { BarChart, YAxis } from "react-native-svg-charts";
import { Text } from "react-native-svg";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

class Top5Quantity extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      top5: []
    };
  }

  componentDidMount() {
    fetch("http://3.17.152.1:8000/api/top5/")
      .then(res => res.json())
      .then(res => {
        const color = ["#82ccdd", "#fad390", "#b8e994", "#6a89cc", "#f8c291"];
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
    const CUT_OFF = this.state.top5[0] ? this.state.top5[0].quantity : 0;
    const Labels = ({ x, y, bandwidth }) =>
      this.state.top5.map((v, index) => (
        <Text
          key={index}
          x={x(this.state.top5[0].quantity) - 100}
          y={y(index) + bandwidth / 2}
          fontSize={16}
          fill="black"
          alignmentBaseline="middle"
        >
          {`${v.quantity}개`}
        </Text>
      ));

    return this.state.top5[0] ? (
      <View style={styles.chart}>
        <YAxis
          data={this.state.top5}
          style={{ height: height * 0.4 }}
          yAccessor={({ index }) => index}
          contentInset={{ top: 25, bottom: 25 }}
          formatLabel={(value, index) => {
            if (index % 2 === 0) {
              return this.state.top5[
                ((this.state.top5.length - 1) * 2 - index) / 2
              ].model;
            }
            return "";
          }}
          svg={{
            fontSize: 15,
            fill: "black"
          }}
        />
        <BarChart
          style={{ flex: 1, marginLeft: 8, height: height * 0.4 }}
          data={this.state.top5}
          horizontal={true}
          yAccessor={({ item }) => item.quantity}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0.4}
          gridMin={0}
        >
          <Labels />
        </BarChart>
      </View>
    ) : (
      <View />
    );
  }
}

const styles = StyleSheet.create({
  labelsContainer: {},
  chart: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: "13%"
  }
});

export default Top5Quantity;
