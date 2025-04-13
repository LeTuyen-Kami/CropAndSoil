import { ScrollView, View } from "react-native";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { Image } from "expo-image";
import { CATEGORY_ICONS } from "../HelpCenter/assets";
import { authAtom } from "~/store/atoms";
import { useAtomValue } from "jotai";
import ContactCard from "~/components/helpCenter/ContactCard";

const TalkWithCropee = () => {
  const auth = useAtomValue(authAtom);
  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Trò chuyện với Cropee"
        textColor="white"
        className="bg-transparent border-0"
        hasSafeTop={false}
      />

      {/* Greeting Section */}
      <View className="px-3">
        <Text className="text-sm text-white">
          <Text className="text-sm font-bold text-white">
            {auth?.user?.name || auth?.user?.phone}
          </Text>
          , Cropee giúp gì được cho bạn ?
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-2 py-5">
        <Input
          placeholder="Nhập từ khóa hoặc nội dung cần tìm"
          className="bg-white border border-[#F0F0F0] rounded-full px-[22px]"
          textInputClassName="text-sm leading-4"
          leftIcon={
            <Image
              source={CATEGORY_ICONS.search}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
          }
        />
      </View>
      <View className="mt-2 bg-[#EEE] rounded-t-2xl flex-1 overflow-hidden">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Contact Section */}
          <View className="px-2 mb-6 bg-white rounded-2xl">
            <View className="px-2 py-3">
              <Text className="text-base font-medium text-[#383B45]">
                Bạn vẫn cần trợ giúp?
              </Text>
            </View>

            <View className="pb-3">
              <ContactCard
                icon={CATEGORY_ICONS.phone}
                title="Gọi cho Cropee"
                description="Hotline: 0912.345.678 \nDịch vụ chăm sóc khách hàng 24/7 (1000đ/phút)."
              />

              <ContactCard
                icon={CATEGORY_ICONS.chat}
                title="Trò chuyện với Cropee"
                description="Nói chuyện với CLEO, nhân viên chăm sóc khách hàng ảo 24/7 của chúng tôi. Nhận hỗ trợ từ các Chuyên gia chăm sóc khách hàng của chúng tôi, phục vụ 24/7."
              />

              <ContactCard
                icon={CATEGORY_ICONS.phone}
                title="Cộng đồng facebook Cropee"
                description="Cộng đồng người mua hàng trực tuyến chính thức của Cropee Việt Nam Nhận lời khuyên và trợ giúp từ những khách hàng Cropee khác!"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default TalkWithCropee;
