import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "~/components/ui/text";

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
    <View className="flex-row items-center justify-between px-4 py-3 bg-background border-b border-border">
      <View className="flex-row items-center flex-1">
        {!!showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-2"
          >
            <Text>Back</Text>
          </TouchableOpacity>
        )}
        <Text className="text-lg font-medium text-foreground" numberOfLines={1}>
          {title}
        </Text>
      </View>

      {!!rightComponent && <View className="ml-4">{rightComponent}</View>}
    </View>
  );
};

export default Header;
