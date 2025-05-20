import { Dimensions, Platform } from "react-native";
import { mmkvStore } from "~/store/atomWithMMKV";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { BREAKPOINTS } from "./contants";
import dayjs from "dayjs";
import { IProduct } from "~/services/api/product.service";

export const ENV = {
  EXPO_PUBLIC_BASE_URL: "https://cropee-api.faster.asia/api/v1",
  EXPO_PUBLIC_IDENTITY_BASE_URL: "https://cropee-api.faster.asia/api/v1",
  EXPO_PUBLIC_ENV: "dev",
  EXPO_PUBLIC_SENTRY_DSN:
    "https://bac04b48769b756a71f586d876accab8@o4509072888889344.ingest.de.sentry.io/4509072902914128",
  EXPO_PUBLIC_AGENT_LINK:
    "https://demo-cropee.crinfinity.com/dang-ky/?type=seller",
};

export const screen = Dimensions.get("screen");

export const isIOS = Platform.OS === "ios";

export const isAndroid = Platform.OS === "android";

const baseWidth = 393;
const baseHeight = 852;

export const BOTTOM_TAB_HEIGHT = isIOS ? 90 : 70;

export const validatePhoneNumber = (phoneNumber: string) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phoneNumber);
};

export const validatePassword = (password: string) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,16}$/;
  return regex.test(password);
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getDeviceId = () => {
  const deviceId = mmkvStore.getString("deviceId");
  if (!deviceId) {
    const uuid = uuidv4();
    mmkvStore.set("deviceId", uuid);
    return uuid;
  }
  return deviceId;
};

export const getErrorMessage = (error: any, defaultMessage?: string) => {
  if (error.response) {
    return error.response.data.message;
  }
  return defaultMessage || "Lỗi không xác định";
};

export const chunkArray = <T>(array: T[], size: number) => {
  return array.reduce((acc, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = [];
    }

    acc[chunkIndex].push(item);
    return acc;
  }, [] as T[][]);
};

export const applyTyoe = (
  data: any[],
  {
    typeName,
    handleId,
  }: {
    typeName: string;
    handleId: (item: any) => string;
  }
) => {
  return data?.map((item) => {
    return {
      type: typeName,
      id: handleId(item),
      items: item,
    };
  });
};

export const preHandleFlashListData = (
  data: any[],
  typeName: string = "product"
) => {
  const chunkedData = chunkArray(data, 2);

  return applyTyoe(chunkedData, {
    typeName,
    handleId: (item) => item?.[0]?.id,
  });
};

type Options = {
  containerPadding: number; // tổng trái + phải
  itemGap: number;
};

export const getItemWidth = ({ containerPadding, itemGap }: Options) => {
  const screenWidth = Dimensions.get("window").width;

  const sorted = Object.keys(BREAKPOINTS)
    .map(Number)
    .sort((a, b) => a - b);

  let columns = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (screenWidth >= sorted[i]) {
      columns = BREAKPOINTS[sorted[i] as keyof typeof BREAKPOINTS];
    }
  }

  const totalGap = itemGap * (columns - 1);
  const availableWidth = screenWidth - containerPadding - totalGap;
  const itemWidth = availableWidth / columns;

  return {
    itemWidth,
    columns,
  };
};

export const formatPrice = (price?: number) => {
  if (price === null || price === undefined || price === 0) return "";

  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export const onlineStatus = (lastOnlineAt?: string) => {
  if (!lastOnlineAt) return "";

  if (!dayjs(lastOnlineAt)?.isValid()) return "";

  const now = dayjs();
  const lastOnline = dayjs(lastOnlineAt);
  const diffInMinutes = now.diff(lastOnline, "minutes");
  if (diffInMinutes < 5) {
    return "Online vài phút trước";
  }

  if (diffInMinutes < 60) {
    return `Online ${Math.floor(diffInMinutes)} phút trước`;
  }

  if (diffInMinutes < 24 * 60) {
    return `Online ${Math.floor(diffInMinutes / 60)} giờ trước`;
  }

  return `Online ${Math.floor(diffInMinutes / (24 * 60))} ngày trước`;
};

export const getTimeAgo = (date?: string) => {
  if (!date) return "";

  if (!dayjs(date)?.isValid()) return "";

  const now = dayjs();
  const dateObj = dayjs(date);

  const diffInYears = now.diff(dateObj, "years");
  const diffInMonths = now.diff(dateObj, "months");
  const diffInDays = now.diff(dateObj, "days");

  if (diffInYears > 0) {
    return `${diffInYears} năm`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths} tháng`;
  } else if (diffInDays > 0) {
    return `${diffInDays} ngày`;
  } else {
    return "Hôm nay";
  }
};

export const calculateDiscount = (item: IProduct) => {
  if (item?.regularPrice > item?.salePrice) {
    return Math.round(
      ((item?.regularPrice - item?.salePrice) / item?.regularPrice) * 100
    );
  }

  return undefined;
};

export const formatDate = (date?: string, format: string = "DD/MM/YYYY") => {
  if (!date) return "";

  if (!dayjs(date)?.isValid()) return "";

  return dayjs(date).format(format);
};

export const convertToK = (value?: number) => {
  if (!value) return 0;

  return Math.round(value / 1000).toLocaleString("vi-VN");
};

export const checkCanRender = (data: any) => {
  if (!data) return false;

  if (Array.isArray(data) && data.length === 0) return false;

  if (data?.some?.((item: any) => !item)) return false;

  return true;
};

export const formatPhoneNumber = (phoneNumber?: string) => {
  if (!phoneNumber) return "";

  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
};

export const priceToNumber = (formattedPrice: string): number => {
  if (!formattedPrice) return 0;

  const normalized = formattedPrice.replace(/[^\d]/g, "");

  return Number(normalized);
};

export const getMediaTypes = (media?: string) => {
  if (!media) return "image";

  const extension = media.split(".").pop();

  if (!extension) return "image";
  if (
    extension?.includes("jpg") ||
    extension?.includes("jpeg") ||
    extension?.includes("png")
  ) {
    return "image";
  }

  if (
    extension?.includes("mp4") ||
    extension?.includes("mov") ||
    extension?.includes("avi")
  ) {
    return "video";
  }

  return "image";
};

export const isNowBetween = (start?: string, end?: string) => {
  if (!start || !end) return false;

  const now = dayjs();
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  return now.isAfter(startDate) && now.isBefore(endDate);
};

export const maskVNDPriceBeforeSale = (
  price?: number,
  visibleDigits = 1
): string => {
  if (!price) return "0 ₫";

  const priceStr = price.toString();
  const masked = priceStr
    .split("")
    .map((digit, i) => (i < visibleDigits ? digit : "?"))
    .join("");

  const numberOfHidden = priceStr.length - visibleDigits;
  const padded = masked.padEnd(priceStr.length, "?");

  // Thêm dấu phẩy ngăn cách và đơn vị ₫
  const formatted = Number(padded.replace(/\?/g, "0")).toLocaleString("vi-VN");

  // Thay số 0 (fake) bằng dấu ? lại
  const finalMasked = formatted.replace(/0/g, "?") + " ₫";

  return finalMasked;
};

export const formatDuration = (duration: number) => {
  // Convert milliseconds to seconds if needed
  const totalSeconds = Math.floor(duration / 1000);

  // Calculate minutes and seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format as MM:SS with leading zeros for seconds
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
