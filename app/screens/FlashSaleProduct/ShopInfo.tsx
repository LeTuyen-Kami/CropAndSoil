import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { deepEqual } from "fast-equals";
import { cssInterop } from "nativewind";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { toast } from "~/components/common/Toast";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { flashSaleService } from "~/services/api/flashsale.service";
import { getTimeAgo, onlineStatus } from "~/utils";

cssInterop(Image, {
  className: "style",
});

const ShopInfoSkeleton = () => {
  return (
    <View className="py-5 mt-4 bg-white rounded-t-3xl border-b-2 border-gray-100">
      <View className="px-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-row gap-2">
            <View>
              <View className="size-[60px] rounded-full bg-gray-400/20 animate-pulse" />
            </View>
            <View className="gap-1">
              <View className="w-28 h-4 rounded-md animate-pulse bg-gray-400/20" />
              <View className="w-20 h-3 rounded-md animate-pulse bg-gray-400/20" />
              <View className="flex-row gap-1 items-center">
                <View className="w-3 h-3 rounded-full animate-pulse bg-gray-400/20" />
                <View className="w-24 h-3 rounded-md animate-pulse bg-gray-400/20" />
              </View>
            </View>
          </View>
          <View className="w-6 h-6 rounded-full animate-pulse bg-gray-400/20" />
        </View>
      </View>
      <View className="items-center mt-3 px-2.5">
        <View className="bg-[#F5F5F5] rounded-xl p-2 flex-row items-center">
          <View className="items-center flex-1 border-r border-[#E3E3E3]">
            <View className="mb-1 w-16 h-3 rounded-md animate-pulse bg-gray-400/20" />
            <View className="w-12 h-3 rounded-md animate-pulse bg-gray-400/20" />
          </View>
          <View className="items-center flex-1 border-r border-[#E3E3E3]">
            <View className="mb-1 w-16 h-3 rounded-md animate-pulse bg-gray-400/20" />
            <View className="w-12 h-3 rounded-md animate-pulse bg-gray-400/20" />
          </View>
          <View className="items-center flex-1 border-r border-[#E3E3E3]">
            <View className="mb-1 w-16 h-3 rounded-md animate-pulse bg-gray-400/20" />
            <View className="w-12 h-3 rounded-md animate-pulse bg-gray-400/20" />
          </View>
          <View className="flex-1 items-center">
            <View className="mb-1 w-16 h-3 rounded-md animate-pulse bg-gray-400/20" />
            <View className="w-12 h-3 rounded-md animate-pulse bg-gray-400/20" />
          </View>
        </View>
      </View>

      <View className="flex-row justify-center gap-1.5 mt-3 mx-4">
        <View className="bg-gray-400/20 rounded-full px-4 py-2.5 items-center flex-1 animate-pulse" />
        <View className="bg-gray-400/20 rounded-full px-4 py-2.5 items-center flex-1 animate-pulse" />
      </View>
    </View>
  );
};

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

  const { data: shopDetail, isLoading } = useQuery({
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

  if (isLoading) {
    return <ShopInfoSkeleton />;
  }

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
