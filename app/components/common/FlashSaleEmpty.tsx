import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";
import { Feather } from "@expo/vector-icons";
import ContainerList from "~/screens/Home/ContainerList";

interface FlashSaleEmptyProps {
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

const FlashSaleEmpty = ({
  title = "Không có Flash Sale",
  description = "Hiện tại không có sản phẩm Flash Sale nào",
  onRefresh,
}: FlashSaleEmptyProps) => {
  return (
    <View>
      <View className="relative mt-10">
        <View className="mx-2 top-[-15] absolute left-0 right-0 h-[76] rounded-[40] bg-secondary-50 opacity-20" />
        <ContainerList
          bgColor="bg-primary-100"
          title="Flash Sale"
          icon={
            <Image
              source={imagePaths.flashSale}
              style={{ width: 40, height: 40 }}
            />
          }
        >
          <View className="justify-center items-center py-6 bg-white rounded-2xl">
            <Feather name="shopping-bag" size={48} color="#D1D5DB" />
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
        </ContainerList>
      </View>
    </View>
  );
};

export default FlashSaleEmpty;
