import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";

interface HeaderProps {
  onPressMessages: () => void;
  onPressQuestionCircle: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onPressMessages,
  onPressQuestionCircle,
}) => {
  return (
    <View className="flex flex-row justify-between items-center px-3 mt-0">
      <Image
        source={imagePaths.logo}
        style={{ width: 64, height: 48 }}
        contentFit="contain"
      />
      <View className="flex flex-row gap-6">
        <TouchableOpacity onPress={onPressMessages}>
          <Image
            source={imagePaths.icMessages}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressQuestionCircle}>
          <Image
            source={imagePaths.icQuestionCircle}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
