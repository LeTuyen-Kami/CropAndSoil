import { View } from "react-native";
import SectionTitle from "./SectionTitlte";
import SupportItem from "./SupportItem";
import { imagePaths } from "~/assets/imagePath";
import { useNavigation } from "@react-navigation/native";

const SupportSection = () => {
  const navigation = useNavigation();

  const onPressHelpCenter = () => {
    navigation.navigate("HelpCenter");
  };

  const onPressTalkWithCropee = () => {
    navigation.navigate("TalkWithCropee");
  };

  return (
    <View className="mb-6 bg-white rounded-xl">
      <SectionTitle title="Hỗ trợ" />
      <SupportItem
        icon={imagePaths.icQuestion}
        title="Trung tâm trợ giúp"
        onPress={onPressHelpCenter}
      />
      <View className="mx-2 h-px bg-gray-100" />
      <SupportItem
        icon={imagePaths.icHeadphone}
        title="Trò chuyện với Cropee"
        onPress={onPressTalkWithCropee}
      />
    </View>
  );
};

export default SupportSection;
