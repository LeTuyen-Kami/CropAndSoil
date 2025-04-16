import { FontAwesome5 } from "@expo/vector-icons";
import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
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
  getItemWidth,
  preHandleFlashListData,
  screen,
} from "~/utils";
import Filter from "./Filter";
import { COLORS } from "~/constants/theme";

const ExploreCategory = () => {
  return (
    <View className="px-2 py-4 mx-2 rounded-2xl bg-white/20">
      <Text className="text-lg font-bold text-white uppercase">
        Khám phá theo danh mục
      </Text>
      <View className="mt-4">
        <Category />
      </View>
    </View>
  );
};

const Header = ({
  isOpen,
  onOpen,
  searchText,
}: {
  isOpen: boolean;
  onOpen: () => void;
  searchText: string;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<"SearchAdvance">>();

  const onPressSearch = () => {
    navigation.dispatch((state) => {
      // Remove all the screens after `Profile`
      const index = state.routes.findIndex((r) => r.name === "Search");

      if (index === -1) {
        return CommonActions.reset({
          ...state,
          routes: [...state.routes, { name: "Search" }],
          index: 0,
        });
      }

      const routes = state.routes.slice(0, index + 1);

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
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
          {searchText || "Tìm kiếm sản phẩm cửa hàng"}
        </Text>
        <Image
          source={imagePaths.icMagnifier}
          className="ml-1 size-5"
          contentFit="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onOpen}
        className="h-12 rounded-full aspect-square bg-[#39CA71] justify-center items-center"
        hitSlop={20}
      >
        <Image
          source={imagePaths.icFilter}
          className="size-6"
          contentFit="contain"
        />
      </TouchableOpacity>
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
          onSale={item?.regularPrice > item?.salePrice}
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
  const { searchText } = route.params;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sort, setSort] = useState<{
    sortBy: "salePrice" | "createdAt";
    sortDirection: "asc" | "desc";
  } | null>(null);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isRefresh,
    refresh,
    isLoading,
    isFetching,
    updateParams,
  } = usePagination(productService.searchProducts, {
    initialPagination: {
      skip: 0,
      take: 10,
    },
    queryKey: ["search-products"],
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

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "category") {
      return <ExploreCategory />;
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
    if (!sort) return;

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
    ratings: string[];
  }) => {
    const numberMinPrice = Number(minPrice);
    const numberMaxPrice = Number(maxPrice);

    updateParams({
      ...(numberMinPrice > 0 &&
        !!numberMinPrice &&
        numberMinPrice < numberMaxPrice && { minPrice: numberMinPrice }),
      ...(numberMaxPrice > 0 &&
        !!numberMaxPrice &&
        numberMaxPrice > numberMinPrice && { maxPrice: numberMaxPrice }),
      ...(locations.length > 0 && {
        locations: locations?.map((i) => "p:" + i).join(","),
      }),
      ...(categories.length > 0 && { categories: categories.join(",") }),
      ...(ratings.length > 0 && { averageRatingFrom: Number(ratings) }),
    });
  };

  const flashListData = useMemo(() => {
    const handledData = preHandleFlashListData(data);

    if (!data || data.length === 0) {
      return [...categoryData, ...containerHeaderData, ...noDataData];
    }
    return [...categoryData, ...containerHeaderData, ...handledData];
  }, [data, sort]);

  useEffect(() => {
    updateParams({
      search: searchText,
    });
  }, [searchText]);

  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header isOpen={isOpen} onOpen={onOpen} searchText={searchText} />
      <View className="flex-1">
        <FlashList
          className="mt-4"
          data={flashListData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={302}
          getItemType={(item) => item.type}
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
      <Filter isOpen={isOpen} onClose={onClose} onApply={onFilter} />
    </ScreenWrapper>
  );
};

export default SearchAdvance;
