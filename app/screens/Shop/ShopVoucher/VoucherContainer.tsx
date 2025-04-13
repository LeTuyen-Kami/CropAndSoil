import { View } from "react-native";
import { Text } from "~/components/ui/text";

const VoucherContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <View className="px-2 pb-4 bg-white rounded-xl">
      <Text className="my-3 text-xl font-bold text-center text-[#383B45]">
        {title}
      </Text>
      <View className="flex-row flex-wrap gap-x-2 gap-y-2">{children}</View>
    </View>
  );
};

export default VoucherContainer;
