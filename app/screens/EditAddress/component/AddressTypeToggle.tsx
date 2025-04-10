import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { addressTypeAtom } from "../formAtom";

export function AddressTypeToggle() {
  const [addressType, setAddressType] = useAtom(addressTypeAtom);

  const handleToggleType = (type: "office" | "home") => {
    setAddressType((prev) => ({
      ...prev,
      type,
    }));
  };

  return (
    <View className="flex-row gap-2">
      <Pressable
        onPress={() => handleToggleType("office")}
        className={`flex-row items-center px-4 py-2 rounded-full ${
          addressType.type === "office"
            ? "bg-white border-[#159747] border"
            : "bg-white"
        }`}
      >
        <MaterialIcons
          name="apartment"
          size={16}
          color="#159747"
          style={{ marginRight: 4 }}
        />
        <Text className="text-[#159747] font-medium text-xs">Văn phòng</Text>
      </Pressable>

      <Pressable
        onPress={() => handleToggleType("home")}
        className={`flex-row items-center px-4 py-2 rounded-full ${
          addressType.type === "home"
            ? "bg-white border-[#159747] border"
            : "bg-white"
        }`}
      >
        <MaterialIcons
          name="home"
          size={16}
          color="#159747"
          style={{ marginRight: 4 }}
        />
        <Text className="text-[#159747] font-medium text-xs">Nhà riêng</Text>
      </Pressable>
    </View>
  );
}
