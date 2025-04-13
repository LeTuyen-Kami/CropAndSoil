import * as React from "react";
import {
  TextInput,
  View,
  Text,
  type TextInputProps,
  TouchableOpacity,
} from "react-native";
import { cn } from "~/lib/utils";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholderClassName?: string;
  error?: string;
  textInputClassName?: string;
  clearable?: boolean;
  focusedStyle?: string;
  placeholderTextColor?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      className,
      placeholderClassName,
      leftIcon,
      rightIcon,
      error,
      textInputClassName,
      clearable,
      focusedStyle,
      placeholderTextColor = "#AEAEAE",
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <>
        <View
          className={cn(
            "flex-row items-center bg-white rounded-full px-5 border border-white",
            props.editable === false && "opacity-50 web:cursor-not-allowed",
            className,
            error && "border border-red-500",
            isFocused && focusedStyle
          )}
        >
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <TextInput
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={ref}
            className={cn(
              "flex-1 py-4 text-base leading-5",
              textInputClassName
            )}
            placeholderTextColor={placeholderTextColor}
            {...props}
          />
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
          {clearable && props?.value && isFocused && (
            <TouchableOpacity
              hitSlop={10}
              onPress={() => props?.onChangeText?.("")}
              className="bg-[#F5F5F5] rounded-full p-1"
            >
              <Ionicons name="close" size={14} color="#AEAEAE" />
            </TouchableOpacity>
          )}
        </View>
        {error && (
          <View className="flex-row gap-1 items-center pl-5 mt-1">
            <MaterialIcons name="error" size={12} color="red" />
            <Text className="text-xs text-red-500">{error}</Text>
          </View>
        )}
      </>
    );
  }
);

Input.displayName = "Input";

export { Input };
