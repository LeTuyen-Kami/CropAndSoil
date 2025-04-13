import { Image as ExpoImage } from "expo-image";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import AllMedia from "./AllMedia";
import ReviewItem, { ReviewItemProps } from "~/components/common/ReviewItem";
import { Text } from "~/components/ui/text";
import { deepEqual } from "fast-equals";
import { useQuery } from "@tanstack/react-query";
import { productService } from "~/services/api/product.service";

type RatingProps = {
  rating?: number;
  totalReviews?: number;
  onViewAllPress?: () => void;
  id: string | number;
};

// Mock data for reviews
const MOCK_REVIEWS: ReviewItemProps[] = [
  {
    reviewer: {
      name: "Thanh Trần",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    rating: 5,
    quality: "Chất lượng sản phẩm: Tốt",
    date: "10/01/2025 12:14",
    productVariant: "NPK Rau Phú Mỹ",
    likes: 0,
    media: [
      {
        type: "video",
        uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: "0:18",
        thumbnail: "https://images.unsplash.com/photo-1560493676-04071c5f467b",
      },
      {
        type: "image",
        uri: "https://images.unsplash.com/photo-1560493676-04071c5f467b",
      },
      {
        type: "image",
        uri: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf",
      },
      {
        type: "image",
        uri: "https://images.unsplash.com/photo-1536147210925-5cb7a7a4f9fe",
      },
    ],
    sellerResponse:
      "Greenhome thật vui mừng khi nhận được đánh giá của bạn, và rất mong tiếp tục nhận được sự ủng hộ của bạn trong thời gian sắp tới ạ! Mến chúc bạn mỗi ngày đều rạng rỡ, tươi tắn và gặp nhiều may mắn!",
  },
  {
    reviewer: {
      name: "Lưu Nhã Ngân",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    rating: 5,
    quality: "Chất lượng sản phẩm: Tốt",
    date: "10/01/2025 12:14",
    productVariant: "NPK Rau Phú Mỹ",
    likes: 0,
    sellerResponse:
      "Greenhome thật vui mừng khi nhận được đánh giá của bạn, và rất mong tiếp tục nhận được sự ủng hộ của bạn trong thời gian sắp tới ạ! Mến chúc bạn mỗi ngày đều rạng rỡ, tươi tắn và gặp nhiều may mắn!",
  },
  {
    reviewer: {
      name: "Nguyễn Trần Hưng",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    rating: 5,
    quality: "Chất lượng sản phẩm: Tốt",
    date: "10/01/2025 12:14",
    productVariant: "NPK Rau Phú Mỹ",
    likes: 0,
  },
];

const Rating: React.FC<RatingProps> = ({
  totalReviews = 20,
  onViewAllPress,
  id,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const { data: productDetail } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => productService.getProductDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <ExpoImage
          key={i}
          source={imagePaths.starFilled}
          style={{ width: 16, height: 16, marginRight: 2 }}
          contentFit="contain"
        />
      );
    }
    return stars;
  };

  // Filter reviews based on selected filter
  const filteredReviews =
    selectedFilter === "images"
      ? MOCK_REVIEWS.filter((review) => review.media && review.media.length > 0)
      : MOCK_REVIEWS;

  return (
    <View className="mt-2 w-full bg-white rounded-3xl">
      <AllMedia />
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
        <ScrollView
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
              Tất cả đánh giá (16)
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
        </ScrollView>
      </View>

      {/* Review List */}
      <View>
        {filteredReviews.map((review, index) => (
          <ReviewItem key={index} {...review} />
        ))}
      </View>
    </View>
  );
};

export default React.memo(Rating, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
