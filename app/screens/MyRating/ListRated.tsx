import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Image as RNImage,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import Empty from "~/components/common/Empty";
import ReviewItem from "~/components/common/ReviewItem";
import { Text } from "~/components/ui/text";
import { COLORS } from "~/constants/theme";
import { usePagination } from "~/hooks/usePagination";
import { IReview, reviewService } from "~/services/api/review.service";
import { formatDate, isIOS } from "~/utils";
import RatingFilter from "./RatedFilter";

const ITEMS = [
  { id: "1", name: "Tất cả", value: "" },
  { id: "2", name: "5 sao", value: "5" },
  { id: "3", name: "4 sao", value: "4" },
  { id: "4", name: "3 sao", value: "3" },
  { id: "5", name: "2 sao", value: "2" },
  { id: "6", name: "1 sao", value: "1" },
];

const ListRated = () => {
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<{
    id: string;
    name: string;
  }>(ITEMS[0]);

  const {
    data: reviews,
    isLoading,
    isFetching,
    hasNextPage,
    isRefresh,
    refresh,
    fetchNextPage,
    updateParams,
  } = usePagination(reviewService.getMyReviews, {
    initialPagination: {
      skip: 0,
      take: 10,
    },
    queryKey: ["reviews"],
  });

  const onPressEdit = (review: IReview) => {
    navigation.navigate("EditReview", {
      orderId: review.orderId,
      productId: review.productId,
      variationId: review.variationId,
      thumbnail: review.variation?.thumbnail || review.product?.thumbnail,
      productName: review.product?.name,
      variationName: review.variation?.name,
      isEdit: true,
      review: review,
    });
  };
  const onPressLike = (id: string | number) => {
    console.log("onPressLike");
  };

  const onPressFilter = (item: any) => {
    setSelectedFilter(item);
    updateParams({ rating: item.value });
  };

  const renderItem = useCallback(
    ({ item }: { item: IReview }) => {
      return (
        <View className="bg-white rounded-2xl">
          <TouchableOpacity
            className="flex-row gap-2 items-center px-3 pt-3"
            onPress={() => {
              navigation.navigate("Shop", { id: item.shop.id });
            }}
          >
            <Image
              source={imagePaths.icShop}
              className="size-5"
              contentFit="cover"
              style={{
                tintColor: "#393B45",
              }}
            />

            <Text className="text-sm text-[#393B45]  font-medium">
              {item.shop.shopName}
            </Text>
          </TouchableOpacity>
          <ReviewItem
            isLikeButtonInBottom
            onPressEdit={() => onPressEdit(item)}
            onPressLike={() => onPressLike(item.id)}
            reviewer={{
              name: item.authorName,
              avatar: item.authorAvatar,
            }}
            sellerResponse={item?.replies?.[0]?.comment}
            rating={item.rating}
            media={item?.gallery?.map((media) => ({
              type: media.type === "video" ? "video" : "image",
              uri: media.thumbnail,
              src: media.src,
            }))}
            quality={item.quality}
            date={formatDate(item.createdAt)}
            productVariant={item.variation.name}
            likes={item.totalLikes}
            product={{
              id: item.productId.toString(),
              name: item?.product?.name,
              image: item?.product?.thumbnail,
            }}
            comment={item.comment}
            isReportButtonInBottom={false}
          />
        </View>
      );
    },
    [navigation]
  );

  return (
    <View className="flex-1 bg-[#eee]">
      <RatingFilter
        items={ITEMS}
        selectedItem={selectedFilter}
        onPressItem={onPressFilter}
      />
      <FlashList
        data={reviews}
        renderItem={renderItem}
        onEndReached={fetchNextPage}
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
        }
        showsVerticalScrollIndicator={false}
        estimatedItemSize={500}
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={() => (
          <Empty title="Không có đánh giá nào" isLoading={isLoading} />
        )}
        ListFooterComponent={
          isFetching && hasNextPage ? (
            <View className="justify-center items-center py-3">
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : (
            <View
              className="py-3"
              style={{
                paddingBottom: bottom,
              }}
            >
              {reviews?.length > 0 && (
                <Text className="text-sm text-center text-primary">
                  Bạn đã xem hết danh sách
                </Text>
              )}
            </View>
          )
        }
      />
    </View>
  );
};

export default ListRated;
