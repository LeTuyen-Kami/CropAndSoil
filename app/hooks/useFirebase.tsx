// src/hooks/useFirebase.ts
import { useState, useEffect, useCallback } from "react";
import { Platform, PermissionsAndroid } from "react-native";

// 💡 Modular imports
import {
  getMessaging,
  requestPermission as requestMessagingPermission,
  getToken as getFCMToken,
  onMessage,
  onTokenRefresh,
  AuthorizationStatus,
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";

import { getApp } from "@react-native-firebase/app";

export default function useFirebase() {
  const app = getApp(); // modular: lấy default app
  const messaging = getMessaging(app);

  const [token, setToken] = useState<string | null>(null);
  const [permissionGranted, setGranted] = useState<boolean>(false);

  /* ------------ 1. Xin quyền ------------ */
  const requestPermission = useCallback(async () => {
    try {
      if (Platform.OS === "ios") {
        const status = await requestMessagingPermission(messaging);
        setGranted(
          status === AuthorizationStatus.AUTHORIZED ||
            status === AuthorizationStatus.PROVISIONAL
        );
      } else {
        // Android 13+
        if (Platform.Version && parseInt(Platform.Version as string) >= 33) {
          const res = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          setGranted(res === PermissionsAndroid.RESULTS.GRANTED);
        } else {
          setGranted(true);
        }
      }
    } catch (e) {
      console.warn("Notification permission error:", e);
      setGranted(false);
    }
  }, [messaging]);

  /* ------------ 2. Lấy token ------------ */
  const refreshToken = useCallback(async () => {
    try {
      const fcm = await getFCMToken(messaging);
      setToken(fcm);
      return fcm;
    } catch (e) {
      console.warn("Get FCM token error:", e);
      return null;
    }
  }, [messaging]);

  /* ------------ 3. Đăng ký listeners ------------ */
  useEffect(() => {
    requestPermission().then(refreshToken);

    // foreground listener

    // token refresh listener
    const unsubToken = onTokenRefresh(messaging, refreshToken);

    return () => {
      unsubToken();
    };
  }, [messaging, refreshToken, requestPermission]);

  const handleInitialMessage = useCallback(async () => {}, [messaging]);

  useEffect(() => {
    handleInitialMessage();
  }, [handleInitialMessage]);

  return { token, permissionGranted, requestPermission };
}
