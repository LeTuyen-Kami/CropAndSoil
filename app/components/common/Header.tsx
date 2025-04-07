import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "~/components/ui/text";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import { cn } from "~/lib/utils";
interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
  leftClassName?: string;
  className?: string;
  textColor?: string;
  titleClassName?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  rightComponent,
  leftClassName,
  className,
  textColor,
  titleClassName,
}) => {
  const navigation = useNavigation();

  return (
    <View
      className={cn(
        "flex-row justify-between items-center px-4 py-3 border-b bg-background border-border",
        className
      )}
    >
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
            className={cn("w-8", leftClassName)}
          >
            <Image
              source={imagePaths.icBack}
              style={{ width: 7.5, height: 15, tintColor: textColor }}
            />
          </TouchableOpacity>
        ) : (
          <View className="w-8" />
        )}
        <Text
          className={cn(
            "flex-1 text-lg font-medium text-center text-foreground",
            titleClassName
          )}
          numberOfLines={1}
          style={{ color: textColor }}
        >
          {title}
        </Text>
      </View>

      {!!rightComponent ? (
        <View>{rightComponent}</View>
      ) : (
        <View className="w-8" />
      )}
    </View>
  );
};

export default Header;
