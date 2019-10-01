import React, { Component } from "react";
// import { Text, View } from "react-native";
import ProductList from "../components/productList";

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        average_price: {
          id: 1,
          brand: "STOKE",
          model: "S9",
          date: "2019-10-01",
          average_price: 23000,
          lowest_price: 20000,
          highest_price: 40000,
          quantity: 24
        },
        filtered_data: [
          {
            id: 1,
            brand: "STOKE",
            model: "S9",
            price: 300000,
            url: "https://www.hellomarket.com/item/163618711",
            img_url:
              "https://ccimg.hellomarket.com/images/2019/item/08/25/14/2308_4152473_1.jpg?size=s6",
            market: "헬로마켓",
            posted_at: null,
            is_sold: false,
            category_id: 1,
            location: "-"
          },
          {
            id: 2,
            brand: "STOKE",
            model: "S9",
            price: 230000,
            url: "https://www.hellomarket.com/item/163560910",
            img_url:
              "https://ccimg.hellomarket.com/images/2019/item/08/20/12/5312_4013953_1.jpg?size=s6",
            market: "당근마켓",
            posted_at: null,
            is_sold: false,
            category_id: 1,
            location: "서울 서초구"
          }
        ]
      }
    };
  }

  render() {
    return <ProductList data={this.state.data} />;
  }
}
