import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";

interface SearchHistoryItemProps {
  text: string;
  onPress: () => void;
  onDelete: () => void;
}

const SearchHistoryItem = ({
  text,
  onPress,
  onDelete,
}: SearchHistoryItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 px-4 border-b border-[#F0F0F0] w-full"
    >
      <Image
        source={imagePaths.historyIcon}
        style={{
          width: 20,
          height: 20,
          marginRight: 10,
        }}
        contentFit="contain"
      />
      <View className="flex-1">
        <Text className="text-[#676767]">{text}</Text>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Image
          source={imagePaths.closeCircleIcon}
          style={{
            width: 20,
            height: 20,
          }}
          contentFit="contain"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SearchHistoryItem;
