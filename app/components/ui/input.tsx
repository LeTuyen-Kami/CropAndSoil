import * as React from "react";
import { TextInput, View, Text, type TextInputProps } from "react-native";
import { cn } from "~/lib/utils";

interface InputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholderClassName?: string;
  error?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    { className, placeholderClassName, leftIcon, rightIcon, error, ...props },
    ref
  ) => {
    return (
      <>
        <View
          className={cn(
            "flex-row items-center bg-white rounded-full px-6",
            props.editable === false && "opacity-50 web:cursor-not-allowed",
            className,
            error && "border border-red-500"
          )}
        >
          {leftIcon && <View className="mr-2">{leftIcon}</View>}
          <TextInput
            ref={ref}
            className={cn("flex-1 py-4 text-base leading-5")}
            placeholderClassName={cn(
              "text-muted-foreground",
              placeholderClassName
            )}
            {...props}
          />
          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </View>
        {error && (
          <Text className="mt-1 ml-2 text-sm text-red-500">{error}</Text>
        )}
      </>
    );
  }
);

Input.displayName = "Input";

export { Input };
