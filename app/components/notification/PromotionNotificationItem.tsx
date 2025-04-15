import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { FontAwesome5 } from "@expo/vector-icons";
import { imagePaths } from "~/assets/imagePath";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "~/navigation/types";
import { INotification } from "~/services/api/notification.service";
import dayjs from "dayjs";
import { formatDate } from "~/utils";
export interface PromotionNotification {
  id: string;
  type: "promotion";
  title: string;
  message: string;
  date: string;
  imageUrl: string;
  isRead: boolean;
}

interface PromotionNotificationItemProps {
  notification: INotification;
}

const PromotionNotificationItem: React.FC<PromotionNotificationItemProps> = ({
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
          <View className="flex-row items-center gap-[10px]">
            <View className="justify-center items-center w-9 h-9">
              <Image
                source={imagePaths.statusPromotion}
                contentFit="contain"
                className="size-[38px]"
              />
              {/* {!notification.isRead && (
                <View className="absolute top-0 right-0 rounded-full border border-white">
                  <View className="bg-red-500 rounded-full size-2" />
                </View>
              )} */}
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
          <View className="flex-row bg-[#F5F5F5] rounded-lg gap-[10px]">
            <View className="w-[74px] h-[72px] rounded-lg border border-[#F0F0F0] overflow-hidden">
              <Image
                source={{ uri: notification.thumbnail }}
                className="w-full h-full rounded-lg"
                contentFit="cover"
              />
            </View>
            <View className="flex-1 justify-center">
              <Text
                className="text-xs text-[#676767] leading-[18px]"
                numberOfLines={3}
              >
                {notification.content}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PromotionNotificationItem;
