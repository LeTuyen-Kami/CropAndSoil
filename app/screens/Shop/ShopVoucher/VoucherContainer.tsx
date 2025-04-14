import { View } from "react-native";
import { Text } from "~/components/ui/text";

export const VoucherHeader = ({ title }: { title: string }) => {
  return (
    <View className="px-2 bg-white rounded-t-xl">
      <Text className="my-3 text-xl font-bold text-center text-[#383B45]">
        {title}
      </Text>
    </View>
  );
};

export const VoucherBottom = () => {
  return <View className="mb-4 w-full h-4 bg-white rounded-b-xl" />;
};

const VoucherContainer = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <View className="px-2 pb-4 bg-white rounded-xl">
      <VoucherHeader title={title} />
      <View className="flex-row flex-wrap gap-x-2 gap-y-2">{children}</View>
    </View>
  );
};

export default VoucherContainer;
