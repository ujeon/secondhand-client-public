import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { showMessage } from 'react-native-flash-message';

export default class AverageMonthly extends Component {
  render() {
    const data = {
      average_price: 304374,
      lowest_price: 150000,
      highest_price: 500000,
      daily: [
        {
          id: 176,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-10-01',
          average_price: 283333,
          lowest_price: 250000,
          highest_price: 300000,
          quantity: 3
        },
        {
          id: 177,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-09-28',
          average_price: 375000,
          lowest_price: 300000,
          highest_price: 450000,
          quantity: 2
        },
        {
          id: 178,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-09-29',
          average_price: 287500,
          lowest_price: 250000,
          highest_price: 350000,
          quantity: 4
        },
        {
          id: 179,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-09-26',
          average_price: 230000,
          lowest_price: 230000,
          highest_price: 230000,
          quantity: 1
        },
        {
          id: 180,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-09-27',
          average_price: 415000,
          lowest_price: 380000,
          highest_price: 450000,
          quantity: 2
        },
        {
          id: 181,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-09-24',
          average_price: 293333,
          lowest_price: 290000,
          highest_price: 300000,
          quantity: 3
        },
        {
          id: 182,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-09-25',
          average_price: 300000,
          lowest_price: 300000,
          highest_price: 300000,
          quantity: 1
        },
        {
          id: 183,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-09-30',
          average_price: 291666,
          lowest_price: 270000,
          highest_price: 350000,
          quantity: 6
        },
        {
          id: 184,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-09-23',
          average_price: 325000,
          lowest_price: 250000,
          highest_price: 500000,
          quantity: 8
        },
        {
          id: 185,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-09-21',
          average_price: 250000,
          lowest_price: 250000,
          highest_price: 250000,
          quantity: 1
        },
        {
          id: 187,
          brand: 'EASYWALKER',
          model: 'HARVEY',
          date: '2019-09-12',
          average_price: 150000,
          lowest_price: 150000,
          highest_price: 150000,
          quantity: 1
        }
      ]
    };
    return (
      <View>
        <LineChart
          data={{
            labels: data.daily.map(el => el.date).reverse(),
            datasets: [
              {
                data: data.daily.map(el => el.average_price).reverse()
              }
            ]
          }}
          width={Dimensions.get('window').width * 3} // from react-native
          height={350}
          yAxisLabel=''
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          fromZero={true}
          bezier
          style={{
            marginVertical: 10,
            borderRadius: 16
          }}
          onDataPointClick={({ value, getColor }) => {
            showMessage({
              message: `${value}`,
              description: 'You selected this value',
              backgroundColor: getColor(0.9)
            });
          }}
        />
      </View>
    );
  }
}
