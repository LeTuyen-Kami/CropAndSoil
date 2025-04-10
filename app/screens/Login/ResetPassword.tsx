import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { validatePhoneNumber } from "~/utils";
import Animated, { withTiming } from "react-native-reanimated";
import { ResetPasswordStep, useStepAnimation } from "~/hooks/useStepAnimation";

const ResetPassword = () => {
  const [step, setStep] = useState<ResetPasswordStep>("phone");
  const [previousStep, setPreviousStep] = useState<ResetPasswordStep | null>(
    null
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [hasInput, setHasInput] = useState(false);
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const { animationProgress, getEnteringAnimation, getExitingAnimation } =
    useStepAnimation<ResetPasswordStep>();

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    setHasInput(text.length > 0);
  };

  const handleClearInput = () => {
    setPhoneNumber("");
    setHasInput(false);
  };

  const handlePhoneContinue = () => {
    setPreviousStep(step);
    setStep("code");
    animationProgress.value = withTiming(1, { duration: 300 });
  };

  const handleCodeContinue = () => {
    setPreviousStep(step);
    setStep("newPassword");
    animationProgress.value = withTiming(1, { duration: 300 });
  };

  const handleGoBack = () => {
    if (step === "code") {
      setPreviousStep(step);
      setStep("phone");
    } else if (step === "newPassword") {
      setPreviousStep(step);
      setStep("code");
    }
  };

  const handlePhoneChanged = () => {
    // Handle phone number changed action
    console.log("Phone number changed");
  };

  const togglePasswordVisibility = () => {
    setTogglePassword(!togglePassword);
  };

  useEffect(() => {
    setStep("phone");
  }, []);

  return (
    <View className="px-8 pt-10 mb-6">
      {/* Header with back button */}
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
          Đặt lại mật khẩu
        </Text>
      </View>

      {/* Instruction */}
      <View className="items-center mb-4">
        <Text className="text-xs text-[#575964] text-center">
          {step === "phone"
            ? "Vui lòng nhập SĐT của bạn để nhận mã xác thực từ SMS."
            : step === "code"
            ? "Vui lòng nhập mã xác thực được gửi tới SĐT của bạn."
            : "Vui lòng đặt mật khẩu mới cho tài khoản của bạn."}
        </Text>
      </View>

      {step === "phone" ? (
        <Animated.View
          entering={getEnteringAnimation(step, previousStep)}
          exiting={getExitingAnimation(step, previousStep)}
        >
          {/* Phone Input */}
          <Input
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            placeholder="Số điện thoại"
            keyboardType="phone-pad"
            className=" bg-[#F5F5F5] my-4"
            leftIcon={
              <Image
                source={imagePaths.icUserRounded}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
              />
            }
            rightIcon={
              hasInput ? (
                <TouchableOpacity onPress={handleClearInput}>
                  <Image
                    source={imagePaths.icRemoveInput}
                    style={{ width: 20, height: 20 }}
                    contentFit="contain"
                  />
                </TouchableOpacity>
              ) : null
            }
          />

          {/* Phone Changed Link */}
          <View className="p-4">
            <TouchableOpacity onPress={handlePhoneChanged}>
              <Text className="text-sm text-[#159747] text-center">
                Số điện thoại đã thay đổi?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <Button
            onPress={handlePhoneContinue}
            className="bg-[#FCBA27] disabled:opacity-50"
            disabled={!validatePhoneNumber(phoneNumber)}
          >
            <Text className="font-medium text-white">Tiếp tục</Text>
          </Button>
        </Animated.View>
      ) : null}

      {step === "code" ? (
        <Animated.View
          entering={getEnteringAnimation(step, previousStep)}
          exiting={getExitingAnimation(step, previousStep)}
        >
          {/* Verification Code Input */}
          <Input
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="Nhập mã xác thực"
            keyboardType="number-pad"
            className="bg-[#F5F5F5] my-4"
            leftIcon={
              <Image
                source={imagePaths.icLock}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
              />
            }
          />

          {/* Resend Code Link */}
          <View className="p-4">
            <TouchableOpacity>
              <Text className="text-sm text-[#159747] text-center">
                Gửi lại mã xác thực
              </Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <Button
            onPress={handleCodeContinue}
            className="bg-[#FCBA27] disabled:opacity-50"
            disabled={verificationCode.length < 4}
          >
            <Text className="font-medium text-white">Tiếp tục</Text>
          </Button>
        </Animated.View>
      ) : null}

      {step === "newPassword" ? (
        <Animated.View
          entering={getEnteringAnimation(step, previousStep)}
          exiting={getExitingAnimation(step, previousStep)}
          className="flex-1"
        >
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
            className="bg-[#F5F5F5] my-4"
          />
          {/* Password Requirements */}
          <View className="">
            <Text className="text-xs text-[#575964] tracking-tight ">
              1.Mật khẩu phải dài từ 8 - 16 kí tự {`\n`}2.Bắt buộc có ít nhất 1
              số và 1 kí tự chữ
            </Text>
          </View>
          {/* Continue Button */}
          <Button
            onPress={() => {}}
            className="bg-[#FCBA27] mt-4 disabled:opacity-50"
            disabled={password.length < 8}
          >
            <Text className="font-medium text-white">Tiếp tục</Text>
          </Button>
        </Animated.View>
      ) : null}
    </View>
  );
};

export default ResetPassword;
