import { useNavigation } from "@react-navigation/native";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { useAtomValue } from "jotai";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  FlatListProps,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
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
import { calculateDiscount, checkCanRender, chunkArray, screen } from "~/utils";
import ContainerList from "./ContainerList";
import Header from "./Header";
import HeaderSearch from "./HeaderSearch";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList as unknown as React.ComponentType<FlashListProps<any>>
);

const LIMIT_PRODUCT_IN_FOOTER = 4;

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
      className="w-full aspect-[7/2]"
    >
      <Image
        source={{ uri: banner.image }}
        style={{ width: "100%", height: "100%" }}
        contentFit="contain"
      />
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
};

// BestSellerHeader component
const SectionHeader = ({ title, image }: { title: string; image: string }) => {
  return (
    <View className="pt-6 bg-primary-100">
      <View className="relative bg-white px-5 pb-4 pt-5 flex-row items-center rounded-t-[40px]">
        <Image source={image} style={{ width: 40, height: 40 }} />
        <Text className="ml-2 text-xl font-bold text-black uppercase">
          {title}
        </Text>
      </View>
    </View>
  );
};

// BestSellerFooter component
const SectionFooter = ({ ids, title }: { ids: number[]; title: string }) => {
  const navigation = useSmartNavigation();

  const onPress = () => {
    navigation.navigate("ProductBy", {
      productIds: ids,
      title: title,
    });
  };

  return (
    <View className="bg-primary-100">
      <View
        className="px-3 bg-white rounded-b-2xl"
        style={{
          paddingVertical: ids.length > LIMIT_PRODUCT_IN_FOOTER ? 16 : 8,
        }}
      >
        {!!ids && ids.length > LIMIT_PRODUCT_IN_FOOTER && (
          <Button variant={"outline"} onPress={onPress}>
            <Text>Xem tất cả</Text>
          </Button>
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
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: "100%" }}
          />
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
        height={(screen.width * 2) / 7}
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
  banners?: {
    id: string;
    image: string;
    url: string;
  }[];
}

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

  const [repeaterData, setRepeaterData] = useState<ILocalRepeater[]>([]);

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
      }: {
        headerTitle: string;
        headerImage: string;
        id: string;
        footerUrl: string;
        footerTitle: string;
        productIds: number[];
      }
    ) => {
      if (!checkCanRender(data)) {
        return [];
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

        if (item?.products && item?.products?.length > 0) {
          const processedData = processData(item.products, {
            headerTitle: item.heading,
            headerImage: item.icon,
            id: item.id,
            footerUrl: item.button.url,
            footerTitle: item.button.title,
            productIds: item.productIds,
          });
          baseItems.push(...processedData);
        }
      });
    }
    return [...baseItems];
  }, [repeaterData]);

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

        case ITEM_TYPES.SECTION_FOOTER:
          return (
            <SectionFooter
              ids={item?.productIds ?? []}
              title={item.footerTitle ?? ""}
            />
          );

        default:
          return null;
      }
    },
    [loadingMore]
  );

  useEffect(() => {
    if (homeData) {
      const handledRepeaters = homeData.repeaters.map((item, index) => {
        const currentIndex = index;

        const displayProductIds = item?.productIds
          ?.slice(0, LIMIT_PRODUCT_IN_FOOTER)
          .join(",");

        productService
          .searchProducts({
            ids: displayProductIds,
            skip: 0,
            take: 100,
          })
          .then((data) => {
            setRepeaterData((prev) => {
              const newData = [...prev];
              newData[currentIndex].products = data.data;
              return newData;
            });
          });

        return {
          ...item,
          id: index.toString(),
          products: [],
        };
      });

      setRepeaterData(handledRepeaters);
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
