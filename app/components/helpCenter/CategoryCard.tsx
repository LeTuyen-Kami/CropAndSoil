import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { screen } from "~/utils";

interface CategoryCardProps {
  icon: string;
  title: string;
  onPress?: () => void;
}

const CategoryCard = ({ icon, title, onPress }: CategoryCardProps) => {
  return (
    <TouchableOpacity
      className="items-center gap-1.5"
      onPress={onPress}
      style={{
        width: (screen.width - 72) / 4,
      }}
    >
      <View className={`justify-center items-center p-2 w-6 h-6 rounded-full`}>
        <Image
          source={icon}
          style={{ width: 24, height: 24 }}
          contentFit="contain"
        />
      </View>
      <Text className="text-xs leading-[18px] text-[#383B45] text-center">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;
