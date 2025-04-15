import {
  View,
  TouchableOpacity,
  ImageSourcePropType,
  Pressable,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import Checkbox from "expo-checkbox";
import { Feather } from "@expo/vector-icons";
import { memo, useState, useRef, useEffect } from "react";
import { imagePaths } from "~/assets/imagePath";
import { deepEqual } from "fast-equals";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "~/navigation/types";
import { formatPrice, getErrorMessage } from "~/utils";
import { cartService } from "~/services/api/cart.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./Toast";

export interface ShoppingCartItemProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  type?: string;
  quantity: number;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onQuantityChange?: (id: string, quantity: number) => void;
  onDelete?: (id: string) => void;
  productId: string;
  variationId: string;
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
  productId,
  variationId,
}: ShoppingCartItemProps) => {
  const navigation = useNavigation<RootStackScreenProps<"MainTabs">>();
  const queryClient = useQueryClient();

  const mutationUpdateCartItem = useMutation({
    mutationFn: (data: { quantity: number; isChecked: boolean }) => {
      return cartService.updateCartItem({
        cartItemId: Number(id),
        data: {
          productId: Number(productId),
          quantity: data.quantity,
          isChecked: data.isChecked,
          variationId: Number(variationId),
        },
      });
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ["detail-cart"] });
      toast.error(getErrorMessage(error, "Cập nhật giỏ hàng thất bại"));
    },
  });

  const handleSelect = (value: boolean) => {
    onSelect?.(id, value);

    // Call mutation to update selection
    mutationUpdateCartItem.mutate({
      quantity: quantity,
      isChecked: value,
    });
  };

  const updateQuantity = (newQuantity: number) => {
    onQuantityChange?.(id, newQuantity);

    // Call mutation to update quantity
    mutationUpdateCartItem.mutate({
      quantity: newQuantity,
      isChecked: isSelected,
    });
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    updateQuantity(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      updateQuantity(newQuantity);
    }
  };

  const handleDelete = () => {
    onDelete?.(id);
  };

  const handleNavigateToProductDetail = () => {
    navigation.navigate("DetailProduct", {
      id: productId,
    });
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
        <Pressable onPress={handleNavigateToProductDetail}>
          <View className="w-[100px] h-[100px] border border-[#F0F0F0] rounded-2xl justify-center items-center p-2.5">
            <Image
              source={image}
              className="w-full h-full rounded-lg"
              contentFit="cover"
            />
          </View>
        </Pressable>
      </View>

      <View className="flex-1 justify-center">
        <Pressable onPress={handleNavigateToProductDetail}>
          <Text
            className="text-xs text-[#383B45] leading-[18px]"
            numberOfLines={2}
          >
            {name}
          </Text>
        </Pressable>

        {!!type && (
          <View className="flex-row items-center mt-1">
            <View className="flex-row items-center bg-[#F5F5F5] rounded-full py-1.5 px-3 gap-2">
              <Text className="text-[10px] text-black leading-[14px]">
                {type}
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
        )}

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
              disabled={mutationUpdateCartItem.isPending}
            >
              <Feather name="minus" size={16} color="#676767" />
            </TouchableOpacity>
            <View className="border-l border-r border-[#E3E3E3] px-2 h-full justify-center">
              <Text className="text-[10px] text-[#545454] leading-[14px]">
                {quantity}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleIncrement}
              className="justify-center items-center w-7 h-7"
              disabled={mutationUpdateCartItem.isPending}
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
