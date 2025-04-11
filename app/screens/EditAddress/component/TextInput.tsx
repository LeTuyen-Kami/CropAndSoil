import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useAtom } from "jotai";

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  atom: any;
  error?: string;
  onClear?: () => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

export function AddressTextInput({
  placeholder,
  value,
  onChange,
  atom,
  error,
  onClear,
  keyboardType = "default",
}: TextInputProps) {
  // Using the provided atom to track state
  const [inputValue, setInputValue] = useAtom(atom);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (text: string) => {
    setInputValue(text);
    onChange(text);
  };

  const handleClear = () => {
    setInputValue("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      error={error}
      keyboardType={keyboardType}
      textInputClassName="text-sm leading-4"
      className={
        error
          ? "border-red-500"
          : isFocused
          ? "border-[#159747]"
          : "border-[#F0F0F0]"
      }
      rightIcon={
        value ? (
          <Pressable
            onPress={handleClear}
            className="p-1 rounded-full bg-black/20"
          >
            <Feather name="x" size={12} color="white" />
          </Pressable>
        ) : null
      }
    />
  );
}
