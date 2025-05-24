// RootNavigation.ts -------------------------------------------------
import {
  createNavigationContainerRef,
  NavigationContainerRef,
} from "@react-navigation/native";
export const navigationRef = createNavigationContainerRef();

// hooks/useFCMNavigation.ts -----------------------------------------
import { getApp } from "@react-native-firebase/app";
import {
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { toast } from "~/components/common/Toast";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export default function useFCMNavigation(
  navigationRef: NavigationContainerRef<any>
) {
  const app = getApp();
  const messaging = getMessaging(app);

  const handle = async (msg: FirebaseMessagingTypes.RemoteMessage | null) => {
    console.log("msg", msg);

    if (!msg?.data?.notificationId) return;
    const { notificationId, ...params } = msg.data;

    console.log("orderId", notificationId);

    if (navigationRef.isReady()) {
      console.log("navigationRef.isReady()");

      navigationRef.navigate("Notifications");
      setTimeout(() => {
        console.log("navigate");
        navigationRef.navigate("DetailNotification", { id: notificationId });
      }, 100);
    }
  };

  // 1) Cold‑start
  useEffect(() => {
    if (Platform.OS === "ios") {
      getInitialNotification(messaging).then(handle);
    }
  }, [messaging]);

  // // 2) Background → foreground (tap)
  useEffect(() => onNotificationOpenedApp(messaging, handle), [messaging]);

  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.getLastNotificationResponseAsync().then(
        async (notification) => {
          console.log("notification", notification?.notification?.request);

          handle({
            data: {
              notificationId:
                notification?.notification?.request?.content?.data
                  ?.notificationId,
              title: notification?.notification?.request?.content?.title,
              body: notification?.notification?.request?.content?.body,
            },
          } as any);
        }
      );
    }
  }, []);

  // 3) Foreground message realtime
  useEffect(
    () =>
      onMessage(messaging, (msg) => {
        console.log("msg", msg);

        if (msg.notification?.body) {
          toast.info(msg.notification?.body);
        }
      }),
    [messaging]
  );
}
