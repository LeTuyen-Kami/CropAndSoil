import { Feather } from "@expo/vector-icons";
import { atom, useAtom, useStore } from "jotai";
import { selectAtom } from "jotai/utils";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { screen } from "~/utils";

const atomInfo = atom({
  minPrice: "",
  maxPrice: "",
  categories: [],
  locations: [],
  ratings: [],
  shipping: [],
});

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const FilterChip = ({ label, isSelected, onPress }: FilterChipProps) => {
  return (
    <TouchableOpacity
      className={`flex-row justify-center items-center px-4 h-10 rounded-full flex-1 ${
        isSelected ? "bg-[#DEF1E5]" : "bg-white border border-[#CCCCCC]"
      }`}
      onPress={onPress}
    >
      <Text
        className={`text-xs font-normal ${
          isSelected ? "text-[#159747]" : "text-[#AEAEAE]"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  showDetails?: boolean;
}

const FilterSection = ({
  title,
  children,
  showDetails,
}: FilterSectionProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="w-full">
      <View className="flex-row px-3">
        <View className="justify-center items-center">
          <Text className="text-base font-medium text-[#383B45]">{title}</Text>
        </View>
      </View>
      {children}
      {showDetails && (
        <View className="w-full border-b border-[#F0F0F0]">
          <View className="flex-row justify-center items-center px-5 py-2">
            <Text className="text-sm text-[#676767]">Xem chi tiết </Text>
            <Feather name="chevron-down" size={16} color="#676767" />
          </View>
        </View>
      )}
    </View>
  );
};

const minPriceAtom = atom(
  (get) => get(atomInfo).minPrice,
  (get, set, newValue: string) => {
    set(atomInfo, {
      ...get(atomInfo),
      minPrice: newValue,
    });
  }
);
const maxPriceAtom = atom(
  (get) => get(atomInfo).maxPrice,
  (get, set, newValue: string) => {
    set(atomInfo, {
      ...get(atomInfo),
      maxPrice: newValue,
    });
  }
);

const PriceRange = () => {
  const [minValue, setMinValue] = useAtom(minPriceAtom);
  const [maxValue, setMaxValue] = useAtom(maxPriceAtom);

  const formatPrice = (value: string) => {
    // Remove all non-numeric characters and the 'đ' symbol
    const numericValue = value.replace(/[^0-9]/g, "");

    // Add dots between every 3 digits
    const formattedValue = (+numericValue)?.toLocaleString();

    // Add 'đ' at the end
    return formattedValue ? `${formattedValue}đ` : "";
  };

  const handleMinChange = (value: string) => {
    // If the user is deleting the 'đ' character, just clear the value
    if (minValue && minValue.endsWith("đ") && value === minValue.slice(0, -1)) {
      setMinValue("");
      return;
    }

    // Remove the 'đ' character if it exists before formatting
    const cleanValue = value.replace("đ", "");
    const formattedValue = formatPrice(cleanValue);
    setMinValue(formattedValue);
  };

  const handleMaxChange = (value: string) => {
    // If the user is deleting the 'đ' character, just clear the value
    if (maxValue && maxValue.endsWith("đ") && value === maxValue.slice(0, -1)) {
      setMaxValue("");
      return;
    }

    // Remove the 'đ' character if it exists before formatting
    const cleanValue = value.replace("đ", "");
    const formattedValue = formatPrice(cleanValue);
    setMaxValue(formattedValue);
  };

  return (
    <View className="flex-row items-center px-2.5 py-2 gap-1.5">
      <TextInput
        className="bg-white border border-[#CCCCCC] rounded-full p-2 px-4 items-center justify-center flex-1 text-center"
        value={minValue}
        onChangeText={handleMinChange}
        placeholder="Giá tối thiểu"
        keyboardType="numeric"
        selection={
          minValue.endsWith("đ")
            ? { start: minValue.length - 1, end: minValue.length - 1 }
            : undefined
        }
      />
      <View className="h-px w-4 bg-[#676767]" />
      <TextInput
        className="bg-white border border-[#CCCCCC] rounded-full p-2 px-4 items-center justify-center flex-1 text-center"
        value={maxValue}
        onChangeText={handleMaxChange}
        placeholder="Giá tối đa"
        keyboardType="numeric"
        selection={
          maxValue.endsWith("đ")
            ? { start: maxValue.length - 1, end: maxValue.length - 1 }
            : undefined
        }
      />
    </View>
  );
};

const Filter = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { top, bottom } = useSafeAreaInsets();

  const store = useStore();

  const [categories, setCategories] = useState({
    fertilizer: true,
    seeds: false,
    tools: false,
    plants: false,
  });

  const [locations, setLocations] = useState({
    hcm: true,
    hanoi: true,
    district1: false,
    district3: false,
  });

  const [ratings, setRatings] = useState({
    all: true,
    fiveStar: false,
    fourStar: false,
    threeStar: false,
    twoStar: false,
    oneStar: false,
  });

  const [shipping, setShipping] = useState({
    all: true,
    fiveStar: false,
    fourStar: false,
    threeStar: false,
    twoStar: false,
    oneStar: false,
  });

  const toggleCategory = (category: keyof typeof categories) => {
    setCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleLocation = (location: keyof typeof locations) => {
    setLocations((prev) => ({
      ...prev,
      [location]: !prev[location],
    }));
  };

  const toggleRating = (rating: keyof typeof ratings) => {
    setRatings((prev) => ({
      ...prev,
      [rating]: !prev[rating],
    }));
  };

  const toggleShipping = (option: keyof typeof shipping) => {
    setShipping((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const onPressApply = () => {
    console.log("apply", store.get(atomInfo));
  };

  useEffect(() => {
    store.set(atomInfo, {
      minPrice: "100.000đ",
      maxPrice: "500.000đ",
      categories: [],
      locations: [],
      ratings: [],
      shipping: [],
    });
  }, []);

  if (!isOpen) return null;

  return (
    <Animated.View
      className="absolute top-0 right-0 bottom-0 left-0 z-10 flex-row bg-black/20"
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <Pressable className="flex-1" onPress={onClose} />
      <Animated.View
        style={{
          width: screen.width - 60,
          height: "100%",
          backgroundColor: "white",
        }}
        entering={SlideInRight.delay(100)}
        exiting={SlideOutRight}
      >
        <View
          className="flex-row items-center justify-between bg-[#F5F5F5]  pb-3 px-2"
          style={{
            paddingTop: top,
          }}
        >
          <TouchableOpacity className="p-2" onPress={onClose}>
            <Feather name="chevron-left" size={24} color="#090A0B" />
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-bold text-center">
            Bộ lọc tìm kiếm
          </Text>
          <View className="w-8" />
        </View>

        <ScrollView className="flex-1">
          <FilterSection title="Theo danh mục" showDetails>
            <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
              <FilterChip
                label="Phân bón"
                isSelected={categories.fertilizer}
                onPress={() => toggleCategory("fertilizer")}
              />
              <FilterChip
                label="Hạt & Củ giống"
                isSelected={categories.seeds}
                onPress={() => toggleCategory("seeds")}
              />
            </View>
            <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
              <FilterChip
                label="Dụng cụ làm vườn"
                isSelected={categories.tools}
                onPress={() => toggleCategory("tools")}
              />
              <FilterChip
                label="Cây cảnh"
                isSelected={categories.plants}
                onPress={() => toggleCategory("plants")}
              />
            </View>
          </FilterSection>

          <FilterSection title="Nơi bán" showDetails>
            <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
              <FilterChip
                label="TP. Hồ Chí Minh"
                isSelected={locations.hcm}
                onPress={() => toggleLocation("hcm")}
              />
              <FilterChip
                label="Hà Nội"
                isSelected={locations.hanoi}
                onPress={() => toggleLocation("hanoi")}
              />
            </View>
            <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
              <FilterChip
                label="Quận 1"
                isSelected={locations.district1}
                onPress={() => toggleLocation("district1")}
              />
              <FilterChip
                label="Quận 3"
                isSelected={locations.district3}
                onPress={() => toggleLocation("district3")}
              />
            </View>
          </FilterSection>

          <View className="w-full border-b border-[#E3E3E3] py-5">
            <FilterSection title="Theo giá">
              <PriceRange />
            </FilterSection>
          </View>

          <View className="w-full border-b border-[#E3E3E3] py-5">
            <FilterSection title="Đánh giá">
              <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
                <FilterChip
                  label="Tất cả"
                  isSelected={ratings.all}
                  onPress={() => toggleRating("all")}
                />
                <FilterChip
                  label="Từ 5 sao "
                  isSelected={ratings.fiveStar}
                  onPress={() => toggleRating("fiveStar")}
                />
              </View>
              <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
                <FilterChip
                  label="Từ 4 sao"
                  isSelected={ratings.fourStar}
                  onPress={() => toggleRating("fourStar")}
                />
                <FilterChip
                  label="Từ 3 sao"
                  isSelected={ratings.threeStar}
                  onPress={() => toggleRating("threeStar")}
                />
              </View>
              <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
                <FilterChip
                  label="Từ 2 sao"
                  isSelected={ratings.twoStar}
                  onPress={() => toggleRating("twoStar")}
                />
                <FilterChip
                  label="Từ 1 sao"
                  isSelected={ratings.oneStar}
                  onPress={() => toggleRating("oneStar")}
                />
              </View>
            </FilterSection>
          </View>

          <View className="py-5 w-full">
            <FilterSection title="Vận chuyển">
              <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
                <FilterChip
                  label="Tất cả"
                  isSelected={shipping.all}
                  onPress={() => toggleShipping("all")}
                />
                <FilterChip
                  label="Từ 5 sao "
                  isSelected={shipping.fiveStar}
                  onPress={() => toggleShipping("fiveStar")}
                />
              </View>
              <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
                <FilterChip
                  label="Từ 4 sao"
                  isSelected={shipping.fourStar}
                  onPress={() => toggleShipping("fourStar")}
                />
                <FilterChip
                  label="Từ 3 sao"
                  isSelected={shipping.threeStar}
                  onPress={() => toggleShipping("threeStar")}
                />
              </View>
              <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
                <FilterChip
                  label="Từ 2 sao"
                  isSelected={shipping.twoStar}
                  onPress={() => toggleShipping("twoStar")}
                />
                <FilterChip
                  label="Từ 1 sao"
                  isSelected={shipping.oneStar}
                  onPress={() => toggleShipping("oneStar")}
                />
              </View>
            </FilterSection>
          </View>
        </ScrollView>

        <View
          className="flex-row"
          style={{
            paddingBottom: bottom,
          }}
        >
          <TouchableOpacity className="flex-1 py-3 bg-[#FFF5DF] justify-center items-center">
            <Text className="text-sm font-medium text-[#FCBA26]">
              Thiết lập lại
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 bg-[#FCBA26] justify-center items-center"
            onPress={onPressApply}
          >
            <Text className="text-sm font-medium text-white">Áp dụng</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default Filter;
