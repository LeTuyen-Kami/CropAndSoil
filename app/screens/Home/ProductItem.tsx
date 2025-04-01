import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

const ProductItem = () => {
  const price = 96000;
  const oldPrice = 135000;

  return (
    <View className="flex-1 mr-[6] rounded-2xl bg-white overflow-hidden">
      <View className="bg-neutral-100 h-[142]">
        <Image
          source={"https://picsum.photos/200/300"}
          style={{ width: "100%", height: "100%", borderRadius: 8 }}
          contentFit="cover"
        />
      </View>
      <View className="p-[10] flex-col gap-[2]">
        <Text
          className="text-xs tracking-tight text-neutral-700"
          numberOfLines={2}
        >
          Thuốc trừ bệnh Sumi Eight 12.5WP 100gr
        </Text>
        <View className="flex-row gap-[6]">
          <Text className="text-sm font-medium leading-tight text-error-500">
            {price.toLocaleString()}đ
          </Text>
          <Text className="text-xs tracking-tight line-through text-neutral-400">
            {oldPrice.toLocaleString()}đ
          </Text>
        </View>
      </View>
      <View className="mt-1">
        <View className="bg-secondary-100 rounded-full h-[14] w-full overflow-hidden">
          <View
            className="h-full rounded-full bg-secondary-500"
            style={{
              width: "50%",
            }}
          />
          <Text
            className="text-[10px] tracking-tight text-neutral-700 font-medium absolute leading-[14px]"
            style={{
              left: "50%",
              transform: [{ translateX: "-50%" }],
            }}
          >
            Đã bán 20/22
          </Text>
        </View>
      </View>
      <View className="absolute top-5 left-0  h-[20px] w-[32px] bg-error-500 rounded-r-full flex items-center justify-center">
        <Text className="text-[10px] text-white font-medium tracking-tight">
          -10%
        </Text>
      </View>
    </View>
  );
};

export default ProductItem;
