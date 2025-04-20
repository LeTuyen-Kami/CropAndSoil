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

export default function useFCMNavigation(
  navigationRef: NavigationContainerRef<any>
) {
  const app = getApp();
  const messaging = getMessaging(app);

  const handle = async (msg: FirebaseMessagingTypes.RemoteMessage | null) => {
    if (!msg?.data?.id) return;
    const { id, ...params } = msg.data;
    if (navigationRef.isReady()) {
      navigationRef.navigate("Notifications");
      setTimeout(() => {
        navigationRef.navigate("DetailNotification", { id });
      }, 100);
    }
  };

  // // 1) Cold‑start
  useEffect(() => {
    getInitialNotification(messaging).then(handle);
  }, [messaging]);

  // // 2) Background → foreground (tap)
  useEffect(() => onNotificationOpenedApp(messaging, handle), [messaging]);

  // 3) Foreground message realtime
  useEffect(
    () =>
      onMessage(messaging, (msg) => {
        if (msg.notification?.body) {
          toast.info(msg.notification?.body);
        }
      }),
    [messaging]
  );
}
