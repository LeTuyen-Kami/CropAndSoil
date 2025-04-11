import React from "react";
import { View, Text } from "react-native";
import { AddressTypeToggle } from "./AddressTypeToggle";

export function AddressTypeSection() {
  return (
    <View className="flex-row justify-between items-center px-4 py-3 w-full">
      <View className="mr-2">
        <Text className="text-sm font-medium text-[#383B45]">Loại địa chỉ</Text>
      </View>

      <AddressTypeToggle />
    </View>
  );
}
