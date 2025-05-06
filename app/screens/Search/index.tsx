import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import SearchBar from "~/components/common/SearchBar";
import SearchResults from "~/components/search/SearchResults";
import { Text } from "~/components/ui/text";
import { useDebounce } from "~/hooks/useDebounce";
import { RootStackParamList, RootStackRouteProp } from "~/navigation/types";
import { searchService } from "~/services/api/search.services";

// Mock data for search history and suggestions
const MOCK_SEARCH_HISTORY = [
  "Thuốc chăm sóc cây cảnh",
  "Thuốc trừ sâu",
  "Thuốc bảo vệ thực vật",
];

const MOCK_SEARCH_SUGGESTIONS = [
  "Thuốc chăm sóc cây cảnh",
  "Thuốc dưỡng cây",
  "Thuốc diệt côn trùng",
  "Thuốc kích thích tăng trưởng",
];

const SearchScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState(MOCK_SEARCH_HISTORY);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isFirstRender = useRef(true);
  const route = useRoute<RootStackRouteProp<"Search">>();
  const { shopId } = route.params || {};

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => searchService.getTrending(),
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: suggestions } = useQuery({
    queryKey: ["suggestions", debouncedSearchQuery],
    queryFn: () => searchService.searchSuggestions(debouncedSearchQuery),
    enabled: !!debouncedSearchQuery,
  });

  // Update visibility of suggestion grid based on query
  useEffect(() => {
    if (isFirstRender.current) {
      return;
    }

    setShowSuggestions(searchQuery.length === 0);
  }, [searchQuery]);

  const handleSearch = (query?: string) => {
    const value = query || searchQuery;
    console.log("value", value);

    if (value?.trim()) {
      navigation.navigate("SearchAdvance", {
        searchText: value,
        ...(shopId && { shopId: shopId }),
      });
    }
  };

  const handlePressTrending = (item: string) => {
    setSearchQuery(item);
    handleSearch(item);
  };

  const handleSuggestionPress = (suggestion: any) => {
    console.log("Selected suggestion:", suggestion.name);
    setSearchQuery(suggestion.name);
  };

  const handleHistoryItemPress = (text: string) => {
    setSearchQuery(text);
  };

  const handleHistoryItemDelete = (text: string) => {
    setSearchHistory(searchHistory.filter((item) => item !== text));
  };

  const handleSuggestionTermPress = (text: string) => {
    setSearchQuery(text);
    handleSearch(text);
  };

  const handleViewMorePress = () => {
    console.log("View more pressed");
  };

  useEffect(() => {
    setTimeout(() => {
      isFirstRender.current = false;
      setShowSuggestions(true);
    }, 500);
  }, []);

  return (
    <ScreenWrapper hasGradient={false} hasSafeBottom={false}>
      <Header
        title="Tìm kiếm"
        showBack
        className="border-0"
        hasSafeTop={false}
      />
      <View className="flex-1">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={() => handleSearch()}
        />

        {!searchQuery && (
          <View className="flex-row flex-wrap gap-2 p-2">
            {trending?.slice(0, 10)?.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="p-2 bg-[#F5F5F5] rounded-lg"
                onPress={() => handlePressTrending(item)}
              >
                <Text className="text-xs" numberOfLines={2}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search Results */}
        <SearchResults
          query={searchQuery}
          searchHistory={searchHistory}
          suggestedTerms={
            suggestions
              ?.sort((a, b) => b.count - a.count)
              .map((item) => item.name) || []
          }
          onHistoryItemPress={handleHistoryItemPress}
          onHistoryItemDelete={handleHistoryItemDelete}
          onSuggestionPress={handleSuggestionTermPress}
          onViewMorePress={handleViewMorePress}
        />

        {/* Category Suggestions Grid */}
        {/* {showSuggestions && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <SearchSuggestions onSuggestionPress={handleSuggestionPress} />
          </Animated.View>
        )} */}
      </View>
    </ScreenWrapper>
  );
};

export default SearchScreen;
