import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { imagePaths } from "~/assets/imagePath";
import Carousel from "~/components/common/Carusel";
import Category from "~/components/common/Category";
import ProductItem from "~/components/common/ProductItem";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import {
  IProduct,
  IProductResquest,
  productService,
} from "~/services/api/product.service";
import {
  calculateDiscount,
  checkCanRender,
  screen,
  preHandleFlashListData,
  chunkArray,
  applyTyoe,
} from "~/utils";
import ContainerList from "./ContainerList";
import Header from "./Header";
import HeaderSearch from "./HeaderSearch";
import { useAtom } from "jotai";
import { authAtom } from "~/store/atoms";
import { flashSaleService } from "~/services/api/flashsale.service";
import FlashSaleSkeleton from "~/components/common/FlashSaleSkeleton";
import FlashSaleEmpty from "~/components/common/FlashSaleEmpty";
import TopDealSkeleton from "~/components/common/TopDealSkeleton";
import TopDealEmpty from "~/components/common/TopDealEmpty";
import BestSellerSkeleton from "~/components/common/BestSellerSkeleton";
import BestSellerEmpty from "~/components/common/BestSellerEmpty";
import { usePagination } from "~/hooks/usePagination";
import { COLORS } from "~/constants/theme";

const FlashSale = () => {
  const navigation = useSmartNavigation();

  const { data, isLoading } = useQuery({
    queryKey: ["flashSale", "home"],
    queryFn: () =>
      flashSaleService.getFlashSale({
        skip: 0,
        take: 10,
      }),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
    refetchInterval: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <FlashSaleSkeleton />;
  }

  if (!data || data.length === 0) {
    return <FlashSaleEmpty />;
  }

  return (
    <View>
      <View className="relative mt-10">
        <View className="mx-2 top-[-15] absolute left-0 right-0 h-[76] rounded-[40] bg-secondary-50 opacity-20" />
        <ContainerList
          onPress={() => navigation.navigate("FlashSale")}
          bgColor="bg-primary-100"
          title="Flash Sale"
          icon={
            <Image
              source={imagePaths.flashSale}
              style={{ width: 40, height: 40 }}
            />
          }
        >
          <View>
            <FlatList
              data={data}
              horizontal
              renderItem={({ item }) => (
                <ProductItem
                  onPress={() =>
                    navigation.push("FlashSaleProduct", { id: item?.id })
                  }
                  key={item.id}
                  name={item?.flashSaleProduct?.name}
                  price={item?.salePrice}
                  originalPrice={item?.flashSaleVariation?.regularPrice}
                  discount={item?.discountPercent}
                  soldCount={item?.bought}
                  totalCount={item?.campaignStock}
                  image={
                    item?.flashSaleVariation?.thumbnail ||
                    item?.flashSaleProduct?.thumbnail
                  }
                  onSale={true}
                  id={item?.id}
                />
              )}
              ItemSeparatorComponent={() => <View className="w-2" />}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ContainerList>
      </View>
    </View>
  );
};

const TopDeal = () => {
  const smartNavigation = useSmartNavigation();
  const { data, isLoading } = useQuery({
    queryKey: ["topDeal", "home"],
    queryFn: () =>
      productService.getTopDealProducts({
        skip: 0,
        take: 10,
      }),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });

  if (isLoading) {
    return <TopDealSkeleton />;
  }

  if (!checkCanRender(data) || data?.length === 0) {
    return <TopDealEmpty />;
  }

  return (
    <View className="bg-primary-100">
      <View className="mt-4">
        <ContainerList
          bgColor="bg-primary-50"
          title="TOP DEAL - SIÊU RẺ"
          icon={
            <Image
              source={imagePaths.selling}
              style={{ width: 40, height: 40 }}
            />
          }
        >
          <View className="flex flex-row flex-wrap gap-2">
            {data!.map((item, index) => (
              <ProductItem
                width={(screen.width - 24) / 2}
                key={index}
                name={item.name}
                price={item.salePrice}
                originalPrice={item.regularPrice}
                discount={calculateDiscount(item)}
                rating={item.averageRating}
                soldCount={item.totalSales}
                location={item?.shop?.shopWarehouseLocation?.province?.name}
                id={item.id}
                image={item.thumbnail}
                className="flex-grow"
              />
            ))}
          </View>
        </ContainerList>
      </View>
    </View>
  );
};

const Banner = () => {
  return (
    <View className="w-full aspect-[3/2]">
      <Image
        source={imagePaths.homeBanner}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
      />
    </View>
  );
};

const BestSeller = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["bestSeller", "home"],
    queryFn: () =>
      productService.searchProducts({
        sortBy: "bestSelling",
        sortDirection: "desc",
        skip: 0,
        take: 10,
      }),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });

  if (isLoading) {
    return <BestSellerSkeleton />;
  }

  if (!checkCanRender(data) || data?.length === 0) {
    return <BestSellerEmpty />;
  }

  return (
    <View className="bg-primary-50">
      <View className="mt-2">
        <ContainerList
          className="pb-20"
          linearColor={["#FEFEFE", "#EEE"]}
          title="SẢN PHẨM BÁN CHẠY"
          icon={
            <Image source={imagePaths.fire} style={{ width: 40, height: 40 }} />
          }
        >
          <View className="flex flex-row flex-wrap gap-2">
            {data!.map((item, index) => (
              <ProductItem
                width={(screen.width - 24) / 2}
                key={index}
                name={item.name}
                price={item.salePrice}
                originalPrice={item.regularPrice}
                discount={calculateDiscount(item)}
                rating={item.averageRating}
                soldCount={item.totalSales}
                location={item?.shop?.shopWarehouseLocation?.province?.name}
                id={item.id}
                image={item.thumbnail}
                className="flex-grow"
              />
            ))}
          </View>
        </ContainerList>
      </View>
    </View>
  );
};

// Các constant để định nghĩa các loại item cho FlashList
const ITEM_TYPES = {
  CAROUSEL: "carousel",
  CATEGORY: "category",
  FLASH_SALE: "flashSale",
  TOP_DEAL: "topDeal",
  BANNER: "banner",
  BEST_SELLER_HEADER: "bestSellerHeader",
  BEST_SELLER_PRODUCT: "bestSellerProduct",
  BEST_SELLER_FOOTER: "bestSellerFooter",
  BEST_SELLER_EMPTY: "bestSellerEmpty",
  BEST_SELLER_LOADING: "bestSellerLoading",
};

// BestSellerHeader component
const BestSellerHeader = () => {
  return (
    <View className="bg-[#eee] pt-6">
      <View className="relative bg-white px-5 pb-4 pt-5 flex-row items-center rounded-t-[40px]">
        <Image source={imagePaths.fire} style={{ width: 40, height: 40 }} />
        <Text className="ml-2 text-xl font-bold text-black uppercase">
          SẢN PHẨM BÁN CHẠY
        </Text>
      </View>
    </View>
  );
};

// BestSellerFooter component
const BestSellerFooter = ({ loading }: { loading: boolean }) => {
  return (
    <View
      className="pb-4 bg-white"
      style={{ paddingBottom: loading ? 160 : 80 }}
    >
      {loading ? (
        <View className="flex-row justify-center items-center py-4">
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : (
        <View className="h-16" />
      )}
    </View>
  );
};

// BestSellerProductItem component
const BestSellerProductItem = ({ products }: { products: IProduct[] }) => {
  return (
    <View className="flex-row flex-wrap gap-2 px-2 pb-2 bg-white">
      {products.map((product, index) => (
        <ProductItem
          width={(screen.width - 24) / 2}
          key={product.id || index}
          name={product.name}
          price={product.salePrice}
          originalPrice={product.regularPrice}
          discount={calculateDiscount(product)}
          rating={product.averageRating}
          soldCount={product.totalSales}
          location={product?.shop?.shopWarehouseLocation?.province?.name}
          id={product.id}
          image={product.thumbnail}
          className="flex-grow"
        />
      ))}
    </View>
  );
};

export const HomeScreen: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const auth = useAtom(authAtom);
  const queryClient = useQueryClient();

  // Sử dụng usePagination cho bestseller
  const {
    data: bestSellerData,
    hasNextPage: hasBestSellerNextPage,
    fetchNextPage: fetchBestSellerNextPage,
    isLoading: isBestSellerLoading,
    isFetching: isBestSellerFetching,
    refresh: refreshBestSeller,
  } = usePagination<
    IProduct,
    Pick<IProductResquest, "sortBy" | "sortDirection">
  >(productService.searchProducts as any, {
    initialPagination: {
      skip: 0,
      take: 10,
    },
    initialParams: {
      sortBy: "bestSelling",
      sortDirection: "desc",
    },
    queryKey: ["bestSeller-pagination", "home"],
  });

  const navigation = useNavigation();
  const onPressMessages = () => {
    console.log("messages");
  };

  const onPressQuestionCircle = () => {
    console.log("question circle");
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("home") ||
          query.queryKey.includes("categories"),
      }),
      refreshBestSeller(),
    ]);
    setIsRefreshing(false);
  };

  // Chuyển đổi dữ liệu BestSeller thành các item cho FlashList
  const processBestSellerData = useMemo(() => {
    if (
      isBestSellerLoading &&
      (!bestSellerData || bestSellerData.length === 0)
    ) {
      return [
        { id: "bestSellerLoading", type: ITEM_TYPES.BEST_SELLER_LOADING },
      ];
    }

    if (!checkCanRender(bestSellerData) || bestSellerData?.length === 0) {
      return [{ id: "bestSellerEmpty", type: ITEM_TYPES.BEST_SELLER_EMPTY }];
    }

    // Tạo các chunk gồm 2 sản phẩm mỗi chunk
    const chunkedProducts = chunkArray(bestSellerData, 2);

    // Tạo các item cho FlashList từ chunked products
    const bestSellerItems = chunkedProducts.map((products, index) => ({
      id: `bestSellerProduct-${index}`,
      type: ITEM_TYPES.BEST_SELLER_PRODUCT,
      products,
    }));

    // Thêm header và footer
    return [
      { id: "bestSellerHeader", type: ITEM_TYPES.BEST_SELLER_HEADER },
      ...bestSellerItems,
      {
        id: "bestSellerFooter",
        type: ITEM_TYPES.BEST_SELLER_FOOTER,
        loading: hasBestSellerNextPage && isBestSellerFetching,
      },
    ];
  }, [
    bestSellerData,
    isBestSellerLoading,
    hasBestSellerNextPage,
    isBestSellerFetching,
  ]);

  const flashlistData = useMemo(() => {
    const baseItems = [
      { type: ITEM_TYPES.CAROUSEL, id: "carousel" },
      { type: ITEM_TYPES.CATEGORY, id: "category" },
      { type: ITEM_TYPES.FLASH_SALE, id: "flashSale" },
      { type: ITEM_TYPES.TOP_DEAL, id: "topDeal" },
      { type: ITEM_TYPES.BANNER, id: "banner" },
    ];

    return [...baseItems, ...processBestSellerData];
  }, [processBestSellerData]);

  const handleEndReached = async () => {
    if (hasBestSellerNextPage && !isBestSellerFetching && !loadingMore) {
      setLoadingMore(true);
      await fetchBestSellerNextPage();
      setLoadingMore(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case ITEM_TYPES.CAROUSEL:
        return (
          <Carousel
            data={[...Array(10)]}
            autoPlay={true}
            autoPlayInterval={5000}
            loop={true}
            renderItem={({ index }) => (
              <View>
                <Image
                  source={"https://picsum.photos/200/300"}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            )}
          />
        );

      case ITEM_TYPES.CATEGORY:
        return <Category className="px-2 pt-2" />;

      case ITEM_TYPES.FLASH_SALE:
        return <FlashSale />;

      case ITEM_TYPES.TOP_DEAL:
        return <TopDeal />;

      case ITEM_TYPES.BANNER:
        return <Banner />;

      case ITEM_TYPES.BEST_SELLER_HEADER:
        return <BestSellerHeader />;

      case ITEM_TYPES.BEST_SELLER_PRODUCT:
        return <BestSellerProductItem products={item.products} />;

      case ITEM_TYPES.BEST_SELLER_FOOTER:
        return <BestSellerFooter loading={item.loading} />;

      case ITEM_TYPES.BEST_SELLER_LOADING:
        return <BestSellerSkeleton />;

      case ITEM_TYPES.BEST_SELLER_EMPTY:
        return <BestSellerEmpty />;

      default:
        return null;
    }
  };

  return (
    <ScreenWrapper hasGradient={true}>
      <Header
        onPressMessages={onPressMessages}
        onPressQuestionCircle={onPressQuestionCircle}
      />

      <FlashList
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={"white"}
          />
        }
        data={flashlistData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={200}
        getItemType={(item) => item.type}
        ListHeaderComponent={<HeaderSearch />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
    </ScreenWrapper>
  );
};
