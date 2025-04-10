import React from "react";
import { View } from "react-native";
import { DefaultAddressToggle } from "./DefaultAddressToggle";

export function DefaultAddressSection() {
  return (
    <View className="w-full px-4 py-3">
      <DefaultAddressToggle />
    </View>
  );
}
