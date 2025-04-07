import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { useAtomValue, useSetAtom } from "jotai";
import { Pressable, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";
import { RootStackParamList } from "~/navigation/types";
import { authAtom } from "~/store/atoms";
import { loginAtom } from "../Login/atom";
const HeaderLogging = () => {
  const setLoginState = useSetAtom(loginAtom);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const auth = useAtomValue(authAtom);

  const renderContent = () => {
    if (auth?.user) {
      return (
        <TouchableOpacity
          className="flex-row items-center px-4 py-4"
          activeOpacity={0.9}
          onPress={() => {
            navigation.navigate("EditProfile");
          }}
        >
          <View className="h-12 w-12 rounded-full bg-[#DEF1E5] border-2 border-white justify-center items-center mr-2">
            <Image
              source={imagePaths.icUser}
              style={{ width: 24, height: 24 }}
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">
              {auth?.user?.name || auth?.user?.phone}
            </Text>
            <View className="flex-row gap-6 mt-1">
              <Text className="text-xs text-white">{102} Người theo dõi</Text>
              <Text className="text-xs text-white">{125} Đang theo dõi</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Image
              source={imagePaths.icArrowRight}
              style={{ width: 24, height: 24, tintColor: "#fff" }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    return (
      <View className="flex-row items-center px-4 py-4">
        <View className="h-12 w-12 rounded-full bg-[#DEF1E5] border border-white justify-center items-center mr-2">
          <Image source={imagePaths.icUser} style={{ width: 24, height: 24 }} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-white">
            Chào mừng bạn đến với Cropee!
          </Text>
          <View className="flex-row mt-2">
            <TouchableOpacity
              className="bg-[#FCBA27] rounded-full px-4 py-2 mr-2"
              onPress={() => {
                setLoginState({ step: "signIn" });
                navigation.navigate("Login");
              }}
            >
              <Text className="text-xs font-medium text-white">Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 bg-white rounded-full"
              onPress={() => {
                setLoginState({ step: "signUp" });
                navigation.navigate("Login");
              }}
            >
              <Text className="text-xs font-medium text-[#676767]">
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return renderContent();
};

export default HeaderLogging;
