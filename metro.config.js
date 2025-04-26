const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const config = getSentryExpoConfig(__dirname);
module.exports = config;

module.exports = withNativeWind(config, {
  input: "./global.css",
  inlineRem: 16,
});
