import { View } from "react-native";
import SectionTitle from "./SectionTitlte";
import SupportItem from "./SupportItem";
import { imagePaths } from "~/assets/imagePath";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { ENV } from "~/utils";

const SupportSection = () => {
  const navigation = useNavigation();

  const onPressHelpCenter = () => {
    // navigation.navigate("HelpCenter");
    // WebBrowser.openBrowserAsync(ENV.EXPO_PUBLIC_HELP_CENTER_LINK);
    navigation.navigate("WebViewScreen", {
      url: ENV.EXPO_PUBLIC_HELP_CENTER_LINK,
    });
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
      {/* <View className="mx-2 h-px bg-gray-100" />
      <SupportItem
        icon={imagePaths.icHeadphone}
        title="Trò chuyện với Cropee"
        onPress={onPressTalkWithCropee}
      /> */}
    </View>
  );
};

export default SupportSection;
