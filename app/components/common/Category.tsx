import { Image } from "expo-image";
import {
  ActivityIndicator,
  Button,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "~/components/ui/text";
import { usePagination } from "~/hooks/usePagination";
import { categoryService } from "~/services/api/category.service";

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
            contentFit="contain"
          />
        </View>
        <Text className="text-center text-white" numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Category = () => {
  const { data, fetchNextPage, hasNextPage } = usePagination(
    categoryService.getCategories,
    {
      queryKey: ["categories"],
      initialPagination: { skip: 0, take: 10 },
    }
  );

  if (!data) return null;

  return (
    <View className="min-h-[90px]">
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Item title={item.name} image={item.thumbnail} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="w-3" />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          hasNextPage ? (
            <View className="justify-center items-center h-[60px] w-[40px]">
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Category;
