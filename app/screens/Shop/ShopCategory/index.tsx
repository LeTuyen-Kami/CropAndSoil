import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { imagePaths } from "~/assets/imagePath";
import Empty from "~/components/common/Empty";
import { Text } from "~/components/ui/text";
import { COLORS } from "~/constants/theme";
import { usePagination } from "~/hooks/usePagination";
import { categoryService, ICategory } from "~/services/api/category.service";
import useGetShopId from "../useGetShopId";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";

interface ItemProps {
  title: string;
  image: string;
  count: number;
  onPress: () => void;
}

const Item = ({ title, image, count, onPress }: ItemProps) => {
  return (
    <TouchableOpacity
      className="flex-row gap-2 items-center px-2 py-3 bg-white"
      onPress={onPress}
    >
      <Image
        className="size-[46px] rounded-lg"
        source={image}
        contentFit="contain"
        placeholder={imagePaths.placeholder}
        placeholderContentFit="contain"
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
  const navigation = useSmartNavigation();

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
    staleTime: 5000,
  });

  const handlePressCategory = (category: ICategory) => {
    navigation.smartNavigate("SearchAdvance", {
      searchText: category.name,
      shopId: shopId,
    });
  };

  return (
    <FlashList
      showsVerticalScrollIndicator={false}
      data={data}
      renderItem={({ item }) => (
        <Item
          title={item.name}
          image={item.thumbnail}
          count={item.totalProducts}
          onPress={() => handlePressCategory(item)}
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
