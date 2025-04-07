import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientBackground from "~/components/common/GradientBackground";
import Header from "~/components/common/Header";
import ScreenContainer from "~/components/common/ScreenContainer";
import { toast } from "~/components/common/Toast";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import EditProfileField from "./EditProfileField";

type ProfileItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder?: string;
  onPress?: () => void;
};

type ProfileForm = {
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  taxId: string;
};

const ProfileItem = ({
  icon,
  label,
  value,
  placeholder,
  onPress,
}: ProfileItemProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center p-3 mb-2 bg-white rounded-lg"
      onPress={onPress}
    >
      <View className="mr-2">{icon}</View>
      <View className="flex-1">
        <Text className="text-sm text-black">{label}</Text>
        <Text className={`text-sm ${value ? "text-gray-600" : "text-red-500"}`}>
          {value || placeholder}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
    </TouchableOpacity>
  );
};

const EditProfileScreen = () => {
  const { top, bottom } = useSafeAreaInsets();

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: "Cherry Phan",
    phone: "0912345678",
    email: "tr*************@gmail.com",
    gender: "",
    birthDate: "",
    taxId: "",
  });

  const [editField, setEditField] = useState<{
    visible: boolean;
    field: string;
    value: string;
    label: string;
    keyboardType: "default" | "numeric" | "email-address" | "phone-pad";
  }>({
    visible: false,
    field: "",
    value: "",
    label: "",
    keyboardType: "default",
  });

  const handleEditField = (
    field: keyof ProfileForm,
    label: string,
    keyboardType:
      | "default"
      | "numeric"
      | "email-address"
      | "phone-pad" = "default"
  ) => {
    setEditField({
      visible: true,
      field,
      value: profileForm[field],
      label,
      keyboardType,
    });
  };

  const handleSaveField = (value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      [editField.field]: value,
    }));
  };

  const handleClose = () => {
    setEditField((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const handleSaveProfile = () => {
    // Here you would call the API to save the profile
    toast.success("Thông tin hồ sơ đã được cập nhật");
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      toast.error("Cần quyền truy cập vào thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the image upload here
      toast.success("Ảnh đã được chọn");
    }
  };

  return (
    <ScreenContainer
      paddingBottom={0}
      paddingHorizontal={0}
      paddingVertical={0}
      safeArea={false}
      header={
        <GradientBackground gradientStyle={{ paddingTop: top }}>
          <Header
            title="Sửa hồ sơ"
            className="bg-transparent border-0"
            textColor="white"
          />
        </GradientBackground>
      }
    >
      <View className="flex-1">
        <GradientBackground>
          <View className="items-center mt-6 mb-4">
            <View className="relative z-10">
              <View className="w-[140px] h-[140px] rounded-full bg-[#DEF1E5] border-4 border-white justify-center items-center">
                <Ionicons name="person" size={60} color="#159747" />
              </View>
              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-[#AEAEAE] w-[30px] h-[30px] rounded-lg justify-center items-center border-[1.6px] border-white"
                onPress={handlePickImage}
              >
                <Feather name="edit-2" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="absolute top-[50%] left-0 right-0 bottom-0 bg-[#F2F2F2] rounded-t-3xl"></View>
        </GradientBackground>
        <ScrollView>
          <View className="">
            <ProfileItem
              icon={
                <Ionicons name="person-outline" size={24} color="#AEAEAE" />
              }
              label="Họ & tên"
              value={profileForm.fullName}
              onPress={() => handleEditField("fullName", "Họ & tên")}
            />

            <ProfileItem
              icon={<Feather name="phone" size={24} color="#AEAEAE" />}
              label="Số điện thoại"
              value={profileForm.phone}
              onPress={() =>
                handleEditField("phone", "Số điện thoại", "phone-pad")
              }
            />

            <ProfileItem
              icon={
                <MaterialIcons name="mail-outline" size={24} color="#AEAEAE" />
              }
              label="Email"
              value={profileForm.email}
              onPress={() => handleEditField("email", "Email", "email-address")}
            />

            <ProfileItem
              icon={
                <Ionicons
                  name="male-female-outline"
                  size={24}
                  color="#AEAEAE"
                />
              }
              label="Giới tính"
              value={profileForm.gender}
              placeholder="Thêm thông tin giới tính"
              onPress={() => handleEditField("gender", "Giới tính")}
            />

            <ProfileItem
              icon={
                <Ionicons name="calendar-outline" size={24} color="#AEAEAE" />
              }
              label="Ngày sinh"
              value={profileForm.birthDate}
              placeholder="Thêm ngày, tháng, năm sinh"
              onPress={() => handleEditField("birthDate", "Ngày sinh")}
            />

            <ProfileItem
              icon={
                <FontAwesome name="file-text-o" size={24} color="#AEAEAE" />
              }
              label="Mã số thuế & Chứng từ kinh doanh"
              value={profileForm.taxId}
              placeholder="Nhập thông tin & tải lên tệp bắt buộc để hoàn tất"
              onPress={() => handleEditField("taxId", "Mã số thuế")}
            />
          </View>
        </ScrollView>
        <View style={{ paddingBottom: bottom }} className="px-2">
          <Button
            variant="default"
            className="bg-[#FCBA27] rounded-full py-3 active:bg-[#FCBA27]/50"
            onPress={handleSaveProfile}
          >
            <Text className="text-base font-medium text-white">Lưu</Text>
          </Button>
        </View>
      </View>

      <EditProfileField
        visible={editField.visible}
        onClose={handleClose}
        fieldLabel={editField.label}
        currentValue={editField.value}
        onSave={handleSaveField}
        keyboardType={editField.keyboardType}
      />
    </ScreenContainer>
  );
};

export default EditProfileScreen;
