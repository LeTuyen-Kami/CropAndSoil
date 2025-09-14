import { useQuery } from "@tanstack/react-query";
import { deepEqual } from "fast-equals";
import { useAtomValue } from "jotai";
import React from "react";
import { View } from "react-native";
import ProductItem from "~/components/common/ProductItem";
import { Text } from "~/components/ui/text";
import { productService } from "~/services/api/product.service";
import { authAtom } from "~/store/atoms";
import { calculateDiscount, calculateOnSale, screen } from "~/utils";

const MaybeLike = ({ id }: { id: string | number }) => {
  const auth = useAtomValue(authAtom);
  const { data: recommendedProduct } = useQuery({
    queryKey: ["recommended-product"],
    queryFn: () => productService.getRecommendedProducts(),
    enabled: !!auth?.isLoggedIn,
  });

  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center px-4">
        <View className="flex-1 h-[1px] bg-[#CCC]" />
        <Text className="px-4 text-sm leading-tight text-[#676767]">
          Có thể bạn cũng thích
        </Text>
        <View className="flex-1 h-[1px] bg-[#CCC]" />
      </View>
      <View className="flex-row flex-wrap gap-2 px-2 py-3">
        {recommendedProduct?.map((item, index) => (
          <ProductItem
            detailProduct={item}
            width={(screen.width - 24) / 2}
            key={item.id}
            name={item.name}
            price={item.salePrice}
            originalPrice={item.regularPrice}
            discount={calculateDiscount(item)}
            rating={item.averageRating}
            soldCount={item.totalSales}
            location={item.shop?.shopWarehouseLocation?.province?.name}
            id={item.id}
            image={item.thumbnail}
            onSale={calculateOnSale(item)}
            className="flex-grow"
          />
        ))}
      </View>
    </View>
  );
};

export default React.memo(MaybeLike, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
