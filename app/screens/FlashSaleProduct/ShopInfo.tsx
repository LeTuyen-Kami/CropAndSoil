import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { cssInterop } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { deepEqual } from "fast-equals";
import React from "react";
import { productService } from "~/services/api/product.service";
import { useQuery } from "@tanstack/react-query";
import { shopService } from "~/services/api/shop.service";
import dayjs from "dayjs";
import { getTimeAgo, onlineStatus } from "~/utils";
import { toast } from "~/components/common/Toast";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { flashSaleService } from "~/services/api/flashsale.service";

cssInterop(Image, {
  className: "style",
});

const IsOfficialBadge = () => {
  return (
    <LinearGradient
      colors={["#F6C33E", "#159747"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="absolute bottom-0 left-1 right-1 rounded-lg p-0.5 border border-white"
    >
      <View className="flex-row items-center justify-center gap-[2px]">
        <Image
          source={imagePaths.officialBadgeIcon}
          className="size-[6px]"
          contentFit="contain"
        />
        <Image
          source={imagePaths.icOfficial}
          className="h-[4px] w-[27px]"
          contentFit="contain"
        />
      </View>
    </LinearGradient>
  );
};

const ShopInfo = ({ id }: { id: string | number }) => {
  const navigation = useSmartNavigation();

  const { data: shopDetail } = useQuery({
    queryKey: ["flash-sale-product-detail", id],
    queryFn: () => flashSaleService.getFlashItemDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.flashSaleProduct?.shop,
  });

  const handleOpenShop = () => {
    if (!shopDetail || !shopDetail.id) {
      toast.error("Hiện chưa có thông tin shop");
      return;
    }

    navigation.smartNavigate("Shop", { id: shopDetail?.id || "" });
  };

  return (
    <View className="py-5 mt-4 bg-white rounded-t-3xl border-b-2 border-gray-100">
      <View className="px-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-row gap-2">
            <View>
              <Image
                source={{ uri: shopDetail?.shopLogoUrl }}
                className="size-[60px] rounded-full"
              />
              {shopDetail?.isOfficial && <IsOfficialBadge />}
            </View>
            <View className="gap-1">
              <Text className="text-[#383B45] text-sm font-medium">
                {shopDetail?.shopName}
              </Text>
              <Text className="text-[#AEAEAE] text-xs">
                {onlineStatus(shopDetail?.lastOnlineAt)}
              </Text>
              <View className="flex-row gap-1 items-center">
                <Image source={imagePaths.icLocation} className="w-3 h-3" />
                <Text className="text-[#383B45] text-xs">
                  {shopDetail?.shopWarehouseLocation?.province?.name}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <Image
              source={imagePaths.icMessages}
              className="w-6 h-6"
              style={{
                tintColor: "#AEAEAE",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="items-center mt-3 px-2.5">
        <View className="bg-[#F5F5F5] rounded-xl p-2 flex-row items-center">
          <View className="items-center flex-1 border-r border-[#E3E3E3]">
            <Text className="text-[#383B45] text-xs font-medium">
              {getTimeAgo(shopDetail?.createdAt)}
            </Text>
            <Text className="text-[#676767] text-xs">Tham gia</Text>
          </View>
          <View className="items-center flex-1 border-r border-[#E3E3E3]">
            <Text className="text-[#383B45] text-xs font-medium">
              {(shopDetail?.totalProducts || 0).toLocaleString()}
            </Text>
            <Text className="text-[#676767] text-xs">Sản phẩm</Text>
          </View>
          <View className="items-center flex-1 border-r border-[#E3E3E3]">
            <Text className="text-[#383B45] text-xs font-medium">
              {shopDetail?.replyRate}
            </Text>
            <Text className="text-[#676767] text-xs">Tỉ lệ phản hồi</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-[#383B45] text-xs font-medium">
              {shopDetail?.replyIn}
            </Text>
            <Text className="text-[#676767] text-xs">Giờ phản hồi</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-center gap-1.5 mt-3 mx-4">
        <TouchableOpacity
          className="bg-[#159747] rounded-full px-4 py-2.5 items-center flex-1"
          onPress={handleOpenShop}
        >
          <Text className="text-sm font-medium text-white">Xem shop</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#DEF1E5] border border-[#BEE2CC] rounded-full px-4 py-2.5 items-center flex-1">
          <Text className="text-[#159747] text-sm font-medium">Liên hệ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(ShopInfo, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
