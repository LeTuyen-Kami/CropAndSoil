import { FlashList } from "@shopify/flash-list";
import { deepEqual } from "fast-equals";
import React from "react";
import { View } from "react-native";
import ProductItem from "~/components/common/ProductItem";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { screen } from "~/utils";

const MaybeLike = ({ id }: { id: string | number }) => {
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
        {[...Array(10)].map((_, index) => (
          <View key={index}>
            <ProductItem
              width={(screen.width - 24) / 2}
              name={
                "Voluptate irure in laboris sit sunt pariatur. Sit  Voluptate irure in 123 "
              }
              price={100000}
              originalPrice={150000}
              discount={20}
              soldCount={100}
              totalCount={1000}
              rating={4.5}
              location={"Hà Nội"}
              id={"123"}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default React.memo(MaybeLike, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
