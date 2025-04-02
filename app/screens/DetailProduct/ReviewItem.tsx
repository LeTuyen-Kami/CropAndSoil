import React, { memo } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { imagePaths } from "~/assets/imagePath";

type ReviewMedia = {
  type: "image" | "video";
  uri: string;
  duration?: string;
};

export type ReviewItemProps = {
  reviewer: {
    name: string;
    avatar: string;
  };
  rating: number;
  quality: string;
  date: string;
  productVariant: string;
  comment?: string;
  likes: number;
  media?: ReviewMedia[];
  sellerResponse?: string;
};

const ReviewItem: React.FC<ReviewItemProps> = ({
  reviewer,
  rating,
  quality,
  date,
  productVariant,
  comment,
  likes,
  media,
  sellerResponse,
}) => {
  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <ExpoImage
          key={i}
          source={imagePaths.starFilled}
          style={{ width: 12, height: 12, marginRight: 2 }}
          contentFit="contain"
        />
      );
    }
    return stars;
  };

  return (
    <View className="p-3 border-b border-gray-100">
      <View className="flex-row">
        {/* Reviewer Avatar */}
        <View className="overflow-hidden mr-2 w-10 h-10 bg-gray-200 rounded-full">
          <ExpoImage
            source={reviewer.avatar}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>

        {/* Review Content */}
        <View className="flex-1">
          {/* Reviewer Name */}
          <Text className="text-[#000000] text-sm">{reviewer.name}</Text>

          {/* Star Rating */}
          <View className="flex-row items-center mt-1">{renderStars()}</View>

          {/* Quality */}
          <Text className="text-[#575964] text-sm mt-1">{quality}</Text>

          {/* Date and Product Variant */}
          <View className="flex-row items-center mt-1">
            <Text className="text-[#AEAEAE] text-sm">
              {date} | {`Phân loại: ${productVariant}`}
            </Text>
          </View>

          {/* Review Media */}
          {media && media.length > 0 && (
            <View className="mt-2">
              <FlatList
                data={media}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View className="relative mr-2">
                    <ExpoImage
                      source={item.uri}
                      style={{ width: 80, height: 80, borderRadius: 5 }}
                      contentFit="cover"
                    />
                    {item.type === "video" && (
                      <View className="absolute right-0 bottom-0 left-0 flex-row justify-center items-center px-2 h-5 bg-black bg-opacity-60 rounded-b-md">
                        <Text className="text-xs text-white">
                          {item.duration}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>
          )}

          {/* Like Button */}
          <View className="flex-row items-center mt-1">
            <TouchableOpacity className="flex-row items-center">
              <ExpoImage
                source={imagePaths.icHeart}
                style={{ width: 16, height: 16, tintColor: "#AEAEAE" }}
                contentFit="contain"
              />
              <Text className="text-[#AEAEAE] text-sm ml-1">{likes}</Text>
            </TouchableOpacity>
          </View>

          {/* Seller Response */}
          {sellerResponse && (
            <View className="bg-[#FFF9ED] p-3 rounded-xl mt-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-[#000000] text-sm">
                  Phản hồi của người bán
                </Text>
                <ExpoImage
                  source={imagePaths.icArrowRight}
                  style={{
                    width: 16,
                    height: 16,
                    tintColor: "#383B45",
                    transform: [{ rotate: "90deg" }],
                  }}
                  contentFit="contain"
                />
              </View>
              <Text className="text-[#575964] text-xs mt-1">
                {sellerResponse}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(ReviewItem);
