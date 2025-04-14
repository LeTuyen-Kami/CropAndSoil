import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { imagePaths } from "~/assets/imagePath";
import ScreenContainer from "~/components/common/ScreenContainer";
import PaymentItem from "./PaymentItem";

interface Product {
  id: string;
  name: string;
  image: ImageSourcePropType;
  price: number;
  originalPrice: number;
  type: string;
  quantity: number;
}

const PaymentStore = () => {
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Phân Bón NPK Greenhome, Chuyên Rau Ăn Lá, Củ, Cây Ăn Trái, Hoa, Chắc Rễ, Khoẻ Cây, Bông To, Sai Quả",
      image: imagePaths.backArrow,
      price: 160000,
      originalPrice: 220000,
      type: "NPK Rau Phú Mỹ",
      quantity: 1,
    },
    {
      id: "2",
      name: "Phân Bón NPK Greenhome, Chuyên Rau Ăn Lá, Củ, Cây Ăn Trái, Hoa, Chắc Rễ, Khoẻ Cây, Bông To, Sai Quả",
      image: imagePaths.backArrow,
      price: 75000,
      originalPrice: 220000,
      type: "NPK Rau Phú Mỹ",
      quantity: 2,
    },
    {
      id: "3",
      name: "Phân Bón NPK Greenhome, Chuyên Rau Ăn Lá, Củ, Cây Ăn Trái, Hoa, Chắc Rễ, Khoẻ Cây, Bông To, Sai Quả",
      image: imagePaths.backArrow,
      price: 180000,
      originalPrice: 220000,
      type: "NPK Rau Phú Mỹ",
      quantity: 2,
    },
  ]);

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

  return (
    <View className="bg-white rounded-2xl">
      {/* Header */}
      <View className="border-b border-[#F5F5F5] p-3">
        <View className="flex-row items-center">
          <Image
            source={imagePaths.icShop}
            className="mr-2"
            contentFit="contain"
            style={{ tintColor: "#676767", width: 18, height: 18 }}
          />
          <Text className="font-medium text-sm text-[#383B45]">
            Super Lâm Thao
          </Text>
        </View>
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
          />
        ))}
      </View>

      {/* Voucher */}
      <TouchableOpacity className="flex-row justify-between items-center p-3 border-t border-[#F0F0F0]">
        <Text className="text-sm text-[#676767]">Voucher của Shop</Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-[#AEAEAE] mr-2">Chọn hoặc nhập mã</Text>
          <Feather name="chevron-right" size={16} color="#AEAEAE" />
        </View>
      </TouchableOpacity>

      {/* Message */}
      <TouchableOpacity className="flex-row justify-between items-center p-3 border-t border-[#F0F0F0]">
        <Text className="text-sm text-[#676767]">Lời nhắn cho Shop</Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-[#AEAEAE] mr-2">Để lại lời nhắn</Text>
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
