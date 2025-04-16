import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { imagePaths } from "~/assets/imagePath";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "~/navigation/types";
import { INotification } from "~/services/api/notification.service";
import { formatDate } from "~/utils";
import WebViewContent from "../common/WebViewContent";

interface DeliveryNotificationItemProps {
  notification: INotification;
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
              {!notification?.isRead && (
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
                {formatDate(notification?.createdAt, "DD/MM/YYYY HH:mm")}
              </Text>
            </View>
          </View>
        </View>

        {/* Content section */}
        <View className="p-3">
          <View className="flex-row items-center gap-1.5">
            <View className="w-[74px] h-[74px] rounded-lg border border-[#F0F0F0] p-2.5 justify-center items-center">
              <Image
                source={{ uri: notification.thumbnail }}
                className="w-full h-full rounded-lg"
                contentFit="cover"
              />
            </View>
            <View className="h-[64px] flex-1 justify-center">
              <WebViewContent
                html={`<div>${notification.content}</div>`}
                canScroll={false}
              />
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
