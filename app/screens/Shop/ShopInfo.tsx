import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { imagePaths } from "~/assets/imagePath";

const ShopInfo = () => {
  return (
    <View className="w-full">
      {/* Shop intro section */}
      <View className="flex-row justify-between items-center px-2">
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          className="size-[60px] rounded-full"
          contentFit="cover"
        />

        <View className="flex-1 ml-2.5 justify-center gap-0.5">
          <View className="flex-row gap-2 items-center">
            <Text className="text-base font-medium text-white">
              Siêu thị làm vườn Greenhome
            </Text>
            <Image
              source={imagePaths.icRightArrow}
              className="size-[12px]"
              style={{ tintColor: "white" }}
              contentFit="contain"
            />
          </View>

          <Text className="text-[10px] tracking-wide text-white">
            Online 10 phút trước
          </Text>

          <View className="flex-row items-center gap-3 mt-0.5">
            <View className="flex-row items-center gap-1.5">
              <AntDesign name="star" size={14} color="#FCBA27" />
              <Text className="text-xs tracking-wide text-white">4.9/5.0</Text>
            </View>

            <View className="w-[1px] h-3.5 bg-white" />

            <Text className="text-xs tracking-wide text-white">
              2,6k Người theo dõi
            </Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View className="flex-row justify-between items-center px-2 py-4 gap-1.5">
        <TouchableOpacity className="h-10 rounded-lg justify-center items-center bg-[#FCBA27] flex-1 px-4">
          <View className="flex-row justify-center items-center gap-1.5">
            <Image
              source={imagePaths.icUserPlus}
              className="size-5"
              contentFit="contain"
              style={{ tintColor: "white" }}
            />
            <Text className="text-sm font-medium text-center text-white">
              Theo dõi
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 justify-center items-center px-4 h-10 rounded-lg border border-white">
          <View className="flex-row justify-center items-center gap-1.5">
            <Image
              source={imagePaths.icMessages}
              className="size-5"
              contentFit="contain"
              style={{ tintColor: "white" }}
            />
            <Text className="text-sm font-medium text-center text-white">
              Chat
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="justify-center items-center w-10 h-10 rounded-lg border border-white">
          <Image
            source={imagePaths.icPhone3}
            className="size-5"
            contentFit="contain"
            style={{ tintColor: "white" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShopInfo;
