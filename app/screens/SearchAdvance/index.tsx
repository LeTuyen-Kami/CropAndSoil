import {
  CommonActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import GradientBackground from "~/components/common/GradientBackground";
import ProductItem from "~/components/common/ProductItem";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { RootStackParamList, RootStackRouteProp } from "~/navigation/types";
import { chunkArray, preHandleFlashListData, screen } from "~/utils";
import ContainerList from "../Home/ContainerList";
import Filter from "./Filter";
import useDisclosure from "~/hooks/useDisclosure";
import Category from "~/components/common/Category";
import { usePagination } from "~/hooks/usePagination";
import { searchService } from "~/services/api/search.services";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { FontAwesome5 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";

const ExploreCategory = () => {
  return (
    <View className="px-2 py-4 mx-2 rounded-2xl bg-white/20">
      <Text className="text-lg font-bold text-white uppercase">
        Khám phá theo danh mục
      </Text>
      <View className="mt-4">
        <Category />
      </View>
    </View>
  );
};

const Header = ({
  isOpen,
  onOpen,
  searchText,
}: {
  isOpen: boolean;
  onOpen: () => void;
  searchText: string;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<"SearchAdvance">>();

  const onPressSearch = () => {
    navigation.dispatch((state) => {
      // Remove all the screens after `Profile`
      const index = state.routes.findIndex((r) => r.name === "Search");
      const routes = state.routes.slice(0, index + 1);

      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
  };

  return (
    <View className="flex-row gap-4 items-center px-2">
      <TouchableOpacity
        onPress={navigation.goBack}
        className="px-2 py-1"
        hitSlop={20}
      >
        <Image
          source={imagePaths.icArrowLeft}
          className="w-2 h-4"
          contentFit="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPressSearch}
        className="flex-row flex-1 justify-between items-center px-5 h-12 bg-white rounded-full"
      >
        <Text
          className={cn("text-sm text-[#AEAEAE]", searchText && "text-black")}
        >
          {searchText || "Tìm kiếm sản phẩm cửa hàng"}
        </Text>
        <Image
          source={imagePaths.icMagnifier}
          className="size-5"
          contentFit="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onOpen}
        className="h-12 rounded-full aspect-square bg-[#39CA71] justify-center items-center"
        hitSlop={20}
      >
        <Image
          source={imagePaths.icFilter}
          className="size-6"
          contentFit="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const ContainerHeader = () => {
  return (
    <View className="relative bg-[#EEE] px-2 py-4 rounded-t-[40px] mt-[30px]">
      <View className="mx-2 top-[-12px] absolute left-0 right-0 h-[76] rounded-[40] bg-secondary-50 opacity-20" />

      <View className="flex-row gap-2 items-center px-2 mb-4 w-full">
        <Text className="text-xl font-bold text-black uppercase">
          Tất cả sản phẩm
        </Text>
        <TouchableOpacity className="flex-row gap-2 items-center px-4 py-2 ml-auto bg-white rounded-full">
          <Text className="text-sm font-medium leading-tight text-[#676767]">
            Sắp xếp
          </Text>
          <FontAwesome5 name="sort-amount-down-alt" size={16} color="#676767" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TwoProductItem = ({ items }: { items: any[] }) => {
  return (
    <View className="flex-row gap-2 px-2 bg-[#EEE] pb-2">
      {items.map((item, index) => (
        <ProductItem
          width={(screen.width - 24) / 2}
          key={index}
          name={`Voluptate irure in laboris sit sunt pariatur. Sit  Voluptate irure in 123  ${index}`}
          price={100000}
          originalPrice={150000}
          discount={20}
          rating={4.5}
          soldCount={100}
          location={"Hà Nội"}
        />
      ))}
    </View>
  );
};

const categoryData = [
  {
    id: "category",
    type: "category",
  },
];

const containerHeaderData = [
  {
    id: "containerHeader",
    type: "containerHeader",
  },
];

const SearchAdvance = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<"SearchAdvance">>();
  const { searchText } = route.params;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [flashListData, setFlashListData] = useState<any[]>([]);

  const { data, hasNextPage, fetchNextPage } = usePagination(
    searchService.searchProducts,
    {
      initialPagination: {
        skip: 0,
        take: 10,
      },
      queryKey: ["search-products", searchText],
      initialParams: {
        search: searchText,
      },
    }
  );

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "category") {
      return <ExploreCategory />;
    }

    if (item.type === "containerHeader") {
      return <ContainerHeader />;
    }

    return <TwoProductItem items={item.items} />;
  };

  useEffect(() => {
    const tempData = preHandleFlashListData(
      [...Array(100)]?.map((_, index) => ({
        type: "product",
        id: index,
      }))
    );

    setFlashListData([...categoryData, ...containerHeaderData, ...tempData]);
  }, []);

  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header isOpen={isOpen} onOpen={onOpen} searchText={searchText} />
      <View className="flex-1">
        <FlashList
          className="mt-4"
          data={flashListData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={302}
          getItemType={(item) => item.type}
        />
      </View>
      <Filter isOpen={isOpen} onClose={onClose} />
    </ScreenWrapper>
  );
};

export default SearchAdvance;
