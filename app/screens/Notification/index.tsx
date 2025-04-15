import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import NotificationTypeTab from "~/components/notification/NotificationTypeTab";
import NotificationItem from "~/components/notification/NotificationItem";
import { useNotifications } from "~/hooks/useNotifications";
import { SafeAreaView } from "react-native-safe-area-context";
import Empty from "~/components/common/Empty";
import { usePagination } from "~/hooks/usePagination";
import { notificationService } from "~/services/api/notification.service";
import { COLORS } from "~/constants/theme";

const Notification = () => {
  const {
    data: notifications,
    isLoading,
    refresh,
    isRefresh,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = usePagination(notificationService.getNotifications, {
    initialParams: {
      skip: 0,
      take: 10,
    },
    queryKey: ["notifications"],
  });

  return (
    <ScreenWrapper hasGradient={true}>
      <Header
        title="Thông báo"
        hasSafeTop={false}
        className="bg-transparent border-0"
        textColor="#fff"
      />
      <View className="flex-1 bg-[#EEE] rounded-t-3xl overflow-hidden">
        <FlashList
          ItemSeparatorComponent={() => <View className="h-[10px]" />}
          data={notifications}
          renderItem={({ item }) => <NotificationItem notification={item} />}
          estimatedItemSize={150}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onEndReached={fetchNextPage}
          refreshControl={
            <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
          }
          ListEmptyComponent={
            <Empty title="Không có thông báo nào" isLoading={isLoading} />
          }
          ListFooterComponent={
            hasNextPage && isFetching ? (
              <View className="justify-center items-center h-10">
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            ) : (
              <View className="h-[100px] bg-transparent" />
            )
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#676767",
  },
});

export default Notification;
