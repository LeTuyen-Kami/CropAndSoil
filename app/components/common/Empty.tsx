import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Text } from "../ui/text";
import { screen } from "~/utils";

const Empty = ({
  title,
  backgroundColor,
}: {
  title: string;
  backgroundColor?: string;
}) => {
  return (
    <View
      className="flex-1 justify-center items-center"
      style={{
        height: screen.height / 2,
        backgroundColor: backgroundColor,
      }}
    >
      <AntDesign name="folderopen" size={40} color="#6B7280" />
      <Text className="text-center text-gray-500">
        {title || "Không có địa chỉ nào"}
      </Text>
    </View>
  );
};

export default Empty;
