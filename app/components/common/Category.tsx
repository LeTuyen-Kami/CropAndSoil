import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  Button,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { imagePaths } from "~/assets/imagePath";
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
          className={`flex overflow-hidden justify-center items-center rounded-full size-[60]`}
          style={{ backgroundColor: itemBgColor }}
        >
          <Image
            source={image}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            placeholder={imagePaths.placeholder}
            placeholderContentFit="cover"
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

const CategoryItemSkeleton = () => {
  return (
    <View className="w-[71] flex-col gap-2 items-center">
      <View className="rounded-full size-[60] animate-pulse bg-gray-400/20" />
      <View className="w-16 h-3 rounded-md animate-pulse bg-gray-400/20" />
      <View className="w-14 h-3 rounded-md animate-pulse bg-gray-400/20" />
    </View>
  );
};

const CategorySkeleton = () => {
  return (
    <View className="flex-row">
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} className="mx-1.5">
          <CategoryItemSkeleton />
        </View>
      ))}
    </View>
  );
};

interface PureCategoryProps {
  data: ICategory[];
  itemBgColor?: string;
  textColor?: string;
  className?: string;
  onPress: (category: ICategory) => void;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isLoading?: boolean;
}

export const PureCategory = ({
  data,
  itemBgColor,
  textColor,
  className,
  onPress,
  hasNextPage,
  fetchNextPage,
  isLoading,
}: PureCategoryProps) => {
  if (isLoading) {
    return (
      <View className={cn("py-1 min-h-[90px]", className)}>
        <CategorySkeleton />
      </View>
    );
  }

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
            onPress={() => onPress(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="w-3" />}
        onEndReached={fetchNextPage || undefined}
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

interface CategoryProps {
  getCategoriesApi?: (
    payload: PaginationRequests
  ) => Promise<PaginatedResponse<ICategory>>;
  queryKey?: string[];
  itemBgColor?: string;
  textColor?: string;
  className?: string;
  onPress?: (category: ICategory) => void;
}

const Category = ({
  getCategoriesApi = categoryService.getCategories,
  queryKey = ["categories"],
  itemBgColor = "rgba(0,0,0,0.25)",
  textColor = "white",
  className,
  onPress,
}: CategoryProps) => {
  const navigation = useNavigation<RootStackScreenProps<"MainTabs">>();

  const { data, fetchNextPage, hasNextPage, isLoading } = usePagination(
    getCategoriesApi,
    {
      queryKey: queryKey,
      initialPagination: { skip: 0, take: 10 },
      staleTime: 5000,
    }
  );

  const handlePressCategory = (category: ICategory) => {
    if (onPress) {
      onPress(category);
    } else {
      navigation.navigate("SearchAdvance", {
        categoryId: category.id.toString(),
        categoryName: category.name,
      });
    }
  };

  return (
    <PureCategory
      data={data}
      itemBgColor={itemBgColor}
      textColor={textColor}
      onPress={handlePressCategory}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
      className={className}
    />
  );
};

export default Category;
