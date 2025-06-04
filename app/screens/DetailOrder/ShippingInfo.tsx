import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

type ShippingMethod = {
  key: string;
  title: string;
  total: number;
};

type ShippingInfoProps = {
  shippingMethod?: ShippingMethod;
};

const ShippingInfo: React.FC<ShippingInfoProps> = ({ shippingMethod }) => {
  const getShippingIcon = (key?: string) => {
    switch (key) {
      case "ghtk":
        return "🚚";
      case "ghn":
        return "🛵";
      case "vnpost":
        return "📦";
      default:
        return "🚚";
    }
  };

  const formatPrice = (price?: number) => {
    if (price === undefined) return "0 ₫";
    return price.toLocaleString("vi-VN") + " ₫";
  };

  return (
    <View>
      <Text className="mb-2 text-base font-medium">Phương thức vận chuyển</Text>
      <View className="flex-row items-center p-3 bg-gray-50 rounded-lg">
        <Text className="mr-2 text-xl">
          {getShippingIcon(shippingMethod?.key)}
        </Text>
        <View className="flex-1">
          <Text className="text-sm">
            {shippingMethod?.title || "Không có thông tin vận chuyển"}
          </Text>
        </View>
        {shippingMethod?.total !== undefined && (
          <Text className="text-sm font-medium">
            {formatPrice(shippingMethod.total)}
          </Text>
        )}
      </View>
    </View>
  );
};

export default ShippingInfo;
