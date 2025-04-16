import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { Entypo } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import FollowItem from "../FollowItem";

// Mock data for followers
const FOLLOWERS_DATA = [
  {
    id: "1",
    name: "Phân bón Việt Nga",
    status: "Online 5 giờ trước",
    avatar:
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVydGlsaXplcnxlbnwwfHwwfHx8MA%3D%3D",
    isFollowing: false,
  },
  {
    id: "2",
    name: "Phân bón Việt Nga",
    status: "Online",
    avatar:
      "https://images.unsplash.com/photo-1587467512961-120760940315?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmVydGlsaXplcnxlbnwwfHwwfHx8MA%3D%3D",
    isFollowing: true,
  },
  {
    id: "3",
    name: "Phân bón Sông Lô - Phú Thọ",
    status: "Online 2 giờ trước",
    avatar:
      "https://images.unsplash.com/photo-1598967643032-13dee4de3b3e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmVydGlsaXplcnxlbnwwfHwwfHx8MA%3D%3D",
    isFollowing: false,
  },
  {
    id: "4",
    name: "Funo Farm - Kiến thức nhà Nông",
    status: "Online 4 giờ trước",
    avatar:
      "https://images.unsplash.com/photo-1628352081506-83c43123ed7d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D",
    isFollowing: false,
  },
  {
    id: "5",
    name: "Phân bón Việt Nga",
    status: "Online",
    avatar:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZlcnRpbGl6ZXJ8ZW58MHx8MHx8fDA%3D",
    isFollowing: false,
  },
];

const Followers = () => {
  const { bottom } = useSafeAreaInsets();
  const [followers, setFollowers] = React.useState(FOLLOWERS_DATA);

  const handleFollowToggle = (id: string) => {
    setFollowers(
      followers.map((follower) =>
        follower.id === id
          ? { ...follower, isFollowing: !follower.isFollowing }
          : follower
      )
    );
  };

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Người theo dõi"
        hasSafeTop={false}
        className="bg-transparent border-0"
        textColor="#fff"
      />

      <View
        className="flex-1 bg-[#EEE] rounded-t-3xl overflow-hidden"
        style={{
          paddingBottom: bottom,
        }}
      >
        <FlashList
          data={followers}
          renderItem={({ item }) => (
            <FollowItem
              name={item.name}
              status={item.status}
              avatarUrl={item.avatar}
              isFollowing={item.isFollowing}
              onPressFollow={() => handleFollowToggle(item.id)}
            />
          )}
          estimatedItemSize={80}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ListFooterComponent={() => (
            <View className="justify-center items-center my-2 h-10">
              <Text className="text-sm leading-tight text-primary">
                Đã tải tất cả tài khoản người theo dõi
              </Text>
            </View>
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Followers;
