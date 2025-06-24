import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ModalBottom from "./ModalBottom";
import CenterModal from "./CenterModal";
import { cn } from "~/lib/utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface ModalReportProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (reason: string, customReason?: string) => void;
}

const reportOptions = [
  { value: "spam", label: "Spam" },
  { value: "inappropriate", label: "Không phù hợp" },
  { value: "abuse", label: "Lạm dụng / xúc phạm" },
  { value: "other", label: "Khác" },
];

const ModalReport = ({ isOpen, onClose, onSubmit }: ModalReportProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("spam");
  const [customReason, setCustomReason] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!selectedReason) return;
    if (loading) return;

    setLoading(true);

    // Reset form
    setTimeout(() => {
      onSubmit?.(
        selectedReason,
        selectedReason === "other" ? customReason : undefined
      );
      setSelectedReason("");
      setCustomReason("");
      onClose();
      setLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  const isSubmitDisabled =
    !selectedReason ||
    (selectedReason === "other" && !customReason.trim()) ||
    loading;

  useEffect(() => {
    if (isOpen) {
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <CenterModal
      visible={isOpen}
      onClose={() => {
        if (loading) return;
        handleClose();
      }}
      wrapperClassName="w-[95%]"
    >
      <View className="overflow-hidden h-full bg-white rounded-2xl shadow-2xl">
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          bottomOffset={20}
        >
          {/* Header */}
          <View className="p-4 border-b border-gray-100">
            <Text className="text-2xl font-bold tracking-tight text-center text-gray-900">
              Báo cáo nội dung
            </Text>
            <Text className="mt-2 text-sm leading-5 text-center text-gray-500">
              Hãy cho chúng tôi biết vấn đề với nội dung này
            </Text>
          </View>

          {/* Content */}
          <View className="p-4">
            <View className="flex-col gap-2">
              {reportOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  className={cn(
                    "p-4 rounded-xl",
                    selectedReason === option.value
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50 border border-transparent active:bg-gray-100"
                  )}
                  disabled={loading}
                  onPress={() => {
                    setSelectedReason(option.value);
                    console.log(option.value);
                  }}
                >
                  <View className="flex-row items-center">
                    <View
                      className={cn(
                        "w-5 h-5 rounded-full border-2 mr-4 items-center justify-center",
                        selectedReason === option.value
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300 bg-white"
                      )}
                    >
                      {selectedReason === option.value && (
                        <View className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </View>
                    <Text
                      className={cn(
                        "text-base leading-6",
                        selectedReason === option.value
                          ? "text-blue-700 font-semibold"
                          : "text-gray-800 font-medium"
                      )}
                    >
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {selectedReason === "other" && (
              <View className="mt-6">
                <Text className="mb-3 text-sm font-medium text-gray-700">
                  Chi tiết lý do
                </Text>
                <TextInput
                  className="p-4 text-base leading-6 text-gray-900 bg-gray-50 rounded-xl border border-gray-200"
                  placeholder="Vui lòng mô tả chi tiết lý do báo cáo..."
                  placeholderTextColor="#9CA3AF"
                  value={customReason}
                  onChangeText={setCustomReason}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{ minHeight: 100 }}
                />
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
        {/* Footer */}
        <View className="flex-col gap-2 p-4">
          <TouchableOpacity
            className={cn(
              "items-center px-6 py-4 rounded-xl",
              isSubmitDisabled ? "bg-gray-100" : "bg-red-500 active:bg-red-600"
            )}
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text
                className={cn(
                  "text-base font-semibold",
                  isSubmitDisabled ? "text-gray-400" : "text-white"
                )}
              >
                Gửi báo cáo
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            disabled={loading}
            className="items-center px-6 py-4 bg-gray-100 rounded-xl active:bg-gray-200"
            onPress={handleClose}
            activeOpacity={0.8}
          >
            <Text className="text-base font-semibold text-gray-700">
              Hủy bỏ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CenterModal>
  );
};

export default ModalReport;
