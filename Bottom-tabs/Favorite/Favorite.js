import React from "react";
import { View, Text, StyleSheet } from "react-native";

import ProductList from "../components/productList";

// NOTE 사용자 즐겨찾기 리스트를 prop로 전달받음.(혹은 직접 서버에서 가져오거나)
const favorite_list = [
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
    brand: "리안",
    model: "솔로",
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
];

const Favorite = props => {
  // NOTE 로그인 여부를 prop으로 전달 받아서 어느 것을 렌더링 할지 결정
  let isSignup = true;

  if (isSignup) {
    return (
      <View style={styles.containter}>
        <View style={styles.header}>
          <Text>favorite tab</Text>
        </View>
        <View style={styles.content}>
          <ProductList favoriteList={favorite_list} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.containter}>
      <View style={styles.header}>
        <Text>favorite tab</Text>
      </View>
      <View style={styles.content}>
        <Text>회원가입을 하시면 즐겨찾기 추가가 가능합니다.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containter: { flex: 1 },
  header: { flex: 1, marginBottom: "5%", backgroundColor: "blue" },
  content: {
    flex: 5
  }
});

export default Favorite;
