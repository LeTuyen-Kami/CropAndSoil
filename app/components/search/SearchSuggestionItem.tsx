import React from "react";
import { View, TouchableOpacity, ImageSourcePropType } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { screen } from "~/utils";

interface SearchSuggestionItemProps {
  name: string;
  image: string;
  onPress?: () => void;
}

const SearchSuggestionItem = ({
  name,
  image,
  onPress,
}: SearchSuggestionItemProps) => {
  return (
    <TouchableOpacity
      className="bg-[#F5F5F5] rounded-2xl overflow-hidden"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={image}
        style={{
          width: screen.width / 2 - 32,
          height: 140,
        }}
        contentFit="cover"
      />
      <View className="items-center py-3">
        <Text className="font-bold text-[#383B45] text-center">{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SearchSuggestionItem;
