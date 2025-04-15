import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";

// Section title component
const SectionTitle = ({
  title,
  actionText,
  showArrow = false,
  onPress,
}: {
  title: string;
  actionText?: string;
  showArrow?: boolean;
  onPress?: () => void;
}) => {
  return (
    <View className="flex-row justify-between items-center px-2 py-3">
      <Text className="text-sm font-medium text-[#383B45]">{title}</Text>
      <TouchableOpacity className="flex-row items-center" onPress={onPress}>
        <Text className="text-xs text-[#676767] mr-1">{actionText}</Text>
        {showArrow && (
          <Image
            source={imagePaths.icArrowRight}
            style={{ width: 14, height: 14 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SectionTitle;
