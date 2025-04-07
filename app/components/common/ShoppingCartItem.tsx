import { View, TouchableOpacity, ImageSourcePropType } from "react-native";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import Checkbox from "expo-checkbox";
import { Feather } from "@expo/vector-icons";
import { memo, useState } from "react";
import { imagePaths } from "~/assets/imagePath";
import { deepEqual } from "fast-equals";

export interface ShoppingCartItemProps {
  id: string;
  name: string;
  image: ImageSourcePropType;
  price: number;
  originalPrice?: number;
  type?: string;
  quantity: number;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onQuantityChange?: (id: string, quantity: number) => void;
  onDelete?: (id: string) => void;
}

const ShoppingCartItem = ({
  id,
  name,
  image,
  price,
  originalPrice,
  type,
  quantity = 1,
  isSelected = false,
  onSelect,
  onQuantityChange,
  onDelete,
}: ShoppingCartItemProps) => {
  const [itemQuantity, setItemQuantity] = useState(quantity);

  const handleSelect = (value: boolean) => {
    onSelect?.(id, value);
  };

  const handleIncrement = () => {
    const newQuantity = itemQuantity + 1;
    setItemQuantity(newQuantity);
    onQuantityChange?.(id, newQuantity);
  };

  const handleDecrement = () => {
    if (itemQuantity > 1) {
      const newQuantity = itemQuantity - 1;
      setItemQuantity(newQuantity);
      onQuantityChange?.(id, newQuantity);
    }
  };

  const handleDelete = () => {
    onDelete?.(id);
  };

  const formatPrice = (value: number) => {
    return value.toLocaleString() + "đ";
  };

  return (
    <View className="flex-row gap-2 pt-4 px-3 pb-3 border-b border-[#F0F0F0]">
      <View className="flex-row gap-1 items-center">
        <Checkbox
          value={isSelected}
          onValueChange={handleSelect}
          color={isSelected ? "#159747" : undefined}
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: "#CCC",
          }}
        />
        <View className="w-[100px] h-[100px] border border-[#F0F0F0] rounded-2xl justify-center items-center p-2.5">
          <Image
            source={image}
            className="w-full h-full rounded-lg"
            contentFit="cover"
          />
        </View>
      </View>

      <View className="flex-1 justify-center">
        <Text
          className="text-xs text-[#383B45] leading-[18px]"
          numberOfLines={2}
        >
          {name}
        </Text>

        <View className="flex-row items-center mt-1">
          <View className="flex-row items-center bg-[#F5F5F5] rounded-full py-1.5 px-3 gap-2">
            <Text className="text-[10px] text-black leading-[14px]">
              {type || "NPK Rau Phú Mỹ"}
            </Text>
            <Image
              source={imagePaths.icArrowRight}
              style={{
                width: 14,
                height: 14,
                tintColor: "#676767",
                transform: [{ rotate: "90deg" }],
              }}
            />
          </View>
        </View>

        <View className="flex-row items-center gap-1.5 mt-1">
          <Text className="text-xs font-bold text-[#E01839]">
            {formatPrice(price)}
          </Text>
          {originalPrice && originalPrice > price && (
            <Text className="text-xs text-[#AEAEAE] line-through">
              {formatPrice(originalPrice)}
            </Text>
          )}
        </View>

        <View className="flex-row justify-between items-center mt-1">
          <View className="flex-row items-center border border-[#E3E3E3] rounded h-7">
            <TouchableOpacity
              onPress={handleDecrement}
              className="justify-center items-center w-7 h-7"
            >
              <Feather name="minus" size={16} color="#676767" />
            </TouchableOpacity>
            <View className="border-l border-r border-[#E3E3E3] px-2 h-full justify-center">
              <Text className="text-[10px] text-[#545454] leading-[14px]">
                {itemQuantity}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleIncrement}
              className="justify-center items-center w-7 h-7"
            >
              <Feather name="plus" size={16} color="#676767" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleDelete}>
            <Text className="text-xs text-[#E01839]">Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(ShoppingCartItem, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
