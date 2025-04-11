import { Feather } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../ui/text";
import Tabs from "./Tabs";

export type AddressOption = {
  id: string;
  name: string;
  code: string;
};

export type AddressValue = {
  province?: AddressOption | null;
  district?: AddressOption | null;
  ward?: AddressOption | null;
};

type SelectAddressProps = {
  isOpen: boolean;
  onClose: () => void;
  initialValue: AddressValue;
  onSelect: (value: AddressValue) => void;
};

const MOCK_PROVINCES: AddressOption[] = [
  { id: "01", name: "Hà Nội", code: "HN" },
  { id: "02", name: "TP. Hồ Chí Minh", code: "HCM" },
  { id: "03", name: "Đà Nẵng", code: "DN" },
  { id: "04", name: "Hải Phòng", code: "HP" },
  { id: "05", name: "Cần Thơ", code: "CT" },
  { id: "06", name: "An Giang", code: "AG" },
  { id: "07", name: "Bà Rịa - Vũng Tàu", code: "BR-VT" },
  { id: "08", name: "Bắc Giang", code: "BG" },
  { id: "09", name: "Bắc Kạn", code: "BK" },
  { id: "10", name: "Bạc Liêu", code: "BL" },
];

const MOCK_DISTRICTS: Record<string, AddressOption[]> = {
  "01": [
    // Hà Nội
    { id: "01001", name: "Quận Ba Đình", code: "BD" },
    { id: "01002", name: "Quận Hoàn Kiếm", code: "HK" },
    { id: "01003", name: "Quận Đống Đa", code: "DD" },
    { id: "01004", name: "Quận Hai Bà Trưng", code: "HBT" },
    { id: "01005", name: "Quận Thanh Xuân", code: "TX" },
  ],
  "02": [
    // TP. HCM
    { id: "02001", name: "Quận 1", code: "Q1" },
    { id: "02002", name: "Quận 3", code: "Q3" },
    { id: "02003", name: "Quận 4", code: "Q4" },
    { id: "02004", name: "Quận 5", code: "Q5" },
    { id: "02005", name: "Quận 7", code: "Q7" },
  ],
};

const MOCK_WARDS: Record<string, AddressOption[]> = {
  "01001": [
    // Quận Ba Đình
    { id: "0100101", name: "Phường Phúc Xá", code: "PX" },
    { id: "0100102", name: "Phường Trúc Bạch", code: "TB" },
    { id: "0100103", name: "Phường Vĩnh Phúc", code: "VP" },
  ],
  "02001": [
    // Quận 1
    { id: "0200101", name: "Phường Bến Nghé", code: "BN" },
    { id: "0200102", name: "Phường Bến Thành", code: "BT" },
    { id: "0200103", name: "Phường Đa Kao", code: "DK" },
  ],
};

const SelectAddress = ({
  isOpen,
  onClose,
  initialValue,
  onSelect,
}: SelectAddressProps) => {
  const { top } = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState(0);
  const [provinceSearch, setProvinceSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [wardSearch, setWardSearch] = useState("");
  const [currentValue, setCurrentValue] = useState<AddressValue>(initialValue);
  const tabsRef = useRef<{
    setPage: (page: number) => void;
    getPage: () => number;
  }>(null);

  // Reset to initial tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentValue(initialValue);
      setSelectedTab(0);
      setProvinceSearch("");
      setDistrictSearch("");
      setWardSearch("");
    }
  }, [isOpen, initialValue]);

  const getActiveTabContent = useCallback(() => {
    if (selectedTab === 0) {
      return "province";
    } else if (selectedTab === 1) {
      return "district";
    } else {
      return "ward";
    }
  }, [selectedTab]);

  const handleTabChange = useCallback(
    (index: number) => {
      // Only allow changing to tab if prerequisites are met
      if (index === 0) {
        // Always allow changing to province tab
        setSelectedTab(0);
      } else if (index === 1 && currentValue.province) {
        // Only allow district tab if province is selected
        setSelectedTab(1);
      } else if (index === 2 && currentValue.district) {
        // Only allow ward tab if district is selected
        setSelectedTab(2);
      }
    },
    [currentValue.province, currentValue.district]
  );

  const getSearchQueryForTab = useCallback(
    (tabType: string) => {
      if (tabType === "province") return provinceSearch;
      if (tabType === "district") return districtSearch;
      return wardSearch;
    },
    [provinceSearch, districtSearch, wardSearch]
  );

  // Filter data based on search query
  const getFilteredData = useCallback(
    (tabType: string) => {
      const searchQuery = getSearchQueryForTab(tabType);
      let data: AddressOption[] = [];

      if (tabType === "province") {
        data = MOCK_PROVINCES;
      } else if (tabType === "district" && currentValue.province) {
        data = MOCK_DISTRICTS[currentValue.province.id] || [];
      } else if (tabType === "ward" && currentValue.district) {
        data = MOCK_WARDS[currentValue.district.id] || [];
      }

      if (!searchQuery) return data;

      return data.filter((item) => {
        const normalizedName = item.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const normalizedQuery = searchQuery
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        return normalizedName.includes(normalizedQuery);
      });
    },
    [currentValue.province, currentValue.district, getSearchQueryForTab]
  );

  const isItemSelected = useCallback(
    (item: AddressOption, tabType: string) => {
      if (tabType === "province" && currentValue.province) {
        return item.id === currentValue.province.id;
      } else if (tabType === "district" && currentValue.district) {
        return item.id === currentValue.district.id;
      } else if (tabType === "ward" && currentValue.ward) {
        return item.id === currentValue.ward.id;
      }
      return false;
    },
    [currentValue.district, currentValue.province, currentValue.ward]
  );

  const handleSelect = useCallback(
    (item: AddressOption) => {
      const activeTab = getActiveTabContent();
      const updatedValue = { ...currentValue };

      if (activeTab === "province") {
        updatedValue.province = item;
        updatedValue.district = null;
        updatedValue.ward = null;
        tabsRef.current?.setPage(1); // Auto switch to district tab
        // setSelectedTab(1);
      } else if (activeTab === "district") {
        updatedValue.district = item;
        updatedValue.ward = null;
        tabsRef.current?.setPage(2); // Auto switch to ward tab
        // setSelectedTab(2);
      } else if (activeTab === "ward") {
        updatedValue.ward = item;
        onSelect(updatedValue);
        onClose();
      }

      setCurrentValue(updatedValue);
    },
    [currentValue, getActiveTabContent, onClose, onSelect]
  );

  const renderItem = useCallback(
    ({ item, tabType }: { item: AddressOption; tabType: string }) => {
      const isSelected = isItemSelected(item, tabType);

      return (
        <TouchableOpacity
          className={`flex-row items-center p-4 border-b border-gray-100 ${
            isSelected ? "bg-green-50" : ""
          }`}
          onPress={() => handleSelect(item)}
        >
          <View
            className={`justify-center items-center mr-3 w-9 h-9 ${
              isSelected ? "bg-green-100" : "bg-green-50"
            } rounded-full`}
          >
            <Feather
              name="map-pin"
              size={20}
              color={isSelected ? "#059669" : "#10b981"}
            />
          </View>
          <View className="flex-1">
            <Text
              className={`text-base font-medium ${
                isSelected ? "text-green-800" : "text-gray-800"
              }`}
            >
              {item.name}
            </Text>
          </View>
          {isSelected ? (
            <Feather name="check" size={20} color="#059669" />
          ) : (
            <Feather name="chevron-right" size={20} color="#9ca3af" />
          )}
        </TouchableOpacity>
      );
    },
    [handleSelect, isItemSelected]
  );

  const renderSearchBar = useCallback(
    (tabType: string) => {
      let searchValue = "";
      let setSearchValue: (value: string) => void;
      let placeholder = "";

      if (tabType === "province") {
        searchValue = provinceSearch;
        setSearchValue = setProvinceSearch;
        placeholder = "Tìm kiếm Tỉnh/Thành phố...";
      } else if (tabType === "district") {
        searchValue = districtSearch;
        setSearchValue = setDistrictSearch;
        placeholder = "Tìm kiếm Quận/Huyện...";
      } else {
        searchValue = wardSearch;
        setSearchValue = setWardSearch;
        placeholder = "Tìm kiếm Phường/Xã...";
      }

      return (
        <View className="px-4 py-3">
          <View className="flex-row items-center px-4 bg-gray-100 rounded-full">
            <Feather name="search" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 py-2 ml-2 text-base leading-5 text-gray-800"
              placeholder={placeholder}
              value={searchValue}
              onChangeText={setSearchValue}
              placeholderTextColor="#9ca3af"
            />
            {searchValue.length > 0 && (
              <TouchableOpacity onPress={() => setSearchValue("")}>
                <Feather name="x" size={18} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    },
    [provinceSearch, districtSearch, wardSearch]
  );

  const tabItems = useMemo(() => {
    const createTabContent = (tabType: string) => {
      const filteredData = getFilteredData(tabType);

      return (
        <View className="flex-1">
          {renderSearchBar(tabType)}
          <KeyboardAvoidingView behavior="padding" className="flex-1">
            {filteredData.length > 0 ? (
              <FlashList
                keyboardShouldPersistTaps="never"
                data={filteredData}
                keyExtractor={(item) => item.id}
                estimatedItemSize={65}
                renderItem={({ item }) => renderItem({ item, tabType })}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className="flex-1 justify-center items-center p-4">
                <Text className="text-center text-gray-500">
                  Không tìm thấy địa chỉ nào phù hợp
                </Text>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      );
    };

    return [
      {
        title: "Tỉnh/Thành phố",
        content: createTabContent("province"),
      },
      {
        title: "Quận/Huyện",
        content: currentValue.province ? (
          createTabContent("district")
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-center text-gray-500">
              Vui lòng chọn Tỉnh/Thành phố trước
            </Text>
          </View>
        ),
      },
      {
        title: "Phường/Xã",
        content: currentValue.district ? (
          createTabContent("ward")
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-center text-gray-500">
              Vui lòng chọn Quận/Huyện trước
            </Text>
          </View>
        ),
      },
    ];
  }, [
    currentValue.province,
    currentValue.district,
    getFilteredData,
    renderItem,
    renderSearchBar,
  ]);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top }}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-800">Chọn địa chỉ</Text>
        <TouchableOpacity
          onPress={onClose}
          className="justify-center items-center w-10 h-10 bg-gray-100 rounded-full"
        >
          <Feather name="x" size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Selected Locations Summary */}
      <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <View className="flex-row flex-wrap items-center">
          <Text className="mr-1 text-base font-medium text-gray-700">
            Đã chọn:
          </Text>
          {currentValue.province ? (
            <View className="flex-row items-center py-1 mr-2">
              <Text className="text-sm font-medium text-gray-800">
                {currentValue.province.name}
              </Text>
              {currentValue.district ? (
                <Text className="text-sm text-gray-800"> {" > "} </Text>
              ) : null}
            </View>
          ) : (
            <Text className="text-sm text-gray-500">
              Chưa chọn tỉnh/thành phố
            </Text>
          )}

          {currentValue.district ? (
            <View className="flex-row items-center py-1 mr-2">
              <Text className="text-sm font-medium text-gray-800">
                {currentValue.district.name}
              </Text>
              {currentValue.ward ? (
                <Text className="text-sm text-gray-800"> {" > "} </Text>
              ) : null}
            </View>
          ) : null}

          {currentValue.ward ? (
            <View className="flex-row items-center py-1">
              <Text className="text-sm font-medium text-gray-800">
                {currentValue.ward.name}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Tabs */}
      <Tabs
        ref={tabsRef}
        items={tabItems}
        initialPage={selectedTab}
        className="flex-1"
        onTabChange={handleTabChange}
      />
    </View>
  );
};

export default SelectAddress;
