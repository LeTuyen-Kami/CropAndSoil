import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
// Order status item component
const OrderStatusItem = ({ icon, title }: { icon: any; title: string }) => (
  <TouchableOpacity className="flex-1 items-center min-w-16">
    <View className="w-10 h-10 rounded-full bg-[#DEF1E5] items-center justify-center mb-0.5">
      <Image source={icon} style={{ width: 20, height: 20 }} />
    </View>
    <Text className="text-[10px] text-[#383B45] text-center">{title}</Text>
  </TouchableOpacity>
);

export default OrderStatusItem;
