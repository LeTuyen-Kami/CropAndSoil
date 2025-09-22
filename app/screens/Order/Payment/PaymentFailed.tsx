import { useNavigation, useRoute } from "@react-navigation/native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { RootStackRouteProp, RootStackScreenProps } from "~/navigation/types";
import { MaterialIcons } from "@expo/vector-icons";

const PaymentFailed = () => {
  const navigation = useNavigation<RootStackScreenProps<"PaymentFailed">>();
  const route = useRoute<RootStackRouteProp<"PaymentFailed">>();
  const { orderCode, totalAmount } = route.params;
  const { bottom } = useSafeAreaInsets();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleTryAgain = () => {
    navigation.goBack();
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  return (
    <ScreenWrapper hasGradient={false} backgroundColor="white">
      <Header
        title="Thanh toán thất bại"
        titleClassName="font-bold"
        className="pb-6 border-0"
      />

      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-red-100 rounded-full p-6 mb-6">
          <MaterialIcons name="error" size={80} color="#ef4444" />
        </View>

        <Text className="text-2xl font-bold text-red-600 text-center mb-2">
          Thanh toán thất bại!
        </Text>

        <Text className="text-base text-gray-600 text-center mb-6">
          Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
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
          <Button onPress={handleTryAgain} className="w-full">
            <Text className="font-medium text-white">Thử lại</Text>
          </Button>

          <Button onPress={handleGoHome} variant="outline" className="w-full">
            <Text className="font-medium text-gray-700">Về trang chủ</Text>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default PaymentFailed;
