import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { imagePaths } from "~/assets/imagePath";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { PAYMENT_METHODS } from "~/lib/constants";
import { PaymentMethod } from "~/services/api/order.service";
import { ORDER_STATUS } from "~/utils/contants";

type PaymentInfoProps = {
  paymentMethod?: PaymentMethod;
  orderStatus?: string;
  paymentToken?: string;
};

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  paymentMethod,
  orderStatus,
  paymentToken,
}) => {
  const navigation = useSmartNavigation();

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

  const renderButtonNavigate = () => {
    if (
      orderStatus &&
      ORDER_STATUS.PENDING?.includes(orderStatus) &&
      paymentMethod?.key === PAYMENT_METHODS.SEPAY
    ) {
      return (
        <Button
          onPress={() =>
            navigation.navigate("SePayPayment", {
              paymentOrderId: "",
              paymentToken: paymentToken,
            })
          }
          variant={"outline"}
          className="mt-2"
        >
          <Text>Tiến hành thanh toán</Text>
        </Button>
      );
    }
  };

  return (
    <View>
      <Text className="mb-2 text-base font-medium">Phương thức thanh toán</Text>
      <View className="p-3 bg-gray-50 rounded-lg">
        <View className="flex-row items-center">
          <Text className="mr-2 text-xl">
            {paymentMethod?.key === PAYMENT_METHODS.SEPAY ? (
              <Image
                source={imagePaths.SepayLogo}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
              />
            ) : (
              getPaymentIcon(paymentMethod?.key)
            )}
          </Text>
          <Text className="text-sm">
            {paymentMethod?.title || "Không có thông tin thanh toán"}
          </Text>
        </View>
        {renderButtonNavigate()}
      </View>
    </View>
  );
};

export default PaymentInfo;
