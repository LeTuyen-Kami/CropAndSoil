import { useEffect, useMemo, useState } from "react";
import { View, TouchableOpacity, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Image } from "expo-image";
import { Button } from "~/components/ui/button";
import { imagePaths } from "~/assets/imagePath";
import Checkbox from "expo-checkbox";
import { validatePhoneNumber } from "~/utils";
import { OtpInput } from "react-native-otp-entry";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type IStep = "phone" | "code";

const RegisterForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [step, setStep] = useState<IStep>("phone");
  const [previousStep, setPreviousStep] = useState<IStep | null>(null);
  const [countdown, setCountdown] = useState(60);

  // Animation progress value
  const animationProgress = useSharedValue(0);

  const togglePasswordVisibility = () => {
    setTogglePassword(!togglePassword);
  };

  const toggleAgreement = () => {
    setIsAgreed(!isAgreed);
  };

  const handleLogin = () => {
    console.log("Login");
  };

  const handleRegister = () => {
    setPreviousStep(step);
    setStep("code");
    animationProgress.value = withTiming(1, { duration: 300 });
  };

  const handleBecomeSupplier = () => {
    console.log("Become Supplier");
  };

  const handleGoBack = () => {
    if (step === "code") {
      setPreviousStep(step);
      setStep("phone");
      animationProgress.value = withTiming(0, { duration: 300 });
    }
  };

  const disabledRegister = useMemo(() => {
    return !validatePhoneNumber(phoneNumber) || !password || !isAgreed;
  }, [phoneNumber, password, isAgreed]);

  // Get animation based on direction (forward or backward)
  const getEnteringAnimation = (currentStep: IStep, prevStep: IStep | null) => {
    if (!prevStep) return FadeIn.duration(300);

    // Moving forward
    if (prevStep === "phone" && currentStep === "code") {
      return SlideInRight.duration(300);
    }

    // Moving backward
    return SlideInLeft.duration(300);
  };

  const getExitingAnimation = (currentStep: IStep, prevStep: IStep | null) => {
    if (!prevStep) return FadeOut.duration(300);

    // Moving forward
    if (currentStep === "phone" && prevStep === "code") {
      return SlideOutLeft.duration(300);
    }

    // Moving backward
    return SlideOutRight.duration(300);
  };

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
    <View className="flex-1 px-8 pt-10 mb-6">
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
        <Animated.View
          entering={getEnteringAnimation(step, previousStep)}
          exiting={getExitingAnimation(step, previousStep)}
          className="flex-1"
        >
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
                <Text className="text-[#159747] text-[10px]">
                  Điều khoản sử dụng.
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
            <Text className="text-base font-medium text-white">Đăng ký</Text>
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
        <Animated.View
          entering={getEnteringAnimation(step, previousStep)}
          exiting={getExitingAnimation(step, previousStep)}
          className="flex-1"
        >
          <Text className="mt-4 text-xs tracking-tight text-center text-zinc-600">
            Mã xác thực (OTP) đã được gửi qua tin nhắn của số{"\n"}
            <Text className="text-black">{phoneNumber || "0123456789"}</Text>
          </Text>

          <View className="my-8">
            <OtpInput
              theme={{
                pinCodeContainerStyle: {
                  backgroundColor: "#DDF1E5",
                },
              }}
            />
          </View>

          <Text className="mt-4 text-xs tracking-tight text-center text-zinc-600">
            Vui lòng chờ{" "}
            <Text className="text-xs font-bold text-[#159747]">
              {countdown}
            </Text>{" "}
            giây để nhận lại mã xác thực.{"\n"}Lưu ý: Kiểm tra thông báo của
            Zalo để nhận mã kịp thời.
          </Text>

          {countdown === 0 && (
            <TouchableOpacity className="mt-4" onPress={() => setCountdown(60)}>
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
