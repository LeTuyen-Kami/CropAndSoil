import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { imagePaths } from "~/assets/imagePath";

type PaymentMenuProps = {
  totalPrice: string;
  savedAmount: string;
  onVoucherPress: () => void;
  onOrderPress: () => void;
};

const PaymentMenu = ({
  totalPrice = "1.901.300đ",
  savedAmount = "331.300đ",
  onVoucherPress = () => {},
  onOrderPress = () => {},
}: PaymentMenuProps) => {
  return (
    <View className="bg-white rounded-t-xl border-t border-[#F0F0F0] border-l border-r">
      {/* Voucher Selection Section */}
      <View className="border-b border-[#F0F0F0] px-3 py-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            className="flex-row gap-2 items-center"
            onPress={onVoucherPress}
          >
            <Image
              source={imagePaths.icTicketSale}
              className="w-6 h-6"
              contentFit="contain"
            />
            <Text className="text-sm font-normal text-black">
              Cropee Voucher
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row gap-2 items-center"
            onPress={onVoucherPress}
          >
            <Text className="text-sm font-normal text-[#AEAEAE]">
              Chọn hoặc nhập mã
            </Text>
            <AntDesign name="right" size={16} color="#AEAEAE" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Summary Section */}
      <View className="px-3 py-2.5 flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-[#676767]">Tổng thanh toán</Text>
          <View className="flex-row gap-2 items-center">
            <Text className="text-sm font-bold text-[#FCBA27]">
              {totalPrice}
            </Text>
            <MaterialIcons name="keyboard-arrow-up" size={16} color="#FCBA27" />
          </View>
          <Text className="text-[10px] text-[#12B76A]">
            Tiết kiệm {savedAmount}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-[#FCBA27] py-3 px-6 rounded-full"
          onPress={onOrderPress}
        >
          <Text className="text-sm font-medium text-white">Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentMenu;
