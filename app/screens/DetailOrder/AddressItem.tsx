import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

interface AddressItemProps {
  address: {
    id?: string | number;
    phoneNumber?: string;
    isDefault?: boolean;
    name?: string;
    phone?: string;
    addressLineText?: string;
    addressWardText?: string;
    addressDistrictText?: string;
    addressProvinceText?: string;
    addressCountryText?: string;
  };
}

const AddressItem = ({ address }: AddressItemProps) => {
  const {
    name = "",
    phone = "",
    phoneNumber = "",
    addressLineText = "",
    addressWardText = "",
    addressDistrictText = "",
    addressProvinceText = "",
    isDefault = false,
  } = address;

  const displayName = name || "Người nhận";
  const displayPhone = phone || phoneNumber || "";
  const fullAddress = [
    addressLineText,
    addressWardText,
    addressDistrictText,
    addressProvinceText,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <View className="p-3 bg-white rounded-lg border border-gray-100">
      <View className="flex-row items-center mb-1">
        <Text className="text-[14px] font-medium text-[#383B45]">
          {displayName}
        </Text>
        {displayPhone && (
          <>
            <Text className="text-xs text-[#AEAEAE] mx-2">|</Text>
            <Text className="text-xs text-[#676767]">{displayPhone}</Text>
          </>
        )}
      </View>

      <Text className="text-xs text-[#676767]">{fullAddress}</Text>

      {isDefault && (
        <View className="mt-2">
          <View className="self-start px-2 py-1 border rounded-full border-[#FCBA27]">
            <Text className="text-[10px] text-[#FCBA27]">Mặc định</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default AddressItem;
