import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, View } from "react-native";
import { Text } from "~/components/ui/text";
import RatingFilter from "./RatedFilter";
import ReviewItem, { ReviewItemProps } from "~/components/common/ReviewItem";
import Empty from "~/components/common/Empty";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { usePagination } from "~/hooks/usePagination";
import { reviewService } from "~/services/api/review.service";
import { RefreshControl } from "react-native-gesture-handler";
import { COLORS } from "~/constants/theme";
import { useState } from "react";

const ITEMS = [
  { id: "1", name: "Tất cả", value: "" },
  { id: "2", name: "5 sao", value: "5" },
  { id: "3", name: "4 sao", value: "4" },
  { id: "4", name: "3 sao", value: "3" },
  { id: "5", name: "2 sao", value: "2" },
  { id: "6", name: "1 sao", value: "1" },
];

const ListRated = ({ data }: { data: any[] }) => {
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

  const onPressEdit = (id: string | number) => {
    navigation.navigate("EditReview", { id });
  };

  const onPressLike = (id: string | number) => {
    console.log("onPressLike");
  };

  const onPressFilter = (item: any) => {
    setSelectedFilter(item);
    updateParams({ rating: item.value });
  };

  return (
    <View className="flex-1">
      <RatingFilter
        items={ITEMS}
        selectedItem={selectedFilter}
        onPressItem={onPressFilter}
      />
      <FlashList
        data={reviews}
        renderItem={({ item }) => (
          <ReviewItem
            isLikeButtonInBottom
            onPressEdit={() => onPressEdit(item.id)}
            onPressLike={() => onPressLike(item.id)}
            reviewer={{
              name: item.authorName,
              avatar: item.authorAvatar,
            }}
            rating={item.rating}
            quality={item.quality}
            date={item.createdAt}
            productVariant={item.variation.name}
            likes={item.totalLikes}
          />
        )}
        onEndReached={fetchNextPage}
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
        }
        estimatedItemSize={100}
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
