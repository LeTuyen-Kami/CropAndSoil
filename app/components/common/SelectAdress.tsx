import { Feather } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useMemo, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAddress from "~/hooks/useAddress";
import { cn } from "~/lib/utils";
import { Text } from "../ui/text";
import { atom, useAtomValue, useSetAtom } from "jotai";

export type AddressValue = {
  province?: AddressOption | null;
  district?: AddressOption | null;
  ward?: AddressOption | null;
};

export type SelectAddressAtom = {
  isOpen: boolean;
  initialValue: AddressValue;
  initialType: "province" | "district" | "ward";
  onSelect: (value: AddressValue) => void;
};

export const initialSelectAddress: SelectAddressAtom = {
  isOpen: false,
  initialValue: {
    province: null,
    district: null,
    ward: null,
  },
  initialType: "province",
  onSelect: () => {},
};
export const selectAddressAtom = atom<SelectAddressAtom>(initialSelectAddress);

export type AddressOption = {
  id: string;
  name: string;
  code: string;
};

const SelectAddress = () => {
  const { isOpen, initialValue, initialType, onSelect } =
    useAtomValue(selectAddressAtom);

  const setSelectAddress = useSetAtom(selectAddressAtom);

  const { top } = useSafeAreaInsets();
  const [data, setData] = useState<AddressOption[]>([]);
  const [currentType, setCurrentType] = useState<
    "province" | "district" | "ward"
  >("province");
  const [search, setSearch] = useState("");
  const {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    handleResetWard,
    handleResetDistrict,
    handleResetProvince,
    handleSelectProvince,
    handleSelectDistrict,
    handleSelectWard,
  } = useAddress({ enabled: isOpen });

  useEffect(() => {
    if (currentType === "province") {
      setData(
        provinces?.map((province) => ({
          id: province.id,
          name: province.name,
          code: province.id,
        })) || []
      );
    }

    if (currentType === "district") {
      setData(
        districts?.map((district) => ({
          id: district.id,
          name: district.name,
          code: district.id,
        })) || []
      );
    }
    if (currentType === "ward") {
      setData(
        wards?.map((ward) => ({
          id: ward.id,
          name: ward.name,
          code: ward.id,
        })) || []
      );
    }
  }, [currentType, selectedDistrict, wards, provinces, districts]);

  const handleSelect = (item: AddressOption) => {
    setSearch("");
    if (currentType === "province") {
      handleSelectProvince(item);
      setCurrentType("district");
      handleResetDistrict();

      onSelect({
        province: item,
        district: null,
        ward: null,
      });
    }

    if (currentType === "district") {
      handleSelectDistrict(item);
      setCurrentType("ward");
      handleResetWard();
      onSelect({
        province: selectedProvince,
        district: item,
        ward: null,
      });
    }

    if (currentType === "ward") {
      handleSelectWard(item);
      onSelect({
        province: selectedProvince,
        district: selectedDistrict,
        ward: item,
      });
      setSelectAddress({
        isOpen: false,
        initialValue: {
          province: selectedProvince,
          district: selectedDistrict,
          ward: item,
        },
        initialType: "ward",
        onSelect: () => {},
      });
    }
  };

  const filteredData = useMemo(() => {
    if (!search) return data;

    const normalizeText = (text: string) => {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    };

    const normalizedSearch = normalizeText(search);

    return data.filter((item) => {
      const normalizedName = normalizeText(item.name);
      return normalizedName.includes(normalizedSearch);
    });
  }, [data, search]);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setCurrentType(initialType);

      if (initialValue.ward && initialValue.district && initialValue.province) {
        handleSelectProvince(initialValue.province);
        handleSelectDistrict(initialValue.district!);
        handleSelectWard(initialValue.ward!);
        return;
      }
      if (initialValue.district && initialValue.province) {
        handleSelectProvince(initialValue.province);
        handleSelectDistrict(initialValue.district!);
        return;
      }
      if (initialValue.province) {
        handleSelectProvince(initialValue.province);
        return;
      }

      setCurrentType("province");
    }
  }, [isOpen, initialValue, initialType]);

  if (!isOpen) return null;

  return (
    <Animated.View
      className="absolute top-0 right-0 bottom-0 left-0 flex-1 bg-white"
      style={{ paddingTop: top }}
      layout={LinearTransition}
      entering={FadeIn}
      exiting={FadeOut}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-800">Chọn địa chỉ</Text>
        <TouchableOpacity
          onPress={() => setSelectAddress(initialSelectAddress)}
          className="justify-center items-center w-10 h-10 bg-gray-100 rounded-full"
        >
          <Feather name="x" size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Selected Locations Summary */}
      <ListSelectedLocation
        selectedProvince={selectedProvince}
        selectedDistrict={selectedDistrict}
        selectedWard={selectedWard}
        currentType={currentType}
        setCurrentType={setCurrentType}
      />

      <Animated.View className="flex-1" layout={LinearTransition}>
        <View className="flex-row gap-2 items-center px-4 mx-3 mt-3 rounded-full border border-gray-200">
          <Feather name="search" size={20} color="#374151" />
          <TextInput
            placeholder="Tìm kiếm địa chỉ"
            className="flex-1 py-2 pl-1"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity
            className="bg-[#ccc] rounded-full p-[1px]"
            hitSlop={10}
          >
            <Feather name="x" size={14} color="white" />
          </TouchableOpacity>
        </View>
        <FlashList
          data={filteredData}
          estimatedItemSize={50}
          ListFooterComponent={<View className="h-10" />}
          // extraData={provinces}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <Feather name="map-pin" size={20} color="#159747" />
                <Text className="ml-2 text-base font-medium text-gray-800">
                  {item.name}
                </Text>
                <Feather
                  name="chevron-right"
                  size={20}
                  color="#374151"
                  className="ml-auto"
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </Animated.View>
  );
};

const ListSelectedLocation = ({
  selectedProvince,
  selectedDistrict,
  selectedWard,
  currentType,
  setCurrentType,
}: {
  selectedProvince: AddressOption | null;
  selectedDistrict: AddressOption | null;
  selectedWard: AddressOption | null;
  currentType: "province" | "district" | "ward";
  setCurrentType: (type: "province" | "district" | "ward") => void;
}) => {
  return (
    <Animated.View
      className="px-4 py-2 bg-gray-50 border-b border-gray-200"
      layout={LinearTransition}
    >
      <View className="flex-row items-start">
        {/* Timeline/Path Line */}
        <View className="items-center mr-3 mt-[2px]">
          {/* Province Circle */}
          <View
            className={cn(
              "h-4 w-4 rounded-full border-2 flex items-center justify-center",
              currentType === "province" ? "border-primary" : "border-gray-300"
            )}
          >
            {currentType === "province" && (
              <View className="w-2 h-2 rounded-full bg-primary" />
            )}
          </View>

          {selectedProvince && (
            <>
              {/* Connecting Line */}
              <View className="h-4 w-0.5 bg-gray-300" />

              {/* District Circle */}
              <View
                className={cn(
                  "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                  currentType === "district"
                    ? "border-primary"
                    : "border-gray-300"
                )}
              >
                {currentType === "district" && (
                  <View className="w-2 h-2 rounded-full bg-primary" />
                )}
              </View>
            </>
          )}

          {selectedDistrict && (
            <>
              {/* Connecting Line */}
              <View className="h-4 w-0.5 bg-gray-300" />

              {/* Ward Circle */}

              <View
                className={cn(
                  "h-4 w-4 rounded-full border-2 flex items-center justify-center",
                  currentType === "ward" ? "border-red-500" : "border-gray-300"
                )}
              >
                {currentType === "ward" && (
                  <View className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </View>
            </>
          )}
        </View>

        {/* Address Text */}
        <View className="flex-1">
          {/* Province */}
          <TouchableOpacity
            onPress={() => {
              setCurrentType("province");
            }}
          >
            <View className="flex-row items-center">
              <Text
                className={cn(
                  "text-sm font-medium text-gray-800",
                  currentType === "province" && "text-primary font-bold"
                )}
              >
                {selectedProvince?.name || "Chọn tỉnh/thành phố"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* District */}
          {selectedProvince && (
            <TouchableOpacity
              onPress={() => {
                setCurrentType("district");
              }}
            >
              <View className="flex-row items-center mt-3">
                <Text
                  className={cn(
                    "text-sm font-medium text-gray-800",
                    currentType === "district" && "text-primary font-bold"
                  )}
                >
                  {selectedDistrict?.name || "Chọn quận/huyện"}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Ward */}
          {selectedDistrict && (
            <TouchableOpacity
              onPress={() => {
                setCurrentType("ward");
              }}
            >
              <View className="flex-row items-center mt-3">
                <Text
                  className={cn(
                    "text-sm font-medium text-gray-800",
                    currentType === "ward" && "text-red-500 font-bold"
                  )}
                >
                  {selectedWard?.name || "Chọn phường/xã"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export default SelectAddress;
