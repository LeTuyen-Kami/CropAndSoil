import { useMutation } from "@tanstack/react-query";
import { View, ActivityIndicator } from "react-native";
import Header from "~/components/common/Header";
import ScreenContainer from "~/components/common/ScreenContainer";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { toast } from "~/components/common/Toast";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { authService } from "~/services/api/auth.service";
import { signOut } from "~/store/atoms";

const Settings = () => {
  const mutateLogout = useMutation({
    mutationFn: authService.logout,
  });

  const onPressLogout = () => {
    mutateLogout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Đăng xuất thành công");
        signOut();
      },
    });
  };

  return (
    <ScreenWrapper
      hasGradient={true}
      gradientColor={["#159747", "#ff0000"]}
      hasSafeBottom={false}
    >
      <Header
        title="Cài đặt"
        hasSafeTop={false}
        className="bg-transparent border-0"
        textColor="#fff"
      />
      <View className="flex-1 justify-center items-center bg-white">
        <Button onPress={onPressLogout}>
          {mutateLogout.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text>Đăng xuất</Text>
          )}
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Settings;
