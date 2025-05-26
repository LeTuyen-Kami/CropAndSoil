import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image as ExpoImage } from "expo-image";
import { deepEqual } from "fast-equals";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import ReviewItem from "~/components/common/ReviewItem";
import { toast } from "~/components/common/Toast";
import { Text } from "~/components/ui/text";
import { usePagination } from "~/hooks/usePagination";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { productService } from "~/services/api/product.service";
import { reviewService } from "~/services/api/review.service";
import { formatDate } from "~/utils";
type RatingProps = {
  id: string | number;
};

const Rating: React.FC<RatingProps> = ({ id }) => {
  const navigation = useSmartNavigation();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const { data: productDetail } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => productService.getProductDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      return {
        averageRating: data.averageRating,
        reviewCount: data.reviewCount,
        productId: data.id,
      };
    },
  });

  const { data: reviews } = usePagination(
    (params) =>
      reviewService.getProductReviews(productDetail?.productId!, params),
    {
      initialPagination: {
        take: 10,
        skip: 0,
      },
      initialParams: {},
      queryKey: ["reviews", String(productDetail?.productId)],
      enabled: !!productDetail?.productId,
      staleTime: 1000 * 60 * 5,
    }
  );

  const renderStars = () => {
    const stars = [];

    const rating = Math.round(productDetail?.averageRating || 0);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <AntDesign
          key={i}
          name={i < rating ? "star" : "staro"}
          size={16}
          color={rating >= i + 1 ? "#FCBA27" : "#E0E0E0"}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const onViewAllPress = () => {
    if (!productDetail?.averageRating) {
      toast.info("Chưa có đánh giá nào");
      return;
    }

    navigation.smartNavigate("AllProductReview", {
      productId: productDetail?.productId,
    });
  };

  if (!productDetail || !reviews || reviews?.length === 0) return null;

  return (
    <View className="mt-2 w-full bg-white rounded-3xl">
      {/* <AllMedia
        media={reviews?.flatMap((review) =>
          review.gallery.map((media) => ({
            type: getMediaTypes(media),
            uri: media,
            id: media,
          }))
        )}
      /> */}
      <View className="p-2 border-b border-gray-100">
        {/* Header Section */}
        <View className="flex-row justify-between items-center w-full">
          <Text className="text-[#383B45] font-bold text-lg">
            Đánh giá sản phẩm
          </Text>

          <TouchableOpacity
            className="flex-row items-center"
            onPress={onViewAllPress}
          >
            <Text className="text-[#159747] mr-1">Xem tất cả</Text>
            <ExpoImage
              source={imagePaths.icArrowRight}
              style={{ width: 16, height: 16, tintColor: "#159747" }}
              contentFit="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Rating Summary */}
        <View className="flex-row items-center mt-1">
          <View className="flex-row items-center">{renderStars()}</View>
          <Text className="ml-2 text-[#159747]">{`${(
            productDetail?.averageRating || 0
          )?.toFixed(1)}/5`}</Text>
          <Text className="ml-2 text-[#676767]">{`(${
            productDetail?.reviewCount || 0
          } đánh giá)`}</Text>
        </View>

        {/* Filters */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 mb-2"
        >
          <TouchableOpacity
            className={`mr-2 px-4 py-2 rounded-full border ${
              selectedFilter === "all"
                ? "border-[#159747] bg-[#F5FFFA]"
                : "border-gray-200"
            }`}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              className={`${
                selectedFilter === "all" ? "text-[#159747]" : "text-[#676767]"
              }`}
            >
              Tất cả đánh giá ({productDetail?.reviewCount || 0})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`mr-2 px-4 py-2 rounded-full border ${
              selectedFilter === "images"
                ? "border-[#159747] bg-[#F5FFFA]"
                : "border-gray-200"
            }`}
            onPress={() => setSelectedFilter("images")}
          >
            <Text
              className={`${
                selectedFilter === "images"
                  ? "text-[#159747]"
                  : "text-[#676767]"
              }`}
            >
              Đánh giá sản phẩm có hình ảnh (2)
            </Text>
          </TouchableOpacity>
        </ScrollView> */}
      </View>

      {/* Review List */}
      <View>
        {reviews?.map((review, index) => (
          <ReviewItem
            key={index}
            reviewer={{
              name: review?.authorName,
              avatar: review?.authorAvatar,
            }}
            rating={review?.rating}
            quality={review?.quality}
            date={formatDate(review?.createdAt)}
            productVariant={review?.variation?.name || ""}
            likes={review?.totalLikes || 0}
            comment={review?.comment}
            media={review?.gallery?.map((media) => ({
              type: media?.type === "video" ? "video" : "image",
              uri: media?.thumbnail,
              src: media?.src,
            }))}
          />
        ))}
      </View>
    </View>
  );
};

export default React.memo(Rating, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
