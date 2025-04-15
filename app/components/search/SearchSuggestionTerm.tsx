import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";
import { cn } from "~/lib/utils";

interface SearchSuggestionTermProps {
  text: string;
  onPress: () => void;
  className?: string;
}

const SearchSuggestionTerm = ({
  text,
  onPress,
  className,
}: SearchSuggestionTermProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn("flex-row items-center p-4 w-full", className)}
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
