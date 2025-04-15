import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import Carousel from "~/components/common/Carusel";
import Category from "~/components/common/Category";
import ProductItem from "~/components/common/ProductItem";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { calculateDiscount, checkCanRender, screen } from "~/utils";
import ContainerList from "./ContainerList";
import Header from "./Header";
import HeaderSearch from "./HeaderSearch";
import { productService } from "~/services/api/product.service";
import { useQuery } from "@tanstack/react-query";

const FlashSale = () => {
  const { data } = useQuery({
    queryKey: ["flashSale", "home"],
    queryFn: () => productService.getRecommendedProducts(),
    staleTime: 1000 * 60 * 5,
  });

  if (!checkCanRender(data)) return null;

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
          <View>
            <FlatList
              data={data}
              horizontal
              renderItem={({ item }) => (
                <ProductItem
                  name={item.name}
                  price={item.salePrice}
                  originalPrice={item.regularPrice}
                  discount={calculateDiscount(item)}
                  soldCount={item.totalSales}
                  rating={item.averageRating}
                  location={item?.shop?.shopWarehouseLocation?.province?.name}
                  id={item.id}
                  image={item.thumbnail}
                  className="flex-1"
                />
              )}
              ItemSeparatorComponent={() => <View className="w-2" />}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ContainerList>
      </View>
    </View>
  );
};

const TopDeal = () => {
  const { data } = useQuery({
    queryKey: ["topDeal", "home"],
    queryFn: () => productService.getRecommendedProducts(),
    staleTime: 1000 * 60 * 5,
  });

  if (!checkCanRender(data)) return null;

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
            {data!.map((item, index) => (
              <ProductItem
                width={(screen.width - 24) / 2}
                key={index}
                name={item.name}
                price={item.salePrice}
                originalPrice={item.regularPrice}
                discount={calculateDiscount(item)}
                rating={item.averageRating}
                soldCount={item.totalSales}
                location={item?.shop?.shopWarehouseLocation?.province?.name}
                id={item.id}
                image={item.thumbnail}
                className="flex-grow"
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
};

const Banner = () => {
  return (
    <View className="w-full aspect-[3/2]">
      <Image
        source={imagePaths.homeBanner}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />
    </View>
  );
};

const BestSeller = () => {
  const { data } = useQuery({
    queryKey: ["bestSeller", "home"],
    queryFn: () => productService.getRecommendedProducts(),
    staleTime: 1000 * 60 * 5,
  });

  if (!checkCanRender(data)) return null;

  return (
    <View className="bg-primary-50">
      <View className="mt-2">
        <ContainerList
          className="pb-20"
          linearColor={["#FEFEFE", "#EEE"]}
          title="SẢN PHẨM BÁN CHẠY"
          icon={
            <Image source={imagePaths.fire} style={{ width: 40, height: 40 }} />
          }
        >
          <View className="flex flex-row flex-wrap gap-2">
            {data!.map((item, index) => (
              <ProductItem
                width={(screen.width - 24) / 2}
                key={index}
                name={item.name}
                price={item.salePrice}
                originalPrice={item.regularPrice}
                discount={calculateDiscount(item)}
                rating={item.averageRating}
                soldCount={item.totalSales}
                location={item?.shop?.shopWarehouseLocation?.province?.name}
                id={item.id}
                image={item.thumbnail}
                className="flex-grow"
              />
            ))}
          </View>
        </ContainerList>
      </View>
    </View>
  );
};

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
      return <FlashSale />;
    }

    if (item.type === "topDeal") {
      return <TopDeal />;
    }

    if (item.type === "banner") {
      return <Banner />;
    }

    if (item.type === "bestSeller") {
      return <BestSeller />;
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
