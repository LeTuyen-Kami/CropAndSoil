import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import GradientBackground from "~/components/common/GradientBackground";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { authAtom } from "~/store/atoms";
import HeaderLogging from "./HeaderLogging";
import OrderStatusItem from "./OrderStatusItem";
import PrivateOffer from "./PrivateOffer";
import ProfileHeader from "./ProfileHeader";
import RecentProduct from "./RecentProduct";
import SectionTitle from "./SectionTitlte";
import SupportSection from "./SupportSecction";
import UtilityItem from "./UlitityItem";
// Main profile component
const ProfileScreen = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useSmartNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const auth = useAtomValue(authAtom);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey.includes("profile") ||
        query.queryKey.includes("recently-viewed-products"),
    });
    setRefreshing(false);
  };

  const onPressMyOrder = (index: number) => {
    navigation.smartNavigate("MyOrder", { tabIndex: index });
  };

  return (
    <ScreenWrapper
      hasGradient={false}
      hasSafeTop={false}
      backgroundColor="bg-[#EEEEEE]"
    >
      <ScrollView
        contentContainerClassName="bg-[#EEEEEE]"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <GradientBackground
          gradientStyle={{ paddingTop: top, paddingBottom: 20 }}
        >
          <ProfileHeader />
          {/* User section */}

          <HeaderLogging />
        </GradientBackground>
        {/* My orders section */}
        <View>
          <View className="bg-white rounded-xl mb-2.5 -mt-4">
            <SectionTitle
              onPress={() => onPressMyOrder(0)}
              title="Đơn hàng của tôi"
              actionText={
                auth?.isLoggedIn ? "Xem lịch sử mua hàng" : "Đăng nhập để xem"
              }
              showArrow={true}
            />
            <View className="flex-row flex-wrap px-2 py-3">
              <OrderStatusItem
                icon={imagePaths.icWallet}
                title="Chờ xác nhận"
                onPress={() => onPressMyOrder(1)}
              />
              <OrderStatusItem
                icon={imagePaths.icBox}
                title="Chờ vận chuyển"
                onPress={() => onPressMyOrder(2)}
              />
              <OrderStatusItem
                icon={imagePaths.icDelivery}
                title="Đang vận chuyển"
                onPress={() => onPressMyOrder(3)}
              />
              <OrderStatusItem
                icon={imagePaths.icStarProfile}
                title="Đã giao"
                onPress={() => onPressMyOrder(4)}
              />
              <OrderStatusItem
                icon={imagePaths.icReturn}
                title="Đổi trả"
                onPress={() => onPressMyOrder(5)}
              />
            </View>
          </View>

          {/* Special offers section */}
          <PrivateOffer />

          {/* Recently viewed section */}
          <RecentProduct />

          {/* My utilities section */}
          <View className="bg-white rounded-xl mb-2.5">
            <SectionTitle title="Tiện ích của tôi" />
            <View className="flex-row justify-around px-2 py-3">
              <UtilityItem
                icon={imagePaths.icVoucher}
                title="Kho Voucher"
                onPress={() => navigation.smartNavigate("MyVoucher")}
              />
              <UtilityItem
                icon={imagePaths.icHeart}
                title="Sản phẩm yêu thích"
                onPress={() => navigation.smartNavigate("LikedProduct")}
              />
              <UtilityItem
                icon={imagePaths.icClipboard}
                title="Danh sách đánh giá"
                onPress={() => navigation.smartNavigate("MyRating")}
              />
            </View>
          </View>

          {/* Support section */}
          <SupportSection />
        </View>
        <View className="h-20 bg-[#EEEEEE]" />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ProfileScreen;
