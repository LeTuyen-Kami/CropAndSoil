import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useState } from "react";
import { Switch, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import SecurityPinModal from "~/components/common/SecurityPinModal";
import { toast } from "~/components/common/Toast";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { devModeAtom, resetDevMode } from "~/store/atoms";
import { getDeviceId } from "~/utils";

const DevModeItem = ({
  title,
  subtitle,
  value,
  onValueChange,
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) => {
  return (
    <View className="flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-100">
      <View className="flex-1 pr-4">
        <Text className="text-sm font-medium">{title}</Text>
        {subtitle && (
          <Text className="mt-1 text-xs text-gray-500">{subtitle}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E7EB", true: "#FCBA26" }}
        thumbColor={value ? "#fff" : "#fff"}
      />
    </View>
  );
};

const DevMode = () => {
  const navigation = useSmartNavigation();
  const [devMode, setDevMode] = useAtom(devModeAtom);
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const updateDevModeSetting = <K extends keyof typeof devMode>(
    key: K,
    value: boolean
  ) => {
    setDevMode((prev) => ({
      ...prev,
      [key]: value,
      updatedAt: dayjs().toISOString(),
    }));
  };

  const handleNetworkLoggerToggle = (value: boolean) => {
    if (value && !devMode.networkLoggerUnlocked) {
      setShowSecurityModal(true);
      return;
    }

    if (!value) {
      setDevMode((prev) => ({
        ...prev,
        showNetworkLogger: false,
        networkLoggerUnlocked: false,
        updatedAt: dayjs().toISOString(),
      }));
      return;
    }

    updateDevModeSetting("showNetworkLogger", value);
  };

  const handleSecurityVerify = (pin: string): boolean => {
    if (pin === devMode.networkLoggerSecurityPin) {
      setDevMode((prev) => ({
        ...prev,
        showNetworkLogger: true,
        networkLoggerUnlocked: true,
        updatedAt: dayjs().toISOString(),
      }));
      toast.success("Network Logger unlocked!");
      return true;
    }
    return false;
  };

  const handleReset = () => {
    resetDevMode();
    toast.success("Dev mode settings reset!");
  };

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-100">
        <Text className="text-lg font-medium">Developer Mode</Text>
      </View>
      <View className="flex-1 bg-[#EEE] rounded-t-3xl">
        <Text className="px-5 py-3 text-xs font-medium tracking-tight text-error-500">
          Notice: Some features may not work as expected. Please use it for
          testing only.
        </Text>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View className="mt-4">
            <Text className="text-xs font-medium tracking-tight text-[#676767] px-5 py-3">
              NETWORK & DEBUGGING
            </Text>
            <View className="flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-100">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center">
                  <Text className="text-sm font-medium">Network Logger</Text>
                  {devMode.networkLoggerUnlocked && (
                    <View className="px-2 py-1 ml-2 bg-green-100 rounded-full">
                      <Text className="text-xs font-medium text-green-600">
                        Unlocked
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="mt-1 text-xs text-gray-500">
                  Show network requests and responses (Requires PIN)
                </Text>
              </View>
              <Switch
                value={devMode.showNetworkLogger}
                onValueChange={handleNetworkLoggerToggle}
                trackColor={{ false: "#E5E7EB", true: "#FCBA26" }}
                thumbColor={devMode.showNetworkLogger ? "#fff" : "#fff"}
              />
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-xs font-medium tracking-tight text-[#676767] px-5 py-3">
              ERROR TRACKING
            </Text>
            <DevModeItem
              title="Sentry"
              subtitle="Enable error tracking and reporting"
              value={devMode.enableSentry}
              onValueChange={(value) =>
                updateDevModeSetting("enableSentry", value)
              }
            />
          </View>

          <View className="mt-6">
            <Text className="text-xs font-medium tracking-tight text-[#676767] px-5 py-3">
              PERFORMANCE
            </Text>
            <DevModeItem
              title="Optimal Product Images"
              subtitle="Change product image to placeholder 200x300"
              value={devMode.enableOptimalProductImage}
              onValueChange={(value) =>
                updateDevModeSetting("enableOptimalProductImage", value)
              }
            />
          </View>

          <View className="px-5 mt-8">
            <Button
              onPress={handleReset}
              variant="outline"
              className="border-red-300"
            >
              <Text className="text-red-600">Reset to Default</Text>
            </Button>
          </View>
          <View className="justify-center items-center py-2">
            <Text className="text-[10px] text-[#676767]" selectable>
              {getDeviceId()}
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>

      <SecurityPinModal
        visible={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        onVerify={handleSecurityVerify}
        title="Security Verification"
        subtitle="Enter PIN to unlock Network Logger. This feature may expose sensitive data."
      />
    </View>
  );
};

export default DevMode;
