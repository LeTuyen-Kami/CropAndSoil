import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useSetAtom } from "jotai";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import ProductItem from "~/components/common/ProductItem";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Text } from "~/components/ui/text";
import { screen } from "~/utils";
import { loginAtom } from "../Login/atom";
import GradientBackground from "./GradientBackground";
import OrderStatusItem from "./OrderStatusItem";
import ProfileHeader from "./ProfileHeader";
import SectionTitle from "./SectionTitlte";
import SupportItem from "./SupportItem";
import UtilityItem from "./UlitityItem";
// Main profile component
const ProfileScreen = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const setLoginState = useSetAtom(loginAtom);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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

        <View className="flex-row items-center px-4 py-4">
          <View className="h-12 w-12 rounded-full bg-[#DEF1E5] border border-white justify-center items-center mr-2">
            <Image
              source={imagePaths.icUser}
              style={{ width: 24, height: 24 }}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-white">
              Chào mừng bạn đến với Cropee!
            </Text>
            <View className="flex-row mt-2">
              <TouchableOpacity
                className="bg-[#FCBA27] rounded-full px-4 py-2 mr-2"
                onPress={() => {
                  setLoginState({ step: "signIn" });
                  navigation.navigate("Login");
                }}
              >
                <Text className="text-xs font-medium text-white">
                  Đăng nhập
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 bg-white rounded-full"
                onPress={() => {
                  setLoginState({ step: "signUp" });
                  navigation.navigate("Login");
                }}
              >
                <Text className="text-xs font-medium text-[#676767]">
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </GradientBackground>
      {/* My orders section */}
      <View>
        <View className="bg-white rounded-xl mb-2.5 -mt-4">
          <SectionTitle
            title="Đơn hàng của tôi"
            actionText="Đăng nhập để xem"
            showArrow={true}
          />
          <View className="flex-row flex-wrap px-2 py-3">
            <OrderStatusItem icon={imagePaths.icWallet} title="Chờ xác nhận" />
            <OrderStatusItem icon={imagePaths.icBox} title="Chờ vận chuyển" />
            <OrderStatusItem
              icon={imagePaths.icDelivery}
              title="Đang vận chuyển"
            />
            <OrderStatusItem icon={imagePaths.icStarProfile} title="Đã giao" />
            <OrderStatusItem icon={imagePaths.icReturn} title="Đổi trả" />
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
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recently viewed section */}
        <View className="bg-white  rounded-xl mb-2.5">
          <SectionTitle
            title="Đã xem gần đây"
            actionText="Đăng nhập để xem"
            showArrow={true}
          />
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
              />
            ))}
          </View>
        </View>

        {/* My utilities section */}
        <View className="bg-white rounded-xl mb-2.5">
          <SectionTitle title="Tiện ích của tôi" />
          <View className="flex-row justify-around px-2 py-3">
            <UtilityItem icon={imagePaths.icVoucher} title="Kho Voucher" />
            <UtilityItem icon={imagePaths.icHeart} title="Sản phẩm yêu thích" />
            <UtilityItem
              icon={imagePaths.icClipboard}
              title="Danh sách đánh giá"
            />
          </View>
        </View>

        {/* Support section */}
        <View className="mb-6 bg-white rounded-xl">
          <SectionTitle title="Hỗ trợ" />
          <SupportItem
            icon={imagePaths.icQuestion}
            title="Trung tâm trợ giúp"
          />
          <View className="mx-2 h-px bg-gray-100" />
          <SupportItem
            icon={imagePaths.icHeadphone}
            title="Trò chuyện với Cropee"
          />
        </View>
      </View>
      <View className="h-20 bg-[#EEEEEE]" />
    </ScreenContainer>
  );
};

export default ProfileScreen;
