import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  rightComponent,
}) => {
  const navigation = useNavigation();

  return (
    <View className="flex-row justify-between items-center px-4 py-3 border-b bg-background border-border">
      <View className="flex-row flex-1 items-center">
        {!!showBack ? (
          <TouchableOpacity
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 40,
            }}
            onPress={() => navigation.goBack()}
            className="w-8"
          >
            <Image
              source={imagePaths.icBack}
              style={{ width: 7.5, height: 15 }}
            />
          </TouchableOpacity>
        ) : (
          <View className="w-8" />
        )}
        <Text
          className="flex-1 text-lg font-medium text-center text-foreground"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {!!rightComponent ? (
        <View className="ml-4">{rightComponent}</View>
      ) : (
        <View className="w-8" />
      )}
    </View>
  );
};

export default Header;
