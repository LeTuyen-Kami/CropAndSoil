import { registerRootComponent } from "expo";

import App from "./App";
import { startNetworkLogging } from "react-native-network-logger";
import { getMessaging } from "@react-native-firebase/messaging";
import { setBackgroundMessageHandler } from "@react-native-firebase/messaging";
import { getApp } from "@react-native-firebase/app";

// setBackgroundMessageHandler(getMessaging(getApp()), async (msg) => {
//   console.log("BG message:", msg);
// });

// (globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

startNetworkLogging();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
