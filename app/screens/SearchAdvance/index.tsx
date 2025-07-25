import { FontAwesome5 } from "@expo/vector-icons";
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { imagePaths } from "~/assets/imagePath";
import Category from "~/components/common/Category";
import Empty from "~/components/common/Empty";
import ProductItem from "~/components/common/ProductItem";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import useDisclosure from "~/hooks/useDisclosure";
import { usePagination } from "~/hooks/usePagination";
import { cn } from "~/lib/utils";
import { RootStackParamList, RootStackRouteProp } from "~/navigation/types";
import { IProduct, productService } from "~/services/api/product.service";
import {
  calculateDiscount,
  calculateOnSale,
  getItemWidth,
  preHandleFlashListData,
  screen,
} from "~/utils";
import Filter, { FilterRef } from "./Filter";
import { COLORS } from "~/constants/theme";
import { ICategory } from "~/services/api/category.service";

const ExploreCategory = ({
  onPress,
}: {
  onPress: (category: ICategory) => void;
}) => {
  return (
    <View className="px-2 py-4 mx-2 rounded-2xl bg-white/20">
      <Text className="text-lg font-bold text-white uppercase">
        Khám phá theo danh mục
      </Text>
      <View className="mt-4">
        <Category onPress={onPress} />
      </View>
    </View>
  );
};

const Header = ({
  isOpen,
  onOpen,
  searchText,
  hasActiveFilters,
  showFilter,
}: {
  isOpen: boolean;
  onOpen: () => void;
  searchText: string;
  hasActiveFilters: boolean;
  showFilter?: boolean;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onPressSearch = () => {
    const state = navigation.getState();
    const routes = state.routes;
    const index = state.index;

    const previousRoute = routes[index - 1];

    if (previousRoute?.name === "Search") {
      navigation.goBack();
    } else {
      navigation.navigate("Search");
    }
  };

  return (
    <View className="flex-row gap-4 items-center px-2">
      <TouchableOpacity
        onPress={navigation.goBack}
        className="px-2 py-1"
        hitSlop={20}
      >
        <Image
          source={imagePaths.icArrowLeft}
          className="w-2 h-4"
          contentFit="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPressSearch}
        className="flex-row flex-1 justify-between items-center px-5 h-12 bg-white rounded-full"
      >
        <Text
          className={cn(
            "text-sm text-[#AEAEAE] flex-1",
            searchText && "text-black"
          )}
          numberOfLines={1}
        >
          {searchText || "Tìm kiếm sản phẩm"}
        </Text>
        <Image
          source={imagePaths.icMagnifier}
          className="ml-1 size-5"
          contentFit="contain"
        />
      </TouchableOpacity>
      {showFilter && (
        <TouchableOpacity
          onPress={onOpen}
          className={cn(
            "h-12 rounded-full aspect-square bg-[#39CA71] justify-center items-center",
            hasActiveFilters && "border-2 border-white"
          )}
          hitSlop={20}
        >
          <View className="relative">
            <Image
              source={imagePaths.icFilter}
              className="size-6"
              contentFit="contain"
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ContainerHeader = ({
  sort,
  onToggleSort,
}: {
  sort: {
    sortBy: "salePrice" | "createdAt";
    sortDirection: "asc" | "desc";
  } | null;
  onToggleSort: () => void;
}) => {
  return (
    <View className="relative bg-[#EEE] px-2 py-4 rounded-t-[40px] mt-[30px]">
      <View className="mx-2 top-[-12px] absolute left-0 right-0 h-[76] rounded-[40] bg-secondary-50 opacity-20" />

      <View className="flex-row gap-2 items-center px-2 mb-4 w-full">
        <Text className="mt-3 text-xl font-bold text-black uppercase">
          Tất cả sản phẩm
        </Text>
        <TouchableOpacity
          className={cn(
            "flex-row gap-2 items-center px-4 py-2 ml-auto bg-white rounded-full",
            sort && "border border-primary"
          )}
          onPress={onToggleSort}
        >
          <Text
            className={cn(
              "text-sm font-medium leading-tight text-[#676767]",
              sort && "text-primary"
            )}
          >
            Sắp xếp
          </Text>
          {!sort ? (
            <Image
              source={imagePaths.icSort}
              className="size-5"
              contentFit="contain"
            />
          ) : (
            <FontAwesome5
              name={
                sort?.sortDirection === "desc"
                  ? "sort-amount-down-alt"
                  : "sort-amount-up-alt"
              }
              size={16}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TwoProductItem = ({ items }: { items: IProduct[] }) => {
  const width = useMemo(() => {
    return getItemWidth({
      containerPadding: 16,
      itemGap: 8,
    }).itemWidth;
  }, []);

  return (
    <View
      className="flex-row gap-2 px-2 bg-[#EEE] pb-2"
      style={{
        alignItems: "stretch",
      }}
    >
      {items.map((item, index) => (
        <ProductItem
          width={width}
          key={item.id}
          name={item?.name}
          height={"100%"}
          price={item?.salePrice}
          originalPrice={item?.regularPrice}
          discount={calculateDiscount(item)}
          rating={item?.averageRating}
          soldCount={item?.totalSales}
          image={item?.images[0]}
          onSale={calculateOnSale(item)}
          id={item?.id}
          location={item?.shop?.shopWarehouseLocation?.province?.name}
        />
      ))}
    </View>
  );
};

const NoData = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Empty
      title="Không có sản phẩm nào"
      backgroundColor="#EEE"
      isLoading={isLoading}
    />
  );
};
const categoryData = [
  {
    id: "category",
    type: "category",
  },
];

const containerHeaderData = [
  {
    id: "containerHeader",
    type: "containerHeader",
  },
];

const noDataData = [
  {
    id: "noData",
    type: "noData",
  },
];

const SearchAdvance = () => {
  const route = useRoute<RootStackRouteProp<"SearchAdvance">>();
  const { searchText, shopId, categoryId, categoryName } = route.params || {};
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sort, setSort] = useState<{
    sortBy: "salePrice" | "createdAt";
    sortDirection: "asc" | "desc";
  } | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    categories: [] as string[],
    locations: [] as string[],
    ratings: [] as number[],
  });

  const FilterRef = useRef<FilterRef>(null);

  const hasActiveFilters = useMemo(() => {
    return (
      activeFilters.minPrice > 0 ||
      activeFilters.maxPrice > 0 ||
      activeFilters.categories.length > 0 ||
      activeFilters.locations.length > 0 ||
      activeFilters.ratings.length > 0
    );
  }, [activeFilters]);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isRefresh,
    refresh,
    isLoading,
    isFetching,
    updateParams,
    resetParams,
    forceUpdateParams,
  } = usePagination(productService.searchProducts, {
    initialPagination: {
      skip: 0,
      take: 10,
    },
    initialParams: {
      search: searchText,
      ...(shopId && { shopId: shopId }),
      ...(categoryId && { categoryIds: categoryId }),
      ...(sort && {
        sortBy: sort?.sortBy,
        sortDirection: sort?.sortDirection,
      }),
    },
    queryKey: [
      "search-products",
      searchText || "",
      categoryId || "",
      shopId || "",
    ],
  });

  const onToggleSort = () => {
    if (!sort) {
      setSort({
        sortBy: "salePrice",
        sortDirection: "desc",
      });
    } else if (sort?.sortBy === "salePrice" && sort?.sortDirection === "desc") {
      setSort({
        sortBy: "salePrice",
        sortDirection: "asc",
      });
    } else {
      setSort(null);
    }
  };

  const onPressCategory = (category: ICategory) => {
    FilterRef.current?.forceUpdateCategories([category.id.toString()]);
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "category") {
      return <ExploreCategory onPress={onPressCategory} />;
    }

    if (item.type === "containerHeader") {
      return <ContainerHeader sort={sort} onToggleSort={onToggleSort} />;
    }

    if (item.type === "noData") {
      return <NoData isLoading={isLoading} />;
    }

    return <TwoProductItem items={item.items} />;
  };

  useEffect(() => {
    if (!sort) return resetParams();

    updateParams({
      sortBy: sort?.sortBy,
      sortDirection: sort?.sortDirection,
    });
  }, [sort]);

  const onFilter = ({
    minPrice,
    maxPrice,
    categories,
    locations,
    ratings,
  }: {
    minPrice: number;
    maxPrice: number;
    categories: string[];
    locations: string[];
    ratings: number[];
  }) => {
    setActiveFilters({
      minPrice,
      maxPrice,
      categories,
      locations,
      ratings,
    });

    const numberMinPrice = minPrice;
    const numberMaxPrice = maxPrice;

    const params = {
      ...(numberMinPrice > 0 &&
        !!numberMinPrice &&
        numberMinPrice < numberMaxPrice && { minPrice: numberMinPrice }),
      ...(numberMaxPrice > 0 &&
        !!numberMaxPrice &&
        numberMaxPrice > numberMinPrice && { maxPrice: numberMaxPrice }),
      locations: locations?.map((i) => "p:" + i).join(","),
      categoryIds: categories.join(","),
      averageRatingFrom: ratings.length > 0 ? ratings?.[0] : 0,
      search: searchText,
    };

    Object.keys(params).forEach((key) => {
      if (!params[key as keyof typeof params]) {
        delete params[key as keyof typeof params];
      }
    });

    forceUpdateParams({
      ...params,
      ...(shopId && { shopId: shopId }),
      ...(searchText && { search: searchText }),
    });
  };

  const onResetFilter = () => {
    setActiveFilters({
      minPrice: 0,
      maxPrice: 0,
      categories: [],
      locations: [],
      ratings: [],
    });
    resetParams();
  };

  const flashListData = useMemo(() => {
    const handledData = preHandleFlashListData(data);

    if (!data || data.length === 0) {
      return [
        ...(shopId || categoryId ? [] : categoryData),
        ...containerHeaderData,
        ...noDataData,
      ];
    }
    return [
      ...(shopId || categoryId ? [] : categoryData),
      ...containerHeaderData,
      ...handledData,
    ];
  }, [data, sort, shopId]);

  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header
        isOpen={isOpen}
        onOpen={onOpen}
        searchText={searchText ?? categoryName ?? ""}
        hasActiveFilters={hasActiveFilters}
        showFilter={!shopId && !categoryId}
      />
      <View className="relative flex-1">
        <View className="absolute right-0 bottom-0 left-0 h-1/2 bg-[#EEE] z-0" />

        <FlashList
          className="mt-4"
          data={flashListData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={302}
          getItemType={(item) => item.type}
          showsVerticalScrollIndicator={false}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefresh}
              onRefresh={refresh}
              colors={["white"]}
              tintColor="white"
            />
          }
          ListFooterComponent={
            hasNextPage && isFetching ? (
              <View className="flex-row justify-center items-center w-full h-10 bg-[#EEE]">
                <ActivityIndicator size="large" color="#39CA71" />
              </View>
            ) : (
              <View
                className="w-full bg-[#EEE]"
                style={{
                  height: flashListData?.length > 3 ? 40 : 200,
                }}
              />
            )
          }
        />
      </View>
      {!shopId && !categoryId && (
        <Filter
          ref={FilterRef}
          isOpen={isOpen}
          onClose={onClose}
          onApply={onFilter}
          onResetFilter={onResetFilter}
        />
      )}
    </ScreenWrapper>
  );
};

export default SearchAdvance;
