import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { shopService } from "~/services/api/shop.service";
import { onlineStatus } from "~/utils";
import useGetShopId from "./useGetShopId";

const ShopInfoSkeleton = () => {
  return (
    <View className="w-full">
      {/* Shop intro skeleton */}
      <View className="flex-row justify-between items-center px-2">
        <View className="size-[60px] rounded-full bg-gray-400/20 animate-pulse" />

        <View className="flex-1 ml-2.5 justify-center gap-2">
          <View className="w-28 h-5 rounded-md animate-pulse bg-gray-400/20" />
          <View className="w-20 h-3 rounded-md animate-pulse bg-gray-400/20" />
          <View className="flex-row gap-3 items-center mt-1">
            <View className="w-12 h-3 rounded-md animate-pulse bg-gray-400/20" />
            <View className="w-[1px] h-3.5 bg-gray-400/20" />
            <View className="w-24 h-3 rounded-md animate-pulse bg-gray-400/20" />
          </View>
        </View>
      </View>

      {/* Action buttons skeleton */}
      <View className="flex-row justify-between items-center px-2 py-4 gap-1.5">
        <View className="flex-1 h-10 rounded-lg animate-pulse bg-gray-400/20" />
        <View className="flex-1 h-10 rounded-lg animate-pulse bg-gray-400/20" />
        <View className="w-10 h-10 rounded-lg animate-pulse bg-gray-400/20" />
      </View>
    </View>
  );
};

const ShopInfo = () => {
  const shopId = useGetShopId();
  const { data: shopDetail, isLoading } = useQuery({
    queryKey: ["shopDetail", shopId],
    queryFn: () => shopService.getShopDetail(shopId!),
    enabled: !!shopId,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return <ShopInfoSkeleton />;
  }

  return (
    <View className="w-full">
      {/* Shop intro section */}
      <View className="flex-row justify-between items-center px-2">
        <Image
          source={{ uri: shopDetail?.shopLogoUrl }}
          className="size-[60px] rounded-full border border-gray-100"
          contentFit="cover"
        />

        <View className="flex-1 ml-2.5 justify-center gap-0.5">
          <View className="flex-row gap-2 items-center">
            <Text className="text-base font-medium text-white">
              {shopDetail?.shopName}
            </Text>
            <Image
              source={imagePaths.icRightArrow}
              className="size-[12px]"
              style={{ tintColor: "white" }}
              contentFit="contain"
            />
          </View>

          <Text className="text-[10px] tracking-wide text-white">
            {onlineStatus(shopDetail?.lastOnlineAt)}
          </Text>

          <View className="flex-row items-center gap-3 mt-0.5">
            <View className="flex-row items-center gap-1.5">
              <AntDesign name="star" size={14} color="#FCBA27" />
              <Text className="text-xs tracking-wide text-white">
                {shopDetail?.shopRating}
              </Text>
            </View>

            <View className="w-[1px] h-3.5 bg-white" />

            <Text className="text-xs tracking-wide text-white">
              {shopDetail?.totalFollowers} Người theo dõi
            </Text>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      {/* <View className="flex-row justify-between items-center px-2 py-4 gap-1.5">
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
      </View> */}

      <View className="h-10" />
    </View>
  );
};

export default ShopInfo;
