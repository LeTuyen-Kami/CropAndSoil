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
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      error={error}
      keyboardType={keyboardType}
      textInputClassName="text-sm leading-4"
      clearable
      focusedStyle="border border-[#159747]"
    />
  );
}
