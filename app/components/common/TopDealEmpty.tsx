import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";
import { Feather } from "@expo/vector-icons";

interface TopDealEmptyProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

const TopDealEmpty = ({
  title = "Không có sản phẩm khuyến mãi",
  description = "Hiện tại không có sản phẩm khuyến mãi nào",
  onRefresh,
}: TopDealEmptyProps) => {
  return (
    <View className="bg-primary-100">
      <View className="mt-4">
        <View className="mx-2">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row gap-2 items-center">
              <Image
                source={imagePaths.selling}
                style={{ width: 40, height: 40 }}
              />
              <Text className="text-base font-medium">TOP DEAL - SIÊU RẺ</Text>
            </View>
          </View>

          <View className="justify-center items-center py-10 bg-white rounded-2xl">
            <Feather name="tag" size={48} color="#D1D5DB" />
            <Text className="mt-2 text-base font-medium text-neutral-600">
              {title}
            </Text>
            <Text className="mt-1 text-sm text-neutral-500">{description}</Text>

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

export default TopDealEmpty;
