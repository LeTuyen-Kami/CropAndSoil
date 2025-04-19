import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

type PaymentMethod = {
  type: string;
  title: string;
};

type PaymentInfoProps = {
  paymentMethod?: PaymentMethod;
};

const PaymentInfo: React.FC<PaymentInfoProps> = ({ paymentMethod }) => {
  const getPaymentIcon = (type?: string) => {
    switch (type) {
      case "vnpay":
        return "💳";
      case "cod":
        return "💵";
      case "bank_transfer":
        return "🏦";
      default:
        return "💸";
    }
  };

  return (
    <View>
      <Text className="mb-2 text-base font-medium">Phương thức thanh toán</Text>
      <View className="flex-row items-center p-3 bg-gray-50 rounded-lg">
        <Text className="mr-2 text-xl">
          {getPaymentIcon(paymentMethod?.type)}
        </Text>
        <Text className="text-sm">
          {paymentMethod?.title || "Không có thông tin thanh toán"}
        </Text>
      </View>
    </View>
  );
};

export default PaymentInfo;
