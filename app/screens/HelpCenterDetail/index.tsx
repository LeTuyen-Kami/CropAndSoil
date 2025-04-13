import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Input } from "~/components/ui/input";
import { Image } from "expo-image";
import { CATEGORY_ICONS } from "../HelpCenter/assets";
import { imagePaths } from "~/assets/imagePath";
import { useState } from "react";
import ContactCard from "~/components/helpCenter/ContactCard";
import { useAtomValue } from "jotai";
import { authAtom } from "~/store/atoms";

const HelpCenterDetail = () => {
  const [likeSelected, setLikeSelected] = useState<boolean | null>(null);
  const auth = useAtomValue(authAtom);

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Chính sách bảo hành"
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

      {/* Main Content */}
      <View className="flex-1 bg-[#EEEEEE] overflow-hidden rounded-t-2xl">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Article Content */}
          <View className="bg-white rounded-2xl mb-2.5">
            {/* Article Title and Date */}
            <View className="px-2 pt-3">
              <View className="flex-row items-center py-2">
                <View className="w-[2px] h-4 bg-[#159747] mr-2" />
                <Text className="text-sm font-normal text-[#0A0A0A]">
                  Chính sách bảo hành của Cropee
                </Text>
              </View>
              <View className="border-t border-[#E3E3E3] my-1" />
              <View className="flex-row items-center">
                <Image
                  source={imagePaths.icCalendar}
                  style={{ width: 20, height: 20, tintColor: "#AEAEAE" }}
                  contentFit="contain"
                />
                <Text className="text-xs font-medium text-[#AEAEAE] ml-2">
                  Cập nhập lúc10/01/2025 12:14
                </Text>
              </View>
            </View>

            {/* Article Content */}
            <View className="px-2 mt-3 mb-4">
              <Text className="text-sm text-[#383B45] leading-5">
                Lorem Ipsum chỉ đơn giản là một đoạn văn bản giả, được dùng vào
                việc trình bày và dàn trang phục vụ cho in ấn. Lorem Ipsum đã
                được sử dụng như một văn bản chuẩn cho ngành công nghiệp in ấn
                từ những năm 1500, khi một họa sĩ vô danh ghép nhiều đoạn văn
                bản với nhau để tạo thành một bản mẫu văn bản. Đoạn văn bản này
                không những đã tồn tại năm thế kỉ, mà khi được áp dụng vào tin
                học văn phòng, nội dung của nó vẫn không hề bị thay đổi. Nó đã
                được phổ biến trong những năm 1960 nhờ việc bán những bản giấy
                Letraset in những đoạn Lorem Ipsum, và gần đây hơn, được sử dụng
                trong các ứng dụng dàn trang, như Aldus.
              </Text>
            </View>
          </View>

          {/* Feedback Section */}
          <View className="bg-white rounded-2xl mb-2.5 py-3">
            <View className="items-center">
              <View className="items-center mb-5">
                <Text className="text-base text-[#676767]">
                  Bài viết có hữu ích với bạn không
                </Text>
              </View>

              <View className="flex-row gap-10 justify-center items-center">
                <TouchableOpacity
                  className="items-center"
                  onPress={() => setLikeSelected(false)}
                >
                  <View
                    className={`w-[54px] h-[54px] rounded-full items-center justify-center ${"bg-[#DEF1E5]"}`}
                  >
                    <Image
                      source={imagePaths.icLike}
                      style={{ width: 24, height: 24, tintColor: "#159747" }}
                      contentFit="contain"
                    />
                  </View>
                  <Text className="text-base font-medium text-[#676767] mt-2">
                    Hữu ích
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="items-center"
                  onPress={() => setLikeSelected(true)}
                >
                  <View
                    className={`w-[54px] h-[54px] rounded-full items-center justify-center ${"bg-[#DEF1E5]"}`}
                  >
                    <Image
                      source={imagePaths.icDislike}
                      style={{ width: 24, height: 24, tintColor: "#159747" }}
                      contentFit="contain"
                    />
                  </View>
                  <Text className="text-base font-medium text-[#676767] mt-2">
                    Không hữu ích
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Related Articles Section */}
          <View className="bg-white rounded-2xl mb-2.5">
            <View className="px-4 pt-3">
              <Text className="text-base font-medium text-[#383B45]">
                Bài viết liên quan
              </Text>
            </View>

            {/* Accordion Items */}
            <View className="px-4 py-3">
              <TouchableOpacity className="flex-row justify-between items-center py-2.5">
                <Text className="text-base text-[#383B45]">Tài khoản</Text>
                <Image
                  source={imagePaths.icArrowRight}
                  style={{
                    width: 20,
                    height: 20,
                    transform: [{ rotate: "90deg" }],
                    tintColor: "#AEAEAE",
                  }}
                  contentFit="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row justify-between items-center py-2.5">
                <Text className="text-base text-[#383B45]">
                  Mua sắm an toàn
                </Text>
                <Image
                  source={imagePaths.icArrowRight}
                  style={{
                    width: 20,
                    height: 20,
                    transform: [{ rotate: "90deg" }],
                    tintColor: "#AEAEAE",
                  }}
                  contentFit="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity className="flex-row justify-between items-center py-2.5">
                <Text className="text-base text-[#383B45]">
                  Ứng dụng Cropee
                </Text>
                <Image
                  source={imagePaths.icArrowRight}
                  style={{
                    width: 20,
                    height: 20,
                    transform: [{ rotate: "90deg" }],
                    tintColor: "#AEAEAE",
                  }}
                  contentFit="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Section */}
          <View className="mb-6 bg-white rounded-2xl">
            <View className="px-2 py-3">
              <Text className="text-base font-medium text-[#383B45]">
                Bạn vẫn cần trợ giúp?
              </Text>
            </View>

            <View className="px-2 pb-3">
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

export default HelpCenterDetail;
