import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import SearchBar from "~/components/common/SearchBar";
import SearchResults from "~/components/search/SearchResults";
import { RootStackParamList } from "~/navigation/types";
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

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => searchService.getTrending(),
  });

  const mutation = useMutation({
    mutationFn: (search: string) => searchService.searchSuggestions(search),
  });

  const { data: suggestions } = useQuery({
    queryKey: ["suggestions", searchQuery],
    queryFn: () => searchService.searchSuggestions(searchQuery),
  });

  console.log(trending);

  // Update visibility of suggestion grid based on query
  useEffect(() => {
    if (isFirstRender.current) {
      return;
    }

    setShowSuggestions(searchQuery.length === 0);
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate("SearchAdvance", { searchText: searchQuery });
    }
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
    handleSearch();
  };

  const handleViewMorePress = () => {
    console.log("View more pressed");
  };

  useEffect(() => {
    if (trending && trending.length > 0) {
      mutation.mutate(trending[0], {
        onSuccess: (data) => {
          console.log("data", data);
        },
      });
    }
  }, [trending]);

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
          onSearch={handleSearch}
        />

        {/* Search Results */}
        <SearchResults
          query={searchQuery}
          searchHistory={searchHistory}
          suggestedTerms={MOCK_SEARCH_SUGGESTIONS}
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
