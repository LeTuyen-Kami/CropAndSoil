import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { deepEqual } from "fast-equals";
import { useAtomValue } from "jotai";
import React from "react";
import { DimensionValue, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { RootStackScreenProps } from "~/navigation/types";
import { authAtom } from "~/store/atoms";
import { maskVNDPriceBeforeSale } from "~/utils";

export interface ProductItemProps {
  image?: string;
  name: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  soldCount?: number;
  totalCount?: number;
  rating?: number;
  location?: string;
  onPress?: () => void;
  width?: number;
  height?: DimensionValue;
  className?: string;
  footer?: React.ReactNode;
  onSale?: boolean;
  id: string | number;
  overrideSalePrice?: string;
}

const ProductItem = ({
  image,
  name,
  price,
  originalPrice,
  discount,
  soldCount,
  totalCount,
  rating,
  location,
  width = 150,
  height,
  onPress,
  className,
  footer,
  onSale,
  id,
  overrideSalePrice,
}: ProductItemProps) => {
  const navigation = useNavigation<RootStackScreenProps<"DetailProduct">>();

  const auth = useAtomValue(authAtom);

  const hasDiscount = !!discount && discount > 0;
  const hasSoldCount =
    typeof soldCount === "number" && typeof totalCount === "number";

  const hasRating = typeof rating === "number";

  const formatPrice = (value: number) => {
    return value.toLocaleString() + "đ";
  };

  const calculateSoldPercentage = () => {
    if (!hasSoldCount || totalCount === 0) return 0;
    return (soldCount / totalCount) * 100;
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.push("DetailProduct", { id: id });
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View
        className={cn(
          "overflow-hidden bg-white rounded-2xl border shadow-sm border-neutral-200",
          className
        )}
        style={{
          width: width,
          height: height ? height : undefined,
        }}
      >
        <View className="w-full bg-neutral-100 aspect-square">
          <Image
            source={image}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            placeholder={imagePaths.placeholder}
            placeholderContentFit="contain"
            cachePolicy={"memory-disk"}
          />
        </View>
        <View className="p-[10] flex-col gap-[2] flex-1">
          <Text
            className="text-xs tracking-tight text-neutral-700"
            numberOfLines={2}
          >
            {name}
          </Text>
          <View className="flex-row gap-[6] items-center justify-between">
            <Text className="text-sm font-bold leading-tight text-error-500">
              {!!overrideSalePrice
                ? overrideSalePrice
                : auth?.isLoggedIn
                  ? formatPrice(price || originalPrice || 0)
                  : maskVNDPriceBeforeSale(price || originalPrice || 0)}
            </Text>
            {onSale && originalPrice && (
              <Text className="text-xs tracking-tight line-through text-neutral-400">
                {auth?.isLoggedIn
                  ? formatPrice(originalPrice)
                  : maskVNDPriceBeforeSale(originalPrice)}
              </Text>
            )}
          </View>
          {!!(hasSoldCount || hasRating) && (
            <View className="flex-row justify-between items-center">
              {!!hasSoldCount && (
                <View className="flex-1 mt-1">
                  <View className="bg-secondary-100 rounded-full h-[14] w-full overflow-hidden">
                    <View
                      className="h-full rounded-full bg-secondary-500"
                      style={{
                        width: `${calculateSoldPercentage()}%`,
                      }}
                    />
                    <Text
                      className="text-[10px] text-center w-full tracking-tight text-neutral-700 font-medium leading-[14px]"
                      style={{
                        position: "absolute",
                      }}
                    >
                      {`Đã bán ${soldCount}/${totalCount}`}
                    </Text>
                  </View>
                </View>
              )}

              {!hasSoldCount && hasRating && (
                <View className="flex-row gap-2 items-center mt-1">
                  {!!hasRating && (
                    <View className="flex-row items-center bg-[#FDF8EA] rounded-[12px] py-[2] px-[4]">
                      <Text className="text-[10px] text-[#545454] mr-[2]">
                        {rating.toFixed(1)}
                      </Text>
                      <Image
                        source={imagePaths.icStar}
                        style={{ width: 10, height: 10 }}
                      />
                    </View>
                  )}

                  {!!soldCount && (
                    <Text className="text-[10px] tracking-tight text-neutral-700">
                      Đã bán {soldCount}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}
          {!!location && (
            <View className="flex-row gap-[2] items-center pt-1 mt-auto">
              <Image
                source={imagePaths.icLocation}
                style={{ width: 10, height: 10 }}
              />
              <Text className="text-[10px] tracking-tight text-neutral-700">
                {location}
              </Text>
            </View>
          )}
          {!!footer ? footer : null}
        </View>

        {hasDiscount && (
          <View className="absolute top-5 left-0 h-[20px] bg-error-500 rounded-r-full flex items-center justify-center px-[6]">
            <Text className="text-[10px] text-white font-bold tracking-tight">
              -{discount}%
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ProductItem, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
