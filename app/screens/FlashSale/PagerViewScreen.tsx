import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useMemo, useRef, useState } from "react";
import {
  GestureResponderEvent,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import PagerView from "react-native-pager-view";
import { imagePaths } from "~/assets/imagePath";
import Empty from "~/components/common/Empty";
import ProductItem from "~/components/common/ProductItem";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import Timer from "~/components/common/Timer";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { usePagination } from "~/hooks/usePagination";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { cn } from "~/lib/utils";
import { flashSaleService } from "~/services/api/flashsale.service";
import { IProduct } from "~/services/api/product.service";
import { calculateDiscount, getItemWidth, screen } from "~/utils";
import TabItem from "./TabItem";
import Header from "./Header";
import dayjs from "dayjs";

const BannerItem = () => {
  return (
    <View className="">
      <Image
        source={"https://placehold.co/300x100"}
        className="w-full aspect-[3/1]"
        contentFit="contain"
      />
    </View>
  );
};

const TimerItem = () => {
  return (
    <View className="flex-row gap-1 items-center px-5">
      <View className="flex-1 h-[1px] bg-white"></View>
      <Image
        source={imagePaths.icTimer}
        className="size-4"
        contentFit="contain"
      />
      <Text className="text-xs font-medium tracking-tight text-white">
        KẾT THÚC TRONG
      </Text>
      <Timer
        expiredTime={new Date(Date.now() + 1000 * 60 * 60 * 24)}
        textColor="white"
        backgroundColor="#E8AA24"
      />

      <View className="flex-1 h-[1px] bg-white"></View>
    </View>
  );
};

const HeaderItem = () => {
  return (
    <View className="relative bg-[#EEE] px-2 py-4 rounded-t-[40px] mt-2.5">
      <View className="mx-2 top-[-12px] absolute left-0 right-0 h-[76] rounded-[40] bg-secondary-50 opacity-20" />

      <View className="flex-row gap-2 items-center px-2 w-full">
        <Text className="mt-3 text-xl font-bold text-black uppercase">
          TOP SẢN PHẨM NỔI BẬT
        </Text>
      </View>
    </View>
  );
};

const TwoProductItem = ({ items }: { items: IProduct[] }) => {
  const width = useMemo(() => {
    return getItemWidth({
      containerPadding: 16,
      itemGap: 8,
    }).itemWidth;
  }, []);

  return (
    <View
      className="flex-row gap-2 px-2 bg-[#EEE] pb-2"
      style={{
        alignItems: "stretch",
      }}
    >
      {items.map((item, index) => (
        <ProductItem
          width={width}
          key={item.id}
          name={item?.name}
          height={"100%"}
          price={item?.salePrice}
          originalPrice={item?.regularPrice}
          discount={calculateDiscount(item)}
          rating={item?.averageRating}
          soldCount={item?.totalSales}
          image={item?.images[0]}
          onSale={item?.regularPrice > item?.salePrice}
          id={item?.id}
          location={item?.shop?.shopWarehouseLocation?.province?.name}
        />
      ))}
    </View>
  );
};

const NoData = () => {
  return (
    <View className="flex-1 justify-center items-center bg-[#EEE]">
      <Empty title="Không có sản phẩm nào" />
    </View>
  );
};

const PagerViewScreen = () => {
  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "banner") {
      return <BannerItem />;
    }

    if (item.type === "timer") {
      return <TimerItem />;
    }

    if (item.type === "header") {
      return <HeaderItem />;
    }

    if (item.type === "product") {
      return <TwoProductItem items={item.items} />;
    }

    if (item.type === "noData") {
      return <NoData />;
    }

    return null;
  };

  const flashlistData = useMemo(() => {
    return [
      { type: "banner" },
      { type: "timer" },
      { type: "header" },
      { type: "noData" },
    ];
  }, []);

  return (
    <FlashList
      renderItem={renderItem}
      estimatedItemSize={250}
      data={flashlistData}
      keyExtractor={(item, i) => `${item.type}-${i}`}
      removeClippedSubviews
      getItemType={(item) => item.type}
    />
  );
};

export default PagerViewScreen;
