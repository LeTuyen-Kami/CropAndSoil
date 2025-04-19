import { useMemo } from "react";
import { View, Text } from "react-native";
import { ICalculateResponse } from "~/services/api/order.service";
import { formatPrice } from "~/utils";
export interface PaymentItem {
  label: string;
  value: string;
  isNegative?: boolean;
  isTotal?: boolean;
}

const DetailPayment = ({
  calculatedData,
}: {
  calculatedData?: ICalculateResponse;
}) => {
  if (!calculatedData) return null;

  const paymentItems: PaymentItem[] = useMemo(() => {
    return [
      { label: "Tổng tiền hàng", value: formatPrice(calculatedData.subtotal) },
      {
        label: "Tổng tiền phí vận chuyển",
        value: formatPrice(calculatedData.shippingFeeTotal),
      },
      {
        label: "Giảm giá phí vận chuyển",
        value: formatPrice(calculatedData.shippingVoucherDiscountTotal),
        isNegative: true,
      },
      {
        label: "Tổng cộng voucher giảm giá",
        value: formatPrice(calculatedData.saveMoney),
        isNegative: true,
      },
      {
        label: "Tổng thanh toán",
        value: formatPrice(calculatedData.total),
        isTotal: true,
      },
    ]?.filter((item) => item.value !== "");
  }, [calculatedData]);

  return (
    <View className="overflow-hidden mt-4 bg-white rounded-2xl">
      {/* Header */}
      <View className="p-3">
        <Text className="font-medium text-[14px] text-[#0A0A0A]">
          Chi tiết thanh toán
        </Text>
      </View>

      {/* Payment Items */}
      {paymentItems.map((item, index) => (
        <View
          key={index}
          className="flex-row justify-between items-center p-3 border-t border-[#F0F0F0]"
        >
          <Text
            className={`text-[14px] ${
              item.isTotal
                ? "font-medium text-[#383B45]"
                : "font-normal text-[#676767]"
            }`}
          >
            {item.label}
          </Text>
          <Text
            className={`text-[14px] font-medium ${
              item.isNegative
                ? "text-[#E01839]"
                : item.isTotal
                  ? "text-[#383B45]"
                  : "text-[#676767]"
            }`}
          >
            {item.isNegative ? "-" : ""}
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default DetailPayment;
