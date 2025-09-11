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
import { KeyboardProvider } from "react-native-keyboard-controller";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SystemBars } from "react-native-edge-to-edge";
import ModalConfirm from "~/components/common/ModalConfirm";
import * as Sentry from "@sentry/react-native";
import { ENV } from "~/utils";
import FallBackUI from "~/components/common/FallbackUI";
import { withErrorBoundary } from "~/hooks/withErrorBoundary";
import { jotaiStore } from "~/store/store";
import { devModeAtom } from "~/store/atoms";
import { Appearance } from "react-native";

SplashScreen.preventAutoHideAsync();

cssInterop(Image, {
  className: "style",
});
function App() {
  useEffect(() => {
    Appearance.setColorScheme("light");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <JotaiProvider>
          <ReactQueryProvider>
            <SafeAreaProvider>
              <AppNavigator />
              <ToastHolder />
              <ScreenLoading />
              <NetworkLogger />
              <SystemBars style={"auto"} />
              <ModalConfirm />
            </SafeAreaProvider>
          </ReactQueryProvider>
        </JotaiProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const enableSentry = jotaiStore.get(devModeAtom)?.enableSentry ?? false;

if (enableSentry) {
  Sentry.init({
    dsn: ENV.EXPO_PUBLIC_SENTRY_DSN,
  });
}
const Boundary = withErrorBoundary(App);
export default Sentry.wrap(Boundary);
