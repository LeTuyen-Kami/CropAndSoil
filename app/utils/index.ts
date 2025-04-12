import { Dimensions, Platform } from "react-native";
import { mmkvStore } from "~/store/atomWithMMKV";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

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
