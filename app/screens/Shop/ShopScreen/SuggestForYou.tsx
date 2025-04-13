import { FlatList, View } from "react-native";
import { Text } from "~/components/ui/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import ProductItem from "~/components/common/ProductItem";

const SuggestForYou = () => {
  return (
    <View className="bg-white rounded-xl">
      <View className="flex-row justify-between items-center px-2 py-3">
        <Text className="text-sm font-medium">Gợi ý cho bạn</Text>
        <View className="flex-row gap-1 items-center">
          <Text className="text-xs text-[#AEAEAE]">Xem tất cả</Text>
          <Image
            source={imagePaths.icArrowRight}
            className="w-4 h-4"
            style={{
              tintColor: "#AEAEAE",
            }}
            contentFit="contain"
          />
        </View>
      </View>
      <FlatList
        data={[...Array(10)]}
        renderItem={() => (
          <ProductItem
            name={"Sản phẩm 1"}
            price={100000}
            originalPrice={120000}
            soldCount={100}
            rating={4.5}
            location="Hà Nội"
            id={"123"}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-2 py-3"
        ItemSeparatorComponent={() => <View className="w-2" />}
      />
    </View>
  );
};

export default SuggestForYou;
