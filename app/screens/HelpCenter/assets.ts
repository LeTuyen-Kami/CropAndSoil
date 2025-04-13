import searchIconSvg from "~/assets/icons/search_icon.svg";
import phoneIcon from "~/assets/icons/phone_icon.svg";
import chatIcon from "~/assets/icons/chat_icon.svg";

import deliveryTruckIcon from "~/assets/icons/delivery_truck_icon.png";
import hotDealIcon from "~/assets/icons/hot_deal_icon.png";
import infoIcon from "~/assets/icons/info_icon.png";
import onlineStoreIcon from "~/assets/icons/online_store_icon.png";
import refundIcon from "~/assets/icons/refund_icon.png";
import userGearIcon from "~/assets/icons/user_gear_icon.png";
import walletIcon from "~/assets/icons/wallet_icon.png";

// Import the category icons as direct requires
export const CATEGORY_ICONS = {
  onlineStore: onlineStoreIcon,
  hotDeal: hotDealIcon,
  wallet: walletIcon,
  deliveryTruck: deliveryTruckIcon,
  refund: refundIcon,
  userGear: userGearIcon,
  info: infoIcon,
  search: searchIconSvg,
  phone: phoneIcon,
  chat: chatIcon,
} as any;

export const helpCategories = [
  {
    icon: CATEGORY_ICONS.onlineStore,
    title: "Mua sắm cùng Cropee",
    bgColor: "#FFECE5",
  },
  {
    icon: CATEGORY_ICONS.hotDeal,
    title: "Khuyến mãi & Ưu đãi",
    bgColor: "#FFF5E5",
  },
  {
    icon: CATEGORY_ICONS.wallet,
    title: "Thanh toán",
    bgColor: "#E8F0FF",
  },
  {
    icon: CATEGORY_ICONS.deliveryTruck,
    title: "Đơn hàng & Vận chuyển",
    bgColor: "#F2E8FF",
  },
  {
    icon: CATEGORY_ICONS.refund,
    title: "Trả hàng & Hoàn tiền",
    bgColor: "#E5FFF3",
  },
  {
    icon: CATEGORY_ICONS.userGear,
    title: "Tài khoản của tôi",
    bgColor: "#E5EDFF",
  },
  {
    icon: CATEGORY_ICONS.info,
    title: "Thông tin chung",
    bgColor: "#FFEAFF",
  },
];

export const filterCategories = [
  "Gợi ý",
  "Mua sắm cùng Cropee",
  "Khuyến mãi & Ưu đãi",
  "Thanh Toán",
  "Đơn hàng & Vận chuyển",
  "Trả hàng & Hoàn tiền",
  "Tài khoản của tôi",
  "Thông tin chung",
];

export const faqItems = [
  "[Cảnh báo lừa đảo] Mua sắm an toàn cùng Cropee",
  "[Tài khỏan Cropee] Tôi không thể đặt hàng/đăng ký/đăng nhập tài khoản do số điện thoại đã tồn tại",
  "[Trả hàng/Hoàn tiền] Hướng dẫn trả hàng sau khi yêu cầu Trả hàng/Hoàn tiền của bạn được chấp nhận",
  "[Thành viên mới] Tại sao tôi không thể đăng ký tạo tài khoản Cropee bằng số điện thoại của mình?",
  "[Lỗi] Cách xử lý khi hệ thống không thể xác minh tài khoản Cropee của tôi để đăng nhập?",
  "[Trả hàng] Cách đóng gói đơn hàng hoàn trả",
  "[Hủy đơn] Làm thế nào để hủy đơn hàng",
  "[Hoàn tiền] Mất bao lâu để tôi nhận lại tiền sau khi gửi trả hàng thành công?",
];
