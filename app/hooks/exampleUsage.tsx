import React from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
} from "react-native";
import { usePagination } from "./usePagination";

// Example item type
interface Item {
  id: string;
  name: string;
}

// Example search/filter params
interface SearchParams {
  searchTerm?: string;
  filterBy?: string;
}

// Example API function that would fetch paginated data
const fetchItems = async (params: {
  skip: number;
  take: number;
  searchTerm?: string;
  filterBy?: string;
}) => {
  // Replace with your actual API call
  const response = await fetch(
    `https://api.example.com/items?skip=${params.skip}&take=${params.take}${
      params.searchTerm ? `&search=${params.searchTerm}` : ""
    }${params.filterBy ? `&filter=${params.filterBy}` : ""}`
  );
  const data = await response.json();
  return data; // Should match PaginatedResponse<Item>
};

export const ItemsList = () => {
  const {
    data,
    isLoading,
    isFetching,
    isRefresh,
    hasNextPage,
    fetchNextPage,
    refresh,
    updateParams,
  } = usePagination<Item, SearchParams>(fetchItems, {
    queryKey: ["items"],
    initialPagination: { skip: 0, take: 20 },
    initialParams: { searchTerm: "", filterBy: "" },
  });

  // Example search update
  const handleSearch = (term: string) => {
    updateParams({ searchTerm: term });
  };

  // Example filter update
  const handleFilter = (filter: string) => {
    updateParams({ filterBy: filter });
  };

  // Render item
  const renderItem = ({ item }: { item: Item }) => (
    <View
      style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" }}
    >
      <Text>{item.name}</Text>
    </View>
  );

  // Loading indicator at bottom when fetching next page
  const renderFooter = () => {
    if (!isFetching) return null;

    return (
      <View style={{ padding: 16, alignItems: "center" }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  // Handle end reached
  const handleEndReached = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  if (isLoading && data.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
      }
    />
  );
};
