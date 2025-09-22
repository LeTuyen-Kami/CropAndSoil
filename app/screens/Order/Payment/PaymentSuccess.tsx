import { useNavigation, useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { RootStackRouteProp, RootStackScreenProps } from "~/navigation/types";
import { MaterialIcons } from "@expo/vector-icons";

const PaymentSuccess = () => {
  const navigation = useNavigation<RootStackScreenProps<"PaymentSuccess">>();
  const route = useRoute<RootStackRouteProp<"PaymentSuccess">>();
  const { orderCode, totalAmount } = route.params;
  const { bottom } = useSafeAreaInsets();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  const handleViewOrder = () => {
    navigation.reset({
      index: 1,
      routes: [
        { name: "MainTabs", params: { screen: "Profile" } },
        { name: "MyOrder", params: { tabIndex: 0 } },
      ],
    });
  };

  return (
    <ScreenWrapper hasGradient={false} backgroundColor="white">
      <Header
        title="Thanh toán thành công"
        titleClassName="font-bold"
        className="pb-6 border-0"
      />

      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-green-100 rounded-full p-6 mb-6">
          <MaterialIcons name="check-circle" size={80} color="#10b981" />
        </View>

        <Text className="text-2xl font-bold text-green-600 text-center mb-2">
          Thanh toán thành công!
        </Text>

        <Text className="text-base text-gray-600 text-center mb-6">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xử lý.
        </Text>

        <View className="bg-gray-50 rounded-2xl p-4 w-full mb-6">
          <View className="flex-row justify-between items-center mb-2">
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
        </View>

        <View className="w-full space-y-3">
          <Button onPress={handleViewOrder} className="w-full">
            <Text className="font-medium text-white">Xem đơn hàng</Text>
          </Button>

          <Button
            onPress={handleContinueShopping}
            variant="outline"
            className="w-full"
          >
            <Text className="font-medium text-gray-700">Tiếp tục mua sắm</Text>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default PaymentSuccess;
