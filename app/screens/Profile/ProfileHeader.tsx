import { TouchableOpacity } from "react-native";

import { View } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "~/navigation/types";

// Profile header component
const ProfileHeader = () => {
  const navigation = useNavigation<RootStackScreenProps<"MainTabs">>();

  return (
    <View className="flex-row justify-between items-center pr-4">
      <View className="flex-1">
        {/* Seller section */}
        <TouchableOpacity className="bg-[#EFF8F2] flex-row items-center rounded-r-full w-auto self-start h-8 pl-2 pr-4">
          <Image source={imagePaths.icShop} style={{ width: 14, height: 14 }} />
          <Text className="ml-1 text-xs font-medium text-[#159747]">
            Trở thành nhà cung cấp
          </Text>
          <Image
            source={imagePaths.icArrowRight}
            style={{
              width: 14,
              height: 14,
            }}
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          className="mr-6"
          onPress={() => navigation.navigate("Settings")}
        >
          <Image
            source={imagePaths.icSettings}
            style={{ width: 24, height: 24, tintColor: "#FFFFFF" }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={imagePaths.icDialog}
            style={{ width: 24, height: 24, tintColor: "#FFFFFF" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileHeader;
