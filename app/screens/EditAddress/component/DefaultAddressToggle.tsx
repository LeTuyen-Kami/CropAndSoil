import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { addressTypeAtom } from "../formAtom";
import Checkbox from "expo-checkbox";

export function DefaultAddressToggle() {
  const [addressType, setAddressType] = useAtom(addressTypeAtom);

  const toggleDefault = () => {
    setAddressType((prev) => ({
      ...prev,
      isDefault: !prev.isDefault,
    }));
  };

  return (
    <Pressable
      onPress={toggleDefault}
      className="flex-row justify-between items-center"
    >
      <Text className="text-base text-[#383B45]">Đặt làm địa chỉ mặc định</Text>
      <Checkbox
        value={addressType.isDefault}
        onValueChange={toggleDefault}
        color={addressType.isDefault ? "#159747" : "#AEAEAE"}
        style={{
          borderRadius: 4,
        }}
      />
    </Pressable>
  );
}
