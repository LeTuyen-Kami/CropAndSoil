import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { deepEqual } from "fast-equals";
import React, { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";
import { getItemWidth, screen } from "~/utils";

interface VoucherItemProps {
  description: string;
  amount: string;
  minimumAmount: number;
  maximumReduction: number;
  expiryDate: string;
  onPressSave?: () => void;
}

const VoucherItem = ({
  description,
  amount,
  minimumAmount,
  maximumReduction,
  expiryDate,
  onPressSave,
}: VoucherItemProps) => {
  const itemWidth = useMemo(() => {
    return getItemWidth({
      containerPadding: 16,
      itemGap: 8,
    });
  }, []);

  return (
    <View
      style={{
        width: itemWidth.itemWidth,
      }}
    >
      <Image
        source={imagePaths.voucherBackground}
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        contentFit="fill"
      />
      <View
        style={{
          height: "100%",
        }}
      >
        <View
          className="absolute top-0 px-1.5 py-1 bg-[#FFF3D8] rounded-full"
          style={{
            left: "50%",
            transform: [{ translateX: "-50%" }],
          }}
        >
          <Text className="text-[10px] font-medium text-[#E8AB24] tracking-tight">
            x{amount}
          </Text>
        </View>
        <View className="items-center py-4 mx-2 mt-2">
          <Text
            className="text-sm font-bold text-[#966F17] px-1 text-center tracking-tight"
            numberOfLines={3}
          >
            {description}
          </Text>
          <Text className="tracking-tight leading-none text-[10px] text-[#676767] px-4 text-center">
            Đơn tối thiểu {minimumAmount}k giảm tối đa {maximumReduction}k
          </Text>
          <Text className="text-[10px] text-[#AEAEAE]">HSD: {expiryDate}</Text>
        </View>
        <View className="pt-4 pb-4 mx-2 mt-auto rounded-t-xl">
          <TouchableOpacity
            className="justify-center items-center w-full bg-[#FCBA27] rounded-full h-[30px]"
            onPress={onPressSave}
          >
            <Text className="text-xs font-medium tracking-tight text-white">
              Lưu
            </Text>
          </TouchableOpacity>
          <View
            style={{
              position: "absolute",
              top: 0,
              backgroundColor: "red",
              borderRadius: 100,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default React.memo(VoucherItem, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
