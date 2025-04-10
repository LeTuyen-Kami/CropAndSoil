import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Defs, Stop, G, Line } from "react-native-svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { screen } from "~/utils";
import { imagePaths } from "~/assets/imagePath";

type TicketVoucherProps = {
  title?: string;
  maxDiscount?: string;
  minOrder?: string;
  usagePercent?: number;
  expiryDate?: string;
  isBestChoice?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  shadowColor?: string;
  shadowBorderColor?: string;
  onPress?: () => void;
  paddingHorizontal?: number;
  linearGradientColors?: [string, string];
};

const ProgressBar = ({ usagePercent }: { usagePercent: number }) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBg} />
      <LinearGradient
        colors={["#0DAF4B", "#FDCD63"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progressBarFill, { width: `${usagePercent}%` }]}
      />
    </View>
  );
};

const TicketVoucher = ({
  title = "Mã vận chuyển",
  maxDiscount = "Giảm tối đa 200k",
  minOrder = "Đơn tối thiểu 0đ",
  usagePercent = 62,
  expiryDate = "20/01/2025",
  isBestChoice = true,
  borderColor = "#BEE2CB",
  backgroundColor = "#FBFDFB",
  shadowColor = "#CBE7D5",
  shadowBorderColor = "#EBF6F0",
  paddingHorizontal = 12,
  onPress,
  linearGradientColors,
}: TicketVoucherProps) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {({ pressed }) => (
        <View
          className="flex-row w-full aspect-[3.7/1] bg-[#FFFAEF] my-4 min-h-[100px] rounded-xl"
          style={{
            maxWidth: screen.width - paddingHorizontal * 2,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          }}
        >
          <View
            className="absolute -bottom-2.5 left-1 right-1 h-4 rounded-b-xl border flex-row"
            style={{
              backgroundColor: shadowColor,
              borderColor: shadowBorderColor,
            }}
          ></View>
          {linearGradientColors && linearGradientColors?.length > 0 ? (
            <LinearGradient
              colors={linearGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="absolute inset-0 rounded-xl"
            />
          ) : (
            <View
              className="absolute inset-0 rounded-xl"
              style={{ backgroundColor: backgroundColor }}
            />
          )}

          <View
            className="flex-col gap-2 justify-center items-center h-full rounded-l-xl aspect-square"
            style={{
              borderWidth: 1,
              borderColor: borderColor,
              borderRightWidth: 0,
            }}
          >
            <Image
              source={imagePaths.icShop}
              contentFit="contain"
              className="size-[50px]"
            />
            <Text className="text-[10px] font-medium tracking-tight text-[#676767]">
              Voucher toàn sàn
            </Text>
          </View>
          <View className="w-5 h-full">
            <View
              className="absolute top-[-10] left-0 size-5 bg-white aspect-square rounded-full border-b border-r"
              style={{
                transform: [{ rotate: "60deg" }],
                borderColor: borderColor,
              }}
            ></View>
            <View
              className="absolute bottom-[-10] left-0 size-5 aspect-square rounded-full border-t border-l"
              style={{
                transform: [{ rotate: "60deg" }],
                borderColor: borderColor,
                backgroundColor: shadowColor,
              }}
            ></View>
            <View
              style={{
                borderStyle: "dashed",
                borderWidth: 1,
                borderColor: borderColor,
                width: 1,
                height: "70%",
                marginLeft: 9,
                marginVertical: "auto",
              }}
            ></View>
          </View>
          <View
            className="flex-1 justify-center pr-4 pl-1 h-full rounded-r-xl border-t border-r border-b"
            style={{
              borderColor: borderColor,
            }}
          >
            <View className="flex-col gap-[2px] -mt-1.5">
              <Text className="text-base font-medium leading-normal text-primary">
                {maxDiscount}
              </Text>
              <View className="flex-row justify-between">
                <Text className="text-[10px] leading-none tracking-tight text-[#575964]">
                  {minOrder}
                </Text>
                <Text className="text-[10px] leading-none tracking-tight text-[#AEAEAE]">
                  Đã dùng {usagePercent}%
                </Text>
              </View>
              <ProgressBar usagePercent={62} />
              <View className="flex-row justify-between">
                <Text className="text-[10px] leading-none tracking-tight text-[#676767]">
                  {expiryDate}
                </Text>
                <Text className="text-[10px] leading-none tracking-tight text-[#E8AB24]">
                  Điều kiện
                </Text>
              </View>
            </View>
          </View>
          <View className="absolute bottom-[-10px] left-0 right-0 h-full rounded-b-xl bg-transparent flex-row">
            <View className="h-full aspect-square"></View>
            <View className="w-5 h-full">
              <View className="absolute bottom-[-10px] bg-white rounded-full left-[-1px] w-5 h-5" />
            </View>
          </View>
          {isBestChoice && (
            <View className="absolute -top-2 right-[-5px]">
              <View className="px-2 py-1 rounded-t-xl rounded-l-xl bg-secondary">
                <Text className="text-[10px] font-medium leading-none tracking-tight text-white">
                  Lựa chọn tốt nhất
                </Text>
              </View>
              <View
                style={{
                  width: 0,
                  height: 0,
                  backgroundColor: "transparent",
                  borderStyle: "solid",
                  borderRightWidth: 5,
                  borderTopWidth: 5,
                  borderRightColor: "transparent",
                  borderTopColor: "#966F16",
                  alignSelf: "flex-end",
                }}
              />
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 8,
    position: "relative",
  },
  couponShadow: {
    width: "100%",
    height: 110,
    position: "absolute",
  },
  couponMain: {
    width: "100%",
    height: 110,
    position: "relative",
    marginTop: 0,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BEE2CC",
    overflow: "hidden",
  },
  topSection: {
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 8,
    gap: 2,
  },
  shippingIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  titleText: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: "500",
    color: "#676767",
    letterSpacing: 0.1,
  },
  dashedLineContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  discountTermsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 2,
  },
  maxDiscountText: {
    fontFamily: "Roboto",
    fontSize: 16,
    fontWeight: "500",
    color: "#159747",
    marginBottom: 2,
  },
  orderInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 2,
  },
  minOrderText: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: "400",
    color: "#575964",
    letterSpacing: 0.1,
  },
  usagePercentText: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: "400",
    color: "#AEAEAE",
    letterSpacing: 0.1,
  },
  progressBarContainer: {
    width: "100%",
    height: 4,
    borderRadius: 1000,
    marginVertical: 4,
    position: "relative",
  },
  progressBarBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#E3E3E3",
    borderRadius: 1000,
  },
  progressBarFill: {
    position: "absolute",
    height: "100%",
    borderRadius: 1000,
  },
  expiryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 2,
  },
  expiryDateText: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: "400",
    color: "#676767",
    letterSpacing: 0.1,
  },
  termsText: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: "400",
    color: "#E8AB24",
    letterSpacing: 0.1,
  },
  bestChoiceContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    alignItems: "flex-end",
  },
  bestChoiceBadge: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  bestChoiceText: {
    fontFamily: "Roboto",
    fontSize: 10,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 0.1,
  },
  bestChoiceTriangle: {
    position: "absolute",
    bottom: -10,
    right: 0,
  },
});

export default TicketVoucher;
