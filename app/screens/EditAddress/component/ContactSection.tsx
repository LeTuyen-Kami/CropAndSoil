import React from "react";
import { View, Text } from "react-native";
import { AddressTextInput } from "./TextInput";
import { useAtom } from "jotai";
import {
  fullNameAtom,
  phoneNumberAtom,
  phoneErrorAtom,
  formStateAtom,
  validatePhoneNumber,
} from "../formAtom";

export function ContactSection() {
  const [fullName, setFullName] = useAtom(fullNameAtom);
  const [phoneNumber, setPhoneNumber] = useAtom(phoneNumberAtom);
  const [phoneError, setPhoneError] = useAtom(phoneErrorAtom);
  const [formState, setFormState] = useAtom(formStateAtom);

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    const error = validatePhoneNumber(text);
    setPhoneError(error);
  };

  return (
    <View className="w-full">
      <View className="px-5 py-2">
        <Text className="text-sm font-medium text-[#383B45]">Liên hệ</Text>
      </View>

      <View className="px-2 pb-2">
        <AddressTextInput
          placeholder="Họ và tên"
          value={fullName}
          onChange={setFullName}
          atom={fullNameAtom}
        />
      </View>

      <View className="px-2 pb-2">
        <AddressTextInput
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChange={handlePhoneChange}
          atom={phoneNumberAtom}
          error={phoneError}
        />
      </View>
    </View>
  );
}
