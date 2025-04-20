import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { shopService } from "~/services/api/shop.service";
import { activeIndexAtom } from "./atom";
import useGetShopId from "./useGetShopId";

const Background = () => {
  const activeIndex = useAtomValue(activeIndexAtom);

  const shopId = useGetShopId();

  const { data: shopDetail } = useQuery({
    queryKey: ["shopDetail", shopId],
    queryFn: () => shopService.getShopDetail(shopId!),
    enabled: !!shopId,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.shopCoverUrl,
  });

  const colors = useMemo(() => {
    if (activeIndex !== 1) {
      return ["#07692D", "#159747CC"];
    }
    return ["#F09D0F", "#F09D0F"];
  }, [activeIndex]) as [string, string];

  return (
    <View className="absolute top-0 right-0 bottom-0 left-0">
      <Image
        source={{ uri: shopDetail }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
        contentFit="cover"
      />
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default Background;
