import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import {
  ORDER_STATUS,
  ORDER_STATUS_TEXT,
  ORDER_STATUS_COLOR,
} from "~/utils/contants";

type OrderStatusProps = {
  status?: string;
};

const OrderStatusBadge: React.FC<OrderStatusProps> = ({ status }) => {
  const getStatusInfo = (status?: string) => {
    if (!status) return { label: "Không xác định", color: "bg-gray-500" };

    const statusInfo = Object.keys(ORDER_STATUS_TEXT).find((key) => {
      return key.includes(status);
    });

    return {
      label: ORDER_STATUS_TEXT[statusInfo as keyof typeof ORDER_STATUS_TEXT],
      color: ORDER_STATUS_COLOR[statusInfo as keyof typeof ORDER_STATUS_COLOR],
    };
  };

  const statusInfo = getStatusInfo(status);

  console.log(statusInfo);

  return (
    <View
      className={`px-3 py-1 rounded-full`}
      style={{ backgroundColor: statusInfo.color }}
    >
      <Text className="text-xs font-medium text-white">{statusInfo.label}</Text>
    </View>
  );
};

export default OrderStatusBadge;
