import { View } from "react-native";
import { Text } from "~/components/ui/text";
import VoucherItem from "./VoucherItem";

const Vouchers = () => {
  return (
    <View className="px-2 pb-4 bg-white rounded-xl">
      <Text className="my-2 text-xl font-bold text-center text-[#383B45]">
        Voucher của Shop
      </Text>
      <View className="flex-row flex-wrap gap-x-2 gap-y-2">
        <VoucherItem />
        <VoucherItem />
        <VoucherItem />
        <VoucherItem />
      </View>
    </View>
  );
};

export default Vouchers;
