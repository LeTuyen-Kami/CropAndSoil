import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { Entypo } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
// Follower item component

type FollowItemProps = {
  name: string;
  status: string;
  avatarUrl: string;
  isFollowing?: boolean;
  onPressFollow: () => void;
};

const FollowItem = ({
  name,
  status,
  avatarUrl,
  isFollowing = false,
  onPressFollow,
}: FollowItemProps) => {
  return (
    <View className="flex-row items-center bg-white py-4 px-2 border-b border-[#E3E3E3]">
      <View className="flex-row flex-1 gap-2 items-center">
        <View className="w-11 h-11 rounded-full overflow-hidden border border-[#159747]/50">
          <Image
            source={{ uri: avatarUrl }}
            className="w-full h-full"
            contentFit="cover"
          />
        </View>
        <View className="w-[211px]">
          <Text className="text-[14px] font-normal text-black">{name}</Text>
          <Text className="text-[14px] font-normal text-[#676767]">
            {status}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onPressFollow}
        className={`h-8 px-4 rounded-full ${
          isFollowing ? "bg-white border border-[#FCBA27]" : "bg-[#FCBA27]"
        } flex-row items-center justify-center gap-1`}
      >
        {!isFollowing && <Entypo name="plus" size={16} color="white" />}
        <Text
          className={`text-xs font-medium ${
            isFollowing ? "text-[#FCBA27]" : "text-white"
          }`}
        >
          {isFollowing ? "Đang theo..." : "Theo dõi"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FollowItem;
