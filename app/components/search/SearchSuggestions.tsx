import React from "react";
import { View, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import SearchSuggestionItem from "./SearchSuggestionItem";
import { imagePaths } from "~/assets/imagePath";
import { screen } from "~/utils";
import { useQuery } from "@tanstack/react-query";
import { ISearchTrending, searchService } from "~/services/api/search.services";

interface SearchSuggestionsProps {
  onSuggestionPress?: (suggestion: ISearchTrending) => void;
}

const SearchSuggestions = ({ onSuggestionPress }: SearchSuggestionsProps) => {
  const { data } = useQuery({
    queryKey: ["search-suggestions"],
    queryFn: () => searchService.getTrending(),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <View className="mx-2 mt-5">
      <View className="mb-2">
        <Text className="font-bold text-lg text-[#383B45]">GỢI Ý TÌM KIẾM</Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {data?.map((item) => (
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
