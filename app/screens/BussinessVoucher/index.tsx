import React, { useState } from "react";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import {
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Text as RNText,
  ActivityIndicator,
} from "react-native";
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
import { UpdateUserPayload, userService } from "~/services/api/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "~/utils";
import { MAX_IMAGE_SIZE } from "~/utils/contants";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList, RootStackRouteProp } from "~/navigation/types";
// Define a type for our document
type DocumentAsset = {
  name?: string;
  fileName?: string | null;
  uri: string;
  fileSize?: number;
  size?: number;
  type?: string;
};

const BusinessVoucherScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const route = useRoute<RootStackRouteProp<"BusinessVoucher">>();
  const { fullName, phone, email, gender, birthDate, taxId, avatar } =
    route?.params || {};
  const [taxCode, setTaxCode] = useState("");
  const [document, setDocument] = useState<DocumentAsset | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const mutationUploadDocument = useMutation({
    mutationFn: (payload: UpdateUserPayload) => {
      return userService.updateProfile(payload);
    },
  });
  const handleUploadDocument = () => {
    // setShowTypeSelector(true);
    handleSelectDocument();
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

      if (fileSize > MAX_IMAGE_SIZE) {
        toast.error(
          "Kích thước tệp không được vượt quá 10MB. Vui lòng chọn tệp khác."
        );
        return;
      }

      setDocument({
        uri: result.assets[0].uri,
        fileName: result.assets[0].fileName,
        fileSize: result.assets[0].fileSize,
        type: result.assets[0].type,
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
        type: ["application/pdf", "image/jpeg", "image/png", "image/heic"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      // Check file size (5MB limit)
      const fileSize = result.assets[0].size || 0;

      if (fileSize > MAX_IMAGE_SIZE) {
        toast.error(
          "Kích thước tệp không được vượt quá 10MB. Vui lòng chọn tệp khác."
        );
        return;
      }

      setDocument({
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        size: result.assets[0].size,
        type: "File",
      });
      setShowTypeSelector(false);
    } catch (error) {
      console.error("Error picking document:", error);
      toast.error("Đã xảy ra lỗi khi chọn tệp. Vui lòng thử lại.");
    }
  };

  const handleRemoveDocument = () => {
    setDocument(null);
  };

  const handleSave = () => {
    if (!taxCode.trim()) {
      toast.error("Vui lòng nhập mã số thuế");
      return;
    }

    if (!document) {
      toast.error("Vui lòng tải lên tài liệu chứng từ kinh doanh");
      return;
    }

    // Implement save functionality
    mutationUploadDocument.mutate(
      {
        taxNumber: taxCode,
        taxCertificateFile: {
          uri: document.uri,
          type: "File",
          name: document.name || "",
        },

        name: fullName,
        phone: phone,
        email: email,
        gender: gender,
        birthday: birthDate,
        avatarFile:
          avatar && avatar.uri
            ? {
                uri: avatar?.uri || "",
                type: avatar?.mimeType || "image/jpeg",
                name: avatar?.fileName || "",
              }
            : undefined,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          toast.success("Đã lưu thông tin chứng từ kinh doanh");
          navigation.goBack();
        },
        onError: (error) => {
          const message = getErrorMessage(
            error,
            "Đã xảy ra lỗi khi lưu thông tin chứng từ kinh doanh"
          );
          toast.error(message);
        },
      }
    );
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

      <View className="bg-white rounded-t-[40px] pt-4 overflow-hidden flex-1">
        <KeyboardAwareScrollView>
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
                  <Text className="text-sm text-[#AEAEAE] pl-2">
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
              {mutationUploadDocument.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-base font-medium text-white">Lưu</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>

      {/* <ModalBottom
        isOpen={showTypeSelector}
        onClose={() => setShowTypeSelector(false)}
      >
        <SelectDocumentType
          onClose={() => setShowTypeSelector(false)}
          onSelectImage={handleSelectImage}
          onSelectDocument={handleSelectDocument}
        />
      </ModalBottom> */}
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
