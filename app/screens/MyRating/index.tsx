import { View } from "react-native";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import Tabs from "~/components/common/Tabs";
import ListRated from "./ListRated";
import ListUnrated from "./ListUnrated";

const MyRating = () => {
  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header
        textColor="white"
        title="Đánh giá của tôi"
        className="bg-transparent border-0"
        hasSafeTop={false}
      />
      <View className="rounded-t-[16px] overflow-hidden bg-white flex-1">
        <Tabs
          tabBarStyle={{
            paddingHorizontal: 12,
          }}
          titleClassName="text-sm"
          fullWidth
          items={[
            {
              title: "Chưa đánh giá",
              content: <ListUnrated />,
            },
            {
              title: "Đã đánh giá",
              content: <ListRated />,
            },
          ]}
        />
      </View>
    </ScreenWrapper>
  );
};

export default MyRating;
