import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";

const AddressItem = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="flex-row gap-2 p-3 mb-3 bg-white rounded-2xl"
      onPress={() => navigation.navigate("Address")}
    >
      <View className="justify-start items-start">
        <Image
          source={imagePaths.icLocation}
          style={{ width: 20, height: 20 }}
          contentFit="contain"
        />
      </View>
      <View className="flex-1">
        <View className="flex-row gap-2 items-center pb-1">
          <Text className="text-[#383B45] font-medium text-sm">
            Cherry Phan
          </Text>
          <View className="w-[1] h-4 bg-[#E3E3E3]" />
          <Text className="text-[#AEAEAE] text-xs">(+84) 123 456 789</Text>
        </View>
        <Text className="text-[#676767] text-xs leading-[18px]">
          606/32/16, đường số 10, khu phố 4{"\n"}
          Phường Hiệp Bình Phước, Thành Phố Thủ Đức, TP. Hồ Chí Minh
        </Text>
      </View>
      <TouchableOpacity className="justify-center">
        <Image
          source={imagePaths.icArrowRight}
          style={{ width: 20, height: 20, tintColor: "#393B45" }}
          contentFit="contain"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default AddressItem;
