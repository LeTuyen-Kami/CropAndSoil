import { Image } from "expo-image";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";

interface ItemProps {
  title: string;
  image: string;
}

interface CategoryProps {
  data: ItemProps[];
}

const Item = ({ title, image }: ItemProps) => {
  return (
    <TouchableOpacity>
      <View className="w-[71] flex-col gap-2 items-center">
        <View className="size-[60] rounded-full bg-[rgba(0,0,0,0.25)] flex items-center justify-center p-3">
          <Image
            source={image}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>
        <Text className="text-white text-center">{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Category = ({ data }: CategoryProps) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Item title={item.title} image={item.image} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="w-3" />}
    />
  );
};

export default Category;
