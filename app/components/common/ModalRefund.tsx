import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { AntDesign, Feather } from "@expo/vector-icons";
import CenterModal from "./CenterModal";
import ModalBottom from "./ModalBottom";
import { Text } from "../ui/text";
import { toast } from "./Toast";
import { imagePaths } from "~/assets/imagePath";
import { screen } from "~/utils";
import { MAX_IMAGE_SIZE } from "~/utils/contants";

type MediaAsset = {
  uri: string;
  type: "image";
  size?: number;
  name: string;
  mimeType: string;
};

interface ModalRefundProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (data: { reason: string; images: MediaAsset[] }) => void;
  isLoading?: boolean;
}

const MAX_IMAGES = 5;

const ModalRefund: React.FC<ModalRefundProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [showMediaTypeModal, setShowMediaTypeModal] = useState(false);

  const getFileInfo = async (fileUri: string): Promise<{ size: number }> => {
    const fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });
    return {
      size: fileInfo.exists
        ? (fileInfo as FileSystem.FileInfo & { size: number }).size || 0
        : 0,
    };
  };

  const handlePickImage = async () => {
    try {
      if (mediaAssets.length >= MAX_IMAGES) {
        toast.warning(`Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh`);
        return;
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        toast.error("Cần quyền truy cập vào camera");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const fileInfo = await getFileInfo(fileUri);

        if (fileInfo.size > MAX_IMAGE_SIZE) {
          toast.error(`Kích thước ảnh không được vượt quá 10MB`);
          return;
        }

        const newAsset: MediaAsset = {
          uri: fileUri,
          type: "image",
          size: fileInfo.size,
          name: result.assets[0].fileName || "image.jpg",
          mimeType: result.assets[0].mimeType || "image/jpeg",
        };

        setMediaAssets([...mediaAssets, newAsset]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      toast.error("Đã xảy ra lỗi khi chọn ảnh");
    }
  };

  const handleTakePhoto = async () => {
    try {
      if (mediaAssets.length >= MAX_IMAGES) {
        toast.warning(`Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh`);
        return;
      }

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

      if (!result.canceled && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const fileInfo = await getFileInfo(fileUri);

        if (fileInfo.size > MAX_IMAGE_SIZE) {
          toast.error(`Kích thước ảnh không được vượt quá 10MB`);
          return;
        }

        const newAsset: MediaAsset = {
          uri: fileUri,
          type: "image",
          size: fileInfo.size,
          name: result.assets[0].fileName || "image.jpg",
        };

        setMediaAssets([...mediaAssets, newAsset]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      toast.error("Đã xảy ra lỗi khi chụp ảnh");
    }
  };

  const removeMediaAsset = (index: number) => {
    const newAssets = [...mediaAssets];
    newAssets.splice(index, 1);
    setMediaAssets(newAssets);
  };

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do hoàn trả hàng");
      return;
    }

    onSubmit?.({ reason: reason.trim(), images: mediaAssets });
  };

  const resetForm = () => {
    setReason("");
    setMediaAssets([]);
  };

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  return (
    <>
      <ModalBottom isOpen={visible} onClose={onClose}>
        <ScrollView>
          <View className="p-4">
            <Text className="mb-6 text-lg font-medium text-center">
              Yêu cầu hoàn trả hàng
            </Text>

            {/* Reason Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2 text-[#383B45]">
                Lý do <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="border border-[#E3E3E3] rounded-lg p-3 text-[#383B45] text-sm"
                placeholder="Nhập lý do hoàn trả hàng..."
                placeholderTextColor="#AEAEAE"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={reason}
                onChangeText={setReason}
                style={{ height: 100 }}
              />
            </View>

            {/* Image Section */}
            <View className="mb-6">
              <Text className="text-sm font-medium mb-3 text-[#383B45]">
                Hình ảnh
              </Text>

              <View className="flex-row flex-wrap gap-2">
                {/* Uploaded Images */}
                {mediaAssets.map((asset, index) => (
                  <View
                    key={index}
                    className="relative"
                    style={{
                      width: (screen.width * 0.9 - 48 - 8 * 3) / 4,
                      height: (screen.width * 0.9 - 48 - 8 * 3) / 4,
                    }}
                  >
                    <Image
                      source={{ uri: asset.uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 6,
                      }}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      className="flex absolute top-1 right-1 justify-center items-center w-5 h-5 rounded-full bg-black/50"
                      onPress={() => removeMediaAsset(index)}
                      hitSlop={8}
                    >
                      <AntDesign name="close" size={12} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}

                {/* Upload Button */}
                <TouchableOpacity
                  className="flex justify-center items-center rounded-lg border border-gray-400 border-dashed bg-[#F8F9FA]"
                  style={{
                    width: (screen.width * 0.9 - 48 - 8 * 3) / 4,
                    height: (screen.width * 0.9 - 48 - 8 * 3) / 4,
                  }}
                  onPress={() => setShowMediaTypeModal(true)}
                >
                  <View className="items-center">
                    <Image
                      source={imagePaths.icCamera}
                      style={{ width: 20, height: 20 }}
                    />
                    <Text className="text-[#AEAEAE] text-xs mt-1">
                      ({mediaAssets.length}/{MAX_IMAGES})
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              className="bg-[#FCBA27] rounded-lg py-3 items-center mt-4 disabled:opacity-50"
              onPress={handleSubmit}
              disabled={isLoading || !reason.trim() || mediaAssets.length === 0}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-base font-medium text-white">
                  GỬI YÊU CẦU
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ModalBottom>

      <ModalBottom
        isOpen={showMediaTypeModal}
        onClose={() => setShowMediaTypeModal(false)}
      >
        <TouchableWithoutFeedback>
          <View className="p-4">
            <Text className="mb-4 text-lg font-medium">Thêm hình ảnh</Text>

            <TouchableOpacity
              className="flex-row items-center py-3 border-b border-gray-100"
              onPress={() => {
                handlePickImage();
                setShowMediaTypeModal(false);
              }}
            >
              <Feather
                name="camera"
                size={20}
                color="#383B45"
                style={{ marginRight: 12 }}
              />
              <Text className="text-base text-[#383B45]">Chụp ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3"
              onPress={() => {
                handleTakePhoto();
                setShowMediaTypeModal(false);
              }}
            >
              <Feather
                name="image"
                size={20}
                color="#383B45"
                style={{ marginRight: 12 }}
              />
              <Text className="text-base text-[#383B45]">Chọn từ thư viện</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ModalBottom>
    </>
  );
};

export default ModalRefund;
