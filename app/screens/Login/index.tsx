import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";
import RegisterForm from "./RegisterForm";
import { loginAtom } from "./atom";
import { useAtom } from "jotai";

const LoginScreen = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [loginState, setLoginState] = useAtom(loginAtom);

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
                <TouchableOpacity hitSlop={20} className="py-4">
                  <Image
                    source={imagePaths.icShop}
                    style={{ width: 24, height: 24, tintColor: "white" }}
                    contentFit="contain"
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity hitSlop={20} className="py-4">
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1 bg-white rounded-t-[40px] z-10 relative">
            {loginState.step === "signIn" && <LoginForm />}
            {loginState.step === "signUp" && <RegisterForm />}
            {loginState.step === "resetPassword" && <ResetPassword />}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default LoginScreen;
