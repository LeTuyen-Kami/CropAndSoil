import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { formatPrice } from "~/utils";

type OrderItem = {
  subtotal: number;
  total: number;
};

type OrderFee = {
  type: string;
  name: string;
  amount: number;
  total: number;
};

type VoucherInfo = {
  id: number;
  code: string;
  discountType: string;
};

type OrderVoucher = {
  name: string;
  discount: number;
  info: VoucherInfo;
};

type OrderSummaryProps = {
  items?: OrderItem[];
  fees?: OrderFee[];
  vouchers?: OrderVoucher[];
  orderTotal?: number;
  cartDiscount?: number;
  shippingFee?: number;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  fees,
  vouchers,
  orderTotal,
  cartDiscount,
  shippingFee,
}) => {
  const subtotal = useMemo(() => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  }, [items]);

  const shippingDiscount = useMemo(() => {
    if (!fees || fees.length === 0) return 0;
    return fees.reduce((sum, fee) => {
      if (fee.type === "discount_fee_shipping") {
        return sum + fee.total;
      }
      return sum;
    }, 0);
  }, [fees]);

  return (
    <View>
      <Text className="mb-3 text-base font-medium">Tổng thanh toán</Text>

      <View className="space-y-2">
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-500">Tạm tính</Text>
          <Text className="text-sm">{formatPrice(subtotal)}</Text>
        </View>

        {!!shippingFee && shippingFee > 0 && (
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">Phí vận chuyển</Text>
            <Text className="text-sm">{formatPrice(shippingFee)}</Text>
          </View>
        )}

        {!!cartDiscount && cartDiscount > 0 && (
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">Giảm giá</Text>
            <Text className="text-sm text-red-600">
              -{formatPrice(cartDiscount)}
            </Text>
          </View>
        )}

        {!!shippingDiscount && (
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">Giảm giá vận chuyển</Text>
            <Text className="text-sm text-red-600">
              {formatPrice(shippingDiscount)}
            </Text>
          </View>
        )}

        {/* {!!vouchers && vouchers.length > 0 && (
          <View className="pt-1">
            {vouchers.map((voucher, index) => (
              <View key={index} className="flex-row justify-between">
                <Text className="text-sm text-gray-500">
                  Mã giảm giá{" "}
                  <Text className="text-primary">{voucher.name}</Text>
                </Text>
                <Text className="text-sm text-green-600">
                  -{formatPrice(voucher.discount)}
                </Text>
              </View>
            ))}
          </View>
        )} */}

        <View className="pt-2 mt-2 border-t border-gray-100">
          <View className="flex-row justify-between">
            <Text className="text-base font-medium">Tổng cộng</Text>
            <Text className="text-base font-medium text-primary">
              {formatPrice(orderTotal)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderSummary;
