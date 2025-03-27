import { Image } from "expo-image";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import Header from "./Header";

import Carousel from "~/components/common/Carusel";
import Category from "./Category";
import ContainerList from "./ContainerList";
import ProductItem from "./ProductItem";
export const HomeScreen: React.FC = () => {
  const onPressMessages = () => {
    console.log("messages");
  };

  const onPressQuestionCircle = () => {
    console.log("question circle");
  };

  return (
    <ScreenContainer
      header={
        <Header
          onPressMessages={onPressMessages}
          onPressQuestionCircle={onPressQuestionCircle}
        />
      }
      scrollable
      className="bg-primary"
      paddingVertical={0}
      paddingHorizontal={0}
    >
      <View className="px-3 py-4">
        <Text style={styles.text}>
          <Text className="font-bold">Hello Cherry, </Text>
          Hôm nay bạn cần tìm gì ?
        </Text>
      </View>
      <View className="flex-row gap-[10] px-2">
        <Input
          className="flex-1"
          placeholder="Tìm kiếm sản phẩm, cửa hàng"
          rightIcon={
            <Image
              source={imagePaths.icSearch}
              style={{ width: 20, height: 20 }}
            />
          }
        />
        <TouchableOpacity>
          <View className="bg-secondary-500 size-[50] flex items-center justify-center rounded-full">
            <Image
              source={imagePaths.icCart}
              style={{ width: 24, height: 24 }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <Carousel
        data={[...Array(10)]}
        renderItem={({ index }) => (
          <View>
            <Image
              source={"https://picsum.photos/200/300"}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        )}
      />
      <View className="px-2 pt-2">
        <Category
          data={[
            {
              title: "Đất sạch & giá thể",
              image: "https://picsum.photos/200/300",
            },
            {
              title: "Các loại phân bón ",
              image: "https://picsum.photos/200/300",
            },
            {
              title: "Các loại hạt giống",
              image: "https://picsum.photos/200/300",
            },
            {
              title: "Vật tư trồng hoa",
              image: "https://picsum.photos/200/300",
            },
            {
              title: "Vật tư kiểng",
              image: "https://picsum.photos/200/300",
            },
          ]}
        />
      </View>
      <View>
        <View className="relative mt-10">
          <View className="mx-2 top-[-15] absolute left-0 right-0 h-[76] rounded-[40] bg-secondary-50 opacity-20" />
          <ContainerList
            title="Flash Sale"
            icon={
              <Image
                source={imagePaths.lightning}
                style={{ width: 40, height: 40 }}
              />
            }
          >
            <Carousel
              data={[...Array(10)]}
              width={150}
              height={238}
              renderItem={({ index }) => <ProductItem />}
            />
          </ContainerList>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "white",
  },
});
