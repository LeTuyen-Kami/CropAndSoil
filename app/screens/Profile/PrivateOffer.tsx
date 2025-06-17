import { Image } from "expo-image";
import {
  FlatList,
  Pressable,
  ScrollView,
  View,
  Image as RNImage,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import ProductItem from "~/components/common/ProductItem";
import {
  calculateDiscount,
  calculateOnSale,
  checkCanRender,
  isIOS,
  screen,
} from "~/utils";
import SectionTitle from "./SectionTitlte";
import { searchService } from "~/services/api/search.services";
import { useQuery } from "@tanstack/react-query";
import { authAtom } from "~/store/atoms";
import { useAtomValue } from "jotai";
import { productService } from "~/services/api/product.service";
import { homeService } from "~/services/api/home.service";
import * as WebBrowser from "expo-web-browser";
const PrivateOffer = () => {
  const auth = useAtomValue(authAtom);

  const { data } = useQuery({
    queryKey: ["private-offer"],
    queryFn: () => searchService.searchSuggestions(""),
    enabled: auth?.isLoggedIn,
  });

  const { data: homeData } = useQuery({
    queryKey: ["home"],
    queryFn: () => homeService.getHome(),
    staleTime: 1000 * 60,
    enabled: auth?.isLoggedIn,
  });

  const { data: products } = useQuery({
    queryKey: ["private-offer-products"],
    queryFn: () =>
      productService.searchProducts({
        skip: 0,
        take: 10,
        ids: data?.map((item) => item.id)?.join(","),
      }),
    enabled: auth?.isLoggedIn && !!data && data.length > 0,
  });

  if (!auth?.isLoggedIn) return null;

  if (!checkCanRender(products)) return null;

  return (
    <View className="bg-white rounded-xl mb-2.5">
      <SectionTitle title="Ưu đãi dành riêng cho bạn" />
      <Carousel
        autoPlayInterval={2000}
        data={
          homeData?.sliders?.map((item, index) => ({
            id: index.toString(),
            image: item.image,
            url: item.url,
          })) ?? []
        }
        height={(screen.width - 40) / 2}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={screen.width}
        style={{
          width: screen.width,
        }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 40,
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (item.url) {
                WebBrowser.openBrowserAsync(item.url);
              }
            }}
            style={{
              flex: 1,
              marginHorizontal: 26,
              paddingVertical: 8,
            }}
          >
            {isIOS ? (
              <RNImage
                source={{
                  uri: item.image,
                }}
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={{
                  uri: item.image,
                }}
                style={{ width: "100%", height: "100%", borderRadius: 12 }}
                contentFit="cover"
              />
            )}
          </Pressable>
        )}
      />

      <FlatList
        data={products?.data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 8,
          paddingBottom: 8,
        }}
        renderItem={({ item: product }) => (
          <ProductItem
            name={product?.name}
            price={product?.salePrice}
            originalPrice={product?.regularPrice}
            discount={calculateDiscount(product)}
            rating={product?.averageRating}
            soldCount={product?.totalSales}
            image={product?.images[0]}
            onSale={calculateOnSale(product)}
            id={product?.id}
            location={product?.shop?.shopWarehouseLocation?.province?.name}
            className="flex-grow"
            width={Math.max((screen.width - 24) / 2.2, 180)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default PrivateOffer;
