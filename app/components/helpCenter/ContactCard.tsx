import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";

interface ContactCardProps {
  icon: any;
  title: string;
  description: string;
  onPress?: () => void;
}

const ContactCard = ({
  icon,
  title,
  description,
  onPress,
}: ContactCardProps) => {
  return (
    <TouchableOpacity
      className="bg-[#EFF8F2] p-3 rounded-2xl mb-2 flex-row"
      onPress={onPress}
    >
      <View className="mr-2 w-5 h-5">
        <Image
          source={icon}
          style={{ width: 24, height: 24 }}
          contentFit="cover"
        />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-medium text-[#383B45]">{title}</Text>
          <Image
            source={imagePaths.icArrowRight}
            style={{ width: 20, height: 20, tintColor: "#676767" }}
            contentFit="contain"
          />
        </View>
        <Text className="text-sm text-[#676767] mt-1.5">{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ContactCard;
