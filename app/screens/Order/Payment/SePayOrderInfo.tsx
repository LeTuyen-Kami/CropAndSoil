import { View } from "react-native";
import { Text } from "~/components/ui/text";

interface SePayOrderInfoProps {
  orderCode: string;
  totalAmount: number;
  status: string;
}

const SePayOrderInfo = ({
  orderCode,
  totalAmount,
  status,
}: SePayOrderInfoProps) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-orange-600";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "success":
        return "Đã thanh toán";
      case "failed":
        return "Thanh toán thất bại";
      default:
        return "Chờ thanh toán";
    }
  };

  return (
    <View className="bg-white rounded-2xl p-4 mt-4">
      <Text className="text-base font-semibold text-gray-800 mb-4">
        Thông tin đơn hàng
      </Text>

      <View className="space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Mã đơn hàng:</Text>
          <Text className="text-base font-medium text-gray-800">
            #{orderCode}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Tổng thanh toán:</Text>
          <Text className="text-lg font-bold text-red-600">
            {formatAmount(totalAmount)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Trạng thái:</Text>
          <Text className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SePayOrderInfo;
