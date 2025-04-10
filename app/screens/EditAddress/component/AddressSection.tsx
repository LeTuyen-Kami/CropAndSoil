import React from "react";
import { View, Text, Pressable } from "react-native";
import { AddressTextInput } from "./TextInput";
import { useAtom, useSetAtom } from "jotai";
import {
  provinceAtom,
  districtAtom,
  wardAtom,
  streetAddressAtom,
} from "../formAtom";
import { adressAtom } from "~/store/atoms";
import SelectAdress from "~/components/common/SelectAdress";
import { cn } from "~/lib/utils";
import { Feather } from "@expo/vector-icons";
export function AddressSection() {
  const [province, setProvince] = useAtom(provinceAtom);
  const [district, setDistrict] = useAtom(districtAtom);
  const [ward, setWard] = useAtom(wardAtom);
  const [streetAddress, setStreetAddress] = useAtom(streetAddressAtom);
  const setAdress = useSetAtom(adressAtom);

  // In a real implementation, these would open selection modals
  const handleProvinceSelect = () => {
    console.log("Open province selector");

    setAdress((prev) => ({
      ...prev,
      isOpen: true,
      type: "province",
    }));
  };

  const handleDistrictSelect = () => {
    setAdress((prev) => ({
      ...prev,
      isOpen: true,
      type: "district",
    }));
  };

  const handleWardSelect = () => {
    setAdress((prev) => ({
      ...prev,
      isOpen: true,
      type: "ward",
    }));
  };

  return (
    <View className="w-full">
      <View className="px-5 py-2">
        <Text className="text-sm font-medium text-[#383B45]">Địa chỉ</Text>
      </View>

      <View className="px-2 pb-2">
        <Pressable
          onPress={handleProvinceSelect}
          className="w-full px-5 py-[15px] bg-white rounded-3xl flex-row justify-between items-center"
        >
          <Text
            className={cn("text-sm leading-5", !province && "text-[#AEAEAE]")}
          >
            {province || "Tỉnh/Thành phố"}
          </Text>
          <Feather name="chevron-down" size={20} color="#AEAEAE" />
        </Pressable>
      </View>

      <View className="px-2 pb-2">
        <Pressable
          onPress={handleDistrictSelect}
          className="w-full px-5 py-[15px] bg-white rounded-3xl flex-row justify-between items-center"
        >
          <Text
            className={cn("text-sm leading-5", !district && "text-[#AEAEAE]")}
          >
            {district || "Quận/Huyện"}
          </Text>
          <Feather name="chevron-down" size={20} color="#AEAEAE" />
        </Pressable>
      </View>

      <View className="px-2 pb-2">
        <Pressable
          onPress={handleWardSelect}
          className="w-full px-5 py-[15px] bg-white rounded-3xl flex-row justify-between items-center"
        >
          <Text className={cn("text-sm leading-5", !ward && "text-[#AEAEAE]")}>
            {ward || "Phường/Xã"}
          </Text>
          <Feather name="chevron-down" size={20} color="#AEAEAE" />
        </Pressable>
      </View>
      <View className="px-2 pb-2">
        <AddressTextInput
          placeholder="Tòa nhà, số nhà, tên đường"
          value={streetAddress}
          onChange={setStreetAddress}
          atom={streetAddressAtom}
        />
      </View>
    </View>
  );
}
