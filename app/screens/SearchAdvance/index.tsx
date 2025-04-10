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
import { screen } from "~/utils";
import Category from "../Home/Category";
import ContainerList from "../Home/ContainerList";
import Filter from "./Filter";
import useDisclosure from "~/hooks/useDisclosure";
const SearchAdvance = () => {
  const { top } = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RootStackRouteProp<"SearchAdvance">>();
  const { searchText } = route.params;
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    <View className="flex-1">
      <GradientBackground
        gradientStyle={{
          paddingTop: top,
          paddingBottom: 20,
        }}
      >
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
              className={cn(
                "text-sm text-[#AEAEAE]",
                searchText && "text-black"
              )}
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
      </GradientBackground>
      <GradientBackground
        start={{ x: 0, y: 0 }}
        style={{
          flex: 1,
        }}
        gradientStyle={{
          flex: 1,
        }}
        end={{ x: 1, y: 0 }}
      >
        <ScrollView className="flex-1">
          <View className="px-2 py-4 mx-2 rounded-2xl bg-white/20">
            <Text className="text-lg font-bold text-white uppercase">
              Khám phá theo danh mục
            </Text>
            <View className="mt-4">
              <Category
                data={[
                  {
                    title: "Tất cả",
                    image: "https://placehold.co/100x100",
                  },
                  {
                    title: "Đất sạch & giá thể",
                    image: "https://placehold.co/100x100",
                  },
                  {
                    title: "Các loại phân bón",
                    image: "https://placehold.co/100x100",
                  },
                  {
                    title: "Các loại hạt giống",
                    image: "https://placehold.co/100x100",
                  },
                  {
                    title: "Vật tư trồng hoa",
                    image: "https://placehold.co/100x100",
                  },
                ]}
              />
            </View>
          </View>
          <View className="relative mt-10">
            <View className="mx-2 top-[-15] absolute left-0 right-0 h-[76] rounded-[40] bg-secondary-50 opacity-20" />
            <ContainerList
              bgColor="bg-primary-100"
              title="Flash Sale"
              icon={
                <Image
                  source={imagePaths.flashSale}
                  style={{ width: 40, height: 40 }}
                />
              }
            >
              <View className="flex flex-row flex-wrap gap-2">
                {[...Array(20)].map((_, index) => (
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
            </ContainerList>
          </View>
        </ScrollView>
      </GradientBackground>
      <Filter isOpen={isOpen} onClose={onClose} />
    </View>
  );
};

export default SearchAdvance;
