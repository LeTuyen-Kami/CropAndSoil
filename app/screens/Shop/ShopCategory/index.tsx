import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";
import { useQuery } from "@tanstack/react-query";
import { shopService } from "~/services/api/shop.service";
import { categoryService } from "~/services/api/category.service";
import { usePagination } from "~/hooks/usePagination";
import Empty from "~/components/common/Empty";
import { COLORS } from "~/constants/theme";
import useGetShopId from "../useGetShopId";

interface ItemProps {
  title: string;
  image: string;
  count: number;
}

const Item = ({ title, image, count }: ItemProps) => {
  return (
    <TouchableOpacity className="flex-row gap-2 items-center px-2 py-3 bg-white">
      <Image
        className="size-[46px] rounded-lg"
        source={image}
        contentFit="contain"
      />
      <View className="flex-1 justify-center">
        <Text className="text-lg leading-7">{title}</Text>
        <Text className="text-xs text-gray-500">{count} sản phẩm</Text>
      </View>
      <Image
        source={imagePaths.icArrowRight}
        className="size-6"
        style={{ tintColor: "#ccc" }}
        contentFit="contain"
      />
    </TouchableOpacity>
  );
};

const ShopCategory = () => {
  const shopId = useGetShopId();
  // const { data: categoryByShopId } = useQuery({
  //   queryKey: ["categoryByShopId", shopId],
  //   queryFn: () => categoryService.getCategoryByShopId(shopId),
  //   enabled: !!shopId,
  // });

  const {
    data,
    isLoading,
    isRefresh,
    refresh,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = usePagination(categoryService.getCategoryByShopId, {
    queryKey: ["categoryByShopId", (shopId || "")?.toString()],
    enabled: !!shopId,
    initialParams: {
      shopId: shopId,
    },
  });

  return (
    <FlashList
      showsVerticalScrollIndicator={false}
      data={data}
      renderItem={({ item }) => (
        <Item
          title={item.name}
          image={item.thumbnail}
          count={item.totalProducts}
        />
      )}
      ListEmptyComponent={() => (
        <Empty title={"Không có danh mục"} isLoading={isLoading} />
      )}
      refreshControl={
        <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
      }
      estimatedItemSize={200}
      ItemSeparatorComponent={() => <View className="h-[1px] bg-transparent" />}
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
  );
};

export default ShopCategory;
