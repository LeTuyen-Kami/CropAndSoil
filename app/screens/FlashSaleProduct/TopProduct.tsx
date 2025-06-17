import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { deepEqual } from "fast-equals";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { imagePaths } from "~/assets/imagePath";
import ProductItem from "~/components/common/ProductItem";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { flashSaleService } from "~/services/api/flashsale.service";
import { productService } from "~/services/api/product.service";
import { calculateDiscount, calculateOnSale } from "~/utils";

const TopProduct = ({ id }: { id: string | number }) => {
  const navigation = useSmartNavigation();

  const { data } = useQuery({
    queryKey: ["flash-sale-product-detail", id],
    queryFn: () => flashSaleService.getFlashItemDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      return {
        upsellIds: data?.flashSaleProduct?.upsellIds,
        shopId: data?.flashSaleProduct?.shop?.id,
      };
    },
  });

  const { data: topProducts } = useQuery({
    queryKey: ["topProducts", ...(data?.upsellIds || [])],
    queryFn: () =>
      productService.searchProducts({
        ids: data?.upsellIds?.join(","),
        take: 30,
      }),
    enabled: !!data?.upsellIds && data?.upsellIds.length > 0,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });

  if (!topProducts || topProducts?.length === 0) {
    return null;
  }

  const handlePressAllProduct = () => {
    if (!data?.shopId) return;

    navigation.navigate("Shop", {
      id: String(data?.shopId),
      tabIndex: 2,
    });
  };

  return (
    <View className="bg-white px-[10] py-[20]">
      <View className="flex-row justify-between items-center mb-[10]">
        <Text className="text-[18px] font-bold text-neutral-800">
          Top sản phẩm nổi bật
        </Text>
        <TouchableOpacity
          onPress={handlePressAllProduct}
          className="flex-row items-center"
          activeOpacity={0.7}
        >
          <Text className="mr-1 text-base text-primary-600">Xem tất cả</Text>
          <Image
            source={imagePaths.icArrowRight}
            style={{ width: 16, height: 16 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6 }}
        data={topProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem
            name={item.name}
            price={item.salePrice}
            originalPrice={item.regularPrice}
            discount={calculateDiscount(item)}
            soldCount={item.totalSales}
            rating={item.averageRating}
            location={item.shop?.shopWarehouseLocation?.province?.name}
            id={item.id}
            image={item.thumbnail}
            className="flex-1"
            onSale={calculateOnSale(item)}
          />
        )}
      />
    </View>
  );
};

export default React.memo(TopProduct, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
