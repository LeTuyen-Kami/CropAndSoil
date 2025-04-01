import { useState } from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import { Button } from "~/components/ui/button";
import { imagePaths } from "~/assets/imagePath";

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);

  const togglePasswordVisibility = () => {
    setTogglePassword(!togglePassword);
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password");
  };

  const handleRegister = () => {
    console.log("Register");
  };

  const handleLogin = () => {
    console.log("Login");
  };

  return (
    <View className="flex-1 px-8 mb-6">
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
        <Button onPress={handleLogin} className="h-11 bg-[#FCBA27] mb-4">
          <Text className="text-base font-medium text-white">Đăng nhập</Text>
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
