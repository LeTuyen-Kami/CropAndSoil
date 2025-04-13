import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";
import { getItemWidth, screen } from "~/utils";

const VoucherItem = () => {
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
          aspectRatio: 182 / 159,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
            x5
          </Text>
        </View>
        <View className="items-center py-4 mx-2 mt-2">
          <Text className="text-sm font-bold text-[#966F17]">Giảm 5%</Text>
          <Text className="tracking-tight leading-none text-[10px] text-[#676767] px-4 text-center">
            Đơn tối thiểu 250k giảm tối đa 75k
          </Text>
          <Text className="text-[10px] text-[#AEAEAE]">HSD: 20/01/2025</Text>
        </View>
        <View className="pt-4 pb-4 mx-2 mt-auto rounded-t-xl">
          <TouchableOpacity className="justify-center items-center w-full bg-[#FCBA27] rounded-full h-[30px]">
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

export default VoucherItem;
