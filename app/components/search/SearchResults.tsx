import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import SearchHistoryItem from "./SearchHistoryItem";
import SearchSuggestionTerm from "./SearchSuggestionTerm";

interface SearchResultsProps {
  query: string;
  searchHistory: string[];
  suggestedTerms: string[];
  onHistoryItemPress: (text: string) => void;
  onHistoryItemDelete: (text: string) => void;
  onSuggestionPress: (text: string) => void;
  onViewMorePress: () => void;
}

const SearchResults = ({
  query,
  searchHistory,
  suggestedTerms,
  onHistoryItemPress,
  onHistoryItemDelete,
  onSuggestionPress,
  onViewMorePress,
}: SearchResultsProps) => {
  const [viewMore, setViewMore] = useState(false);

  // Filter history and suggestions based on query
  const filteredHistory = searchHistory.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setViewMore(false);
  }, [query]);

  if (query.length === 0) {
    return null;
  }

  const suggestedTermsToShow = viewMore
    ? suggestedTerms
    : suggestedTerms.slice(0, 5);

  return (
    <View className="mt-2 bg-[#F5F5F5] rounded-2xl overflow-hidden">
      {/* History Items */}
      {/* {filteredHistory.map((item, index) => (
        <SearchHistoryItem
          key={`history-${index}`}
          text={item}
          onPress={() => onHistoryItemPress(item)}
          onDelete={() => onHistoryItemDelete(item)}
        />
      ))} */}

      {/* Suggestion Terms */}
      {suggestedTermsToShow.map((item, index) => (
        <SearchSuggestionTerm
          key={`suggestion-${index}`}
          text={item}
          onPress={() => onSuggestionPress(item)}
          className={`${
            index !== suggestedTerms.length - 1
              ? "border-b border-[#F0F0F0]"
              : ""
          }`}
        />
      ))}
      {!viewMore && suggestedTerms.length > 5 && (
        <TouchableOpacity
          onPress={() => setViewMore(true)}
          className="bg-[#F0F0F0] py-4 flex items-center"
        >
          <Text className="text-[#383B45]">Xem thêm</Text>
        </TouchableOpacity>
      )}

      {/* View More Button */}
      {/* {(filteredHistory.length > 0 || filteredSuggestions.length > 0) && (
        <TouchableOpacity
          onPress={onViewMorePress}
          className="bg-[#F0F0F0] py-4 flex items-center"
        >
          <Text className="text-[#383B45]">Xem thêm</Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default SearchResults;
