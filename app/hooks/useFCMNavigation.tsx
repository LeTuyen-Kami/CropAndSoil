// RootNavigation.ts -------------------------------------------------
import {
  createNavigationContainerRef,
  NavigationContainerRef,
} from "@react-navigation/native";
export const navigationRef = createNavigationContainerRef();

// hooks/useFCMNavigation.ts -----------------------------------------
import { useEffect } from "react";
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useSmartNavigation } from "./useSmartNavigation";

export default function useFCMNavigation(
  navigationRef: NavigationContainerRef<any>
) {
  const messaging = getMessaging();

  const handle = (msg: FirebaseMessagingTypes.RemoteMessage | null) => {
    console.log("msg", msg);

    if (!msg?.data?.screen) return;
    const { screen, ...params } = msg.data;
    if (navigationRef.isReady()) {
      navigationRef.navigate(screen as never, params as never);
    }
  };

  // 1) Cold‑start
  useEffect(() => {
    getInitialNotification(messaging).then(handle);
  }, [messaging]);

  // 2) Background → foreground (tap)
  useEffect(() => onNotificationOpenedApp(messaging, handle), [messaging]);

  // 3) Foreground message realtime
  useEffect(
    () =>
      onMessage(messaging, (msg) => {
        // tuỳ: navigate ngay, hay hiển thị custom toast rồi navigate khi user tap
        handle(msg);
      }),
    [messaging]
  );
}
