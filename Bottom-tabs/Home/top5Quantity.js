import React from 'react';
import { View } from 'react-native';
import { BarChart, YAxis } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';

class Top5Quantity extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      top5: []
    };
  }

  componentDidMount() {
    fetch('http://3.17.152.1:8000/api/top5/')
      .then(res => res.json())
      .then(res => {
        const color = ['red', 'orange', 'green', 'yellow', 'blue'];
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
          x={v.quantity < CUT_OFF ? x(v.quantity) + 10 : x(v.quantity) - 15}
          y={y(index) + bandwidth / 2}
          fontSize={14}
          fill={v.quantity >= CUT_OFF ? 'white' : 'black'}
          alignmentBaseline='middle'
        >
          {v.quantity}
        </Text>
      ));

    return (
      <View
        style={{
          flexDirection: 'row',
          height: 200,
          width: 250,
          paddingVertical: 16,
          marginLeft: 10
        }}
      >
        <YAxis
          data={this.state.top5}
          yAccessor={({ index }) => index}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0}
          formatLabel={(value, index) => {
            if (index % 2 === 0) {
              return this.state.top5[
                ((this.state.top5.length - 1) * 2 - index) / 2
              ].model;
            }
            return '';
          }}
          svg={{
            fontSize: 10,
            fill: 'black'
          }}
        />
        <BarChart
          style={{ flex: 1, marginLeft: 8 }}
          data={this.state.top5}
          horizontal={true}
          yAccessor={({ item }) => item.quantity}
          svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0.5}
          spacingOuter={0}
          gridMin={0}
        >
          <Labels />
        </BarChart>
      </View>
    );
  }
}

export default Top5Quantity;
