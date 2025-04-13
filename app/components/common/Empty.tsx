import React from "react";
import { View, ActivityIndicator } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Text } from "../ui/text";
import { screen } from "~/utils";

const Empty = ({
  title,
  backgroundColor,
  isLoading,
}: {
  title: string;
  backgroundColor?: string;
  isLoading?: boolean;
}) => {
  return (
    <View
      className="flex-1 justify-center items-center"
      style={{
        height: screen.height / 2,
        backgroundColor: backgroundColor,
      }}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="#6B7280" />
      ) : (
        <>
          <AntDesign name="folderopen" size={40} color="#6B7280" />
          <Text className="text-center text-gray-500">
            {title || "Không có địa chỉ nào"}
          </Text>
        </>
      )}
    </View>
  );
};

export default Empty;
