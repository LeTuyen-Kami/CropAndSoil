import React from "react";
import { View, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import SearchSuggestionItem from "./SearchSuggestionItem";
import { imagePaths } from "~/assets/imagePath";
import { screen } from "~/utils";

const SUGGESTIONS = [
  {
    id: "1",
    name: "Giá thể",
    image: imagePaths.productGiathe,
  },
  {
    id: "2",
    name: "Dụng cụ trồng cây",
    image: imagePaths.productDungcu,
  },
  {
    id: "3",
    name: "Phân bón",
    image: imagePaths.productPhanbon,
  },
  {
    id: "4",
    name: "Thuốc dưỡng cây",
    image: imagePaths.productThuoc,
  },
  {
    id: "5",
    name: "Hạt giống",
    image: imagePaths.productHatgiong,
  },
  {
    id: "6",
    name: "Vật tư",
    image: imagePaths.productVattu,
  },
];

interface SearchSuggestionsProps {
  onSuggestionPress?: (suggestion: (typeof SUGGESTIONS)[0]) => void;
}

const SearchSuggestions = ({ onSuggestionPress }: SearchSuggestionsProps) => {
  return (
    <View className="mx-2 mt-5">
      <View className="mb-2">
        <Text className="font-bold text-lg text-[#383B45]">GỢI Ý TÌM KIẾM</Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {SUGGESTIONS.map((item) => (
          <View
            key={item.id}
            style={{
              width: screen.width / 2 - 32,
            }}
          >
            <SearchSuggestionItem
              name={item.name}
              image={item.image}
              onPress={() => onSuggestionPress?.(item)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default SearchSuggestions;
