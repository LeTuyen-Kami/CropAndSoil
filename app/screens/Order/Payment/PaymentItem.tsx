import React from "react";
import { View, ImageSourcePropType, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";

interface PaymentItemProps {
  name: string;
  image: any;
  type: string;
  price: number;
  originalPrice: number;
  quantity: number;
  onPress: () => void;
}

const PaymentItem = ({
  name,
  image,
  type,
  price,
  originalPrice,
  quantity,
  onPress,
}: PaymentItemProps) => {
  const formatPrice = (value: number) => {
    return value.toLocaleString() + "đ";
  };

  return (
    <TouchableOpacity className="flex-row gap-1.5 px-3" onPress={onPress}>
      {/* Product Image */}
      <View className="w-[80px] h-[80px] border border-[#F0F0F0] rounded-2xl justify-center items-center p-2.5">
        <Image
          source={image}
          className="w-full h-full rounded-lg"
          contentFit="cover"
        />
      </View>

      {/* Product Info */}
      <View className="flex-1">
        {/* Product Name */}
        <Text
          className="text-xs text-[#383B45] leading-[18px]"
          numberOfLines={2}
        >
          {name}
        </Text>

        {/* Product Type */}
        <View className="mt-1">
          <Text className="text-[10px] text-[#AEAEAE] leading-[14px]">
            {type}
          </Text>
        </View>

        {/* Price and Quantity */}
        <View className="flex-row justify-between items-center mt-auto">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm text-[#0A0A0A]">
              {!!price ? formatPrice(price) : formatPrice(originalPrice)}
            </Text>
            {!!originalPrice && originalPrice > price && !!price && (
              <Text className="text-xs text-[#AEAEAE] line-through">
                {formatPrice(originalPrice)}
              </Text>
            )}
          </View>

          <Text className="text-[10px] text-[#676767]">x{quantity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PaymentItem;
