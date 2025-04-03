import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import ProductItem from "~/components/common/ProductItem";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { screen } from "~/utils";

const MaybeLike = () => {
  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center px-4">
        <View className="flex-1 h-[1px] bg-[#CCC]" />
        <Text className="px-4 text-sm leading-tight text-[#676767]">
          Có thể bạn cũng thích
        </Text>
        <View className="flex-1 h-[1px] bg-[#CCC]" />
      </View>
      <View className="px-2 py-3">
        <FlashList
          contentContainerStyle={{}}
          data={[...Array(10)]}
          ItemSeparatorComponent={() => <View className="h-2" />}
          numColumns={2}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <ProductItem
              className={index % 2 === 0 ? "mr-1" : "ml-1"}
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
            />
          )}
        />
      </View>
    </View>
  );
};

export default MaybeLike;
