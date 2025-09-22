import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import { Clipboard, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { toast } from "~/components/common/Toast";

interface SePayBankTransferProps {
  bankName: string;
  bankLogo: string;
  accountNumber: string;
  accountHolderName: string;
  amount: number;
  expiredAt: string;
  status: string;
  isPolling: boolean;
}

const SePayBankTransfer = ({
  bankName,
  bankLogo,
  accountNumber,
  accountHolderName,
  amount,
  expiredAt,
  status,
  isPolling,
}: SePayBankTransferProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  const formatTimeLeft = (expiredAt: string) => {
    const now = new Date().getTime();
    const expired = new Date(expiredAt).getTime();
    const diff = expired - now;

    if (diff <= 0) {
      return "00:00:00";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(formatTimeLeft(expiredAt));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiredAt]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setString(text);
      toast.success(`Đã sao chép ${label}`);
    } catch (error) {
      toast.error("Không thể sao chép");
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
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
    <View className="bg-white rounded-2xl mt-4 overflow-hidden shadow-sm">
      {/* Header Section */}
      <View className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
        <Text className="text-sm font-semibold text-gray-800">
          Cách 2: Chuyển khoản thủ công theo thông tin
        </Text>
      </View>

      {/* Bank Info Section */}
      <View className="px-4 py-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mr-3">
            <Image
              source={{ uri: bankLogo }}
              style={{ width: 32, height: 32 }}
              contentFit="contain"
            />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">
              Ngân hàng {bankName}
            </Text>
            <Text className="text-sm text-gray-500">
              Thông tin chuyển khoản
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-gray-100 mx-4" />

      {/* Payment Details Section */}
      <View className="px-4 py-4 space-y-4">
        {/* Account Holder */}
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1">Chủ tài khoản</Text>
            <Text className="text-base font-medium text-gray-800">
              {accountHolderName}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-100" />

        {/* Account Number */}
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1">Số tài khoản</Text>
            <Text className="text-base font-medium text-gray-800">
              {accountNumber}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => copyToClipboard(accountNumber, "số tài khoản")}
            className="ml-3 p-2 bg-gray-50 rounded-full"
          >
            <MaterialIcons name="content-copy" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-100" />

        {/* Amount */}
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1">Số tiền</Text>
            <Text className="text-lg font-bold text-red-600">
              {formatAmount(amount)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => copyToClipboard(amount.toString(), "số tiền")}
            className="ml-3 p-2 bg-gray-50 rounded-full"
          >
            <MaterialIcons name="content-copy" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-100" />

        {/* Transfer Content */}
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1">
              Nội dung chuyển khoản
            </Text>
            <Text className="text-base font-medium text-gray-800">
              KHONG YEU CAU
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-gray-100" />

        {/* Expiry Time */}
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-1">
            <Text className="text-sm text-gray-500 mb-1">
              Thời gian hết hạn
            </Text>
            <View className="flex-row items-center">
              <MaterialIcons name="access-time" size={16} color="#ef4444" />
              <Text className="text-lg font-bold text-red-600 ml-1">
                {timeLeft || "00:00:00"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Status Section */}
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

export default SePayBankTransfer;
