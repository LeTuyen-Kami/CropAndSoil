import { View } from "react-native";
import { Line } from "react-native-svg";
import Svg from "react-native-svg";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const ShopPromotionItem = () => {
  return (
    <View className="flex-col rounded-xl border border-primary">
      <View className="flex-col justify-center items-center p-2">
        <Text className="text-xs font-bold tracking-tight text-primary">
          Giảm 12%
        </Text>
        <Text className="text-[10px] tracking-tight">Đơn tối thiểu 250k</Text>
        <Text className="text-[10px] tracking-tight">Đơn tối đa 100k</Text>
        <Text className="text-[8px] text-[#AEAEAE] tracking-tight">
          Hạn sử dụng: 12/12/2025
        </Text>
      </View>
      <View className="h-[10px] w-full bg-primary">
        <Svg height="1" width="100%">
          <Line
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
            stroke="red"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        </Svg>
      </View>
      <View className="px-2.5 pb-[7px] pt-[5px]">
        <Button size={"sm"}>
          <Text>Lưu</Text>
        </Button>
      </View>
    </View>
  );
};

export default ShopPromotionItem;
