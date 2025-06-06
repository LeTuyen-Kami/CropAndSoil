import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
  Image as RNImage,
} from "react-native";
import { imagePaths } from "~/assets/imagePath";
import Empty from "~/components/common/Empty";
import { Text } from "~/components/ui/text";
import { usePagination } from "~/hooks/usePagination";
import { IOrder, orderService } from "~/services/api/order.service";
import { formatDate, isIOS } from "~/utils";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
type ProductItem = IOrder["items"][0] & {
  createdAt: string;
  shop: IOrder["shop"];
  orderId: number;
};

interface ListUnratedProps {}

const ListUnrated = ({}: ListUnratedProps) => {
  const navigation = useSmartNavigation();
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>();

  const {
    data,
    isLoading,
    isFetching,
    isRefresh,
    refresh,
    hasNextPage,
    fetchNextPage,
  } = usePagination(orderService.listOrder, {
    queryKey: ["list-unrated"],
    initialParams: {
      skip: 0,
      take: 10,
      isNotReviewed: true,
    },
  });

  const handleRatingPress = (product: ProductItem) => {
    setSelectedProduct(product);
  };

  const listData: ProductItem[] = useMemo(() => {
    return (
      data
        ?.map((item) => {
          return {
            ...item,
            items: item?.items?.map((i) => ({
              ...i,
              createdAt: item.createdAt,
              shop: item.shop,
              orderId: item.id,
            })),
          };
        })
        ?.flatMap((item) => item.items) || []
    );
  }, [data]);

  const onPressRating = (product: ProductItem) => {
    navigation.navigate("EditReview", {
      orderId: product.orderId,
      productId: product.productId,
      variationId: product.variationId,
      thumbnail: product.variation?.thumbnail || product.product?.thumbnail,
      productName: product.name,
      variationName: product.variation?.name,
      isEdit: false,
    });
  };
  const renderItem = ({ item }: { item: ProductItem }) => {
    return (
      <View className="mb-3 bg-white rounded-xl">
        <View className="flex-row px-2 py-3 border-b border-gray-200">
          <Image
            source={imagePaths.icShop}
            className="rounded-full size-5"
            style={{
              tintColor: "#676767",
            }}
          />
          <View className="flex-1 ml-3">
            <Text
              className="text-sm font-medium text-[#676767]"
              numberOfLines={1}
            >
              {item?.shop?.shopName}
            </Text>
          </View>
        </View>
        <View className="flex-row p-2">
          {isIOS ? (
            <RNImage
              source={{
                uri: item?.variation?.thumbnail || item?.product?.thumbnail,
              }}
              style={{ width: 80, height: 80, borderRadius: 8 }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={{
                uri: item?.variation?.thumbnail || item?.product?.thumbnail,
              }}
              className="w-20 h-20 rounded-lg"
              contentFit="cover"
            />
          )}
          <View className="flex-1 ml-3">
            <Text className="text-sm font-medium" numberOfLines={2}>
              {item.name}
            </Text>
            <Text className="text-[#AEAEAE] text-xs">
              Phân loại: {item.variation?.name}
            </Text>
            <Text className="mt-1 text-xs text-gray-500">
              Ngày mua: {formatDate(item.createdAt, "DD/MM/YYYY HH:mm")}
            </Text>

            <TouchableOpacity
              className="flex-row justify-center items-center px-4 py-2 mt-4 bg-yellow-500 rounded-full"
              onPress={() => onPressRating(item)}
            >
              <Text className="mr-2 text-xs font-medium text-white">
                Đánh giá ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 px-4 pt-3 bg-[#eee]">
      <FlashList
        data={listData}
        renderItem={renderItem}
        estimatedItemSize={100}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
        }
        ListEmptyComponent={() => (
          <Empty title="Không có đơn hàng" isLoading={isLoading} />
        )}
        ListFooterComponent={() => (
          <View className="h-2.5 items-center justify-center">
            {hasNextPage && isFetching && <ActivityIndicator />}
          </View>
        )}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default ListUnrated;
