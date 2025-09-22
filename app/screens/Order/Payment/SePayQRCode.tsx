import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { toast } from "~/components/common/Toast";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

interface SePayQRCodeProps {
  qrCodeUrl: string;
  status: string;
  isPolling: boolean;
}

const SePayQRCode = ({ qrCodeUrl, status, isPolling }: SePayQRCodeProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadQR = async () => {
    try {
      setIsDownloading(true);

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        toast.error("Cần quyền truy cập thư viện ảnh để tải xuống");
        return;
      }

      // tạo đường dẫn có đuôi .png
      const fileUri = FileSystem.cacheDirectory + `qr_${Date.now()}.png`;

      // tải ảnh từ URL về local
      await FileSystem.downloadAsync(qrCodeUrl, fileUri);

      // lưu vào gallery
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("SePay QR", asset, false);

      toast.success("Đã lưu ảnh QR code vào thư viện ảnh");
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi lưu ảnh QR code vào thư viện ảnh");
    } finally {
      setIsDownloading(false);
    }
  };
  const getStatusText = () => {
    switch (status) {
      case "success":
        return "Thanh toán thành công";
      case "failed":
        return "Thanh toán thất bại";
      default:
        return "Chờ thanh toán";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-orange-600";
    }
  };

  return (
    <View className="bg-white rounded-2xl overflow-hidden">
      <Text className="text-sm font-semibold text-gray-800 p-4">
        Cách 1: Mở app ngân hàng và quét mã QR
      </Text>

      <View className="items-center mb-4">
        <View className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-3">
          <Image
            source={{ uri: qrCodeUrl }}
            style={{ width: 200, height: 200 }}
            contentFit="contain"
          />
        </View>

        <TouchableOpacity
          onPress={handleDownloadQR}
          disabled={isDownloading}
          className="bg-blue-600 rounded-lg px-4 py-2 flex-row items-center gap-2"
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialIcons name="download" size={16} color="white" />
          )}
          <Text className="text-white font-medium">Tải ảnh QR</Text>
        </TouchableOpacity>
      </View>

      {/* <View className="flex-row items-center justify-center gap-2">
        <Text className="text-sm text-gray-600">Trạng thái:</Text>
        <Text className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </Text>
        {isPolling && status !== "success" && status !== "failed" && (
          <ActivityIndicator size="small" color="#f59e0b" />
        )}
      </View> */}

      <View className="bg-gray-50 px-4 py-3">
        <View className="flex-row items-center justify-center">
          <View className="flex-row items-center">
            <View
              className={`w-2 h-2 rounded-full mr-2 ${
                status === "success"
                  ? "bg-green-500"
                  : status === "failed"
                  ? "bg-red-500"
                  : "bg-orange-500"
              }`}
            />
            <Text className="text-sm text-gray-600 mr-2">Trạng thái:</Text>
            <Text className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </Text>
          </View>
          {isPolling && status !== "success" && status !== "failed" && (
            <View className="ml-2 animate-spin">
              <MaterialIcons name="refresh" size={16} color="#f59e0b" />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default SePayQRCode;
