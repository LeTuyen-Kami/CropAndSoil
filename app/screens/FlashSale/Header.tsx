import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";

const Header = () => {
  const navigation = useSmartNavigation();

  return (
    <View className="flex-row gap-4 items-center px-2">
      <TouchableOpacity
        onPress={navigation.smartGoBack}
        className="px-2 py-1"
        hitSlop={20}
      >
        <Image
          source={imagePaths.icArrowLeft}
          className="w-2 h-4"
          contentFit="contain"
        />
      </TouchableOpacity>
      {/* <Input
        placeholder="Tìm kiếm sản phẩm"
        placeholderTextColor="#AEAEAE"
        className="flex-1"
        textInputClassName="text-sm leading-4"
        rightIcon={
          <TouchableOpacity>
            <Image
              source={imagePaths.icMagnifier}
              className="size-5"
              contentFit="contain"
            />
          </TouchableOpacity>
        }
      /> */}
      <TouchableOpacity
        className="flex-row flex-1 items-center px-5 bg-white rounded-full"
        onPress={() => navigation.navigate("Search")}
      >
        <View className="flex-1 py-4">
          <Text className="text-sm leading-4 text-[#AAAAB2]">Tìm kiếm</Text>
        </View>
        <View className="ml-2">
          <Image
            source={imagePaths.icMagnifier}
            className="size-5"
            style={{ tintColor: "#AAAAB2" }}
          />
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity
        className="h-12 rounded-full aspect-square bg-[#39CA71] justify-center items-center"
        hitSlop={20}
      >
        <Image
          source={imagePaths.icFilter}
          className="size-6"
          contentFit="contain"
        />
      </TouchableOpacity> */}
    </View>
  );
};

export default Header;
