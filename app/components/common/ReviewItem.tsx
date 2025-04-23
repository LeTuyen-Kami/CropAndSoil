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
import { AntDesign, Feather } from "@expo/vector-icons";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { Video, ResizeMode } from "expo-av";
import RenderVideo from "./RenderVideo";
import { deepEqual } from "fast-equals";

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
  const navigation = useSmartNavigation();
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

  const onPressProduct = () => {
    if (product) {
      navigation.smartNavigate("DetailProduct", { id: product.id });
    }
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
            placeholder={imagePaths.icAvatar}
            placeholderContentFit="cover"
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
                    {item.type === "image" ? (
                      <ExpoImage
                        source={item.uri}
                        style={{ width: 80, height: 80, borderRadius: 5 }}
                        contentFit="cover"
                        shouldRasterizeIOS={true}
                      />
                    ) : (
                      <View className="w-20 h-20 bg-gray-200 rounded-md">
                        <RenderVideo uri={item.uri} />
                      </View>
                    )}
                  </Pressable>
                )}
                getItemLayout={(data, index) => ({
                  length: 80,
                  offset: 80 * index,
                  index,
                })}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={3}
              />
            </View>
          )}
          {/* Like Button */}
          {/* {!isLikeButtonInBottom && (
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
          )} */}
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
            <TouchableOpacity
              className="flex-row my-2 rounded-lg border border-[#F0F0F0]"
              onPress={onPressProduct}
            >
              <View className="p-2.5 bg-white rounded-l-lg">
                <Image
                  source={product.image}
                  style={{ width: 40, height: 40, borderRadius: 5 }}
                  contentFit="cover"
                />
              </View>
              <View className="flex-1 py-2 bg-[#F0F0F0] pl-1.5">
                <Text
                  numberOfLines={2}
                  className="text-[#383B45] text-xs leading-tight"
                >
                  {product.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {isLikeButtonInBottom && (
            <View className="flex-row items-center justify-between mt-1.5">
              <TouchableOpacity
                className="flex-row items-center"
                hitSlop={20}
                onPress={onPressLike}
              >
                {/* <AntDesign
                  name="like1"
                  size={20}
                  color="#AEAEAE"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-[#AEAEAE] text-sm">{likes}</Text> */}
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

export default memo(ReviewItem, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
