import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import Constants from "expo-constants";
import { useAtomValue } from "jotai";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { toast } from "~/components/common/Toast";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { authService } from "~/services/api/auth.service";
import { authAtom, showModalConfirm, signOut } from "~/store/atoms";
import { ENV, getDeviceId, getErrorMessage } from "~/utils";
import * as WebBrowser from "expo-web-browser";
import { cn } from "~/lib/utils";
import { userService } from "~/services/api/user.service";
import { toggleLoading } from "~/components/common/ScreenLoading";

const useDevMode = () => {
  const [tapCount, setTapCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useSmartNavigation();

  const handleTap = () => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount >= 7) {
      // Activate dev mode
      setTapCount(0);
      toast.success("Dev Mode activated!");
      navigation.navigate("DevMode");
      return;
    }

    timerRef.current = setTimeout(() => {
      setTapCount(0);
    }, 1000);
  };

  return { handleTap, tapCount };
};

const Section = ({
  title,
  children,
  onPressTitle,
}: {
  title: string;
  children: React.ReactNode;
  onPressTitle?: () => void;
}) => {
  return (
    <Pressable className="flex-col gap-[1px]" onPress={onPressTitle}>
      <Text className="text-xs font-medium tracking-tight text-[#676767] px-5 py-3">
        {title}
      </Text>
      {children}
    </Pressable>
  );
};
const SettingItem = ({
  title,
  onPress,
  titleClassName,
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  titleClassName?: string;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between items-center px-5 py-3 bg-white">
        <Text className={cn("text-sm leading-tight", titleClassName)}>
          {title}
        </Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );
};

const Settings = () => {
  const navigation = useSmartNavigation();
  const { bottom } = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const { handleTap: handleDevModeTap } = useDevMode();
  const auth = useAtomValue(authAtom);

  const mutateLogout = useMutation({
    mutationFn: authService.logout,
  });

  const onPressLogout = () => {
    if (loading) return;

    setLoading(true);
    mutateLogout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Đăng xuất thành công");
        signOut();
        navigation.smartGoBack();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, "Lỗi khi đăng xuất"));
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  const changePassword = () => {
    navigation.smartNavigate("ChangePassword");
  };

  const handleOpenPolicy = () => {
    WebBrowser.openBrowserAsync(ENV.EXPO_PUBLIC_POLICY_LINK);
  };

  const handleOpenTerms = () => {
    WebBrowser.openBrowserAsync(ENV.EXPO_PUBLIC_TERMS_LINK);
  };

  const handleOpenIntro = () => {
    WebBrowser.openBrowserAsync(ENV.EXPO_PUBLIC_INTRO_LINK);
  };

  const handleDeleteAccount = () => {
    showModalConfirm({
      title: "Xóa tài khoản",
      message:
        "Bạn có chắc chắn muốn xóa tài khoản không? Sau khi xóa tài khoản, bạn sẽ không thể đăng nhập lại vào hệ thống.",
      onConfirm: () => {
        toggleLoading(true);
        userService
          .requestDeleteAccount({
            reason: "Không có nhu cầu sử dụng nữa",
            email: auth?.user?.email || "",
            phone: auth?.user?.phone || "",
          })
          .then(() => {
            toast.success("Yêu cầu xóa tài khoản đã được gửi");
            onPressLogout();
          })
          .catch((error) => {
            toast.error(getErrorMessage(error, "Lỗi khi xóa tài khoản"));
          })
          .finally(() => {
            toggleLoading(false);
          });
      },
    });
  };

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title={auth?.isLoggedIn ? "Thiết lập tài khoản" : "Cài đặt"}
        hasSafeTop={false}
        className="bg-transparent border-0"
        textColor="#fff"
      />
      <View className="flex-1 bg-[#EEE] rounded-t-3xl">
        <ScrollView showsVerticalScrollIndicator={false}>
          {auth?.isLoggedIn && (
            <Section title="Tài khoản của tôi">
              <SettingItem
                title="Tài khoản"
                onPress={() => navigation.smartNavigate("EditProfile")}
              />
              <SettingItem title="Đổi mật khẩu" onPress={changePassword} />
              <SettingItem
                title="Xóa tài khoản"
                onPress={handleDeleteAccount}
                titleClassName="text-red-500"
              />
            </Section>
          )}

          {auth?.isLoggedIn && (
            <Section title="Thông tin">
              <SettingItem
                title="Sổ địa chỉ"
                onPress={() => navigation.smartNavigate("Address")}
              />
            </Section>
          )}

          <Section title="Về chúng tôi" onPressTitle={handleDevModeTap}>
            <SettingItem title="Giới thiệu" onPress={handleOpenIntro} />
            <SettingItem
              title="Điều khoản và điều kiện"
              onPress={handleOpenTerms}
            />
            <SettingItem
              title="Chính sách bảo mật"
              onPress={handleOpenPolicy}
            />
          </Section>

          <Section title="Thông tin ứng dụng">
            <View className="px-5 py-3 bg-white">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm leading-tight">Phiên bản</Text>
                <Text className="text-sm text-[#676767]">
                  {Constants.expoConfig?.version || "1.0.0"}
                </Text>
              </View>
            </View>
          </Section>
          {/* <View className="justify-center items-center py-2">
            <Text className="text-[10px] text-[#676767]" selectable>
              {getDeviceId()}
            </Text>
          </View> */}
        </ScrollView>
        {auth?.isLoggedIn && (
          <View
            className="px-2"
            style={{
              paddingBottom: bottom,
            }}
          >
            <Button onPress={onPressLogout} className="bg-[#FCBA26] ">
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text>Đăng xuất</Text>
              )}
            </Button>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Settings;
