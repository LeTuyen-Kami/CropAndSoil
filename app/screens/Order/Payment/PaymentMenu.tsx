import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { imagePaths } from "~/assets/imagePath";
import { IVoucher } from "~/services/api/voucher.service";
import { ICalculateResponse } from "~/services/api/order.service";
import { formatPrice } from "~/utils";
type PaymentMenuProps = {
  onVoucherPress: () => void;
  onOrderPress: () => void;
  voucher: IVoucher | null;
  calculatedData?: ICalculateResponse;
};

const PaymentMenu = ({
  onVoucherPress = () => {},
  onOrderPress = () => {},
  voucher,
  calculatedData,
}: PaymentMenuProps) => {
  const savedAmount = useMemo(() => {
    return (
      (calculatedData?.productVoucherDiscountTotal || 0) +
      (calculatedData?.shippingVoucherDiscountTotal || 0) +
      (calculatedData?.marketplaceDiscountTotal || 0)
    );
  }, [calculatedData]);

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
            className="flex-row flex-1 gap-2 items-center ml-1"
            onPress={onVoucherPress}
          >
            {!!voucher ? (
              <Text
                className="flex-1 text-sm font-normal text-right text-primary"
                numberOfLines={1}
              >
                {voucher?.description}
              </Text>
            ) : (
              <Text className="text-sm font-normal text-[#AEAEAE] flex-1 text-right">
                Chọn hoặc nhập mã
              </Text>
            )}
            <AntDesign name="right" size={16} color="#AEAEAE" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Summary Section */}
      <View className="px-3 py-2.5 flex-row justify-between items-center">
        {!!calculatedData?.total ? (
          <View>
            <Text className="text-xs text-[#676767]">Tổng thanh toán</Text>
            <View className="flex-row gap-2 items-center">
              <Text className="text-sm font-bold text-[#FCBA27]">
                {formatPrice(calculatedData?.total)}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-up"
                size={16}
                color="#FCBA27"
              />
            </View>
            {!!savedAmount && (
              <Text className="text-[10px] text-[#12B76A]">
                Tiết kiệm {formatPrice(savedAmount)}
              </Text>
            )}
          </View>
        ) : (
          <View />
        )}

        <TouchableOpacity
          className="bg-[#FCBA27] py-3 px-6 rounded-full"
          onPress={onOrderPress}
          disabled={!calculatedData?.total}
        >
          <Text className="text-sm font-medium text-white">Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentMenu;
