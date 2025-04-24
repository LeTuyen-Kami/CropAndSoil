import { Image } from "expo-image";
import { FlatList, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import ProductItem from "~/components/common/ProductItem";
import { Text } from "~/components/ui/text";

interface ShopScreenContainerProps {
  title?: string;
  onPress?: () => void;
  componentTitle?: React.ReactNode;
  children: React.ReactNode;
}

const ShopScreenContainer = ({
  title,
  onPress,
  componentTitle,
  children,
}: ShopScreenContainerProps) => {
  return (
    <View className="bg-white rounded-xl mb-2.5">
      <View className="flex-row justify-between items-center px-2 py-3">
        {!!componentTitle ? (
          componentTitle
        ) : (
          <Text className="text-sm font-medium">{title}</Text>
        )}
        <TouchableOpacity
          className="flex-row gap-1 items-center"
          onPress={() => {
            onPress?.();
          }}
          activeOpacity={!!onPress ? 0.8 : 1}
        >
          <Text className="text-xs text-[#AEAEAE]">Xem tất cả</Text>
          <Image
            source={imagePaths.icArrowRight}
            className="w-4 h-4"
            style={{
              tintColor: "#AEAEAE",
            }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

export default ShopScreenContainer;
