import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
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
import ContainerList from "./ContainerList";
import ProductItem from "~/components/common/ProductItem";
import ProductItemL from "./ProductItem";
import { screen } from "~/utils";
import { useNavigation } from "@react-navigation/native";
import HeaderSearch from "./HeaderSearch";
import Category from "~/components/common/Category";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { FlashList } from "@shopify/flash-list";

export const HomeScreen: React.FC = () => {
  const [flashlistData, setFlashlistData] = useState<any[]>([]);

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

  useEffect(() => {
    setFlashlistData([
      { type: "carousel" },
      { type: "category" },
      { type: "flashSale" },
      { type: "topDeal" },
      { type: "banner" },
      { type: "bestSeller" },
    ]);
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "carousel") {
      return (
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
      );
    }

    if (item.type === "category") {
      return <Category className="px-2 pt-2" />;
    }

    if (item.type === "flashSale") {
      return (
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
                      id={"123"}
                    />
                  ))}
                </View>
              </ScrollView>
            </ContainerList>
          </View>
        </View>
      );
    }

    if (item.type === "topDeal") {
      return (
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
                    id={"123"}
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
      );
    }

    if (item.type === "banner") {
      return (
        <View className="w-full aspect-[3/2]">
          <Image
            source={imagePaths.homeBanner}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>
      );
    }

    if (item.type === "bestSeller") {
      return (
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
                    id={"123"}
                  />
                ))}
              </View>
            </ContainerList>
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper hasGradient={true}>
      <Header
        onPressMessages={onPressMessages}
        onPressQuestionCircle={onPressQuestionCircle}
      />

      <FlashList
        data={flashlistData}
        renderItem={renderItem}
        keyExtractor={(item) => item.type}
        estimatedItemSize={200}
        getItemType={(item) => item.type}
        ListHeaderComponent={<HeaderSearch />}
      />
    </ScreenWrapper>
  );
};
