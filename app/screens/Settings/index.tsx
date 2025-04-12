import { useMutation } from "@tanstack/react-query";
import { View, ScrollView, Linking } from "react-native";
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

const SettingItem = ({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}) => {
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      className="flex-row items-center p-4 mb-2 w-full bg-gray-50 rounded-xl"
    >
      <View className="mr-4">{icon}</View>
      <View className="flex-1">
        <Text className="text-base font-medium">{title}</Text>
        {subtitle && <Text className="text-xs text-gray-500">{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Button>
  );
};

const Settings = () => {
  const appVersion = Constants.manifest?.version || "1.0.0";

  const mutateLogout = useMutation({
    mutationFn: authService.logout,
  });

  const onPressLogout = () => {
    signOut();

    // mutateLogout.mutate(undefined, {
    //   onSuccess: () => {
    //     toast.success("Đăng xuất thành công");
    //     signOut();
    //   },
    // });
  };

  const navigateToProfile = () => {
    // Handle navigation to profile screen via your app's navigation system
    toast.info("Đang chuyển hướng đến trang cá nhân");
  };

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Cài đặt"
        hasSafeTop={false}
        className="bg-transparent border-0"
        textColor="#fff"
      />
      <View className="flex-1 px-4 pt-6 bg-white rounded-t-3xl">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <Image
              source={require("../../../assets/icon.png")}
              style={{ width: 80, height: 80 }}
              className="mb-2 rounded-xl"
            />
            <Text className="text-xl font-bold">Crop And Soil</Text>
            <Text className="text-sm text-gray-500">
              Phiên bản {appVersion}
            </Text>
          </View>

          <Text className="px-2 mb-2 text-base font-bold">Tài khoản</Text>
          <SettingItem
            icon={<Ionicons name="person-outline" size={24} color="#10b981" />}
            title="Thông tin cá nhân"
            subtitle="Quản lý thông tin cá nhân của bạn"
            onPress={navigateToProfile}
          />
          <SettingItem
            icon={
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#6366f1"
              />
            }
            title="Thông báo"
            subtitle="Quản lý cài đặt thông báo"
            onPress={() => toast.info("Tính năng đang phát triển")}
          />

          <Text className="px-2 mt-4 mb-2 text-base font-bold">Pháp lý</Text>
          <SettingItem
            icon={
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="#f59e0b"
              />
            }
            title="Chính sách bảo mật"
            onPress={() => toast.info("Tính năng đang phát triển")}
          />
          <SettingItem
            icon={
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#ef4444"
              />
            }
            title="Điều khoản sử dụng"
            onPress={() => toast.info("Tính năng đang phát triển")}
          />

          <Text className="px-2 mt-4 mb-2 text-base font-bold">Ứng dụng</Text>
          <SettingItem
            icon={<Ionicons name="star-outline" size={24} color="#eab308" />}
            title="Đánh giá ứng dụng"
            onPress={() => Linking.openURL("https://play.google.com/store")}
          />
          <SettingItem
            icon={
              <Ionicons name="help-circle-outline" size={24} color="#0ea5e9" />
            }
            title="Trợ giúp & Hỗ trợ"
            onPress={() => toast.info("Tính năng đang phát triển")}
          />
          <SettingItem
            icon={
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#8b5cf6"
              />
            }
            title="Về chúng tôi"
            onPress={() => toast.info("Tính năng đang phát triển")}
          />

          <Button
            variant="outline"
            className="my-8 bg-red-500"
            onPress={onPressLogout}
            disabled={mutateLogout.isPending}
          >
            <Text className="font-medium text-white">Đăng xuất</Text>
          </Button>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Settings;
