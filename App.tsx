import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { cssInterop } from "nativewind";
import React, { useEffect } from "react";
import { AppNavigator } from "./app/navigation/AppNavigator";
import JotaiProvider from "./app/providers/jotaiProvider";
import ReactQueryProvider from "./app/providers/reactQueryProvider";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ToastHolder from "~/components/common/Toast";
import ScreenLoading from "~/components/common/ScreenLoading";
import NetworkLogger from "~/components/common/NetworkLogger";

SplashScreen.preventAutoHideAsync();

cssInterop(Image, {
  className: "style",
});
export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <JotaiProvider>
      <ReactQueryProvider>
        <SafeAreaProvider>
          <AppNavigator />
          <ToastHolder />
          <ScreenLoading />
          <NetworkLogger />
        </SafeAreaProvider>
      </ReactQueryProvider>
    </JotaiProvider>
  );
}
