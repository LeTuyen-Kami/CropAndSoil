import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onSelectCategory(category)}
          className={`px-4 py-2 mx-1 rounded-full ${
            selectedCategory === category
              ? "bg-[#EFF8F2] border border-[#4DB073]"
              : "bg-[#F0F0F0]"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              selectedCategory === category
                ? "text-[#159747]"
                : "text-[#676767]"
            }`}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryFilter;
