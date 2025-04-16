import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { Text } from "~/components/ui/text";
import { ICalculateResponse, orderService } from "~/services/api/order.service";
import { IOrderCalculateRequest } from "~/services/api/order.service";
import { paymentService } from "~/services/api/payment.service";
import { userService } from "~/services/api/user.service";
import { IVoucher } from "~/services/api/voucher.service";
import { Store } from "../types";
import { toast } from "~/components/common/Toast";
import { formatPrice, getErrorMessage } from "~/utils";
const Footer = ({
  onVoucherPress,
  voucher,
  stores,
}: {
  onVoucherPress: () => void;
  voucher: IVoucher | null;
  stores: Store[];
}) => {
  const navigation = useNavigation();
  const [calculatedData, setCalculatedData] =
    useState<ICalculateResponse | null>(null);
  const { data: paymentMethods } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentService.getAvailablePaymentMethods(),
  });

  const { data: address, refetch: refetchAddress } = useQuery({
    queryKey: ["payment-address"],
    queryFn: () => userService.getAddress({ skip: 0, take: 1 }),
    select: (data) => data.data?.[0] || null,
  });

  const mutationCalculateOrder = useMutation({
    mutationFn: (data: IOrderCalculateRequest) => orderService.calculate(data),
  });

  useEffect(() => {
    if (paymentMethods && address) {
      mutationCalculateOrder.mutate(
        {
          paymentMethodKey: paymentMethods[0].key,
          shippingAddressId: address?.id!,
          shippingVoucherCode:
            voucher?.voucherType === "shipping" ? voucher?.code : "",
          productVoucherCode:
            voucher?.voucherType !== "shipping" ? voucher?.code! : "",
          shops:
            stores?.map((store) => ({
              id: Number(store.id),
              shippingMethodKey: "ghtk",
              note: "",
              voucherCode: store.shopVoucher?.code || "",
              items: store.items
                ?.filter((item) => item.isSelected)
                .map((item) => ({
                  product: {
                    id: Number(item.productId),
                    name: item.name,
                  },
                  variation: {
                    id: Number(item.variation.id),
                    name: item?.variation.name,
                  },
                  quantity: item.quantity,
                })),
            })) || [],
        },
        {
          onSuccess: (data) => {
            setCalculatedData(data);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error, "Lỗi khi tính toán đơn hàng"));
          },
        }
      );
    }
  }, [paymentMethods, stores, address, voucher]);

  const handlePayment = () => {
    navigation.navigate("Payment");
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

  const savedAmount = useMemo(() => {
    return (
      (calculatedData?.productVoucherDiscountTotal || 0) +
      (calculatedData?.shippingVoucherDiscountTotal || 0) +
      (calculatedData?.marketplaceDiscountTotal || 0)
    );
  }, [calculatedData]);

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
          {!!voucher ? (
            <Text
              className="flex-1 text-sm text-right text-primary"
              numberOfLines={1}
            >
              {voucher.description}
            </Text>
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
            <View className="flex-row items-center">
              <Text className="text-sm font-bold text-[#FCBA27] mr-2">
                {formatPrice(calculatedData?.total || 0)}
              </Text>
              <Feather name="chevron-up" size={16} color="#FCBA27" />
            </View>
            {!!savedAmount && savedAmount > 0 && (
              <Text className="text-[10px] text-[#12B76A]">
                Tiết kiệm {formatPrice(savedAmount)}
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
