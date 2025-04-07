import { View, Text } from "react-native";

export interface PaymentItem {
  label: string;
  value: string;
  isNegative?: boolean;
  isTotal?: boolean;
}

interface PaymentDetailsProps {
  title?: string;
  items: PaymentItem[];
  className?: string;
}

const DetailPayment = () => {
  const paymentItems: PaymentItem[] = [
    { label: "Tổng tiền hàng", value: "2.165.000đ" },
    { label: "Tổng tiền phí vận chuyển", value: "67.600đ" },
    { label: "Giảm giá phí vận chuyển", value: "-30.600đ", isNegative: true },
    {
      label: "Tổng cộng voucher giảm giá",
      value: "-300.700đ",
      isNegative: true,
    },
    { label: "Tổng thanh toán", value: "1.901.300đ", isTotal: true },
  ];

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
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default DetailPayment;
