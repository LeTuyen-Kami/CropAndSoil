import { View, TouchableOpacity } from "react-native";
import CenterModal from "~/components/common/CenterModal";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";

const ModalFailed = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <CenterModal
      visible={isOpen}
      onClose={onClose}
      wrapperClassName="p-6 items-center"
    >
      <Image
        source={imagePaths.objectError}
        className="h-[100px] w-[130px]" // Approximate size based on Figma
        contentFit="contain"
      />
      <View className="items-center pt-6">
        <Text className="text-center font-bold text-lg text-[#0B5226]">
          Thanh toán thất bại!
        </Text>
        <Text className="mt-1 text-center text-xs text-[#676767]">
          Có vấn đề với phương thức thanh toán của bạn. Vui lòng chọn phương
          thức thanh toán khác.
        </Text>
      </View>
      <View className="pt-4 w-full">
        <TouchableOpacity
          className="h-11 w-full items-center justify-center rounded-full bg-[#FCBA27] px-4"
          onPress={onClose} // Assuming retry closes modal for now
        >
          <Text className="text-base font-medium text-white">
            Thanh toán lại
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="justify-center items-center px-4 mt-2 w-full h-11 bg-white rounded-full"
          onPress={onClose} // Assuming chat closes modal for now
        >
          <Text className="font-medium text-base text-[#676767]">
            Chat với Cropee
          </Text>
        </TouchableOpacity>
      </View>
    </CenterModal>
  );
};

export default ModalFailed;
