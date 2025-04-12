import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { authAtom } from "~/store/atoms";

const HeaderSearch = () => {
  const navigation = useNavigation();
  const auth = useAtomValue(authAtom);

  return (
    <React.Fragment>
      <View className="px-3 py-4">
        <Text className="text-white">
          <Text className="font-bold">
            Hello {auth?.user?.name || auth?.user?.phone},{" "}
          </Text>
          Hôm nay bạn cần tìm gì ?
        </Text>
      </View>
      <View className="flex-row gap-[10] px-2">
        <TouchableOpacity
          onPress={() => navigation.navigate("Search")}
          className="flex-row flex-1 gap-2 justify-between items-center px-4 py-2 bg-white rounded-full"
        >
          <Text className="text-sm text-zinc-400">
            Tìm kiếm sản phẩm, cửa hàng
          </Text>
          <Image
            source={imagePaths.icSearch}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <View className="bg-secondary-500 size-[50] flex items-center justify-center rounded-full">
            <Image
              source={imagePaths.icCart}
              style={{ width: 24, height: 24 }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );
};

export default HeaderSearch;
