import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "~/components/ui/text";
import { FontAwesome5 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo, useState } from "react";
import ProductItem from "~/components/common/ProductItem";
import {
  calculateDiscount,
  getItemWidth,
  preHandleFlashListData,
  screen,
} from "~/utils";
import { usePagination } from "~/hooks/usePagination";
import { IProduct, productService } from "~/services/api/product.service";
import Empty from "~/components/common/Empty";
import { COLORS } from "~/constants/theme";
import useGetShopId from "../useGetShopId";

const Header = ({ total }: { total: number }) => {
  return (
    <View className="flex-row gap-2 items-center px-2 mb-4 w-full">
      <Text className="text-sm font-medium text-black">
        Tất cả sản phẩm{" "}
        <Text className="text-sm font-medium text-[#676767]">
          ({(total || 0)?.toLocaleString()} kết quả)
        </Text>
      </Text>
      <TouchableOpacity className="flex-row gap-2 items-center px-4 py-2 ml-auto bg-white rounded-full">
        <Text className="text-sm font-medium leading-tight text-[#676767]">
          Sắp xếp
        </Text>
        <FontAwesome5 name="sort-amount-down-alt" size={16} color="#676767" />
      </TouchableOpacity>
    </View>
  );
};

const RenderTwoProduct = ({ items }: { items: IProduct[] }) => {
  const width = useMemo(() => {
    return getItemWidth({
      containerPadding: 16,
      itemGap: 8,
    }).itemWidth;
  }, []);

  return (
    <View className="flex-row gap-2 bg-[#EEE] pb-2">
      {items.map((item) => (
        <ProductItem
          key={item.id}
          width={width}
          name={item.name}
          price={item.salePrice}
          originalPrice={item.regularPrice}
          discount={calculateDiscount(item)}
          rating={item.averageRating}
          soldCount={item.reviewCount}
          id={item.id}
          image={item.images[0]}
          onSale={item.regularPrice > item.salePrice}
          location={item.shop?.shopWarehouseLocation?.province?.name}
          height={"100%"}
        />
      ))}
    </View>
  );
};

const ShopProduct = () => {
  const id = useGetShopId();
  const {
    data,
    isLoading,
    isRefresh,
    refresh,
    hasNextPage,
    fetchNextPage,
    isFetching,
    total,
  } = usePagination(productService.searchProducts, {
    queryKey: ["products", (id || "")?.toString()],
    enabled: !!id,
    initialParams: {
      shopId: id,
    },
  });

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "header") {
      return <Header total={total} />;
    }

    if (item.type === "product") {
      return <RenderTwoProduct items={item.items} />;
    }

    if (item.type === "noData") {
      return (
        <Empty
          title="Không có sản phẩm nào"
          backgroundColor="#EEE"
          isLoading={isLoading}
        />
      );
    }

    return null;
  };

  const flashListData = useMemo(() => {
    const handledData = preHandleFlashListData(data);

    if (!data || data.length === 0) {
      return [{ type: "header" }, { type: "noData" }];
    }

    return [{ type: "header" }, ...handledData];
  }, [data]);

  return (
    <View className="flex-1 px-2 py-3">
      <FlashList
        data={flashListData}
        renderItem={renderItem}
        estimatedItemSize={200}
        getItemType={(item) => item.type}
        ListEmptyComponent={() => (
          <Empty title="Không có sản phẩm nào" isLoading={isLoading} />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
        }
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          return hasNextPage && isFetching ? (
            <View className="flex-row justify-center items-center py-4">
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : (
            <View className="h-[100px]" />
          );
        }}
      />
    </View>
  );
};

export default ShopProduct;
