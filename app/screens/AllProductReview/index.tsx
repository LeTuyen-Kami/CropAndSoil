import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import Empty from "~/components/common/Empty";
import Header from "~/components/common/Header";
import ReviewItem from "~/components/common/ReviewItem";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { COLORS } from "~/constants/theme";
import { usePagination } from "~/hooks/usePagination";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { cn } from "~/lib/utils";
import { IReview, reviewService } from "~/services/api/review.service";
import { formatDate } from "~/utils";

interface FilterItem {
  id: string;
  name: string;
  value: string;
}

interface RatingFilterProps {
  onPressItem: (item: FilterItem) => void;
  items: FilterItem[];
  selectedItem: FilterItem;
}

const FILTER_ITEMS: FilterItem[] = [
  { id: "1", name: "Tất cả", value: "" },
  { id: "2", name: "5 sao", value: "5" },
  { id: "3", name: "4 sao", value: "4" },
  { id: "4", name: "3 sao", value: "3" },
  { id: "5", name: "2 sao", value: "2" },
  { id: "6", name: "1 sao", value: "1" },
];

const RatingFilter = ({
  onPressItem,
  items,
  selectedItem,
}: RatingFilterProps) => {
  return (
    <View className="py-2 mb-2 bg-white">
      <FlashList
        horizontal
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onPressItem(item)}
            className={`px-4 py-2 mx-1 rounded-full border border-[#F0F0F0] bg-[#F0F0F0] ${
              selectedItem.id === item.id
                ? "border-primary"
                : "border-[#F0F0F0]"
            }`}
          >
            <Text
              className={cn(
                "text-xs font-medium tracking-tight text-[#676767]",
                selectedItem.id === item.id && "text-primary"
              )}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        estimatedItemSize={50}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

interface RouteParams {
  productId: string | number;
}

const AllProductReview = ({ route }: { route?: { params?: RouteParams } }) => {
  const { productId = "" } = route?.params || {};
  const { bottom } = useSafeAreaInsets();
  const navigation = useSmartNavigation();
  const [selectedFilter, setSelectedFilter] = useState<FilterItem>(
    FILTER_ITEMS[0]
  );

  const {
    data: reviews,
    isLoading,
    isFetching,
    hasNextPage,
    isRefresh,
    refresh,
    fetchNextPage,
    updateParams,
  } = usePagination<IReview>(
    (params) => {
      if (!productId) {
        return Promise.resolve({
          data: [],
          skip: 0,
          take: 10,
          total: 0,
        });
      }
      return reviewService.getProductReviews(productId, params);
    },
    {
      initialPagination: {
        skip: 0,
        take: 10,
      },
      initialParams: {},
      queryKey: ["product-reviews", String(productId)],
      enabled: !!productId,
    }
  );

  const onPressFilter = (item: FilterItem) => {
    setSelectedFilter(item);
    updateParams({ rating: item.value });
  };

  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header
        textColor="white"
        title="Đánh giá sản phẩm"
        className="bg-transparent border-0"
        hasSafeTop={false}
      />
      <View className="rounded-t-[16px] overflow-hidden bg-[#F5F5F5] flex-1">
        <RatingFilter
          items={FILTER_ITEMS}
          selectedItem={selectedFilter}
          onPressItem={onPressFilter}
        />
        <FlashList
          showsVerticalScrollIndicator={false}
          data={reviews || []}
          renderItem={({ item }: { item: IReview }) => (
            <View className="mx-3 mb-2 bg-white rounded-2xl">
              <TouchableOpacity
                className="flex-row gap-2 items-center px-3 pt-3"
                onPress={() => {
                  navigation.navigate("Shop", { id: String(item.shop.id) });
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
                <Text className="text-sm text-[#393B45] font-medium">
                  {item.shop.shopName}
                </Text>
              </TouchableOpacity>
              <ReviewItem
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
                comment={item.comment}
              />
            </View>
          )}
          onEndReached={fetchNextPage}
          refreshControl={
            <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
          }
          estimatedItemSize={250}
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
    </ScreenWrapper>
  );
};

export default AllProductReview;
