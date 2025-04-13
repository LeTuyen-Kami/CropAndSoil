import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";

interface FAQCardProps {
  title: string;
  onPress?: () => void;
}

const FAQCard = ({ title, onPress }: FAQCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between items-center py-3">
        <Text className="text-sm text-[#676767] flex-1">{title}</Text>
      </View>
      <View className="h-[1px] bg-[#F0F0F0]" />
    </TouchableOpacity>
  );
};

export default FAQCard;
