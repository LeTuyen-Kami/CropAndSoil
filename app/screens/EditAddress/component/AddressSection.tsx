import { Feather } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { cn } from "~/lib/utils";
import { adressAtom } from "~/store/atoms";
import {
  districtAtom,
  provinceAtom,
  streetAddressAtom,
  wardAtom,
} from "../formAtom";
import { AddressTextInput } from "./TextInput";
import useAddress from "~/hooks/useAddress";
export function AddressSection() {
  const [province, setProvince] = useAtom(provinceAtom);
  const [district, setDistrict] = useAtom(districtAtom);
  const [ward, setWard] = useAtom(wardAtom);
  const [streetAddress, setStreetAddress] = useAtom(streetAddressAtom);
  const [adress, setAdress] = useAtom(adressAtom);

  const {
    handleSelectProvince,
    handleSelectDistrict,
    handleSelectWard,
    handleResetProvince,
    handleResetDistrict,
    handleResetWard,
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
  } = useAddress({ enabled: true });

  console.log("address", JSON.stringify(adress, null, 2));

  const handleProvinceSelect = () => {
    setAdress((prev) => ({
      ...prev,
      isOpen: true,
      type: "province",
      data:
        provinces?.map((province) => ({
          id: province.id,
          name: province.name,
          code: province.id,
        })) || [],
    }));
  };

  const handleDistrictSelect = () => {
    setAdress((prev) => ({
      ...prev,
      isOpen: true,
      type: "district",
      data:
        districts?.map((district) => ({
          id: district.id,
          name: district.name,
          code: district.id,
        })) || [],
    }));
  };

  const handleWardSelect = () => {
    setAdress((prev) => ({
      ...prev,
      isOpen: true,
      type: "ward",
      data:
        wards?.map((ward) => ({
          id: ward.id,
          name: ward.name,
          code: ward.id,
        })) || [],
    }));
  };

  useEffect(() => {
    if (selectedProvince) {
      setProvince({
        id: selectedProvince.id,
        name: selectedProvince.name,
      });
    }

    if (selectedDistrict) {
      setDistrict({
        id: selectedDistrict.id,
        name: selectedDistrict.name,
      });
    }

    if (selectedWard) {
      setWard({
        id: selectedWard.id,
        name: selectedWard.name,
      });
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  useEffect(() => {
    if (!adress.isOpen) {
      if (adress.type === "province" && adress.province) {
        handleSelectProvince({
          id: adress.province?.id,
          name: adress.province?.name,
          type: "province",
          slug: adress.province?.code,
        });
        handleResetDistrict();
        handleResetWard();
      }

      if (adress.type === "district" && adress.district) {
        handleSelectDistrict({
          id: adress.district?.id,
          name: adress.district?.name,
          type: "district",
          provinceId: adress.district?.code,
        });
        handleResetWard();
      }

      if (adress.type === "ward" && adress.ward) {
        handleSelectWard({
          id: adress.ward?.id,
          name: adress.ward?.name,
          type: "ward",
          districtId: adress.ward?.code,
        });
        handleResetWard();
      }
    }
  }, [adress.isOpen]);

  return (
    <View className="w-full">
      <View className="px-5 py-2">
        <Text className="text-sm font-medium text-[#383B45]">Địa chỉ</Text>
      </View>

      <View className="px-2 pb-2">
        <TouchableOpacity
          onPress={handleProvinceSelect}
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
          onPress={handleDistrictSelect}
          className="w-full px-5 py-[15px] bg-white rounded-3xl flex-row justify-between items-center"
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
          onPress={handleWardSelect}
          className="w-full px-5 py-[15px] bg-white rounded-3xl flex-row justify-between items-center"
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
