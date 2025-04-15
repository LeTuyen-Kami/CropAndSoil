import { useNavigation } from "@react-navigation/native";
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
import { cn } from "~/lib/utils";
import { RootStackScreenProps } from "~/navigation/types";
import { categoryService, ICategory } from "~/services/api/category.service";
import { PaginatedResponse, PaginationRequests } from "~/types";

interface ItemProps {
  title: string;
  image: string;
  itemBgColor?: string;
  textColor?: string;
  onPress: () => void;
}

const Item = ({ title, image, itemBgColor, textColor, onPress }: ItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="w-[71] flex-col gap-2 items-center">
        <View
          className={`flex justify-center items-center p-3 rounded-full size-[60]`}
          style={{ backgroundColor: itemBgColor }}
        >
          <Image
            source={image}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
          />
        </View>
        <Text
          className="text-center"
          style={{ color: textColor }}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

interface CategoryProps {
  getCategoriesApi?: (
    payload: PaginationRequests
  ) => Promise<PaginatedResponse<ICategory>>;
  queryKey?: string[];
  itemBgColor?: string;
  textColor?: string;
  className?: string;
}

const Category = ({
  getCategoriesApi = categoryService.getCategories,
  queryKey = ["categories"],
  itemBgColor = "rgba(0,0,0,0.25)",
  textColor = "white",
  className,
}: CategoryProps) => {
  const navigation = useNavigation<RootStackScreenProps<"MainTabs">>();

  const { data, fetchNextPage, hasNextPage } = usePagination(getCategoriesApi, {
    queryKey: queryKey,
    initialPagination: { skip: 0, take: 10 },
  });

  const handlePressCategory = (category: ICategory) => {
    navigation.navigate("SearchAdvance", {
      searchText: category.name,
    });
  };

  return (
    <View className={cn("min-h-[90px]", className)}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Item
            title={item.name}
            image={item.thumbnail}
            itemBgColor={itemBgColor}
            textColor={textColor}
            onPress={() => handlePressCategory(item)}
          />
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
