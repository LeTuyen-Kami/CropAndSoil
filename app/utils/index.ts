import { Dimensions, Platform } from "react-native";
import { mmkvStore } from "~/store/atomWithMMKV";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { BREAKPOINTS } from "./contants";
import dayjs from "dayjs";

export const ENV = process.env;

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

export const preHandleFlashListData = (data: any[]) => {
  const chunkedData = chunkArray(data, 2);

  return applyTyoe(chunkedData, {
    typeName: "product",
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
  if (!price) return "";

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
    return `Online ${diffInMinutes} phút trước`;
  }

  if (diffInMinutes < 24 * 60) {
    return `Online ${diffInMinutes / 60} giờ trước`;
  }

  return `Online ${diffInMinutes / (24 * 60)} ngày trước`;
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
