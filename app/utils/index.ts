import { Dimensions, Platform } from "react-native";

export const ENV = process.env;

export const screen = Dimensions.get("screen");

export const isIOS = Platform.OS === "ios";

export const isAndroid = Platform.OS === "android";

const baseWidth = 393;
const baseHeight = 852;
