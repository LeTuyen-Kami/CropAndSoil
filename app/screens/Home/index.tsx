import { useNavigation } from "@react-navigation/native";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { useAtomValue } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
  Image as RNImage,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { imagePaths } from "~/assets/imagePath";
import CarouselEmpty from "~/components/common/CarouselEmpty";
import CarouselSkeleton from "~/components/common/CarouselSkeleton";
import Carousel from "~/components/common/Carusel";
import Category from "~/components/common/Category";
import FlashSaleEmpty from "~/components/common/FlashSaleEmpty";
import FlashSaleSkeleton from "~/components/common/FlashSaleSkeleton";
import ProductItem from "~/components/common/ProductItem";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { commonService } from "~/services/api/common.service";
import { flashSaleService } from "~/services/api/flashsale.service";
import { homeService, ILocalRepeater } from "~/services/api/home.service";
import { IProduct, productService } from "~/services/api/product.service";
import { searchService } from "~/services/api/search.services";
import { authAtom } from "~/store/atoms";
import {
  calculateDiscount,
  checkCanRender,
  chunkArray,
  isIOS,
  screen,
} from "~/utils";
import ContainerList from "./ContainerList";
import Header from "./Header";
import HeaderSearch from "./HeaderSearch";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList as unknown as React.ComponentType<FlashListProps<any>>
);

const LIMIT_PRODUCT_IN_FOOTER = 4;
const PRODUCTS_PER_PAGE = 10;

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

const Banner = ({
  banner,
}: {
  banner: {
    id: string;
    image: string;
    url: string;
  };
}) => {
  return (
    <Pressable
      onPress={() => {
        if (banner.url) {
          WebBrowser.openBrowserAsync(banner.url);
        }
      }}
      className="w-full aspect-[2.5/1]"
    >
      {isIOS ? (
        <RNImage
          source={{ uri: banner.image }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={{ uri: banner.image }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      )}
    </Pressable>
  );
};

// Các constant để định nghĩa các loại item cho FlashList
const ITEM_TYPES = {
  CAROUSEL: "carousel",
  CATEGORY: "category",
  FLASH_SALE: "flashSale",
  TOP_DEAL: "topDeal",
  BANNER: "banner",
  SECTION_HEADER: "sectionHeader",
  SECTION_PRODUCTS: "sectionProducts",
  SECTION_FOOTER: "sectionFooter",
  SUGGESTION_PRODUCT: "suggestionProduct",
};

// BestSellerHeader component
const SectionHeader = ({ title, image }: { title: string; image: string }) => {
  return (
    <View className="pt-6 bg-primary-100">
      <View className="relative bg-white px-5 pb-4 pt-5 flex-row items-center rounded-t-[40px]">
        {image && <Image source={image} style={{ width: 40, height: 40 }} />}
        <Text
          className={
            image
              ? "ml-2 text-xl font-bold text-black"
              : "text-xl font-bold text-black"
          }
        >
          {title.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

// BestSellerFooter component
const SectionFooter = ({
  ids,
  title,
  sectionId,
  type,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: {
  ids: number[];
  title: string;
  sectionId: string;
  type?: "top_deal" | "top_sale";
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}) => {
  const navigation = useSmartNavigation();

  // const onPress = () => {
  //   if (type) {
  //     // Navigate to specific page for top_deal or top_sale
  //     navigation.navigate("TopProducts", {
  //       type: type,
  //       title: title,
  //     });
  //   } else {
  //     navigation.navigate("ProductBy", {
  //       productIds: ids,
  //       title: title,
  //     });
  //   }
  // };

  const shouldShowLoadMore = hasMore && onLoadMore;

  return (
    <View className="bg-primary-100">
      <View
        className="px-3 bg-white rounded-b-2xl"
        style={{
          paddingVertical: shouldShowLoadMore ? 16 : 8,
        }}
      >
        {shouldShowLoadMore && (
          <View className="justify-center h-10">
            {isLoadingMore ? (
              <ActivityIndicator size="small" color="#FCBA26" />
            ) : (
              <Button variant={"outline"} onPress={onLoadMore}>
                <Text>Xem thêm</Text>
              </Button>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

// BestSellerProductItem component
const SectionProducts = ({ products }: { products: IProduct[] }) => {
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

const HomeCarousel = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["homeCarousel", "home"],
    queryFn: () => homeService.getHome(),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.sliders,
  });

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  if (!checkCanRender(data) || data?.length === 0) {
    return <CarouselEmpty />;
  }

  return (
    <Carousel
      data={
        data?.map((item, index) => ({
          id: index.toString(),
          image: item.image,
          url: item.url,
        })) ?? []
      }
      autoPlay={true}
      autoPlayInterval={5000}
      loop={true}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            if (item.url) {
              WebBrowser.openBrowserAsync(item.url);
            }
          }}
        >
          {isIOS ? (
            <RNImage
              source={{ uri: item.image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={{ uri: item.image }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          )}
        </Pressable>
      )}
    />
  );
};

const Banners = ({
  banners,
}: {
  banners: {
    id: string;
    image: string;
    url: string;
  }[];
}) => {
  if (!checkCanRender(banners) || banners?.length === 0) {
    return null;
  }

  if (banners.length === 1) {
    return <Banner banner={banners[0]} />;
  }

  return (
    <View className="bg-primary-100">
      <Carousel
        data={banners.map((item) => ({
          id: item.id,
          image: item.image,
          url: item.url,
        }))}
        width={screen.width}
        height={screen.width / 2.5}
        renderItem={({ item }) => <Banner banner={item} />}
        autoPlay={true}
        autoPlayInterval={5000}
        loop={true}
      />
    </View>
  );
};

interface IFlashListData {
  type: string;
  id: string;
  products?: IProduct[];
  headerTitle?: string;
  headerImage?: string;
  footerUrl?: string;
  footerTitle?: string;
  productIds?: number[];
  sectionId?: string;
  sectionType?: "top_deal" | "top_sale";
  hasMore?: boolean;
  isLoadingMore?: boolean;
  buttonTitle?: string;
  buttonUrl?: string;
  banners?: {
    id: string;
    image: string;
    url: string;
  }[];
}

// Empty state component for sections
const SectionEmpty = ({ title }: { title: string }) => {
  return (
    <View className="items-center px-4 py-8 bg-white">
      <Text className="text-center text-gray-500">
        Hiện tại chưa có sản phẩm nào trong mục {title}
      </Text>
    </View>
  );
};

export const HomeScreen: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const auth = useAtomValue(authAtom);
  const queryClient = useQueryClient();

  const { data: homeData } = useQuery({
    queryKey: ["home"],
    queryFn: () => homeService.getHome(),
    staleTime: 1000 * 60,
  });

  const mutateTopDealProducts = useMutation({
    mutationFn: ({ skip, take }: { skip: number; take: number }) =>
      productService.getTopDealProducts({
        skip,
        take,
      }),
  });

  const mutateTopSaleProducts = useMutation({
    mutationFn: ({ skip, take }: { skip: number; take: number }) =>
      productService.getTopSaleProducts({
        skip,
        take,
      }),
  });

  const [repeaterData, setRepeaterData] = useState<ILocalRepeater[]>([]);
  const [suggestionProducts, setSuggestionProducts] = useState<IProduct[]>([]);
  const [sectionPagination, setSectionPagination] = useState<
    Record<string, { skip: number; hasMore: boolean; isLoading: boolean }>
  >({});

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
    ]);
    setIsRefreshing(false);
  };

  const handleLoadMore = useCallback(
    async (sectionId: string, type?: "top_deal" | "top_sale") => {
      const currentPagination = sectionPagination[sectionId];
      if (
        !currentPagination ||
        currentPagination.isLoading ||
        !currentPagination.hasMore
      ) {
        return;
      }

      setSectionPagination((prev) => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          isLoading: true,
        },
      }));

      try {
        let newProducts: IProduct[] = [];

        if (type === "top_deal") {
          const response = await mutateTopDealProducts.mutateAsync({
            skip: currentPagination.skip,
            take: PRODUCTS_PER_PAGE,
          });
          newProducts = response.data;
        } else if (type === "top_sale") {
          const response = await mutateTopSaleProducts.mutateAsync({
            skip: currentPagination.skip,
            take: PRODUCTS_PER_PAGE,
          });
          newProducts = response.data;
        }

        setRepeaterData((prev) =>
          prev.map((item) =>
            item.id === sectionId
              ? { ...item, products: [...item.products, ...newProducts] }
              : item
          )
        );

        setSectionPagination((prev) => ({
          ...prev,
          [sectionId]: {
            skip: currentPagination.skip + PRODUCTS_PER_PAGE,
            hasMore: newProducts.length === PRODUCTS_PER_PAGE,
            isLoading: false,
          },
        }));
      } catch (error) {
        console.error("Error loading more products:", error);
        setSectionPagination((prev) => ({
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            isLoading: false,
          },
        }));
      }
    },
    [sectionPagination, mutateTopDealProducts, mutateTopSaleProducts]
  );

  // Chuyển đổi dữ liệu BestSeller thành các item cho FlashList
  const processData = useCallback(
    (
      data: IProduct[] | undefined,
      {
        headerTitle,
        headerImage,
        id,
        footerUrl,
        footerTitle,
        productIds,
        type,
        hasMore,
        isLoadingMore,
      }: {
        headerTitle: string;
        headerImage: string;
        id: string;
        footerUrl: string;
        footerTitle: string;
        productIds: number[];
        type?: "top_deal" | "top_sale";
        hasMore?: boolean;
        isLoadingMore?: boolean;
      }
    ) => {
      if (!checkCanRender(data) || data!.length === 0) {
        return [
          {
            id: "header" + id,
            type: ITEM_TYPES.SECTION_HEADER,
            headerTitle: headerTitle,
            headerImage: headerImage,
          },
          {
            id: "empty" + id,
            type: "sectionEmpty",
            headerTitle: headerTitle,
          },
          {
            id: "footer" + id,
            type: ITEM_TYPES.SECTION_FOOTER,
            footerUrl: footerUrl,
            footerTitle: headerTitle,
            productIds: productIds,
            sectionId: id,
            sectionType: type,
            hasMore: false,
            isLoadingMore: false,
          },
        ];
      }

      // Tạo các chunk gồm 2 sản phẩm mỗi chunk
      const chunkedProducts = chunkArray(data!, 2);

      // Tạo các item cho FlashList từ chunked products
      const items = chunkedProducts.map((products, index) => ({
        id: `product-${id}-${index}`,
        type: ITEM_TYPES.SECTION_PRODUCTS,
        products,
      }));

      // Thêm header và footer
      return [
        {
          id: "header" + id,
          type: ITEM_TYPES.SECTION_HEADER,
          headerTitle: headerTitle,
          headerImage: headerImage,
        },
        ...items,
        {
          id: "footer" + id,
          type: ITEM_TYPES.SECTION_FOOTER,
          footerUrl: footerUrl,
          footerTitle: headerTitle,
          productIds: productIds,
          sectionId: id,
          sectionType: type,
          hasMore: hasMore,
          isLoadingMore: isLoadingMore,
        },
      ];
    },
    []
  );

  const flashlistData = useMemo(() => {
    const baseItems: IFlashListData[] = [
      { type: ITEM_TYPES.CAROUSEL, id: "carousel" },
      { type: ITEM_TYPES.CATEGORY, id: "category" },
      { type: ITEM_TYPES.FLASH_SALE, id: "flashSale" },
    ];

    if (repeaterData.length > 0) {
      repeaterData.forEach((item) => {
        if (item?.banners && item?.banners?.length > 0) {
          baseItems.push({
            type: ITEM_TYPES.BANNER,
            id: item.id,
            banners:
              item.banners?.map((banner, index) => ({
                id: index.toString(),
                image: banner.image,
                url: banner.url,
              })) ?? [],
          });
        }

        const currentPagination = sectionPagination[item.id];
        const processedData = processData(item.products, {
          headerTitle: item.heading,
          headerImage: item.icon,
          id: item.id,
          footerUrl: item.button.url,
          footerTitle: item.button.title,
          productIds: item.productIds,
          type: item.type,
          hasMore: currentPagination?.hasMore ?? false,
          isLoadingMore: currentPagination?.isLoading ?? false,
        });
        baseItems.push(...processedData);
      });
    }

    // Add suggestion products section at the end
    if (homeData?.suggestionProduct && suggestionProducts.length > 0) {
      const suggestionData = processData(suggestionProducts, {
        headerTitle: homeData.suggestionProduct.title,
        headerImage: "", // empty string since we don't have icon URL for suggestions
        id: "suggestion",
        footerUrl: homeData.suggestionProduct.button.url,
        footerTitle: homeData.suggestionProduct.button.title,
        productIds: homeData.suggestionProduct.productIds,
        hasMore: false,
        isLoadingMore: false,
      });
      baseItems.push(...suggestionData);
    }

    return [...baseItems];
  }, [repeaterData, sectionPagination, homeData, suggestionProducts]);

  const renderItem = useCallback(
    ({ item }: { item: IFlashListData }) => {
      switch (item.type) {
        case ITEM_TYPES.CAROUSEL:
          return <HomeCarousel />;

        case ITEM_TYPES.CATEGORY:
          return <Category className="px-2 pt-2" />;

        case ITEM_TYPES.FLASH_SALE:
          return <FlashSale />;

        case ITEM_TYPES.BANNER:
          return <Banners banners={item.banners ?? []} />;

        case ITEM_TYPES.SECTION_HEADER:
          return (
            <SectionHeader
              title={item.headerTitle ?? ""}
              image={item.headerImage ?? ""}
            />
          );

        case ITEM_TYPES.SECTION_PRODUCTS:
          return <SectionProducts products={item.products ?? []} />;

        case "sectionEmpty":
          return <SectionEmpty title={item.headerTitle ?? ""} />;

        case ITEM_TYPES.SECTION_FOOTER:
          return (
            <SectionFooter
              ids={item?.productIds ?? []}
              title={item.footerTitle ?? ""}
              sectionId={item.sectionId ?? ""}
              type={item.sectionType}
              hasMore={item.hasMore}
              onLoadMore={() =>
                handleLoadMore(item.sectionId ?? "", item.sectionType)
              }
              isLoadingMore={item.isLoadingMore}
            />
          );

        default:
          return null;
      }
    },
    [loadingMore, handleLoadMore]
  );

  useEffect(() => {
    if (homeData) {
      const handledRepeaters = homeData.repeaters.map((item, index) => {
        const currentIndex = index;
        const sectionId = index.toString();

        // Initialize pagination for this section
        setSectionPagination((prev) => ({
          ...prev,
          [sectionId]: {
            skip: PRODUCTS_PER_PAGE,
            hasMore: true,
            isLoading: false,
          },
        }));

        if (item.type === "top_deal" || item.type === "top_sale") {
          // Use mutation for top_deal and top_sale
          const mutation =
            item.type === "top_deal"
              ? mutateTopDealProducts
              : mutateTopSaleProducts;

          mutation
            .mutateAsync({
              skip: 0,
              take: PRODUCTS_PER_PAGE,
            })
            .then((response) => {
              setRepeaterData((prev) => {
                const newData = [...prev];
                if (newData[currentIndex]) {
                  newData[currentIndex].products = response.data;
                }
                return newData;
              });

              // Update pagination based on response
              setSectionPagination((prev) => ({
                ...prev,
                [sectionId]: {
                  skip: PRODUCTS_PER_PAGE,
                  hasMore: response.data.length === PRODUCTS_PER_PAGE,
                  isLoading: false,
                },
              }));
            })
            .catch((error) => {
              console.error(`Error fetching ${item.type} products:`, error);
              setSectionPagination((prev) => ({
                ...prev,
                [sectionId]: {
                  skip: 0,
                  hasMore: false,
                  isLoading: false,
                },
              }));
            });
        } else {
          // Use productIds for other types
          const displayProductIds = item?.productIds
            ?.slice(0, LIMIT_PRODUCT_IN_FOOTER)
            .join(",");

          if (displayProductIds) {
            productService
              .searchProducts({
                ids: displayProductIds,
                skip: 0,
                take: 100,
              })
              .then((data) => {
                setRepeaterData((prev) => {
                  const newData = [...prev];
                  if (newData[currentIndex]) {
                    newData[currentIndex].products = data.data;
                  }
                  return newData;
                });
              });
          }

          // For non-mutation types, set hasMore to false since we're using productIds
          setSectionPagination((prev) => ({
            ...prev,
            [sectionId]: {
              skip: 0,
              hasMore: false,
              isLoading: false,
            },
          }));
        }

        return {
          ...item,
          id: sectionId,
          products: [],
        };
      });

      setRepeaterData(handledRepeaters);

      // Handle suggestion products
      if (homeData.suggestionProduct?.productIds?.length > 0) {
        const suggestionProductIds =
          homeData.suggestionProduct.productIds.join(",");
        productService
          .searchProducts({
            ids: suggestionProductIds,
            skip: 0,
            take: 100,
          })
          .then((data) => {
            setSuggestionProducts(data.data);
          })
          .catch((error) => {
            console.error("Error fetching suggestion products:", error);
          });
      }
    }
  }, [homeData]);

  useEffect(() => {
    if (auth?.isLoggedIn) {
      queryClient.prefetchQuery({
        queryKey: ["private-offer"],
        queryFn: () => searchService.searchSuggestions(""),
      });

      queryClient.prefetchQuery({
        queryKey: ["recently-viewed-products"],
        queryFn: () => commonService.getRecentlyViewedProducts(),
      });
    }
  }, [auth]);

  const scrollY = useSharedValue(0);

  // scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const contentHeight = event.contentSize.height;
      const layoutHeight = event.layoutMeasurement.height;
      const yOffset = event.contentOffset.y;

      // nếu kéo tới dưới cùng và kéo quá (overscroll)
      const overScroll = yOffset + layoutHeight - contentHeight;

      if (overScroll > 0) {
        scrollY.value = overScroll;
      } else {
        scrollY.value = 0;
      }
    },
  });

  const animatedFooterStyle = useAnimatedStyle(() => {
    return {
      height: 60 + scrollY.value * 2, // chiều cao tăng dần theo overScroll
    };
  });

  return (
    <ScreenWrapper hasGradient={true}>
      <Header
        onPressMessages={onPressMessages}
        onPressQuestionCircle={onPressQuestionCircle}
      />

      <Animated.View
        className="absolute bottom-0 left-0 right-0 bg-[#DDF1E5]"
        style={animatedFooterStyle}
      />

      <AnimatedFlashList
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={"white"}
          />
        }
        showsVerticalScrollIndicator={false}
        bouncesZoom
        data={flashlistData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={200}
        getItemType={(item) => item.type}
        ListHeaderComponent={<HeaderSearch />}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<View className="h-[100px] bg-[#DDF1E5]" />}
      />
    </ScreenWrapper>
  );
};
