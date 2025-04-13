import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import Background from "./Background";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Input } from "~/components/ui/input";
import ShopInfo from "./ShopInfo";
import Tabs from "./Tabs";
import { useQuery } from "@tanstack/react-query";
import { shopService } from "~/services/api/shop.service";
import { RootStackRouteProp } from "~/navigation/types";
import { useRoute } from "@react-navigation/native";

const Shop = () => {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RootStackRouteProp<"Shop">>();
  const { id } = route.params;

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
          <Input
            placeholder="Tìm kiếm"
            className="flex-1 border-0 bg-white/20"
            placeholderTextColor="white"
            textInputClassName="text-sm leading-4 text-white"
            rightIcon={
              <Image
                source={imagePaths.icMagnifier}
                className="size-5"
                style={{ tintColor: "white" }}
              />
            }
          />
          <TouchableOpacity hitSlop={20} onPress={() => navigation.goBack()}>
            <Image source={imagePaths.icThreeDot} className="size-[50px]" />
          </TouchableOpacity>
        </View>
        <ShopInfo id={id} />
      </View>
      <Tabs />
    </View>
  );
};

export default Shop;
