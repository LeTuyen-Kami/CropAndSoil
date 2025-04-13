import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";

interface ItemProps {
  title: string;
  image: string;
  count: number;
}

const Item = ({ title, image, count }: ItemProps) => {
  return (
    <TouchableOpacity className="flex-row gap-2 items-center px-2 py-3 bg-white">
      <Image
        className="size-[46px] rounded-lg"
        source={image}
        contentFit="contain"
      />
      <View className="flex-1 justify-center">
        <Text className="text-lg leading-7">{title}</Text>
        <Text className="text-xs text-gray-500">{count} sản phẩm</Text>
      </View>
      <Image
        source={imagePaths.icArrowRight}
        className="size-6"
        style={{ tintColor: "#ccc" }}
        contentFit="contain"
      />
    </TouchableOpacity>
  );
};

const ShopCategory = () => {
  return (
    <FlashList
      showsVerticalScrollIndicator={false}
      data={[...Array(10)]}
      renderItem={({ item }) => (
        <Item
          title="Phân bón Phú Mỹ"
          image="https://picsum.photos/200/200"
          count={3}
        />
      )}
      estimatedItemSize={200}
      ItemSeparatorComponent={() => <View className="h-[1px] bg-transparent" />}
      ListFooterComponent={() => <View className="h-[100px]" />}
    />
  );
};

export default ShopCategory;
