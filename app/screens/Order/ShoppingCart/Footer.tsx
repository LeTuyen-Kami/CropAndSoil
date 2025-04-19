import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { ICalculateResponse } from "~/services/api/order.service";
import { IVoucher } from "~/services/api/voucher.service";
import { convertToK, formatPrice } from "~/utils";
import { Store } from "../types";
import React from "react";

const Footer = ({
  onVoucherPress,
  voucher,
  stores,
  calculatedData,
}: {
  onVoucherPress: () => void;
  voucher: IVoucher | null;
  stores: Store[];
  calculatedData?: ICalculateResponse;
}) => {
  const navigation = useNavigation();

  const handlePayment = () => {
    navigation.navigate("Payment", {
      isClearCart: true,
    });
  };

  const { selectedCount } = useMemo(() => {
    let count = 0;

    stores.forEach((store) => {
      store.items.forEach((item) => {
        if (item.isSelected) {
          count += item.quantity;
        }
      });
    });

    return { selectedCount: count };
  }, [stores]);

  return (
    <View className="overflow-hidden bg-white rounded-t-2xl">
      {/* Voucher Section */}
      <View className="flex-row justify-between items-center px-2 py-4 border-t border-l border-r border-[#F0F0F0] rounded-t-2xl">
        <View className="flex-row gap-2 items-center">
          <Feather name="tag" size={20} color="#159747" />
          <Text className="text-sm text-[#0A0A0A]">Cropee Voucher</Text>
        </View>
        <TouchableOpacity
          className="flex-row flex-1 items-center ml-1"
          onPress={onVoucherPress}
          activeOpacity={0.8}
        >
          {!!calculatedData?.marketplaceShippingVoucherDiscountTotal ||
          !!calculatedData?.marketplaceProductVoucherDiscountTotal ? (
            <React.Fragment>
              {!!calculatedData?.marketplaceShippingVoucherDiscountTotal && (
                <Text
                  className="flex-1 text-xs text-right text-primary"
                  numberOfLines={1}
                >
                  Giảm phí vận chuyển{" "}
                  {calculatedData?.marketplaceShippingVoucherDiscountTotal}k
                </Text>
              )}
              {!!calculatedData?.marketplaceProductVoucherDiscountTotal && (
                <Text
                  className="flex-1 text-xs text-right text-red-500"
                  numberOfLines={1}
                >
                  Giảm ₫
                  {convertToK(
                    calculatedData?.marketplaceProductVoucherDiscountTotal
                  )}
                  k
                </Text>
              )}
            </React.Fragment>
          ) : (
            <Text className="text-sm text-[#AEAEAE] mr-2 flex-1 text-right">
              Chọn hoặc nhập mã
            </Text>
          )}
          <Feather name="chevron-right" size={20} color="#AEAEAE" />
        </TouchableOpacity>
      </View>

      {/* Total Price and Payment Button */}
      <View className="flex-row justify-between items-center px-3 py-3 border-t border-[#F0F0F0]">
        {!!calculatedData ? (
          <View>
            <Text className="text-xs text-[#676767]">Tổng thanh toán</Text>
            {!!calculatedData?.total && (
              <View className="flex-row items-center">
                <Text className="text-sm font-bold text-[#FCBA27] mr-2">
                  {formatPrice(calculatedData?.total || 0)}
                </Text>
                <Feather name="chevron-up" size={16} color="#FCBA27" />
              </View>
            )}
            {!!calculatedData?.saveMoney && (
              <Text className="text-[10px] text-[#12B76A]">
                Tiết kiệm {formatPrice(calculatedData?.saveMoney || 0)}
              </Text>
            )}
          </View>
        ) : (
          <View />
        )}

        <TouchableOpacity
          className="bg-[#FCBA27] px-[22px] py-[10px] rounded-full"
          activeOpacity={0.8}
          onPress={handlePayment}
        >
          <Text className="text-sm font-medium text-white">
            Mua hàng ({selectedCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;
