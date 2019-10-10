import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { BarChart, YAxis } from "react-native-svg-charts";
import { Text } from "react-native-svg";

const { height } = Dimensions.get("window");

class Top5Quantity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      top5: []
    };
  }

  componentDidMount() {
    this.setState({ top5: this.props.top5 });
  }

  render() {
    const Labels = ({ x, y, bandwidth }) => {
      const CUT_OFF = this.state.top5[0].quantity;
      return this.state.top5.map((v, index) => (
        <Text
          key={index}
          x={x(this.state.top5[0].quantity) - 40}
          y={y(index) + bandwidth / 2}
          fontSize={12}
          fontStyle="italic"
          fill={this.state.top5[0].quantity === v.quantity ? "white" : "black"}
          alignmentBaseline="middle"
        >
          {`${v.quantity}개`}
        </Text>
      ));
    };

    return this.state.top5[0] ? (
      <View style={styles.chart}>
        <YAxis
          data={this.state.top5}
          style={styles.yaxis}
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
            fontSize: 12,
            fill: "black"
          }}
        />
        <BarChart
          style={styles.barChart}
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
  },
  yaxis: {
    height: height * 0.4,
    marginTop: "3.5%",
    marginLeft: "2.3%"
  },
  barChart: { flex: 1, marginLeft: 8, height: height * 0.4, margin: "2%" }
});

export default Top5Quantity;
