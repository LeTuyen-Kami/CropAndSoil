import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";

const Footer = ({
  totalPrice,
  totalSavings,
  selectedCount,
}: {
  totalPrice: number;
  totalSavings: number;
  selectedCount: number;
}) => {
  const navigation = useNavigation();

  // Format prices to display with thousand separators
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handlePayment = () => {
    navigation.navigate("Payment");
  };

  const handleVoucher = () => {
    navigation.navigate("VoucherSelect");
  };

  return (
    <View className="overflow-hidden bg-white rounded-t-2xl">
      {/* Voucher Section */}
      <View className="flex-row justify-between items-center px-2 py-4 border-t border-l border-r border-[#F0F0F0] rounded-t-2xl">
        <View className="flex-row gap-2 items-center">
          <Feather name="tag" size={20} color="#159747" />
          <Text className="text-sm text-[#0A0A0A]">Cropee Voucher</Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={handleVoucher}
          activeOpacity={0.8}
        >
          <Text className="text-sm text-[#AEAEAE] mr-2">Chọn hoặc nhập mã</Text>
          <Feather name="chevron-right" size={20} color="#AEAEAE" />
        </TouchableOpacity>
      </View>

      {/* Total Price and Payment Button */}
      <View className="flex-row justify-between items-center px-3 py-3 border-t border-[#F0F0F0]">
        <View>
          <Text className="text-xs text-[#676767]">Tổng thanh toán</Text>
          <View className="flex-row items-center">
            <Text className="text-sm font-bold text-[#FCBA27] mr-2">
              {formatPrice(totalPrice)}đ
            </Text>
            <Feather name="chevron-up" size={16} color="#FCBA27" />
          </View>
          {totalSavings > 0 && (
            <Text className="text-[10px] text-[#12B76A]">
              Tiết kiệm {formatPrice(totalSavings)}đ
            </Text>
          )}
        </View>

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
