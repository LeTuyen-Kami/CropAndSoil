import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";

// Utility item component
const UtilityItem = ({
  icon,
  title,
  onPress,
}: {
  icon: any;
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} className="flex-1 items-center">
    <View className="w-10 h-10 rounded-full bg-[#DEF1E5] items-center justify-center mb-0.5">
      <Image source={icon} style={{ width: 20, height: 20 }} />
    </View>
    <Text className="text-[10px] text-[#383B45]">{title}</Text>
  </TouchableOpacity>
);

export default UtilityItem;
