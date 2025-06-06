import { useMutation } from "@tanstack/react-query";
import {
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import Header from "~/components/common/Header";
import ScreenContainer from "~/components/common/ScreenContainer";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { toast } from "~/components/common/Toast";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { authService } from "~/services/api/auth.service";
import { signOut } from "~/store/atoms";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { useState, useRef } from "react";

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
      navigation.smartNavigate("DevMode");
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
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between items-center px-5 py-3 bg-white">
        <Text className="text-sm leading-tight">{title}</Text>
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

  const mutateLogout = useMutation({
    mutationFn: authService.logout,
  });

  const onPressLogout = () => {
    setLoading(true);
    mutateLogout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Đăng xuất thành công");
      },
    });

    setTimeout(() => {
      signOut();
      navigation.smartGoBack();
      setLoading(false);
    }, 1000);
  };

  const changePassword = () => {
    navigation.smartNavigate("ChangePassword");
  };

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Thiết lập tài khoản"
        hasSafeTop={false}
        className="bg-transparent border-0"
        textColor="#fff"
      />
      <View className="flex-1 bg-[#EEE] rounded-t-3xl">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Section title="Tài khoản của tôi" onPressTitle={handleDevModeTap}>
            <SettingItem
              title="Tài khoản"
              onPress={() => navigation.smartNavigate("EditProfile")}
            />
            <SettingItem title="Đổi mật khẩu" onPress={changePassword} />
          </Section>
          <Section title="Thông tin">
            <SettingItem
              title="Sổ địa chỉ"
              onPress={() => navigation.smartNavigate("Address")}
            />
          </Section>
        </ScrollView>
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
      </View>
    </ScreenWrapper>
  );
};

export default Settings;
