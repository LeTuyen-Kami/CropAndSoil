import { Feather } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { selectAddressAtom } from "~/components/common/SelectAdress";
import { cn } from "~/lib/utils";
import {
  districtAtom,
  provinceAtom,
  streetAddressAtom,
  wardAtom,
} from "../formAtom";
import { AddressTextInput } from "./TextInput";

export function AddressSection() {
  const [province, setProvince] = useAtom(provinceAtom);
  const [district, setDistrict] = useAtom(districtAtom);
  const [ward, setWard] = useAtom(wardAtom);
  const [streetAddress, setStreetAddress] = useAtom(streetAddressAtom);
  const setSelectAddress = useSetAtom(selectAddressAtom);

  const handleSelect = ({
    initialType,
  }: {
    initialType: "province" | "district" | "ward";
  }) => {
    setSelectAddress({
      isOpen: true,
      initialValue: {
        ward: ward?.id
          ? {
              id: ward.id,
              name: ward.name,
              code: ward.id,
            }
          : null,
        district: district?.id
          ? {
              id: district.id,
              name: district.name,
              code: district.id,
            }
          : null,
        province: province?.id
          ? {
              id: province.id,
              name: province.name,
              code: province.id,
            }
          : null,
      },
      initialType: initialType,
      onSelect: (value) => {
        if (value.province) {
          setProvince(value.province);
        }
        if (value.district) {
          setDistrict(value.district);
        }
        if (value.ward) {
          setWard(value.ward);
        }
      },
    });
  };

  return (
    <View className="w-full">
      <View className="px-5 py-2">
        <Text className="text-sm font-medium text-[#383B45]">Địa chỉ</Text>
      </View>

      <View className="px-2 pb-2">
        <TouchableOpacity
          onPress={() => handleSelect({ initialType: "province" })}
          className="w-full px-5 py-[15px] bg-white rounded-3xl flex-row justify-between items-center"
        >
          <Text
            className={cn(
              "text-sm leading-5",
              !province.name && "text-[#AEAEAE]"
            )}
          >
            {province.name || "Tỉnh/Thành phố"}
          </Text>
          <Feather name="chevron-down" size={20} color="#AEAEAE" />
        </TouchableOpacity>
      </View>

      <View className="px-2 pb-2">
        <TouchableOpacity
          onPress={() => handleSelect({ initialType: "district" })}
          className="w-full px-5 py-[15px] bg-white rounded-3xl flex-row justify-between items-center disabled:opacity-50"
          disabled={!province.name}
        >
          <Text
            className={cn(
              "text-sm leading-5",
              !district.name && "text-[#AEAEAE]"
            )}
          >
            {district.name || "Quận/Huyện"}
          </Text>
          <Feather name="chevron-down" size={20} color="#AEAEAE" />
        </TouchableOpacity>
      </View>

      <View className="px-2 pb-2">
        <TouchableOpacity
          onPress={() => handleSelect({ initialType: "ward" })}
          className="w-full px-5 py-[15px] bg-white rounded-3xl flex-row justify-between items-center disabled:opacity-50"
          disabled={!province.name || !district.name}
        >
          <Text
            className={cn("text-sm leading-5", !ward.name && "text-[#AEAEAE]")}
          >
            {ward.name || "Phường/Xã"}
          </Text>
          <Feather name="chevron-down" size={20} color="#AEAEAE" />
        </TouchableOpacity>
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
