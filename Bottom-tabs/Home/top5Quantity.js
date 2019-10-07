import React from "react";
import { View, Dimensions } from "react-native";
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
    this.props.changeState();
  }

  render() {
    const CUT_OFF = this.state.top5[0] ? this.state.top5[0].quantity : 0;
    const Labels = ({ x, y, bandwidth }) =>
      this.state.top5.map((v, index) => (
        <Text
          key={index}
          x={x(this.state.top5[0].quantity) - 110}
          y={y(index) + bandwidth / 2}
          fontSize={16}
          fill="black"
          alignmentBaseline="middle"
        >
          {`${v.quantity}개의 게시물`}
        </Text>
      ));

    return this.state.top5[0] ? (
      <View
        style={{
          flexDirection: "row",
          height: height * 0.5,
          width: width * 0.8,
          paddingVertical: 16
        }}
      >
        <YAxis
          data={this.state.top5}
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
          style={{ flex: 1, marginLeft: 8 }}
          data={this.state.top5}
          horizontal={true}
          yAccessor={({ item }) => item.quantity}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0.7}
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

export default Top5Quantity;
