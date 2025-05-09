import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import { Input } from "~/components/ui/input";
import Background from "./Background";
import ShopInfo from "./ShopInfo";
import Tabs from "./Tabs";
import { Text } from "~/components/ui/text";
import useGetShopId from "./useGetShopId";
const Shop = () => {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const shopId = useGetShopId();

  return (
    <View className="flex-1 bg-green-300">
      <View className="pb-14">
        <Background />
        <View
          className="flex-row gap-4 justify-between items-center px-2 py-3 pb-4"
          style={{ paddingTop: top }}
        >
          <TouchableOpacity
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 40,
            }}
            onPress={() => navigation.goBack()}
            className="px-2 w-8"
          >
            <Image
              source={imagePaths.icBack}
              style={{ width: 7.5, height: 15, tintColor: "white" }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row flex-1 items-center px-5 rounded-full bg-white/20"
            onPress={() =>
              navigation.navigate("Search", {
                shopId: (shopId || "")?.toString(),
              })
            }
          >
            <View className="flex-1 py-4">
              <Text className="text-sm leading-4 text-white opacity-70">
                Tìm kiếm
              </Text>
            </View>
            <View className="ml-2">
              <Image
                source={imagePaths.icMagnifier}
                className="size-5"
                style={{ tintColor: "white" }}
              />
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity hitSlop={20} onPress={() => navigation.goBack()}>
            <Image source={imagePaths.icThreeDot} className="size-[50px]" />
          </TouchableOpacity> */}
        </View>
        <ShopInfo />
      </View>
      <Tabs />
    </View>
  );
};

export default Shop;
