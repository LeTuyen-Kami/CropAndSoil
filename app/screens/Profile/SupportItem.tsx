import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";

// Support item component
const SupportItem = ({ icon, title }: { icon: any; title: string }) => (
  <TouchableOpacity className="flex-row items-center px-2 py-2">
    <Image source={icon} style={{ width: 24, height: 24 }} />
    <Text className="text-sm text-[#383B45] ml-2">{title}</Text>
    <View className="flex-1" />
    <Image
      source={imagePaths.icBack}
      style={{ width: 7, height: 14, transform: [{ rotate: "180deg" }] }}
    />
  </TouchableOpacity>
);

export default SupportItem;
