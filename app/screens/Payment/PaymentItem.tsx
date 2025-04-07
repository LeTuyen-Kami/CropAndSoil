import React from "react";
import { View, ImageSourcePropType } from "react-native";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";

interface PaymentItemProps {
  id: string;
  name: string;
  image: ImageSourcePropType;
  type: string;
  price: number;
  originalPrice: number;
  quantity: number;
}

const PaymentItem = ({
  id,
  name,
  image,
  type,
  price,
  originalPrice,
  quantity,
}: PaymentItemProps) => {
  const formatPrice = (value: number) => {
    return value.toLocaleString() + "đ";
  };

  return (
    <View className="flex-row gap-1.5 px-3">
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
            <Text className="text-sm text-[#0A0A0A]">{formatPrice(price)}</Text>
            {originalPrice > price && (
              <Text className="text-xs text-[#AEAEAE] line-through">
                {formatPrice(originalPrice)}
              </Text>
            )}
          </View>

          <Text className="text-[10px] text-[#676767]">x{quantity}</Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentItem;
