import React, { useState } from "react";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { View, TouchableOpacity, Alert, Modal } from "react-native";
import { Text } from "~/components/ui/text";
import Header from "~/components/common/Header";
import { Input } from "~/components/ui/input";
import DocumentUploader from "~/components/business/DocumentUploader";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { toast } from "~/components/common/Toast";
import ModalBottom from "~/components/common/ModalBottom";
// Define a type for our document
type DocumentAsset = {
  name?: string;
  fileName?: string | null;
  uri: string;
  fileSize?: number;
  size?: number;
};

const BusinessVoucherScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const [taxCode, setTaxCode] = useState("");
  const [document, setDocument] = useState<DocumentAsset | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const handleUploadDocument = () => {
    setShowTypeSelector(true);
  };

  const handleSelectImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        toast.error("Cần quyền truy cập vào thư viện ảnh");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) return;

      // Check file size (5MB limit)
      const fileSize = result.assets[0].fileSize || 0;
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (fileSize > maxSize) {
        Alert.alert(
          "Tệp quá lớn",
          "Kích thước tệp không được vượt quá 5MB. Vui lòng chọn tệp khác.",
          [{ text: "Đồng ý" }]
        );
        return;
      }

      setDocument({
        uri: result.assets[0].uri,
        fileName: result.assets[0].fileName,
        fileSize: result.assets[0].fileSize,
      });
      setShowTypeSelector(false);
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn ảnh. Vui lòng thử lại.", [
        { text: "Đồng ý" },
      ]);
    }
  };

  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      // Check file size (5MB limit)
      const fileSize = result.assets[0].size || 0;
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (fileSize > maxSize) {
        Alert.alert(
          "Tệp quá lớn",
          "Kích thước tệp không được vượt quá 5MB. Vui lòng chọn tệp khác.",
          [{ text: "Đồng ý" }]
        );
        return;
      }

      setDocument({
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        size: result.assets[0].size,
      });
      setShowTypeSelector(false);
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi chọn tệp. Vui lòng thử lại.", [
        { text: "Đồng ý" },
      ]);
    }
  };

  const handleRemoveDocument = () => {
    setDocument(null);
  };

  const handleSave = () => {
    if (!taxCode.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập mã số thuế", [
        { text: "Đồng ý" },
      ]);
      return;
    }

    if (!document) {
      Alert.alert(
        "Thiếu tài liệu",
        "Vui lòng tải lên tài liệu chứng từ kinh doanh",
        [{ text: "Đồng ý" }]
      );
      return;
    }

    // Implement save functionality
    console.log("Saving:", { taxCode, document });

    // Show success message
    Alert.alert("Thành công", "Đã lưu thông tin chứng từ kinh doanh", [
      { text: "Đồng ý" },
    ]);
  };

  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header
        title="Chứng từ kinh doanh"
        hasSafeTop={false}
        className="bg-transparent border-0"
        textColor="white"
        titleClassName="font-bold"
      />

      <View className="bg-white rounded-t-[40px] pt-10 overflow-hidden flex-1">
        <Text className="text-sm mx-5 my-2 font-medium text-[#383B45]">
          Mã số thuế
        </Text>

        <View className="px-2 pb-2.5 flex-row items-center justify-between">
          <View className="flex-1">
            <Input
              placeholder="Nhập ký tự"
              className="bg-white border-[#F0F0F0]"
              maxLength={14}
              value={taxCode}
              onChangeText={setTaxCode}
              keyboardType="number-pad"
              rightIcon={
                <Text className="text-sm text-[#AEAEAE] ml-2">
                  {taxCode.length}/14
                </Text>
              }
            />
          </View>
        </View>

        <Text className="text-sm font-medium text-[#383B45] mt-1.5 mx-5 mb-2">
          Chứng từ kinh doanh
        </Text>

        <DocumentUploader
          hasDocument={!!document}
          documentName={getDocumentName(document)}
          onUpload={handleUploadDocument}
          onRemove={handleRemoveDocument}
          className="mx-2.5"
        />

        <View
          className="px-2 py-[12px] items-center mt-auto"
          style={{ paddingBottom: bottom }}
        >
          <TouchableOpacity
            className="w-full h-11 bg-[#FCBA27] rounded-full items-center justify-center"
            onPress={handleSave}
          >
            <Text className="text-base font-medium text-white">Lưu</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ModalBottom
        isOpen={showTypeSelector}
        onClose={() => setShowTypeSelector(false)}
      >
        <SelectDocumentType
          onClose={() => setShowTypeSelector(false)}
          onSelectImage={handleSelectImage}
          onSelectDocument={handleSelectDocument}
        />
      </ModalBottom>
    </ScreenWrapper>
  );
};

// Helper function to get document name
const getDocumentName = (document: DocumentAsset | null): string => {
  if (!document) return "";
  return document.name || document.fileName || "Document";
};

const SelectDocumentType = ({
  onClose,
  onSelectImage,
  onSelectDocument,
}: {
  onClose: () => void;
  onSelectImage: () => void;
  onSelectDocument: () => void;
}) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View className="bg-white rounded-t-3xl">
      <View className="self-center my-3 w-12 h-1 bg-gray-300 rounded-full" />

      <Text className="mb-5 text-lg font-medium text-center">
        Chọn loại tài liệu
      </Text>

      <TouchableOpacity
        className="flex-row items-center px-6 py-4"
        onPress={onSelectImage}
      >
        <View className="w-10 h-10 bg-[#F0F0F0] rounded-full items-center justify-center mr-4">
          <FontAwesome name="image" size={20} color="#FCBA27" />
        </View>
        <View>
          <Text className="text-base font-medium">Hình ảnh</Text>
          <Text className="text-sm text-gray-500">JPG, PNG</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center px-6 py-4"
        onPress={onSelectDocument}
      >
        <View className="w-10 h-10 bg-[#F0F0F0] rounded-full items-center justify-center mr-4">
          <FontAwesome name="file-pdf-o" size={20} color="#FCBA27" />
        </View>
        <View>
          <Text className="text-base font-medium">Tài liệu</Text>
          <Text className="text-sm text-gray-500">PDF</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BusinessVoucherScreen;
