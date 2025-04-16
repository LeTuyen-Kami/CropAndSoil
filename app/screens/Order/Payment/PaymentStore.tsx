import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageSourcePropType,
  Pressable,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { imagePaths } from "~/assets/imagePath";
import ScreenContainer from "~/components/common/ScreenContainer";
import PaymentItem from "./PaymentItem";
import { Store } from "../types";
import { useNavigation } from "@react-navigation/native";
import { RootStackRouteProp, RootStackScreenProps } from "~/navigation/types";
import { cn } from "~/lib/utils";

const PaymentStore = ({
  store,
  onMessagePress,
  message,
  onShopVoucherPress,
}: {
  store: Store;
  onMessagePress: () => void;
  message: string;
  onShopVoucherPress: () => void;
}) => {
  const navigation = useNavigation<RootStackScreenProps<"Payment">>();

  const products = useMemo(() => {
    return store.items.filter((item) => item.isSelected);
  }, [store]);

  const formatPrice = (value: number) => {
    return value.toLocaleString() + "đ";
  };

  const totalItems = products.reduce(
    (acc, product) => acc + product.quantity,
    0
  );

  const totalPrice = products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  const navigationToShop = () => {
    navigation.navigate("Shop", { id: store.id });
  };

  const navigationToProduct = (productId: string) => {
    navigation.navigate("DetailProduct", { id: productId });
  };

  return (
    <View className="bg-white rounded-2xl mb-2.5">
      {/* Header */}
      <View className="border-b border-[#F5F5F5] p-3">
        <Pressable className="flex-row items-center" onPress={navigationToShop}>
          <Image
            source={imagePaths.icShop}
            className="mr-2"
            contentFit="contain"
            style={{ tintColor: "#676767", width: 18, height: 18 }}
          />
          <Text className="font-medium text-sm text-[#383B45]">
            {store.name}
          </Text>
        </Pressable>
      </View>

      {/* Products */}
      <View className="gap-4 py-4">
        {products.map((product) => (
          <PaymentItem
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
            originalPrice={product.originalPrice}
            type={product.type}
            quantity={product.quantity}
            onPress={() => navigationToProduct(product.productId)}
          />
        ))}
      </View>

      {/* Voucher */}
      <TouchableOpacity
        className="flex-row justify-between items-center p-3 border-t border-[#F0F0F0]"
        onPress={onShopVoucherPress}
      >
        <Text className="text-sm text-[#676767]">Voucher của Shop</Text>
        <View className="flex-row flex-1 justify-end items-center ml-1">
          {store.shopVoucher ? (
            <Text
              className="flex-1 text-sm text-right text-primary"
              numberOfLines={1}
            >
              {store.shopVoucher.description}
            </Text>
          ) : (
            <Text className="text-sm text-[#AEAEAE] mr-2">
              Chọn hoặc nhập mã
            </Text>
          )}
          <Feather name="chevron-right" size={16} color="#AEAEAE" />
        </View>
      </TouchableOpacity>

      {/* Message */}
      <TouchableOpacity
        className="flex-row justify-between items-center p-3 border-t border-[#F0F0F0]"
        onPress={onMessagePress}
      >
        <Text className="text-sm text-[#676767]">Lời nhắn cho Shop</Text>
        <View className="flex-row items-center">
          <Text
            className={cn(
              "text-sm text-[#AEAEAE] mr-2",
              message && "text-[#383B45]"
            )}
          >
            {message || "Để lại lời nhắn"}
          </Text>
          <Feather name="chevron-right" size={16} color="#AEAEAE" />
        </View>
      </TouchableOpacity>

      {/* Delivery */}
      <View className="flex-row justify-between items-center p-3 border-t border-[#F0F0F0]">
        <Text className="text-sm text-[#676767]">Phương thức giao hàng</Text>
        <Text className="text-sm text-[#676767]">Giao hàng tiết kiệm</Text>
      </View>

      {/* Total */}
      <View className="flex-row justify-between items-center p-3 border-t border-[#F0F0F0]">
        <Text className="text-sm font-medium text-[#383B45]">
          Tổng số tiền ({totalItems} sản phẩm)
        </Text>
        <Text className="text-sm font-medium text-[#383B45]">
          {formatPrice(totalPrice)}
        </Text>
      </View>
    </View>
  );
};

export default PaymentStore;
