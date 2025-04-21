import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";
import { Feather } from "@expo/vector-icons";

interface BestSellerEmptyProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

const BestSellerEmpty = ({
  title = "Chưa có sản phẩm bán chạy",
  description = "Hãy quay lại sau để xem các sản phẩm bán chạy nhất",
  onRefresh,
}: BestSellerEmptyProps) => {
  return (
    <View className="bg-primary-50">
      <View className="mt-2">
        <View className="pb-20 mx-2">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row gap-2 items-center">
              <Image
                source={imagePaths.fire}
                style={{ width: 40, height: 40 }}
              />
              <Text className="text-base font-medium">SẢN PHẨM BÁN CHẠY</Text>
            </View>
          </View>

          <View className="justify-center items-center py-10 bg-white rounded-2xl">
            <Feather name="award" size={48} color="#D1D5DB" />
            <Text className="mt-2 text-base font-medium text-neutral-600">
              {title}
            </Text>
            <Text className="px-6 mt-1 text-sm text-center text-neutral-500">
              {description}
            </Text>

            {onRefresh && (
              <TouchableOpacity
                onPress={onRefresh}
                className="px-6 py-2 mt-4 rounded-full bg-primary-500"
              >
                <Text className="font-medium text-white">Làm mới</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default BestSellerEmpty;
