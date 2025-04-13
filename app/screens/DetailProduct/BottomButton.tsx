import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const BottomButton = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="w-full h-[60px] bg-[#159747] rounded-t-[32px] flex-row"
      style={{
        bottom: bottom,
      }}
    >
      <TouchableOpacity className="flex-row gap-2 items-center py-[10px] px-[20px] border-r border-[#12853E]">
        <Image
          source={imagePaths.chatIcon}
          className="size-6"
          style={{
            tintColor: "white",
          }}
        />
        <Text className="text-sm font-medium leading-tight text-white">
          Chat
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row gap-2 items-center py-[10px] px-[20px]">
        <Image
          source={imagePaths.icCart}
          className="size-6"
          style={{
            tintColor: "white",
          }}
        />
        <Text className="text-sm font-medium leading-tight text-white">
          Thêm sản phẩm
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row gap-2 items-center py-[10px] px-[20px] bg-[#FCBA26] flex-1 justify-center rounded-tr-[32px]">
        <Text className="text-sm font-bold leading-tight text-white">
          Mua ngay
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomButton;
