import { View } from "react-native";
import { Line } from "react-native-svg";
import Svg from "react-native-svg";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

type ShopPromotionItemProps = {
  borderColor?: string;
  backgroundColor?: string;
  title?: string;
  minOrder?: string;
  maxDiscount?: string;
  expiryDate?: string;
  onPress?: () => void;
};

const ShopPromotionItem = ({
  borderColor = "#BEE2CB",
  backgroundColor = "#F7FBF8",
  title = "Giảm 12%",
  minOrder = "Đơn tối thiểu 250k",
  maxDiscount = "Đơn tối đa 100k",
  expiryDate = "12/12/2025",
  onPress,
}: ShopPromotionItemProps) => {
  return (
    <View
      className="flex-col rounded-xl border"
      style={{
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      }}
    >
      <View className="flex-col justify-center items-center p-2">
        <Text className="text-xs font-bold tracking-tight text-primary">
          {title}
        </Text>
        <Text className="text-[10px] tracking-tight text-[#676767]">
          {minOrder}
        </Text>
        <Text className="text-[10px] tracking-tight text-[#676767]">
          {maxDiscount}
        </Text>
        <Text className="text-[8px] text-[#AEAEAE] tracking-tight">
          Hạn sử dụng: {expiryDate}
        </Text>
      </View>
      <View className="h-[10px] w-full justify-center items-center">
        <Svg height="1" width="80%">
          <Line
            x1="0"
            y1="0"
            x2="100%"
            y2="0"
            stroke={borderColor}
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        </Svg>
        <View
          style={{
            width: 10,
            height: 10,
            backgroundColor: "white",
            borderRadius: 10,
            position: "absolute",
            left: -5,
            transform: [{ rotate: "45deg" }],
            borderWidth: 1,
            borderColor: borderColor,
            overflow: "hidden",
            borderBottomColor: "transparent",
            borderLeftColor: "transparent",
          }}
        />
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 10,
            backgroundColor: "white",
            position: "absolute",
            borderWidth: 1,
            borderColor: borderColor,
            borderTopColor: "transparent",
            borderRightColor: "transparent",
            right: -6,
            transform: [{ rotate: "45deg" }],
          }}
        />
      </View>
      <View className="px-2.5 pb-[7px] pt-[5px]">
        <Button size={"sm"} onPress={onPress}>
          <Text>Lưu</Text>
        </Button>
      </View>
    </View>
  );
};

export default ShopPromotionItem;
