import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { toast } from "~/components/common/Toast";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { UpdateUserPayload, userService } from "~/services/api/user.service";
import { authAtom } from "~/store/atoms";
import { getErrorMessage } from "~/utils";
import { GENDER_OPTIONS, MAX_IMAGE_SIZE } from "~/utils/contants";
import EditProfileField from "./EditProfileField";
import Alert from "~/components/common/Alert";

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
  avatar: ImagePicker.ImagePickerAsset | null;
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
      <View className="mr-2 h-full">{icon}</View>
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

  const auth = useAtomValue(authAtom);

  const queryClient = useQueryClient();

  const navigation = useNavigation();

  const mutationUpdateProfile = useMutation({
    mutationFn: (data: UpdateUserPayload) => userService.updateProfile(data),
  });

  const {
    data: profile,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.getProfile(),
    enabled: auth?.isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: "",
    phone: "",
    email: "",
    gender: "",
    birthDate: "",
    taxId: "",
    avatar: null,
  });

  const [editField, setEditField] = useState<{
    visible: boolean;
    field: string;
    value: string;
    label: string;
    keyboardType: "default" | "numeric" | "email-address" | "phone-pad";
    fieldType: "text" | "date" | "gender";
  }>({
    visible: false,
    field: "",
    value: "",
    label: "",
    keyboardType: "default",
    fieldType: "text",
  });

  const handleEditField = (
    field: keyof ProfileForm,
    label: string,
    keyboardType:
      | "default"
      | "numeric"
      | "email-address"
      | "phone-pad" = "default",
    fieldType: "text" | "date" | "gender" = "text"
  ) => {
    setEditField({
      visible: true,
      field,
      value: profileForm[field] as string,
      label,
      keyboardType,
      fieldType,
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
    mutationUpdateProfile.mutate(
      {
        name: profileForm.fullName,
        phone: profileForm.phone,
        email: profileForm.email,
        gender: profileForm.gender,
        birthday: profileForm.birthDate,
        avatarFile:
          profileForm.avatar && profileForm.avatar.uri
            ? {
                uri: profileForm.avatar?.uri || "",
                type: profileForm.avatar?.type || "",
                name: profileForm.avatar?.fileName || "",
              }
            : undefined,
      },
      {
        onSuccess: (data) => {
          toast.success("Thông tin hồ sơ đã được cập nhật");
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: (error) => {
          const message = getErrorMessage(error, "Có lỗi xảy ra khi cập nhật");
          toast.error(message);
        },
      }
    );
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
      quality: 0.8,
    });

    if (result.assets?.[0]) {
      //kiểm tra image size

      if (
        result.assets[0]?.fileSize &&
        result.assets[0]?.fileSize > MAX_IMAGE_SIZE
      ) {
        toast.error("Kích thước ảnh không được vượt quá 2MB");
        return;
      }

      console.log("fileSize", result.assets[0]?.fileSize);

      // Handle the image upload here
      toast.success("Ảnh đã được chọn");
      setProfileForm((prev) => ({
        ...prev,
        avatar: result.assets[0],
      }));
    }
  };

  useEffect(() => {
    if (profile) {
      setProfileForm({
        fullName: profile.name,
        phone: profile.phone,
        email: profile.email,
        gender: profile.gender,
        birthDate: profile.birthday,
        taxId: profile.taxNumber,
        avatar: {
          uri: profile.avatarUrl,
          width: 140,
          height: 140,
        },
      });
    }
  }, [profile]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
        <Header
          title="Sửa hồ sơ"
          className="bg-transparent border-0"
          textColor="white"
          hasSafeTop={false}
        />
        <View className="flex-1">
          <View>
            <View className="absolute top-[50%] left-0 right-0 bottom-0 bg-[#F2F2F2] rounded-t-3xl"></View>

            <View className="items-center mb-4">
              <View className="relative">
                <View className="rounded-full bg-[#DEF1E5] border-4 border-white justify-center items-center">
                  <Image
                    source={profileForm.avatar?.uri}
                    className="w-[120px] h-[120px] rounded-full"
                    contentFit="cover"
                    placeholder={imagePaths.icUser}
                    placeholderContentFit="cover"
                  />
                </View>
                <TouchableOpacity
                  className="absolute bottom-0 right-4 bg-[#AEAEAE] w-[30px] h-[30px] rounded-full justify-center items-center border-[1.6px] border-white"
                  onPress={handlePickImage}
                >
                  {/* <Feather name="edit-2" size={16} color="white" /> */}
                  <Octicons name="pencil" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="flex-col flex-1 bg-[#F2F2F2]">
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
              }
            >
              <View className="">
                <ProfileItem
                  icon={
                    <Image
                      source={imagePaths.icUser1}
                      className="size-6"
                      contentFit="contain"
                    />
                  }
                  label="Họ & tên"
                  value={profileForm.fullName}
                  placeholder={"Thêm thông tin họ & tên"}
                  onPress={() => handleEditField("fullName", "Họ & tên")}
                />

                <ProfileItem
                  icon={
                    <Image
                      source={imagePaths.icPhone1}
                      className="size-6"
                      contentFit="contain"
                    />
                  }
                  label="Số điện thoại"
                  value={profileForm.phone}
                  placeholder={"Thêm thông tin số điện thoại"}
                  onPress={() =>
                    handleEditField("phone", "Số điện thoại", "phone-pad")
                  }
                />

                <ProfileItem
                  icon={
                    <Image
                      source={imagePaths.icLetter}
                      className="size-6"
                      contentFit="contain"
                    />
                  }
                  label="Email"
                  value={profileForm.email}
                  placeholder={"Thêm thông tin email"}
                  onPress={() =>
                    handleEditField("email", "Email", "email-address")
                  }
                />

                <ProfileItem
                  icon={
                    <Image
                      source={imagePaths.icGender}
                      className="size-6"
                      contentFit="contain"
                    />
                  }
                  label="Giới tính"
                  value={
                    GENDER_OPTIONS.find(
                      (option) => option.value === profileForm.gender
                    )?.label || ""
                  }
                  placeholder="Thêm thông tin giới tính"
                  onPress={() =>
                    handleEditField("gender", "Giới tính", "default", "gender")
                  }
                />

                <ProfileItem
                  icon={
                    <Image
                      source={imagePaths.icCalendar}
                      className="size-6"
                      contentFit="contain"
                    />
                  }
                  label="Ngày sinh"
                  value={
                    dayjs(profileForm.birthDate).isValid()
                      ? dayjs(profileForm.birthDate).format("DD/MM/YYYY")
                      : ""
                  }
                  placeholder="Thêm ngày, tháng, năm sinh"
                  onPress={() => {
                    if (Platform.OS === "android") {
                      DateTimePickerAndroid.open({
                        value: new Date(profileForm.birthDate),
                        onChange: (event, date) => {
                          console.log("date", date);

                          setProfileForm((prev) => ({
                            ...prev,
                            birthDate: date?.toISOString() || "",
                          }));
                        },
                        maximumDate: new Date(),
                        mode: "date",
                        display: "calendar",
                      });
                    } else {
                      handleEditField(
                        "birthDate",
                        "Ngày sinh",
                        "default",
                        "date"
                      );
                    }
                  }}
                />

                <ProfileItem
                  icon={
                    <Image
                      source={imagePaths.icDocument}
                      className="size-6"
                      contentFit="contain"
                    />
                  }
                  label="Mã số thuế & Chứng từ kinh doanh"
                  value={profileForm.taxId}
                  placeholder="Nhập thông tin & tải lên tệp bắt buộc để hoàn tất"
                  onPress={() => {
                    navigation.navigate("BusinessVoucher");
                    if (!profileForm.taxId) {
                    } else {
                      // toast.info("Bạn đã tải lên chứng từ kinh doanh");
                    }
                  }}
                />
                <View className="px-2 py-4">
                  <Alert
                    title="Tài khoản đang chờ duyệt."
                    description="Giấy phép kinh doanh đã được tải lên và đang trong quá trình xem xét, chờ phê duyệt từ Cropee."
                  />
                </View>
              </View>
            </ScrollView>
            <View className="px-2" style={{ paddingBottom: bottom }}>
              <Button
                variant="default"
                className="bg-[#FCBA27] rounded-full py-3 active:bg-[#FCBA27]/50"
                onPress={handleSaveProfile}
              >
                {mutationUpdateProfile.isPending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-base font-medium text-white">Lưu</Text>
                )}
              </Button>
            </View>
          </View>
        </View>

        <EditProfileField
          visible={editField.visible}
          onClose={handleClose}
          fieldLabel={editField.label}
          currentValue={editField.value}
          onSave={handleSaveField}
          keyboardType={editField.keyboardType}
          fieldType={editField.fieldType}
        />
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
};

export default EditProfileScreen;
