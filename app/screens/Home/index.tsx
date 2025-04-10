import { Image } from "expo-image";
import React, { useEffect } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { imagePaths } from "~/assets/imagePath";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import Header from "./Header";
import * as SplashScreen from "expo-splash-screen";
import Carousel from "~/components/common/Carusel";
import Category from "./Category";
import ContainerList from "./ContainerList";
import ProductItem from "~/components/common/ProductItem";
import ProductItemL from "./ProductItem";
import { screen } from "~/utils";
import { useNavigation } from "@react-navigation/native";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const onPressMessages = () => {
    console.log("messages");
  };

  const onPressQuestionCircle = () => {
    console.log("question circle");
  };

  useEffect(() => {
    SplashScreen.setOptions({
      fade: true,
      duration: 500,
    });
    SplashScreen.hideAsync();
  }, []);

  return (
    <ScreenContainer
      header={
        <Header
          onPressMessages={onPressMessages}
          onPressQuestionCircle={onPressQuestionCircle}
        />
      }
      scrollable
      hasBottomTabs={true}
      className="bg-primary"
      paddingVertical={0}
      paddingHorizontal={0}
      safeArea={false}
    >
      <View className="px-3 py-4">
        <Text style={styles.text}>
          <Text className="font-bold">Hello Cherry, </Text>
          Hôm nay bạn cần tìm gì ?
        </Text>
      </View>
      <View className="flex-row gap-[10] px-2">
        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          className="flex-row flex-1 gap-2 justify-between items-center px-4 py-2 bg-white rounded-full"
        >
          <Text className="text-sm text-zinc-400">
            Tìm kiếm sản phẩm, cửa hàng
          </Text>
          <Image
            source={imagePaths.icSearch}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
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
        autoPlay={true}
        autoPlayInterval={5000}
        loop={true}
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
            bgColor="bg-primary-100"
            title="Flash Sale"
            icon={
              <Image
                source={imagePaths.flashSale}
                style={{ width: 40, height: 40 }}
              />
            }
          >
            <ScrollView horizontal>
              <View className="flex flex-row gap-2">
                {[...Array(10)].map((_, index) => (
                  <ProductItem
                    key={index}
                    name={
                      "Voluptate irure in laboris sit sunt pariatur. Sit  Voluptate irure in 123 "
                    }
                    price={100000}
                    originalPrice={150000}
                    discount={20}
                    soldCount={100}
                    totalCount={1000}
                    rating={4.5}
                    location={"Hà Nội"}
                  />
                ))}
              </View>
            </ScrollView>
          </ContainerList>
        </View>
      </View>
      <View className="bg-primary-100">
        <View className="mt-10">
          <ContainerList
            bgColor="bg-primary-50"
            title="TOP DEAL - SIÊU RẺ"
            icon={
              <Image
                source={imagePaths.selling}
                style={{ width: 40, height: 40 }}
              />
            }
          >
            <View className="flex flex-row flex-wrap gap-2">
              {[...Array(20)].map((_, index) => (
                <ProductItem
                  width={(screen.width - 24) / 2}
                  key={index}
                  name={`Voluptate irure in laboris sit sunt pariatur. Sit  Voluptate irure in 123  ${index}`}
                  price={100000}
                  originalPrice={150000}
                  discount={20}
                  rating={4.5}
                  soldCount={100}
                  location={"Hà Nội"}
                />
              ))}
            </View>
            <View className="flex justify-center items-center mt-6">
              <TouchableOpacity className="bg-[#FCBA26] rounded-full px-8 py-2">
                <Text className="text-xs text-white">Xem thêm</Text>
              </TouchableOpacity>
            </View>
          </ContainerList>
        </View>
      </View>

      <View className="w-full aspect-[3/2]">
        <Image
          source={imagePaths.homeBanner}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>

      <View className="bg-primary-50">
        <View className="mt-2">
          <ContainerList
            className="pb-20"
            linearColor={["#FEFEFE", "#EEE"]}
            title="SẢN PHẨM BÁN CHẠY"
            icon={
              <Image
                source={imagePaths.fire}
                style={{ width: 40, height: 40 }}
              />
            }
          >
            <View className="flex flex-row flex-wrap gap-2">
              {[...Array(14)].map((_, index) => (
                <ProductItem
                  width={(screen.width - 24) / 2}
                  key={index}
                  name={`Voluptate irure in laboris sit sunt pariatur. Sit  Voluptate irure in 123 `}
                  price={100000}
                  originalPrice={150000}
                  discount={20}
                  rating={4.5}
                  soldCount={100}
                  location={"Hà Nội"}
                />
              ))}
            </View>
          </ContainerList>
        </View>
      </View>
      <View className="h-[80] bg-"></View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "white",
  },
});
