import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import Carousel from "~/components/common/Carusel";
import Category from "~/components/common/Category";
import ProductItem from "~/components/common/ProductItem";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { productService } from "~/services/api/product.service";
import { calculateDiscount, checkCanRender, screen } from "~/utils";
import ContainerList from "./ContainerList";
import Header from "./Header";
import HeaderSearch from "./HeaderSearch";
import { useAtom } from "jotai";
import { authAtom } from "~/store/atoms";
import { flashSaleService } from "~/services/api/flashsale.service";

const FlashSale = () => {
  const navigation = useSmartNavigation();

  const { data } = useQuery({
    queryKey: ["flashSale", "home"],
    queryFn: () =>
      flashSaleService.getFlashSale({
        skip: 0,
        take: 10,
      }),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
    refetchInterval: 1000 * 60 * 5,
  });

  if (!checkCanRender(data)) return null;

  return (
    <View>
      <View className="relative mt-10">
        <View className="mx-2 top-[-15] absolute left-0 right-0 h-[76] rounded-[40] bg-secondary-50 opacity-20" />
        <ContainerList
          onPress={() => navigation.navigate("FlashSale")}
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
                  onPress={() =>
                    navigation.push("FlashSaleProduct", { id: item?.id })
                  }
                  key={item.id}
                  name={item?.flashSaleProduct?.name}
                  price={item?.salePrice}
                  originalPrice={item?.flashSaleVariation?.regularPrice}
                  discount={item?.discountPercent}
                  soldCount={item?.bought}
                  totalCount={item?.campaignStock}
                  image={
                    item?.flashSaleVariation?.thumbnail ||
                    item?.flashSaleProduct?.thumbnail
                  }
                  onSale={true}
                  id={item?.id}
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
  const smartNavigation = useSmartNavigation();
  const { data } = useQuery({
    queryKey: ["topDeal", "home"],
    queryFn: () =>
      productService.getTopDealProducts({
        skip: 0,
        take: 10,
      }),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });

  if (!checkCanRender(data)) return null;

  return (
    <View className="bg-primary-100">
      <View className="mt-4">
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
            <TouchableOpacity
              onPress={() => smartNavigation.navigate("S")}
              className="bg-[#FCBA26] rounded-full px-8 py-2"
            >
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
    queryFn: () =>
      productService.searchProducts({
        sortBy: "bestSelling",
        sortDirection: "desc",
        skip: 0,
        take: 10,
      }),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const auth = useAtom(authAtom);
  const queryClient = useQueryClient();

  const navigation = useNavigation();
  const onPressMessages = () => {
    console.log("messages");
  };

  const onPressQuestionCircle = () => {
    console.log("question circle");
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey.includes("home") ||
        query.queryKey.includes("categories"),
    });
    setIsRefreshing(false);
  };

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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={"white"}
          />
        }
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
