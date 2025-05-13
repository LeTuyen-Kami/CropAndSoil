import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "~/components/ui/text";
import { FontAwesome5 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import { cn } from "~/lib/utils";

const Header = ({
  total,
  sort,
  onToggleSort,
}: {
  total: number;
  sort: {
    sortBy: "salePrice" | "createdAt";
    sortDirection: "asc" | "desc";
  } | null;
  onToggleSort: () => void;
}) => {
  return (
    <View className="flex-row gap-2 items-center px-2 mb-4 w-full">
      <Text className="text-sm font-medium text-black">
        Tất cả sản phẩm{" "}
        <Text className="text-sm font-medium text-[#676767]">
          ({(total || 0)?.toLocaleString()} kết quả)
        </Text>
      </Text>
      <TouchableOpacity
        className={cn(
          "flex-row gap-2 items-center px-4 py-2 ml-auto bg-white rounded-full",
          sort && "border border-primary"
        )}
        onPress={onToggleSort}
      >
        <Text
          className={cn(
            "text-sm font-medium leading-tight text-[#676767]",
            sort && "text-primary"
          )}
        >
          Sắp xếp
        </Text>
        {!sort ? (
          <Image
            source={imagePaths.icSort}
            className="size-5"
            contentFit="contain"
          />
        ) : (
          <FontAwesome5
            name={
              sort?.sortDirection === "desc"
                ? "sort-amount-down-alt"
                : "sort-amount-up-alt"
            }
            size={16}
            color={COLORS.primary}
          />
        )}
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
          image={item.thumbnail}
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

  const [sort, setSort] = useState<{
    sortBy: "salePrice" | "createdAt";
    sortDirection: "asc" | "desc";
  } | null>(null);

  const {
    data,
    isLoading,
    isRefresh,
    refresh,
    hasNextPage,
    fetchNextPage,
    isFetching,
    total,
    updateParams,
    resetParams,
  } = usePagination(productService.searchProducts, {
    queryKey: ["products", (id || "")?.toString()],
    enabled: !!id,
    initialParams: {
      shopId: id?.toString(),
      sortBy: undefined as "salePrice" | "createdAt" | undefined,
      sortDirection: undefined as "asc" | "desc" | undefined,
    },
    initialPagination: {
      skip: 0,
      take: 10,
    },
  });

  const onToggleSort = () => {
    if (!sort) {
      setSort({
        sortBy: "salePrice",
        sortDirection: "desc",
      });
    } else if (sort?.sortBy === "salePrice" && sort?.sortDirection === "desc") {
      setSort({
        sortBy: "salePrice",
        sortDirection: "asc",
      });
    } else {
      setSort(null);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item.type === "header") {
        return <Header total={total} sort={sort} onToggleSort={onToggleSort} />;
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
    },
    [isLoading, sort]
  );

  useEffect(() => {
    if (!sort) return resetParams();

    updateParams({
      sortBy: sort?.sortBy,
      sortDirection: sort?.sortDirection,
    });
  }, [sort]);

  const flashListData = useMemo(() => {
    const handledData = preHandleFlashListData(data);

    if (!data || data.length === 0) {
      return [
        { type: "header", id: "header" },
        { type: "noData", id: "noData" },
      ];
    }

    return [{ type: "header", id: "header" }, ...handledData];
  }, [data, sort]);

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
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
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
