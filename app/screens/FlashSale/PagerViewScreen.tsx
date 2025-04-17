import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
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
import {
  flashSaleService,
  IFlashSaleProduct,
} from "~/services/api/flashsale.service";
import { IProduct } from "~/services/api/product.service";
import {
  calculateDiscount,
  getItemWidth,
  preHandleFlashListData,
  screen,
} from "~/utils";
import TabItem from "./TabItem";
import Header from "./Header";
import dayjs from "dayjs";
import { COLORS } from "~/constants/theme";

const BannerItem = () => {
  return (
    <View className="">
      <Image
        source={"https://picsum.photos/300/100"}
        className="w-full aspect-[3/1]"
        contentFit="contain"
      />
    </View>
  );
};

const TimerItem = ({ expiredTime }: { expiredTime: Date }) => {
  const isExpired = dayjs().isAfter(expiredTime);

  return (
    <View className="flex-row gap-1 items-center px-5 my-4">
      <View className="flex-1 h-[1px] bg-white"></View>
      <Image
        source={imagePaths.icTimer}
        className="size-4"
        contentFit="contain"
        style={{ tintColor: "white" }}
      />
      {isExpired ? (
        <Text className="text-xs font-medium tracking-tight text-white">
          ĐÃ KẾT THÚC
        </Text>
      ) : (
        <React.Fragment>
          <Text className="text-xs font-medium tracking-tight text-white">
            KẾT THÚC TRONG
          </Text>
          <Timer
            expiredTime={expiredTime}
            textColor="white"
            backgroundColor="#E8AA24"
          />
        </React.Fragment>
      )}
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

const TwoProductItem = ({ items }: { items: IFlashSaleProduct[] }) => {
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
          name={item?.flashSaleProduct?.name}
          height={"100%"}
          price={item?.salePrice}
          originalPrice={item?.flashSaleProduct?.regularPrice}
          discount={item?.discountPercent}
          soldCount={item?.bought}
          totalCount={item?.campaignStock}
          image={item?.flashSaleProduct?.thumbnail}
          onSale={true}
          id={item?.id}
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

const BottomItem = () => {
  return (
    <View className="flex-row justify-center items-center bg-[#EEE] h-[200px]"></View>
  );
};

const PagerViewScreen = ({ timeSlot }: { timeSlot: string }) => {
  const { data, isLoading, isRefresh, refresh, hasNextPage, fetchNextPage } =
    usePagination(
      (data) => {
        return flashSaleService.getFlashSale(timeSlot, data);
      },
      {
        queryKey: ["flash-sale", timeSlot],
        enabled: !!timeSlot,
      }
    );

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "banner") {
      return <BannerItem />;
    }

    if (item.type === "timer") {
      return <TimerItem expiredTime={item.expiredTime} />;
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

    if (item.type === "bottom") {
      return <BottomItem />;
    }

    return null;
  };

  const flashlistData = useMemo(() => {
    const handledData = preHandleFlashListData(data, "product");

    return [
      { type: "banner" },
      { type: "timer", expiredTime: dayjs(timeSlot).add(1, "hour").toDate() },
      { type: "header" },
      ...(handledData.length > 0 ? handledData : [{ type: "noData" }]),
      ...(handledData.length < 2
        ? [
            {
              type: "bottom",
            },
          ]
        : []),
    ];
  }, [data]);

  return (
    <FlashList
      renderItem={renderItem}
      estimatedItemSize={250}
      data={flashlistData}
      keyExtractor={(item, i) => `${item.type}-${i}`}
      removeClippedSubviews
      getItemType={(item) => item.type}
      refreshControl={
        <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
      }
      onEndReached={fetchNextPage}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() => {
        return hasNextPage && isLoading ? (
          <View className="flex-row justify-center items-center py-4">
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : null;
      }}
    />
  );
};

export default PagerViewScreen;
