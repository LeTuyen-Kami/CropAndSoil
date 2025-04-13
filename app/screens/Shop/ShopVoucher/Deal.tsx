import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { getItemWidth } from "~/utils";
import Timer from "./Timer";
import { AntDesign } from "@expo/vector-icons";
const ProductItem = () => {
  const { itemWidth } = getItemWidth({
    containerPadding: 16,
    itemGap: 8,
  });

  return (
    <View
      style={{ width: itemWidth }}
      className="overflow-hidden bg-white rounded-2xl shadow-sm"
    >
      <View className="relative">
        {/* Image placeholder */}
        <View className="w-full aspect-square bg-neutral-100">
          <Image
            source={"https://picsum.photos/200/300"}
            style={{ width: "100%", aspectRatio: 1 }}
            contentFit="contain"
          />
        </View>

        {/* Discount tag */}
        <View className="absolute left-0 top-5 flex-row items-center w-[42px] h-5">
          <Image
            source={imagePaths.lightningBadge}
            className="absolute top-0 right-0 bottom-0 left-0"
            contentFit="cover"
          />
          <Text className="text-[10px] font-bold text-white ml-0.5">-20%</Text>
        </View>
      </View>

      <View className="p-2">
        {/* Product name */}
        <Text
          className="text-xs tracking-tight text-[#383B45]"
          numberOfLines={2}
        >
          Thuốc trừ bệnh Sumi Eight 12.5WP 100gr
        </Text>

        {/* Prices */}
        <View className="flex-row gap-2 items-center mb-2">
          <Text className="text-sm font-bold text-[#C42424]">160.000đ</Text>
          <Text className="text-sm line-through text-neutral-400">
            220.000đ
          </Text>
        </View>

        <View className="">
          <View className="w-full h-[14px] bg-[#FFD99F] rounded-full">
            <LinearGradient
              colors={["#F55D20", "#FFCA3D"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-full rounded-full"
              style={{ width: "50%" }}
            />

            <Image
              source={imagePaths.icFire1}
              className="absolute -top-1.5 left-0.5 size-[18px]"
              contentFit="contain"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const Deal = () => {
  return (
    <View className="mt-6">
      <LinearGradient
        colors={["#F5FFF9", "#BEE2CC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute top-0 right-0 bottom-0 left-0 rounded-2xl"
      ></LinearGradient>

      <View className="mx-12 -mt-3">
        <LinearGradient
          colors={["#159747", "#07BE4D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-b-xl py-2.5 justify-center items-center"
        >
          <Text className="text-2xl font-bold text-white">
            DEAL TẾT NGẬP TRÀN
          </Text>
        </LinearGradient>
        <View className="overflow-hidden absolute top-0 -left-4 w-4 h-3">
          <View className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#159747]" />
          <View className="w-4 h-6 bg-[#0A692D] rounded-full"></View>
        </View>
        <View className="overflow-hidden absolute top-0 -right-4 w-4 h-3">
          <View className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#07BE4D]" />
          <View className="w-4 h-6 bg-[#0A692D] rounded-full"></View>
        </View>
      </View>
      <Timer expiredTime={new Date(Date.now() + 1000 * 60 * 60 * 24)} />
      <View className="flex flex-row flex-wrap gap-2 px-2">
        {[...Array(4)].map((_, index) => (
          <ProductItem key={index} />
        ))}
      </View>
      <View className="flex-row gap-1 justify-center items-center w-full mt-[18px] mb-2.5">
        <Text className="flex-row gap-1 items-center text-sm font-medium text-[#0B5226]">
          Xem thêm Deal hot{" "}
        </Text>
        <Image
          source={imagePaths.icArrowRight}
          className="size-[18px] rotate-90"
          style={{ tintColor: "#0B5226" }}
        />
      </View>
    </View>
  );
};

export default Deal;
