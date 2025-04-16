import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import Header from "~/components/common/Header";
import { toggleLoading } from "~/components/common/ScreenLoading";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { toast } from "~/components/common/Toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { userService } from "~/services/api/user.service";
import { getErrorMessage } from "~/utils";

const ChangePassword = () => {
  const { bottom } = useSafeAreaInsets();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toggleNewPassword, setToggleNewPassword] = useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState(false);
  const navigation = useSmartNavigation();

  const mutationResetPassword = useMutation({
    mutationFn: userService.changePassword,
  });

  const toggleNewPasswordVisibility = () => {
    setToggleNewPassword(!toggleNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setToggleConfirmPassword(!toggleConfirmPassword);
  };

  const handleResetPassword = () => {
    toggleLoading(true);
    mutationResetPassword.mutate(
      {
        password: newPassword,
      },
      {
        onSuccess: (data) => {
          toast.success("Đặt lại mật khẩu thành công");
          navigation.smartGoBack();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Lỗi khi đặt lại mật khẩu"));
        },
        onSettled: () => {
          toggleLoading(false);
        },
      }
    );
  };

  const enabled =
    !!newPassword && !!confirmPassword && newPassword === confirmPassword;

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Thay đổi mật khẩu"
        hasSafeTop={false}
        className="bg-transparent border-0"
        textColor="#fff"
      />
      <View className="flex-1 bg-[#EEE] rounded-t-3xl">
        <View className="mt-4">
          <Text className="px-5 py-2 text-sm font-medium leading-tight text-[#383B45]">
            Mật khẩu mới
          </Text>
          <Input
            placeholder="Nhập mật khẩu mới"
            className="mx-2"
            value={newPassword}
            onChangeText={setNewPassword}
            textInputClassName="text-sm leading-4"
            secureTextEntry={!toggleNewPassword}
            rightIcon={
              <TouchableOpacity onPress={toggleNewPasswordVisibility}>
                <Image
                  source={
                    !toggleNewPassword
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
          />
        </View>
        <View className="mt-2.5">
          <Text className="px-5 py-2 text-sm font-medium leading-tight text-[#383B45]">
            Xác nhận mật khẩu
          </Text>
          <Input
            placeholder="Nhập lại mật khẩu mới"
            className="mx-2"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            textInputClassName="text-sm leading-4"
            secureTextEntry={!toggleConfirmPassword}
            rightIcon={
              <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                <Image
                  source={
                    !toggleConfirmPassword
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
          />
        </View>
        <View
          className="mx-2 mt-auto"
          style={{
            paddingBottom: bottom,
          }}
        >
          <Button
            className="bg-[#FCBA26] disabled:opacity-50"
            disabled={!enabled}
            onPress={handleResetPassword}
          >
            <Text>Xác nhận</Text>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ChangePassword;
