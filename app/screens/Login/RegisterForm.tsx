import Checkbox from "expo-checkbox";
import { Image } from "expo-image";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { imagePaths } from "~/assets/imagePath";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import {
  formatPhoneNumber,
  getErrorMessage,
  validatePhoneNumber,
} from "~/utils";
import { loginAtom } from "./atom";
import { authService, SendSmsOtpResponse } from "~/services/api/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "~/components/common/Toast";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { authAtom } from "~/store/atoms";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "~/navigation/types";
import * as WebBrowser from "expo-web-browser";
import { ENV } from "~/utils";
import { userService } from "~/services/api/user.service";

type IStep = "phone" | "code";

const RegisterForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [step, setStep] = useState<IStep>("phone");
  const [previousStep, setPreviousStep] = useState<IStep | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [loginState, setLoginState] = useAtom(loginAtom);
  const [registerSendOtpState, setRegisterSendOtpState] =
    useState<SendSmsOtpResponse | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setAuthState = useSetAtom(authAtom);
  const queryClient = useQueryClient();
  const mutationRegisterSendOtp = useMutation({
    mutationFn: authService.registerSendOtp,
  });

  const mutationRegisterVerifyOtp = useMutation({
    mutationFn: authService.registerVerifyOtp,
  });

  // Animation progress value

  const togglePasswordVisibility = () => {
    setTogglePassword(!togglePassword);
  };

  const toggleAgreement = () => {
    setIsAgreed(!isAgreed);
  };

  const handleLogin = () => {
    setLoginState({
      step: "signIn",
      previousStep: loginState.step || "signUp",
    });
  };

  const handleRegister = async () => {
    toggleLoading(true);
    mutationRegisterSendOtp.mutate(
      {
        flow: "REGISTER",
        phone: phoneNumber,
      },
      {
        onSuccess: (data) => {
          setRegisterSendOtpState(data);
          setPreviousStep(step);
          setStep("code");
        },
        onError: (error) => {
          toast.error(getErrorMessage(error), "top", 3000);
        },
        onSettled: () => {
          toggleLoading(false);
        },
      }
    );
  };

  const handleBecomeSupplier = () => {
    WebBrowser.openBrowserAsync(ENV.EXPO_PUBLIC_AGENT_LINK);
  };

  const handleOpenTerms = () => {
    WebBrowser.openBrowserAsync(ENV.EXPO_PUBLIC_TERMS_LINK);
  };

  const handleGoBack = () => {
    if (step === "code") {
      setPreviousStep(step);
      setStep("phone");
    }
  };

  const onOtpChange = (otp: string) => {
    if (otp.length === 6) {
      toggleLoading(true);
      mutationRegisterVerifyOtp.mutate(
        {
          flow: "REGISTER",
          phone: phoneNumber,
          transactionId: registerSendOtpState?.transactionId || "",
          otp,
          password,
        },
        {
          onSuccess: (data) => {
            toast.success("Đăng ký thành công");
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
            toast.error(
              getErrorMessage(error, "Lỗi khi xác thực mã OTP"),
              "top",
              3000
            );
          },
          onSettled: () => {
            toggleLoading(false);
          },
        }
      );
    }
  };
  const disabledRegister = useMemo(() => {
    return !validatePhoneNumber(phoneNumber) || !password || !isAgreed;
  }, [phoneNumber, password, isAgreed]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "code" && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, step]);

  return (
    <View className="px-8 pt-10 mb-6">
      {/* Header with back button for OTP screen */}
      <View className="flex-row justify-center items-center mb-4">
        {step !== "phone" && (
          <TouchableOpacity onPress={handleGoBack} className="absolute left-0">
            <Image
              source={imagePaths.icArrowLeft}
              style={{ width: 24, height: 24 }}
              contentFit="contain"
            />
          </TouchableOpacity>
        )}
        <Text className="text-3xl font-bold text-[#383B45] text-center">
          {step === "phone" ? "Đăng ký" : "Nhập mã xác minh"}
        </Text>
      </View>

      {/* Register Form */}
      {step === "phone" && (
        <Animated.View exiting={SlideOutLeft}>
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
              className="bg-[#F5F5F5]"
            />
          </View>

          {/* Terms & Conditions */}
          <Pressable onPress={toggleAgreement}>
            <View className="flex-row gap-2 my-4">
              <Checkbox
                value={isAgreed}
                onValueChange={toggleAgreement}
                color="#159747"
                style={{ borderRadius: 4, width: 16, height: 16 }}
              />
              <Text className="text-[10px] text-[#575964] flex-1">
                Tôi đã đọc và đồng ý với{" "}
                <Text
                  className="text-[#159747] text-[10px]"
                  onPress={handleOpenTerms}
                >
                  Điều khoản sử dụng.{" "}
                </Text>
                Tôi cam kết có đầy đủ giấy phép cần thiết theo quy định pháp
                luật.
              </Text>
            </View>
          </Pressable>

          {/* Register Button */}
          <Button
            onPress={handleRegister}
            className="h-11 bg-[#FCBA27] mb-4 disabled:opacity-50"
            disabled={disabledRegister}
          >
            {mutationRegisterSendOtp.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-base font-medium text-white">Đăng ký</Text>
            )}
          </Button>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="h-11 border border-[#FCBA27] rounded-full justify-center items-center mb-4"
          >
            <Text className="text-[#FCBA27] font-medium text-base">
              Bạn đã có tài khoản?
            </Text>
          </TouchableOpacity>

          {/* Become Supplier Button */}
          <TouchableOpacity
            onPress={handleBecomeSupplier}
            className="h-11 bg-white border border-[#CCCCCC] rounded-full justify-center items-center"
          >
            <Text className="text-[#676767] font-medium text-base">
              Trở thành nhà cung cấp
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {step === "code" && (
        <Animated.View entering={SlideInRight} exiting={SlideOutLeft}>
          <Text className="mt-4 text-xs tracking-tight text-center text-zinc-600">
            Mã xác thực (OTP) đã được gửi qua tin nhắn của số{"\n"}
            <Text className="text-xs tracking-tight text-black">
              {formatPhoneNumber(phoneNumber || "0123456789")}
            </Text>
          </Text>

          <View className="my-8">
            <OtpInput
              theme={{
                pinCodeContainerStyle: {
                  backgroundColor: "#DDF1E5",
                },
              }}
              onTextChange={onOtpChange}
            />
          </View>

          {countdown > 0 ? (
            <Text className="text-xs tracking-tight text-center text-zinc-600">
              Vui lòng chờ{" "}
              <Text className="text-xs font-bold text-[#159747]">
                {countdown}
              </Text>{" "}
              giây để nhận lại mã xác thực.{"\n"}Lưu ý: Kiểm tra thông báo của
              Zalo để nhận Mã kịp thời Nếu bạn chưa có tài khoản Zalo, hãy nhấn
              mũi tên trở lại để chọn phương thức khác
            </Text>
          ) : (
            <TouchableOpacity
              className="mt-4"
              onPress={() => {
                setCountdown(60);
                handleRegister();
              }}
            >
              <Text className="text-sm text-[#159747] text-center">
                Gửi lại mã xác thực
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </View>
  );
};

export default RegisterForm;
