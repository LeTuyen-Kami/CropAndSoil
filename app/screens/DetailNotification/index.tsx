import { useRoute } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import WebViewContent from "~/components/common/WebViewContent";
import { RootStackRouteProp } from "~/navigation/types";
import { notificationService } from "~/services/api/notification.service";
import { formatDate } from "~/utils";

const DetailNotification = () => {
  const { bottom } = useSafeAreaInsets();
  const { params } = useRoute<RootStackRouteProp<"DetailNotification">>();
  const queryClient = useQueryClient();

  const { data: notification } = useQuery({
    queryKey: ["notification", params.id],
    queryFn: () =>
      notificationService.getNotificationsDetail(params.id!.toString()),
    enabled: !!params.id,
  });

  useEffect(() => {
    if (notification) {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    }
  }, [notification]);

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Thông báo"
        hasSafeTop={false}
        className="bg-transparent border-0"
        textColor="#fff"
      />

      <View
        className="flex-1 bg-[#fff] rounded-t-3xl overflow-hidden"
        style={{
          paddingBottom: bottom,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-t-3xl">
            <View className="flex-row p-3 pb-1.5">
              <View className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FDCD63] to-[#FCBA27] items-center justify-center mr-2.5">
                <Text className="text-lg text-white">💰</Text>
              </View>

              <View className="flex-1">
                <Text
                  className="text-[#383B45] font-medium text-base"
                  numberOfLines={2}
                >
                  {notification?.title}
                </Text>
                <Text className="text-[#676767] text-xs mt-1">
                  {formatDate(notification?.createdAt, "DD/MM/YYYY HH:mm")}
                </Text>
              </View>
            </View>

            <Image
              source={{ uri: notification?.thumbnail }}
              className="mt-2 w-full h-48"
              resizeMode="cover"
            />

            <View className="p-3">
              <WebViewContent html={notification?.content || ""} />
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default DetailNotification;
