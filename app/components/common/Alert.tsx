import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";

interface AlertProps {
  title: string;
  description: string;
}

const Alert = ({ title, description }: AlertProps) => {
  return (
    <View className="mb-2.5">
      <View className="flex-row  bg-[#FFF5DF] p-2 rounded-lg border border-[#FCBA27]">
        <MaterialIcons name="error" size={20} color="#FCBA27" />
        <View className="flex-1 ml-2">
          <Text className="text-sm text-black">{title}</Text>
          <Text className="text-xs text-[#676767]">{description}</Text>
        </View>
      </View>
    </View>
  );
};

export default Alert;
