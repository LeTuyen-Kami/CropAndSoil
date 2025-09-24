import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";
import { PAYMENT_METHODS } from "~/lib/constants";
import SuperShipLogo from "~/assets/images/supership_logo.png";
// Payment method option type

const ShippingMethod = () => {
  const shippingMethods = [
    {
      key: "supership",
      title: "SuperShip",
      description: "Giao hàng siêu nhanh, cước phí rẻ",
    },
  ];

  return (
    <View className="mt-4 bg-white rounded-2xl">
      <View className="flex-row justify-between items-center p-3 border-b border-[#F5F5F5]">
        <Text className="text-sm font-medium leading-tight text-[#383B45]">
          Phương thức vận chuyển
        </Text>
        <Image
          source={imagePaths.icArrowRight}
          style={{ width: 20, height: 20, tintColor: "#393B45" }}
          contentFit="contain"
        />
      </View>
      <View>
        {shippingMethods?.map((option, index) => (
          <View
            key={option.key}
            className={twMerge(
              "flex-col gap-2",
              index !== shippingMethods?.length - 1 &&
                "border-b border-[#F5F5F5]"
            )}
          >
            <TouchableOpacity
              className={twMerge("flex-row justify-between items-center px-3")}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <View className={twMerge("flex-row flex-1 items-center")}>
                <View className="justify-center items-center mr-2 size-10">
                  <Image
                    source={SuperShipLogo}
                    style={{ width: 20, height: 20 }}
                    contentFit="contain"
                  />
                </View>
                <View className="flex-1 py-2">
                  <Text className="text-[14px] text-[#383B45]">
                    {option.title}
                  </Text>
                  {option.description && (
                    <Text className="text-[12px] text-[#159747]">
                      {option.description}
                    </Text>
                  )}
                </View>
              </View>
              <View className="justify-center items-center w-6 h-6">
                <MaterialIcons name="check-circle" size={24} color="#159747" />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ShippingMethod;
