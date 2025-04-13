import dayjs from "dayjs";
import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";

// Mock data for the notification
const notificationData = {
  id: "1",
  title:
    "🌾 ƯU ĐÃI TẾT NGẬP TRÀN – GIẢM GIÁ LÊN ĐẾN 30% cho các sản phẩm nông nghiệp chất lượng!",
  date: "2024-12-15T10:15:00",
  image: "https://picsum.photos/800/400",
  content: `🎉 Chào đón Tết Nguyên Đán 2025, Cropee xin gửi đến bạn những ưu đãi đặc biệt để cùng nhau chào xuân mới đầy may mắn và thịnh vượng!

🎁 CÁC ƯU ĐÃI:

Giảm 20% cho tất cả các sản phẩm phân bón, hạt giống và nông sản tươi sống.

Mua 1 tặng 1 cho một số loại giống cây trồng đặc biệt, chuẩn bị cho vụ mùa mới.

Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ (áp dụng toàn quốc).

📅 Thời gian khuyến mãi: Từ 20/01/2025 - 15/02/2025.

CÁCH NHẬN KHUYẾN MÃI:

Truy cập Cropee và lựa chọn sản phẩm yêu thích.

Thêm sản phẩm vào giỏ hàng và tiến hành thanh toán.

Nhập mã khuyến mãi: TET2025 (giảm giá 20%) hoặc FREEDELIVERY (miễn phí vận chuyển).

Hoàn tất thanh toán và chờ nhận hàng tận nơi với ưu đãi cực hấp dẫn!

✨ Mua sắm nhanh chóng để đón Tết với những sản phẩm chất lượng, giá ưu đãi và dịch vụ tận tâm!

🌿 Chúc bạn một năm mới an khang, thịnh vượng, vụ mùa bội thu và hạnh phúc viên mãn!


Lưu ý: Chương trình khuyến mãi chỉ áp dụng đến hết ngày 15/02/2025, nhanh tay để không bỏ lỡ cơ hội vàng này!`,
};

const DetailNotification = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Thông báo"
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Notification Card */}
          <View className="bg-white rounded-t-3xl">
            {/* Header with title and date */}
            <View className="flex-row p-3 pb-1.5">
              {/* Icon */}
              <View className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FDCD63] to-[#FCBA27] items-center justify-center mr-2.5">
                <Text className="text-lg text-white">💰</Text>
              </View>

              {/* Title and date container */}
              <View className="flex-1">
                <Text
                  className="text-[#383B45] font-medium text-base"
                  numberOfLines={2}
                >
                  {notificationData.title}
                </Text>
                <Text className="text-[#676767] text-xs mt-1">
                  {dayjs(notificationData.date).format("DD/MM/YYYY HH:mm")}
                </Text>
              </View>
            </View>

            {/* Notification Image */}
            <Image
              source={{ uri: notificationData.image }}
              className="mt-2 w-full h-48"
              resizeMode="cover"
            />

            {/* Notification Content */}
            <View className="p-3">
              <Text className="text-[#676767] text-sm leading-5">
                {notificationData.content}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default DetailNotification;
