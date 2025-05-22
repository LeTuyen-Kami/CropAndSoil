import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { atom, useAtom, useStore } from "jotai";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Pressable,
  SectionList,
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
import { toast } from "~/components/common/Toast";
import { Text } from "~/components/ui/text";
import useDisclosure from "~/hooks/useDisclosure";
import { categoryService } from "~/services/api/category.service";
import { placeService } from "~/services/api/place.service";
import { priceToNumber, screen } from "~/utils";
interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const minPriceAtom = atom("");
const maxPriceAtom = atom("");

const FilterChip = ({ label, isSelected, onPress }: FilterChipProps) => {
  return (
    <TouchableOpacity
      className={`flex-row justify-center items-center px-4 h-10 rounded-full flex-1 ${
        isSelected ? "bg-[#DEF1E5]" : "bg-white border border-[#CCCCCC]"
      }`}
      onPress={onPress}
    >
      <Text
        className={`text-xs font-normal text-center ${
          isSelected ? "text-[#159747]" : "text-[#AEAEAE]"
        }`}
        numberOfLines={2}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface FilterSectionHeaderProps {
  title: string;
  showDetails?: boolean;
  isOpen?: boolean;
  onOpen?: () => void;
}

const FilterSectionHeader = ({
  title,
  showDetails,
  isOpen,
  onOpen,
}: FilterSectionHeaderProps) => {
  return (
    <View className="w-full">
      {showDetails ? (
        <View className="w-full border-b border-[#F0F0F0]">
          <TouchableOpacity
            className="flex-row justify-center items-center px-5 py-2"
            onPress={onOpen}
          >
            <Text className="text-sm text-[#676767]">
              {isOpen ? "Thu gọn" : "Xem chi tiết"}
            </Text>
            <Feather
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={16}
              color="#676767"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="w-full border-b border-[#F0F0F0]" />
      )}
      <View className="flex-row px-3 mt-4">
        <View className="justify-center items-center">
          <Text className="text-base font-medium text-[#383B45]">{title}</Text>
        </View>
      </View>
    </View>
  );
};

const PriceRange = () => {
  const [minValue, setMinValue] = useAtom(minPriceAtom);
  const [maxValue, setMaxValue] = useAtom(maxPriceAtom);

  const formatPrice = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const formattedValue = (+numericValue)?.toLocaleString();
    return formattedValue ? `${formattedValue}đ` : "";
  };

  const handleMinChange = (value: string) => {
    if (minValue && minValue.endsWith("đ") && value === minValue.slice(0, -1)) {
      setMinValue("");
      return;
    }
    const cleanValue = value.replace("đ", "");
    const formattedValue = formatPrice(cleanValue);
    setMinValue(formattedValue);
  };

  const handleMaxChange = (value: string) => {
    if (maxValue && maxValue.endsWith("đ") && value === maxValue.slice(0, -1)) {
      setMaxValue("");
      return;
    }
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
        placeholderTextColor="#ccc"
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
        placeholderTextColor="#ccc"
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

// Interface for filter items
interface FilterItem {
  id: string;
  label: string;
  isSelected: boolean;
  value?: number;
}

// Interface for sections with proper typing
interface FilterSection {
  title: string;
  showDetails?: boolean;
  data: (FilterItem[] | null)[]; // Each section can have arrays of items or null for price range
  type?: "price";
}

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (params: {
    minPrice: number;
    maxPrice: number;
    categories: string[];
    locations: string[];
    ratings: number[];
  }) => void;
  onResetFilter: () => void;
}

export interface FilterRef {
  forceUpdateCategories: (categoriesIds: string[]) => void;
}

const Filter = forwardRef<FilterRef, FilterProps>(
  ({ isOpen, onClose, onApply, onResetFilter }, ref) => {
    const { top, bottom } = useSafeAreaInsets();
    const store = useStore();

    const { data: serverCategories } = useQuery({
      queryKey: ["serverCategories"],
      queryFn: () =>
        categoryService.getCategories({
          skip: 0,
          take: 100,
        }),
    });

    const { isOpen: isOpenCategory, onToggle: onToggleCategory } =
      useDisclosure();
    const { isOpen: isOpenLocation, onToggle: onToggleLocation } =
      useDisclosure();

    const { data: provinces } = useQuery({
      queryKey: ["provinces"],
      queryFn: () => placeService.getProvinces(),
    });

    // Full data states
    const [allCategories, setAllCategories] = useState<FilterItem[]>([]);
    const [allLocations, setAllLocations] = useState<FilterItem[]>([]);
    const [ratings, setRatings] = useState<FilterItem[]>([
      { id: "all", label: "Tất cả", isSelected: false, value: 0 },
      { id: "fiveStar", label: "Từ 5 sao", isSelected: false, value: 5 },
      { id: "fourStar", label: "Từ 4 sao", isSelected: false, value: 4 },
      { id: "threeStar", label: "Từ 3 sao", isSelected: false, value: 3 },
      { id: "twoStar", label: "Từ 2 sao", isSelected: false, value: 2 },
      { id: "oneStar", label: "Từ 1 sao", isSelected: false, value: 1 },
    ]);

    // Visible data for rendering
    const [visibleCategories, setVisibleCategories] = useState<FilterItem[]>(
      []
    );
    const [visibleLocations, setVisibleLocations] = useState<FilterItem[]>([]);

    // Group items into rows of 2
    const groupIntoRows = (items: FilterItem[]): FilterItem[][] => {
      const result: FilterItem[][] = [];
      for (let i = 0; i < items.length; i += 2) {
        const row: FilterItem[] = [];
        if (items[i]) row.push(items[i]);
        if (items[i + 1]) row.push(items[i + 1]);
        result.push(row);
      }
      return result;
    };

    // Toggle selection for any filter item
    const toggleItemSelection = (
      id: string,
      items: FilterItem[],
      setter: React.Dispatch<React.SetStateAction<FilterItem[]>>,
      sectionKey: string
    ) => {
      if (sectionKey === "ratings") {
        // For ratings, only allow one selection
        setter(
          items.map((item) => ({
            ...item,
            isSelected: item.id === id ? !item.isSelected : false,
          }))
        );
      } else {
        // For other filters, keep multiple selection behavior
        setter(
          items.map((item) =>
            item.id === id ? { ...item, isSelected: !item.isSelected } : item
          )
        );
      }
    };

    // Create sections for SectionList with proper typing
    const sections: Array<{
      title: string;
      showDetails?: boolean;
      data: (FilterItem[] | null)[];
      type?: "price";
      isOpen?: boolean;
      onOpen?: () => void;
      key: string;
    }> = [
      {
        title: "Theo danh mục",
        data: groupIntoRows(visibleCategories).map((row) => row),
        key: "categories",
      },
      {
        title: "Nơi bán",
        data: groupIntoRows(visibleLocations).map((row) => row),
        showDetails: allCategories?.length > 0,
        isOpen: isOpenCategory,
        onOpen: onToggleCategory,
        key: "locations",
      },
      {
        title: "Theo giá",
        data: [null],
        type: "price",
        showDetails: allLocations?.length > 0,
        isOpen: isOpenLocation,
        onOpen: onToggleLocation,
        key: "price",
      },
      {
        title: "Đánh giá",
        data: groupIntoRows(ratings).map((row) => row),
        key: "ratings",
      },
    ];

    const onPressApply = (_categories?: FilterItem[]) => {
      const selectedLocations = allLocations.filter(
        (location) => location.isSelected
      );
      const selectedCategories = (_categories || allCategories).filter(
        (category) => category.isSelected
      );
      const selectedRatings = ratings.filter((rating) => rating.isSelected);
      onClose();

      if (
        priceToNumber(store.get(minPriceAtom)) >
        priceToNumber(store.get(maxPriceAtom))
      ) {
        toast.warning("Giá tối thiểu không được lớn hơn giá tối đa");
        return;
      }

      onApply({
        minPrice: priceToNumber(store.get(minPriceAtom)),
        maxPrice: priceToNumber(store.get(maxPriceAtom)),
        categories: selectedCategories.map((category) => category.id),
        locations: selectedLocations.map((location) => location.id),
        ratings: selectedRatings.map((rating) => rating.value || 0),
      });
    };

    const onReset = () => {
      setAllLocations(
        allLocations.map((location) => ({ ...location, isSelected: false }))
      );
      setAllCategories(
        allCategories.map((category) => ({ ...category, isSelected: false }))
      );
      setRatings(ratings.map((rating) => ({ ...rating, isSelected: false })));
      store.set(minPriceAtom, "");
      store.set(maxPriceAtom, "");
    };

    const onPressReset = () => {
      onReset();
      onClose();
      onResetFilter();
    };

    useEffect(() => {
      onReset();
    }, []);

    // Update all locations when provinces change
    useEffect(() => {
      if (provinces) {
        const locationData = provinces.map((province) => ({
          id: province.id,
          label: province.name,
          isSelected: false,
        }));
        setAllLocations(locationData);
      }
    }, [provinces]);

    // Update visible locations based on expanded state
    useEffect(() => {
      if (isOpenLocation) {
        setVisibleLocations(allLocations);
      } else {
        setVisibleLocations(allLocations.slice(0, 4));
      }
    }, [allLocations, isOpenLocation]);

    // Update all categories when server data changes
    useEffect(() => {
      if (serverCategories?.data) {
        const categoryData = serverCategories.data.map((category) => ({
          id: category.id.toString(),
          label: category.name,
          isSelected: false,
        }));
        setAllCategories(categoryData);
      }
    }, [serverCategories]);

    // Update visible categories based on expanded state
    useEffect(() => {
      if (isOpenCategory) {
        setVisibleCategories(allCategories);
      } else {
        setVisibleCategories(allCategories.slice(0, 4));
      }
    }, [allCategories, isOpenCategory]);

    // Force update categories from outside component
    useImperativeHandle(ref, () => ({
      forceUpdateCategories: (categoriesIds: string[]) => {
        setAllCategories((prev) => {
          const update = [...prev].map((cat) => ({
            ...cat,
            isSelected: categoriesIds.includes(cat.id),
          }));

          onPressApply(update);

          return update;
        });
      },
    }));

    const renderItemRow = ({ item }: { item: FilterItem[] | null }) => {
      if (item === null) {
        return <PriceRange />;
      }

      return (
        <View className="flex-row flex-wrap px-2.5 py-2 gap-1.5">
          {item.map((filterItem) => (
            <FilterChip
              key={filterItem.id}
              label={filterItem.label}
              isSelected={filterItem.isSelected}
              onPress={() => {
                const sectionKey = sections.find((s) =>
                  s.data.some((row) => row === item)
                )?.key;

                if (sectionKey === "categories") {
                  toggleItemSelection(
                    filterItem.id,
                    allCategories,
                    setAllCategories,
                    sectionKey
                  );
                } else if (sectionKey === "locations") {
                  toggleItemSelection(
                    filterItem.id,
                    allLocations,
                    setAllLocations,
                    sectionKey
                  );
                } else if (sectionKey === "ratings") {
                  toggleItemSelection(
                    filterItem.id,
                    ratings,
                    setRatings,
                    sectionKey
                  );
                }
              }}
            />
          ))}
        </View>
      );
    };

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

          <SectionList
            sections={sections}
            keyExtractor={(item, index) =>
              item === null
                ? "price-range"
                : item.map((i) => i.id).join("-") + index
            }
            renderItem={renderItemRow}
            renderSectionHeader={({ section }) => (
              <View>
                <FilterSectionHeader
                  title={section.title}
                  showDetails={section.showDetails}
                  isOpen={section.isOpen}
                  onOpen={section.onOpen}
                />
              </View>
            )}
            renderSectionFooter={({ section }) =>
              section.title === "Đánh giá" ? (
                <View className="w-full border-b border-[#E3E3E3] pb-5" />
              ) : null
            }
            stickySectionHeadersEnabled={false}
          />

          <View
            className="flex-row"
            style={{
              paddingBottom: bottom,
            }}
          >
            <TouchableOpacity
              className="flex-1 py-3 bg-[#FFF5DF] justify-center items-center"
              onPress={onPressReset}
            >
              <Text className="text-sm font-medium text-[#FCBA26]">
                Thiết lập lại
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 bg-[#FCBA26] justify-center items-center"
              onPress={() => onPressApply()}
            >
              <Text className="text-sm font-medium text-white">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
);

export default Filter;
