import { Image as ExpoImage, Image } from "expo-image";
import React, { memo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { imagePaths } from "~/assets/imagePath";
import Gallery from "~/components/common/Galery";
import useDisclosure from "~/hooks/useDisclosure";
import { AntDesign } from "@expo/vector-icons";

type ReviewMedia = {
  type: "image" | "video";
  uri: string;
  duration?: string;
  thumbnail?: string;
};

type ReviewProduct = {
  id: string;
  name: string;
  image: string;
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
  product?: ReviewProduct;
  isLikeButtonInBottom?: boolean;
  onPressEdit?: () => void;
  onPressLike?: () => void;
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
  product,
  isLikeButtonInBottom = false,
  onPressEdit,
  onPressLike,
}) => {
  const { isOpen, onOpen, onClose, openValue } = useDisclosure({
    initialOpenValue: 0,
  });
  const [sallerCollapsed, setSallerCollapsed] = useState(true);
  const rotate = useSharedValue(0);

  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <AntDesign
          key={i}
          name={i < rating ? "star" : "staro"}
          size={12}
          color="#FCBA27"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const handleSallerCollapsed = () => {
    setSallerCollapsed(!sallerCollapsed);
    rotate.value = withTiming(sallerCollapsed ? 90 : 0);
  };

  const rotateArrow = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

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
          <Text className="mt-1 text-sm text-[#AEAEAE]">
            Chất lượng sản phẩm:{" "}
            <Text className="text-sm text-[#575964]">{quality}</Text>
          </Text>

          {/* comment */}
          {comment && (
            <Text className="mt-1 text-sm text-[#676767]">{comment}</Text>
          )}

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
                  <Pressable
                    onPress={() => onOpen(index)}
                    className="relative mr-2"
                  >
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
                  </Pressable>
                )}
              />
            </View>
          )}

          {/* Like Button */}
          {!isLikeButtonInBottom && (
            <View className="flex-row items-center mt-1.5">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={onPressLike}
              >
                <AntDesign
                  name="like1"
                  size={20}
                  color="#AEAEAE"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-[#AEAEAE] text-sm">{likes}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Seller Response */}
          {sellerResponse && (
            <Pressable onPress={handleSallerCollapsed}>
              <Animated.View
                className="bg-[#FFF9ED] p-3 rounded-xl mt-1.5 overflow-hidden"
                layout={LinearTransition}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-[#000000] text-sm">
                    Phản hồi của người bán
                  </Text>
                  <Animated.View style={rotateArrow}>
                    <ExpoImage
                      source={imagePaths.icArrowRight}
                      style={[
                        {
                          width: 16,
                          height: 16,
                          tintColor: "#383B45",
                        },
                      ]}
                      contentFit="contain"
                    />
                  </Animated.View>
                </View>
                <View
                  className="overflow-hidden"
                  style={{
                    height: sallerCollapsed ? 0 : "auto",
                  }}
                >
                  {sallerCollapsed ? null : (
                    <Text className="text-[#575964] text-xs mt-1">
                      {sellerResponse}
                    </Text>
                  )}
                </View>
              </Animated.View>
            </Pressable>
          )}
          {/* product */}

          {product && (
            <View className="flex-row my-2 rounded-lg border border-[#F0F0F0]">
              <View className="p-2.5 bg-white rounded-l-lg">
                <Image
                  source={"https://picsum.photos/200/300"}
                  style={{ width: 40, height: 40, borderRadius: 5 }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1 justify-center items-center bg-[#F0F0F0] pl-1.5">
                <Text
                  numberOfLines={2}
                  className="text-[#383B45] text-xs leading-tight"
                >
                  lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos. Lorem ipsum dolor sit amet consectetur
                </Text>
              </View>
            </View>
          )}

          {isLikeButtonInBottom && (
            <View className="flex-row items-center justify-between mt-1.5">
              <TouchableOpacity
                className="flex-row items-center"
                hitSlop={20}
                onPress={onPressLike}
              >
                <AntDesign
                  name="like1"
                  size={20}
                  color="#AEAEAE"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-[#AEAEAE] text-sm">{likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row gap-2 items-center"
                hitSlop={20}
                onPress={onPressEdit}
              >
                <Text className="text-sm text-primary">Sửa</Text>
                <Image
                  source={imagePaths.icEdit}
                  style={{ width: 16, height: 16 }}
                  contentFit="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Gallery
        visible={isOpen}
        images={
          media?.map((item) => ({
            url: item.uri,
            type: item.type,
            thumbnail: item.thumbnail,
          })) ?? []
        }
        onClose={onClose}
        initialIndex={openValue}
      />
    </View>
  );
};

export default memo(ReviewItem);
