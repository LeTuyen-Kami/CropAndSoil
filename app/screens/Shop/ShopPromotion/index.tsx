import { FlatList, View } from "react-native";
import { useState } from "react";
import ShopPromotionItem from "./Item";
const ShopPromotion = () => {
  const [data, setData] = useState<any[]>([...Array(10)]);

  return (
    <View className="bg-white rounded-xl">
      <FlatList
        data={data}
        renderItem={() => <ShopPromotionItem />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-2 py-4"
        ItemSeparatorComponent={() => <View className="w-2" />}
      />
    </View>
  );
};

export default ShopPromotion;
