import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { cssInterop } from "nativewind";
import React, { useEffect } from "react";
import { AppNavigator } from "./app/navigation/AppNavigator";
import "./global.css";

SplashScreen.preventAutoHideAsync();

cssInterop(Image, {
  className: "style",
});
export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <AppNavigator />;
}
