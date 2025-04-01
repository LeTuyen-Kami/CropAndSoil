import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";

interface SearchSuggestionTermProps {
  text: string;
  onPress: () => void;
}

const SearchSuggestionTerm = ({ text, onPress }: SearchSuggestionTermProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-4 w-full"
    >
      <Image
        source={imagePaths.magnifierBlueIcon}
        style={{
          width: 20,
          height: 20,
          marginRight: 10,
        }}
        contentFit="contain"
      />
      <View className="flex-1">
        <Text className="text-[#383B45]">{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SearchSuggestionTerm;
