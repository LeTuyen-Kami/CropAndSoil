import React, { useEffect } from "react";
import "./global.css";
import { AppNavigator } from "./app/navigation/AppNavigator";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <AppNavigator />;
}
