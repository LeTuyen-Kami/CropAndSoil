import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { deepEqual } from "fast-equals";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import ProductItem from "~/components/common/ProductItem";
import { Text } from "~/components/ui/text";
import { productService } from "~/services/api/product.service";

const TopProduct = ({ id }: { id: string | number }) => {
  const { data: productDetail } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => productService.getProductDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <View className="bg-white px-[10] py-[20]">
      <View className="flex-row justify-between items-center mb-[10]">
        <Text className="text-[18px] font-bold text-neutral-800">
          Top sản phẩm nổi bật
        </Text>
        <TouchableOpacity className="flex-row items-center" activeOpacity={0.7}>
          <Text className="mr-1 text-base text-primary-600">Xem tất cả</Text>
          <Image
            source={imagePaths.icArrowRight}
            style={{ width: 16, height: 16 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6 }}
      >
        <View className="flex-row gap-2">
          {productDetail?.variations?.map((product) => (
            <ProductItem
              className="flex-1"
              key={product.id}
              name={product.name}
              price={product.salePrice}
              originalPrice={product.regularPrice}
              image={product.thumbnail}
              width={150}
              id={product.id}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default React.memo(TopProduct, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
