import { Image } from "expo-image";
import { FlatList, ScrollView, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import ProductItem from "~/components/common/ProductItem";
import { calculateDiscount, checkCanRender, screen } from "~/utils";
import SectionTitle from "./SectionTitlte";
import { searchService } from "~/services/api/search.services";
import { useQuery } from "@tanstack/react-query";
import { authAtom } from "~/store/atoms";
import { useAtomValue } from "jotai";
import { productService } from "~/services/api/product.service";

const PrivateOffer = () => {
  const auth = useAtomValue(authAtom);

  const { data } = useQuery({
    queryKey: ["private-offer"],
    queryFn: () => searchService.searchSuggestions(""),
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
        data={[...Array(10)].map((_, index) => ({
          id: index.toString(),
        }))}
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
        renderItem={({ index }) => (
          <View
            style={{
              flex: 1,
              marginHorizontal: 26,
              paddingVertical: 8,
            }}
          >
            <Image
              source={{
                uri: "https://picsum.photos/200/300",
              }}
              style={{ width: "100%", height: "100%", borderRadius: 12 }}
            />
          </View>
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
            onSale={product?.regularPrice > product?.salePrice}
            id={product?.id}
            location={product?.shop?.shopWarehouseLocation?.province?.name}
            className="flex-grow"
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default PrivateOffer;
