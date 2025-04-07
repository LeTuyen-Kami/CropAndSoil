import React, { useState } from "react";
import { Modal, TouchableOpacity, View, TextInput } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Ionicons } from "@expo/vector-icons";

type EditProfileFieldProps = {
  visible: boolean;
  onClose: () => void;
  fieldLabel: string;
  currentValue: string;
  onSave: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
};

const EditProfileField = ({
  visible,
  onClose,
  fieldLabel,
  currentValue,
  onSave,
  placeholder,
  keyboardType = "default",
}: EditProfileFieldProps) => {
  const [value, setValue] = useState(currentValue);

  const handleSave = () => {
    onSave(value);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="p-4 bg-white rounded-t-3xl">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-medium">{`Chỉnh sửa ${fieldLabel}`}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="mb-1 text-sm">{fieldLabel}</Text>
            <TextInput
              className="p-3 rounded-lg border border-gray-300"
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              keyboardType={keyboardType}
            />
          </View>

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
      </View>
    </Modal>
  );
};

export default EditProfileField;
