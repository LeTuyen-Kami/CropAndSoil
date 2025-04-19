import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";
import { IAddress } from "~/services/api/user.service";
import { formatPhoneNumber } from "~/utils";

const AddressItem = ({ address }: { address?: IAddress }) => {
  const navigation = useNavigation();

  const hasAddress = !!address;

  if (!hasAddress) {
    return (
      <TouchableOpacity
        className="flex-row gap-3 justify-center items-center p-4 mb-3 bg-white rounded-2xl"
        onPress={() => navigation.navigate("Address")}
      >
        <Image
          source={imagePaths.icLocation}
          style={{ width: 24, height: 24 }}
          contentFit="contain"
        />
        <View className="flex-1">
          <Text className="text-[#383B45] font-medium text-base mb-1">
            Bạn chưa có địa chỉ
          </Text>
          <Text className="text-[#676767] text-xs leading-[18px]">
            Vui lòng thêm địa chỉ để tiếp tục thanh toán
          </Text>
        </View>
        <View className="px-3 py-2 rounded-lg bg-primary">
          <Text className="text-xs font-medium text-white">Thêm ngay</Text>
        </View>
      </TouchableOpacity>
    );
  }

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
            {address?.name}
          </Text>
          <View className="w-[1] h-4 bg-[#E3E3E3]" />
          <Text className="text-[#AEAEAE] text-xs">
            {formatPhoneNumber(address?.phoneNumber)}
          </Text>
        </View>
        <Text className="text-[#676767] text-xs leading-[18px]">
          {address?.addressLine}
          {"\n"}
          {address?.ward.name}, {address?.district.name},{" "}
          {address?.province.name}
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
