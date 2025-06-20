import { useNavigation, useRoute } from "@react-navigation/native";
import { View, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { RootStackRouteProp } from "~/navigation/types";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";

const WebViewScreen = () => {
  const route = useRoute<RootStackRouteProp<"WebViewScreen">>();
  const navigation = useNavigation();
  const { url } = route.params;
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWrapper hasGradient={false}>
      <View
        style={{
          backgroundColor: "#20B14C",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          style={{
            width: 44,
            height: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={imagePaths.icArrowLeft}
            style={{ width: 24, height: 24 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
      <WebView source={{ uri: url }} />
    </ScreenWrapper>
  );
};

export default WebViewScreen;
