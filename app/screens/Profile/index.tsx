import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import GradientBackground from "~/components/common/GradientBackground";
import ProductItem from "~/components/common/ProductItem";
import ScreenContainer from "~/components/common/ScreenContainer";
import { screen } from "~/utils";
import { loginAtom } from "../Login/atom";
import HeaderLogging from "./HeaderLogging";
import OrderStatusItem from "./OrderStatusItem";
import ProfileHeader from "./ProfileHeader";
import SectionTitle from "./SectionTitlte";
import SupportItem from "./SupportItem";
import UtilityItem from "./UlitityItem";
import { authAtom } from "~/store/atoms";
import { useQueryClient } from "@tanstack/react-query";
import { RootStackScreenProps } from "~/navigation/types";
import SupportSection from "./SupportSecction";
// Main profile component
const ProfileScreen = () => {
  const { top } = useSafeAreaInsets();

  const navigation = useNavigation<RootStackScreenProps<"MainTabs">>();
  const [refreshing, setRefreshing] = useState(false);
  const setLoginState = useSetAtom(loginAtom);

  const queryClient = useQueryClient();

  const auth = useAtomValue(authAtom);

  const onRefresh = () => {
    setRefreshing(true);
    queryClient.refetchQueries({ queryKey: ["profile"] }).then(() => {
      setRefreshing(false);
    });
  };

  const onPressMyOrder = (index: number) => {
    navigation.navigate("MyOrder", { tabIndex: index });
  };

  return (
    <ScreenContainer
      scrollable={true}
      paddingHorizontal={0}
      paddingVertical={0}
      safeArea={false}
      backgroundColor="#159747"
      wrapperClassName="bg-[#eeeeee]"
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
              onPress={() => onPressMyOrder(0)}
            />
            <OrderStatusItem
              icon={imagePaths.icBox}
              title="Chờ vận chuyển"
              onPress={() => onPressMyOrder(1)}
            />
            <OrderStatusItem
              icon={imagePaths.icDelivery}
              title="Đang vận chuyển"
              onPress={() => onPressMyOrder(2)}
            />
            <OrderStatusItem
              icon={imagePaths.icStarProfile}
              title="Đã giao"
              onPress={() => onPressMyOrder(3)}
            />
            <OrderStatusItem
              icon={imagePaths.icReturn}
              title="Đổi trả"
              onPress={() => onPressMyOrder(4)}
            />
          </View>
        </View>

        {/* Special offers section */}
        <View className="bg-white rounded-xl mb-2.5">
          <SectionTitle title="Ưu đãi dành riêng cho bạn" />
          <Carousel
            autoPlayInterval={2000}
            data={[...Array(10)].map((_, index) => ({
              id: index.toString(),
            }))}
            height={(screen.width - 40) / 2}
            loop={true}
            pagingEnabled={true}
            snapEnabled={true}
            width={screen.width}
            style={{
              width: screen.width,
            }}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 1,
              parallaxScrollingOffset: 40,
            }}
            renderItem={({ index }) => (
              <View
                style={{
                  flex: 1,
                  marginHorizontal: 26,
                  paddingVertical: 8,
                }}
              >
                <Image
                  source={{
                    uri: "https://picsum.photos/200/300",
                  }}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                />
              </View>
            )}
          />
          <ScrollView horizontal>
            <View className="flex-row gap-2 p-2">
              {[...Array(10)].map((_, index) => (
                <ProductItem
                  key={index}
                  name={"Thuốc trừ bệnh Sumi Eight 12.5WP 100gr "}
                  price={160000}
                  originalPrice={180000}
                  rating={4.5}
                  soldCount={100}
                  location="Hà Nội"
                  id={"123"}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recently viewed section */}
        <View className="bg-white  rounded-xl mb-2.5">
          <SectionTitle
            title="Đã xem gần đây"
            actionText={auth?.isLoggedIn ? "" : "Đăng nhập để xem"}
            showArrow={true}
          />

          {auth?.isLoggedIn && (
            <ScrollView horizontal>
              <View className="flex-row gap-2 px-2 pb-2">
                {[...Array(10)].map((_, index) => (
                  <ProductItem
                    key={index}
                    name={"Thuốc trừ bệnh Sumi Eight 12.5WP 100gr "}
                    price={160000}
                    originalPrice={180000}
                    rating={4.5}
                    soldCount={100}
                    location="Hà Nội"
                    id={"123"}
                  />
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        {/* My utilities section */}
        <View className="bg-white rounded-xl mb-2.5">
          <SectionTitle title="Tiện ích của tôi" />
          <View className="flex-row justify-around px-2 py-3">
            <UtilityItem
              icon={imagePaths.icVoucher}
              title="Kho Voucher"
              onPress={() => navigation.navigate("VoucherSelect")}
            />
            <UtilityItem
              icon={imagePaths.icHeart}
              title="Sản phẩm yêu thích"
              onPress={() => navigation.navigate("LikedProduct")}
            />
            <UtilityItem
              icon={imagePaths.icClipboard}
              title="Danh sách đánh giá"
              onPress={() => navigation.navigate("MyRating")}
            />
          </View>
        </View>

        {/* Support section */}
        <SupportSection />
      </View>
      <View className="h-20 bg-[#EEEEEE]" />
    </ScreenContainer>
  );
};

export default ProfileScreen;
