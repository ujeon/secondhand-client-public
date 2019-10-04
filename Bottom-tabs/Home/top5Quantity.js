import React from 'react';
import { View } from 'react-native';
import { BarChart, YAxis } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';

class Top5Quantity extends React.PureComponent {
  render() {
    const data = [
      {
        model: 'XARI',
        averge_price: 436043,
        value: 120,
        svg: {
          fill: 'red'
        }
      },
      {
        model: 'MINI BUGGY',
        averge_price: 103142,
        value: 51,
        svg: {
          fill: 'orange'
        }
      },
      {
        model: 'URBO2',
        averge_price: 85307,
        value: 40,
        svg: {
          fill: 'yellow'
        }
      },
      {
        model: 'HARVEY',
        averge_price: 304374,
        value: 37,
        svg: {
          fill: 'green'
        }
      },
      {
        model: 'MOODD',
        averge_price: 124225,
        value: 36,
        svg: {
          fill: 'blue'
        }
      },
      {
        model: '',
        value: 148,
        svg: {
          fill: 'transparent'
        }
      }
    ];

    const Labels = ({ x, y, bandwidth }) =>
      data.map((v, index) => (
        <Text
          key={index}
          x={x(v.value) + 5}
          y={y(index) + bandwidth / 2}
          fontSize={14}
          fill='black'
          alignmentBaseline='middle'
        >
          {v.value}
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
          data={data}
          yAccessor={({ index }) => index}
          contentInset={{ top: 10, bottom: 10 }}
          spacingInner={0}
          formatLabel={(value, index) => {
            if (index % 2 === 0) {
              return data[((data.length - 1) * 2 - index) / 2].model;
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
          data={data}
          horizontal={true}
          yAccessor={({ item }) => item.value}
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
