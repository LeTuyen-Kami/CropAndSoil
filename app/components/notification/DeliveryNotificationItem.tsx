import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { imagePaths } from "~/assets/imagePath";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "~/navigation/types";
export interface DeliveryNotification {
  id: string;
  type: "delivery";
  message: string;
  date: Date;
  imageUrl: string;
  isRead: boolean;
  title: string;
  orderCode: string;
  packageCode: string;
}

interface DeliveryNotificationItemProps {
  notification: DeliveryNotification;
}

const DeliveryNotificationItem: React.FC<DeliveryNotificationItemProps> = ({
  notification,
}) => {
  const navigation =
    useNavigation<RootStackScreenProps<"DetailNotification">>();

  const handlePress = () => {
    navigation.navigate("DetailNotification", {
      id: notification.id,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View className="bg-white rounded-2xl">
        {/* Header section */}
        <View className="p-3 pb-0 rounded-t-2xl">
          <View className="flex-row items-center gap-2.5">
            <View className="justify-center items-center w-9 h-9">
              <Image
                source={imagePaths.statusDelivery}
                contentFit="contain"
                className="size-[38px]"
              />
              {!notification.isRead && (
                <View className="absolute top-0 right-0 rounded-full border border-white">
                  <View className="bg-red-500 rounded-full size-2" />
                </View>
              )}
            </View>
            <View>
              <Text className="text-base font-medium text-[#383B45]">
                {notification.title}
              </Text>
              <Text className="text-xs text-[#676767]">
                {dayjs(notification.date).format("DD/MM/YYYY HH:mm")}
              </Text>
            </View>
          </View>
        </View>

        {/* Content section */}
        <View className="p-3">
          <View className="flex-row items-center gap-1.5">
            <View className="w-[74px] h-[74px] rounded-lg border border-[#F0F0F0] p-2.5 justify-center items-center">
              <Image
                source={{ uri: notification.imageUrl }}
                className="w-full h-full rounded-lg"
                contentFit="cover"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-[#676767] leading-[18px]">
                Kiện hàng{" "}
                <Text className="text-xs leading-[18px] text-[#159747]">
                  {notification.packageCode}
                </Text>{" "}
                của đơn hàng{" "}
                <Text className="text-xs leading-[18px] text-[#159747]">
                  {notification.orderCode}
                </Text>{" "}
                đã giao thành công đến bạn.
              </Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={18}
              color="#AEAEAE"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DeliveryNotificationItem;
