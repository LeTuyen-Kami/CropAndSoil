import { DeliveryNotification } from "~/components/notification/DeliveryNotificationItem";
import { PromotionNotification } from "~/components/notification/PromotionNotificationItem";

export type Notification = DeliveryNotification | PromotionNotification;

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "delivery",
    title: "Giao hàng thành công!",
    message:
      "Kiện hàng SDFG123456789 của đơn hàng 123456789XCVB đã giao thành công đến bạn.",
    date: new Date("2024-12-15T10:15:00"),
    imageUrl: "https://picsum.photos/200/200?random=1",
    isRead: false,
    orderCode: "123456789XCVB",
    packageCode: "SDFG123456789",
  },
  {
    id: "2",
    type: "delivery",
    title: "Giao hàng thành công!",
    message:
      "Kiện hàng SDFG123456789 của đơn hàng 123456789XCVB đã giao thành công đến bạn.",
    date: new Date("2024-12-15T10:15:00"),
    imageUrl: "https://picsum.photos/200/200?random=2",
    isRead: true,
    orderCode: "123456789XCVB",
    packageCode: "SDFG123456789",
  },
  {
    id: "3",
    type: "delivery",
    title: "Giao hàng thành công!",
    message:
      "Kiện hàng SDFG123456789 của đơn hàng 123456789XCVB đã giao thành công đến bạn.",
    date: new Date("2024-12-15T10:15:00"),
    imageUrl: "https://picsum.photos/200/200?random=3",
    isRead: true,
    orderCode: "123456789XCVB",
    packageCode: "SDFG123456789",
  },
  {
    id: "4",
    type: "promotion",
    title: "🔥 MÃ KHUYẾN MÃI SIÊU HOT 🔥",
    message:
      "Chào mừng bạn đến với Cropee! Để tri ân khách hàng thân thiết, chúng tôi xin gửi tặng bạn mã khuyến mãi đặc biệt giúp tiết kiệm chi phí khi mua sắm các sản phẩm nông nghiệp chất lượng.\n\n🎁 Mã giảm giá: AGRO20\n\n🔹 Giảm 20% cho đơn hàng đầu tiên.\n🔹 Áp dụng cho tất cả các mặt hàng: hạt giống, phân bón, thiết bị nông nghiệp và nông sản tươi sống.\n🔹 Khuyến mãi chỉ áp dụng khi bạn nhập mã khi thanh toán.\n🔹 Ưu đãi có hiệu lực đến hết 31/01/2025.",
    date: "15/12/2024 10:15",
    imageUrl: "https://picsum.photos/200/200?random=4",
    isRead: false,
  },
  {
    id: "5",
    type: "promotion",
    title: "🌸 MỪNG TẾT NGUYÊN ĐÁN 2025 - KHUYẾN MÃI NGẬP TRÀN ƯU ĐÃI! 🌸",
    message:
      "🎉 Chào đón Tết Nguyên Đán 2025, Cropee xin gửi đến bạn những ưu đãi đặc biệt để cùng nhau chào xuân mới đầy may mắn và thịnh vượng!",
    date: "15/12/2024 10:15",
    imageUrl: "https://picsum.photos/200/200?random=5",
    isRead: false,
  },
  {
    id: "6",
    type: "promotion",
    title:
      "🌾 ƯU ĐÃI TẾT NGẬP TRÀN – GIẢM GIÁ LÊN ĐẾN 30% cho các sản phẩm nông nghiệp chất lượng!",
    message:
      "🎉 Chào đón Tết Nguyên Đán 2025, Cropee xin gửi đến bạn những ưu đãi đặc biệt để cùng nhau chào xuân mới đầy may mắn và thịnh vượng!",
    date: "15/12/2024 10:15",
    imageUrl: "https://picsum.photos/200/200?random=6",
    isRead: true,
  },
  {
    id: "7",
    type: "delivery",
    title: "Giao hàng thành công!",
    message:
      "Kiện hàng SDFG123456789 của đơn hàng 123456789XCVB đã giao thành công đến bạn.",
    date: new Date("2024-12-15T10:15:00"),
    imageUrl: "https://picsum.photos/200/200?random=7",
    isRead: false,
    orderCode: "123456789XCVB",
    packageCode: "SDFG123456789",
  },
  {
    id: "8",
    type: "delivery",
    title: "Giao hàng thành công!",
    message:
      "Kiện hàng SDFG123456789 của đơn hàng 123456789XCVB đã giao thành công đến bạn.",
    date: new Date("2024-12-15T10:15:00"),
    imageUrl: "https://picsum.photos/200/200?random=8",
    isRead: false,
    orderCode: "123456789XCVB",
    packageCode: "SDFG123456789",
  },
  {
    id: "9",
    type: "promotion",
    title: "🎉 NGÀY HỘI NÔNG NGHIỆP – ƯU ĐÃI SIÊU KHỦNG CHO MỌI NÔNG DÂN! 🎉",
    message:
      "🌾 Chào mừng Ngày Hội Nông Nghiệp 2025, Cropee xin gửi đến bạn những ưu đãi đặc biệt để tri ân các khách hàng và nông dân thân thiết. Đây là cơ hội tuyệt vời để bạn mua sắm các sản phẩm nông nghiệp chất lượng với giá ưu đãi chưa từng có!",
    date: "15/12/2024 10:15",
    imageUrl: "https://picsum.photos/200/200?random=9",
    isRead: true,
  },
];

// Utility function to filter notifications by type
export const filterNotificationsByType = (
  notifications: Notification[],
  type: string
): Notification[] => {
  if (type === "all") {
    return notifications;
  }
  return notifications.filter((notification) => notification.type === type);
};
