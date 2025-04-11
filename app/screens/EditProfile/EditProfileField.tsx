import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { GENDER_OPTIONS } from "~/utils/contants";
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type EditProfileFieldProps = {
  visible: boolean;
  onClose: () => void;
  fieldLabel: string;
  currentValue: string;
  onSave: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  fieldType?: "text" | "date" | "gender";
};

const EditProfileField = ({
  visible,
  onClose,
  fieldLabel,
  currentValue,
  onSave,
  placeholder,
  keyboardType = "default",
  fieldType = "text",
}: EditProfileFieldProps) => {
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState(currentValue);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);

  const handleSave = () => {
    onSave(value);
    handleClose();
  };

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    translateY.value = withTiming(SCREEN_HEIGHT);
    opacity.value = withTiming(0, {}, () => {
      runOnJS(onClose)();
    });
  }, [onClose]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setValue(selectedDate.toISOString());
    }
  };

  const handleSelectGender = (gender: string) => {
    setValue(gender);
  };

  React.useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0);
      opacity.value = withTiming(0.5);

      if (fieldType === "date" && currentValue) {
        setValue(currentValue);
      }
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const bottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    if (visible) {
      setValue(currentValue);
    }
  }, [currentValue, visible]);

  if (!visible) return null;

  return (
    <View className="absolute top-0 right-0 bottom-0 left-0">
      <KeyboardAvoidingView
        className="relative flex-col flex-1 justify-end"
        behavior="padding"
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            className="absolute top-0 right-0 bottom-0 left-0 bg-black"
            style={backdropStyle}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          className="w-full bg-white rounded-t-3xl"
          style={[
            bottomSheetStyle,
            {
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <View className="px-4">
            <View className="flex-row justify-between items-center mt-4 mb-6">
              <Text className="text-lg font-medium">{`Chỉnh sửa ${fieldLabel}`}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {fieldType === "text" && (
              <View className="mb-6">
                <Input
                  placeholder={`Nhập ${fieldLabel}`}
                  value={value}
                  onChangeText={setValue}
                  keyboardType={keyboardType}
                  className="border-[#F5F5F5]"
                  clearable={true}
                />
              </View>
            )}

            {fieldType === "date" && (
              <View className="items-center mb-6">
                <DateTimePicker
                  value={
                    dayjs(value).isValid() ? dayjs(value).toDate() : new Date()
                  }
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  locale="vi"
                />
                <Text className="mt-2 text-base">
                  {dayjs(value).isValid()
                    ? dayjs(value).format("DD/MM/YYYY")
                    : "Ngày sinh"}
                </Text>
              </View>
            )}

            {fieldType === "gender" && (
              <View className="mb-6">
                {GENDER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`p-3 mb-2 border rounded-lg ${
                      value === option.value
                        ? "border-[#159747] bg-[#DEF1E5]"
                        : "border-[#F5F5F5]"
                    }`}
                    onPress={() => handleSelectGender(option.value)}
                  >
                    <Text
                      className={`text-base ${
                        value === option.value
                          ? "text-[#159747] font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View className="mb-4">
              <Button
                variant="default"
                className="bg-[#FCBA27] rounded-full py-3"
                onPress={handleSave}
              >
                <Text className="text-base font-medium text-white">Lưu</Text>
              </Button>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfileField;
