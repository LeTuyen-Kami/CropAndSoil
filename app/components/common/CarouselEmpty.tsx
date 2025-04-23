import React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";

const CarouselEmpty = () => {
  return (
    <View className="w-full aspect-[16/9] my-4 bg-white rounded-lg overflow-hidden items-center justify-center">
      <Image
        source={imagePaths.objectError}
        style={{ width: 60, height: 60 }}
        contentFit="contain"
      />
      <Text className="mt-2 text-gray-500">Không có ảnh nào</Text>
    </View>
  );
};

export default CarouselEmpty;
