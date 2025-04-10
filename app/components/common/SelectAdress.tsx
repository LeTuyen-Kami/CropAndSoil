import { Feather } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { IOption, adressAtom } from "~/store/atoms";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../ui/text";
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";

const mockAddresses: IOption[] = [
  { id: "1", name: "Hà Nội", code: "HN" },
  { id: "2", name: "Hồ Chí Minh", code: "HCM" },
  { id: "3", name: "Đà Nẵng", code: "DN" },
  { id: "4", name: "Hải Phòng", code: "HP" },
  { id: "5", name: "Cần Thơ", code: "CT" },
  { id: "6", name: "Nha Trang", code: "NT" },
  { id: "7", name: "Đà Lạt", code: "DL" },
  { id: "8", name: "Huế", code: "HUE" },
  { id: "9", name: "Bắc Ninh", code: "BN" },
  { id: "10", name: "Thái Nguyên", code: "TN" },
  { id: "11", name: "Vũng Tàu", code: "VT" },
  { id: "12", name: "Quảng Ninh", code: "QN" },
  { id: "13", name: "Quảng Ngãi", code: "QN" },
  { id: "14", name: "Quảng Bình", code: "QN" },
  { id: "15", name: "Quảng Trị", code: "QN" },
  { id: "16", name: "Quảng Nam", code: "QN" },
  { id: "17", name: "Quảng Ngãi", code: "QN" },
  { id: "18", name: "Quảng Ngãi", code: "QN" },
  { id: "19", name: "Quảng Ngãi", code: "QN" },
  { id: "20", name: "Quảng Ngãi", code: "QN" },
  { id: "21", name: "Quảng Ngãi", code: "QN" },
  { id: "22", name: "Quảng Ngãi", code: "QN" },
  { id: "23", name: "Quảng Ngãi", code: "QN" },
  { id: "24", name: "Quảng Ngãi", code: "QN" },
  { id: "25", name: "Quảng Ngãi", code: "QN" },
];

const mockDistricts: IOption[] = [
  { id: "1", name: "Quận 1", code: "Q1" },
  { id: "2", name: "Quận 2", code: "Q2" },
  { id: "3", name: "Quận 3", code: "Q3" },
];

const mockWards: IOption[] = [
  { id: "1", name: "Phường 1", code: "P1" },
  { id: "2", name: "Phường 2", code: "P2" },
  { id: "3", name: "Phường 3", code: "P3" },
];

const SelectAdress = () => {
  const { top } = useSafeAreaInsets();
  const [adress, setAdress] = useAtom(adressAtom);
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultAddresses, setDefaultAddresses] = useState<IOption[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<IOption[]>([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAddresses(defaultAddresses);
      return;
    }

    // Simulate search delay
    const results = defaultAddresses.filter((addr) => {
      // Convert both the address name and search query to lowercase without diacritics
      const normalizedName = addr.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedQuery = searchQuery
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return normalizedName.includes(normalizedQuery);
    });
    setFilteredAddresses(results);
  }, [searchQuery]);

  const handleSelectAddress = (address: IOption) => {
    // Update the province, district, or ward list based on the current type
    const updatedState = { ...adress };

    if (adress.type === "province") {
      updatedState.province = [...(updatedState.province || []), address];
    } else if (adress.type === "district") {
      updatedState.district = [...(updatedState.district || []), address];
    } else if (adress.type === "ward") {
      updatedState.ward = [...(updatedState.ward || []), address];
    }

    updatedState.isOpen = false;
    setAdress(updatedState);
  };

  const handleClose = () => {
    setAdress({
      ...adress,
      isOpen: false,
    });
  };

  useEffect(() => {
    if (adress.type === "province") {
      setDefaultAddresses(mockAddresses);
      setTitle("Tỉnh/Thành phố");
    } else if (adress.type === "district") {
      setDefaultAddresses(mockDistricts);
      setTitle("Quận/Huyện");
    } else if (adress.type === "ward") {
      setDefaultAddresses(mockWards);
      setTitle("Phường/Xã");
    }
  }, [adress.type]);

  const renderItem = useCallback(
    ({ item }: { item: IOption }) => (
      <TouchableOpacity
        className="flex-row items-center p-4 border-b border-gray-100"
        onPress={() => handleSelectAddress(item)}
      >
        <View className="justify-center items-center mr-3 w-9 h-9 bg-green-50 rounded-full">
          <Feather name="map-pin" size={20} color="#10b981" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-800">
            {item.name}
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color="#9ca3af" />
      </TouchableOpacity>
    ),
    []
  );

  return (
    <Modal visible={adress.isOpen} animationType="slide" transparent={false}>
      <View className="flex-1 bg-white" style={{ paddingTop: top }}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-800">{title}</Text>
          <TouchableOpacity
            onPress={handleClose}
            className="justify-center items-center w-10 h-10 bg-gray-100 rounded-full"
          >
            <Feather name="x" size={22} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="px-4 py-3">
          <View className="flex-row items-center px-4 bg-gray-100 rounded-full">
            <Feather name="search" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 py-2 ml-2 text-base leading-5 text-gray-800"
              placeholder={`Tìm kiếm ${title}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Feather name="x" size={18} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Address List */}
        {filteredAddresses.length > 0 ? (
          <KeyboardAvoidingView behavior="padding" className="flex-1">
            <FlashList
              keyboardShouldPersistTaps="never"
              data={filteredAddresses}
              keyExtractor={(item) => item.id}
              estimatedItemSize={65}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </KeyboardAvoidingView>
        ) : (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-center text-gray-500">
              Không tìm thấy địa chỉ nào phù hợp
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default SelectAdress;
