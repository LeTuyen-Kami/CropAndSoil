import { useMutation } from "@tanstack/react-query";
import {
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
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

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <View className="flex-col gap-[1px]">
      <Text className="text-xs font-medium tracking-tight text-[#676767] px-5 py-3">
        {title}
      </Text>
      {children}
    </View>
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

  const mutateLogout = useMutation({
    mutationFn: authService.logout,
  });

  const onPressLogout = () => {
    mutateLogout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Đăng xuất thành công");
        signOut();
        navigation.smartGoBack();
      },
    });
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
          <Section title="Tài khoản của tôi">
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
            {mutateLogout.isPending ? (
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
