import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPassword from "./ResetPassword";
import { loginAtom } from "./atom";
import * as WebBrowser from "expo-web-browser";
import { ENV } from "~/utils";

const LoginScreen = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [loginState, setLoginState] = useAtom(loginAtom);

  const handleBecomeSupplier = () => {
    WebBrowser.openBrowserAsync(ENV.EXPO_PUBLIC_AGENT_LINK);
  };

  const handleOpenHelpCenter = () => {
    WebBrowser.openBrowserAsync(ENV.EXPO_PUBLIC_HELP_CENTER_LINK);
    // navigation.navigate("HelpCenter");
    // navigation.navigate("WebViewScreen", {
    //   url: ENV.EXPO_PUBLIC_HELP_CENTER_LINK,
    // });
  };

  useEffect(() => {
    return () => {
      setLoginState({
        step: "signIn",
        previousStep: null,
      });
    };
  }, []);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#07BE4D", "#0D823A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.2 }}
        style={{
          flex: 1,
        }}
      >
        <View>
          <View
            className="flex-row items-center px-3"
            style={{ paddingTop: top }}
          >
            <TouchableOpacity
              hitSlop={20}
              className="py-4 pr-4"
              onPress={() => navigation.goBack()}
            >
              <Image
                source={imagePaths.icArrowLeft}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
            </TouchableOpacity>
            <View className="flex-1" />
            <View className="flex-row gap-6">
              {loginState.step === "signIn" && (
                <TouchableOpacity
                  hitSlop={20}
                  className="py-4"
                  onPress={handleBecomeSupplier}
                >
                  <Image
                    source={imagePaths.icShop}
                    style={{ width: 24, height: 24, tintColor: "white" }}
                    contentFit="contain"
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                hitSlop={20}
                className="py-4"
                onPress={handleOpenHelpCenter}
              >
                <Image
                  source={imagePaths.icBrokenCircleQuestion}
                  style={{ width: 24, height: 24 }}
                  contentFit="contain"
                />
              </TouchableOpacity>
            </View>
            <View />
          </View>
          {/* Logo */}
          <View className="items-center mb-6">
            <Image
              source={imagePaths.logo}
              style={{ width: 80, height: 80 }}
              contentFit="contain"
            />
          </View>
          <View className="absolute right-2 left-2 -bottom-14 z-0 h-[68] bg-[#3E9B5E] rounded-t-[40px]"></View>
        </View>
        <KeyboardAwareScrollView
          className="flex-1 bg-white rounded-t-[40px] z-10 relative"
          bottomOffset={50}
        >
          {loginState.step === "signIn" && (
            <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
              <LoginForm />
            </Animated.View>
          )}
          {loginState.step === "signUp" && (
            <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
              <RegisterForm />
            </Animated.View>
          )}
          {loginState.step === "resetPassword" && (
            <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
              <ResetPassword />
            </Animated.View>
          )}
        </KeyboardAwareScrollView>
      </LinearGradient>
    </View>
  );
};

export default LoginScreen;
