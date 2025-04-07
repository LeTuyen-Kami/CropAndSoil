import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";
import { Image } from "expo-image";

// Section title component
const SectionTitle = ({
  title,
  actionText,
  showArrow = false,
}: {
  title: string;
  actionText?: string;
  showArrow?: boolean;
}) => (
  <View className="flex-row justify-between items-center px-2 py-3">
    <Text className="text-sm font-medium text-[#383B45]">{title}</Text>
    <TouchableOpacity className="flex-row items-center">
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

export default SectionTitle;
