import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import CategoryCard from "~/components/helpCenter/CategoryCard";
import FAQCard from "~/components/helpCenter/FAQCard";
import CategoryFilter from "~/components/helpCenter/CategoryFilter";
import SectionHeader from "~/components/helpCenter/SectionHeader";
import {
  CATEGORY_ICONS,
  helpCategories,
  filterCategories,
  faqItems,
} from "./assets";
import ContactCard from "~/components/helpCenter/ContactCard";
import { Input } from "~/components/ui/input";
import { useNavigation } from "@react-navigation/native";
import { authAtom } from "~/store/atoms";
import { useAtomValue } from "jotai";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Gợi ý");
  const navigation = useNavigation();
  const auth = useAtomValue(authAtom);
  const navigateToHelpCenterDetail = () => {
    navigation.navigate("HelpCenterDetail");
  };

  const navigateToFAQs = () => {
    navigation.navigate("FAQs");
  };

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Chăm sóc khách hàng"
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
      <View className="mt-2 bg-[#EEE] rounded-t-2xl flex-1 overflow-hidden">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View className="bg-white rounded-2xl px-3 mb-2.5 pb-4">
            <SectionHeader title="Danh mục" />

            <View className="flex-row flex-wrap gap-x-4 gap-y-6">
              {helpCategories.map((category, index) => (
                <CategoryCard
                  key={index}
                  icon={category.icon}
                  title={category.title}
                  onPress={navigateToHelpCenterDetail}
                />
              ))}
            </View>
          </View>

          {/* FAQs */}
          <View className="bg-white rounded-2xl px-2 mb-2.5">
            <SectionHeader title="Câu hỏi thường gặp" />

            <CategoryFilter
              categories={filterCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <View className="px-2">
              {faqItems.map((item, index) => (
                <FAQCard key={index} title={item} onPress={navigateToFAQs} />
              ))}

              <TouchableOpacity className="flex-row justify-center items-center p-3">
                <Text className="text-sm text-[#676767] mr-2">Xem thêm</Text>
                <Image
                  source={CATEGORY_ICONS.arrowRight}
                  style={{ width: 16, height: 16 }}
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

export default HelpCenter;
