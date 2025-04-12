import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import {
  FontAwesome,
  MaterialIcons,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { cn } from "~/lib/utils";
import Alert from "../common/Alert";

interface DocumentUploaderProps {
  hasDocument: boolean;
  documentName?: string;
  onUpload: () => void;
  onRemove?: () => void;
  className?: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  hasDocument,
  documentName,
  onUpload,
  onRemove,
  className,
}) => {
  const extension = documentName?.split(".").pop();

  if (hasDocument && documentName) {
    return (
      <View className="px-2.5 w-full">
        <View className="flex-row items-center bg-[#F5F5F5] p-3 rounded-lg">
          {extension === "pdf" ? (
            <AntDesign name="pdffile1" size={24} color="#FCBA27" />
          ) : (
            <MaterialIcons name="file-present" size={24} color="#FCBA27" />
          )}
          <View className="flex-1 ml-2">
            <Text
              className="text-sm text-[#383B45] font-medium"
              numberOfLines={1}
            >
              {documentName}
            </Text>
          </View>
          <TouchableOpacity onPress={onRemove} className="ml-2">
            <AntDesign name="delete" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className={cn("flex-col gap-5", className)}>
      <View className="p-6 border border-dashed border-[#CCCCCC] rounded-2xl items-center">
        <Feather name="upload" size={30} color="#FCBA27" />
        <View className="mt-1">
          <Text className="text-sm text-[#383B45] text-center">
            Tải lên giấy chứng từ kinh doanh và mã số thuế
          </Text>
          <Text className="text-xs text-[#676767] text-center mt-1">
            Định dạng hình ảnh JPG, PNG hoặc PDF, và kích thước không vượt quá
            5MB.
          </Text>
        </View>
        <TouchableOpacity
          className="mt-5 px-4 py-1.5 border border-[#CCCCCC] rounded-full"
          onPress={onUpload}
        >
          <Text className="text-xs font-medium text-[#676767]">
            Tải lên tài liệu
          </Text>
        </TouchableOpacity>
      </View>
      {!hasDocument && (
        <Alert
          title="Chưa có tệp nào được chọn"
          description="Vui lòng tải lên tệp bắt buộc để hoàn tất thông tin."
        />
      )}
    </View>
  );
};

export default DocumentUploader;
