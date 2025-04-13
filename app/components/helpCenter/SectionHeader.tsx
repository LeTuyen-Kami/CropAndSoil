import React from "react";
import { View, Text } from "react-native";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => {
  return (
    <View className="py-3">
      <Text className="text-sm font-medium text-[#383B45]">{title}</Text>
    </View>
  );
};

export default SectionHeader;
