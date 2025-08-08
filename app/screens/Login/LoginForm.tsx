import { useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { Button } from "~/components/ui/button";
import { imagePaths } from "~/assets/imagePath";
import { useSetAtom } from "jotai";
import { loginAtom } from "./atom";
import { authService } from "~/services/api/auth.service";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "~/components/common/Toast";
import { getErrorMessage, validatePhoneNumber } from "~/utils";
import { authAtom } from "~/store/atoms";
import { useNavigation } from "@react-navigation/native";
import { userService } from "~/services/api/user.service";
const LoginForm = () => {
  const setAuthState = useSetAtom(authAtom);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const setLoginState = useSetAtom(loginAtom);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const mutationLogin = useMutation({
    mutationFn: authService.login,
  });

  const togglePasswordVisibility = () => {
    setTogglePassword(!togglePassword);
  };

  const handleForgotPassword = () => {
    setLoginState({
      step: "resetPassword",
    });
  };

  const handleRegister = () => {
    setLoginState({
      step: "signUp",
    });
  };

  const handleLogin = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    toggleLoading(true);
    mutationLogin.mutate(
      {
        phone: phoneNumber,
        password,
      },
      {
        onSuccess: (data) => {
          toast.success("Đăng nhập thành công");
          setAuthState((prev) => ({
            ...prev,
            user: data,
            token: data.token,
            isLoggedIn: true,
          }));
          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          });
          queryClient?.prefetchQuery({
            queryKey: ["profile", data.id, data.token.accessToken],
            queryFn: () => userService.getProfile(),
          });
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Lỗi khi đăng nhập"));
        },
        onSettled: () => {
          toggleLoading(false);
        },
      }
    );
  };

  const disabled = useMemo(() => {
    return !phoneNumber || !password;
  }, [phoneNumber, password]);

  return (
    <View className="px-8 mb-6">
      {/* Login Form */}
      <View className="mt-4">
        <Text className="text-3xl font-bold text-[#383B45] text-center mb-4">
          Đăng nhập
        </Text>

        {/* Phone Input */}
        <View className="mb-4">
          <Input
            placeholder="Số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            leftIcon={
              <Image
                source={imagePaths.icPhone}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
            }
            className="bg-[#F5F5F5]"
          />
        </View>

        {/* Password Input */}
        <View className="mb-2">
          <Input
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!togglePassword}
            leftIcon={
              <Image
                source={imagePaths.icLock}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
            }
            rightIcon={
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Image
                  source={
                    !togglePassword
                      ? imagePaths.icEyeClosed
                      : imagePaths.icEyeOpened
                  }
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: "#AEAEAE",
                  }}
                  contentFit="contain"
                />
              </TouchableOpacity>
            }
            style={{
              color: "black",
            }}
            className="bg-[#F5F5F5]"
          />
        </View>

        {/* Forgot Password */}
        <View className="items-center mt-4 mb-6">
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text className="text-[#159747] font-medium">Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <Button
          onPress={handleLogin}
          className="h-11 bg-[#FCBA27] mb-4 disabled:opacity-50"
          disabled={disabled || mutationLogin.isPending}
        >
          <Text className="text-base font-medium text-white">
            {mutationLogin.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              "Đăng nhập"
            )}
          </Text>
        </Button>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          className="h-11 border border-[#FCBA27] rounded-full justify-center items-center"
        >
          <Text className="text-[#FCBA27] font-medium text-base">
            Bạn chưa có tài khoản?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;
