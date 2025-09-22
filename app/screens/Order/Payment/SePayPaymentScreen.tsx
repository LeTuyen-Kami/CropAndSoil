import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { RootStackRouteProp, RootStackScreenProps } from "~/navigation/types";
import { paymentService } from "~/services/api/payment.service";
import SePayQRCode from "./SePayQRCode";
import SePayBankTransfer from "./SePayBankTransfer";
import SePayOrderInfo from "./SePayOrderInfo";
import useSePayPayment from "./useSePayPayment";
import useDisclosure from "~/hooks/useDisclosure";
import ModalFailed from "./ModalFailed";
import ModalSuccess from "./ModalSuccess";
import { getErrorMessage } from "~/utils";

const SePayPaymentScreen = () => {
  const navigation = useNavigation<RootStackScreenProps<"SePayPayment">>();
  const route = useRoute<RootStackRouteProp<"SePayPayment">>();
  const { paymentOrderId, orderCode, totalAmount } = route.params;
  const [errorMessage, setErrorMessage] = useState("");

  const {
    isOpen: isOpenFailed,
    onOpen: onOpenFailed,
    onClose: onCloseFailed,
  } = useDisclosure();

  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  const { bottom } = useSafeAreaInsets();
  const [isPolling, setIsPolling] = useState(true);

  const {
    data: paymentStatus,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payment-status", paymentOrderId],
    queryFn: () => paymentService.getPaymentStatus(paymentOrderId),
    refetchInterval: isPolling ? 5000 : false,
    refetchIntervalInBackground: true,
  });

  const { handlePaymentSuccess, handlePaymentFailed } = useSePayPayment({
    paymentOrderId,
    onSuccess: () => {
      setIsPolling(false);
      onOpenSuccess();
    },
    onFailed: () => {
      setIsPolling(false);
      onOpenFailed();
    },
  });

  useEffect(() => {
    if (paymentStatus?.status === "success") {
      handlePaymentSuccess();
    } else if (paymentStatus?.status === "failed") {
      handlePaymentFailed();
    }
  }, [paymentStatus?.status, handlePaymentSuccess, handlePaymentFailed]);

  const handlePressContinueOrder = () => {
    onCloseSuccess();
    navigation.pop(2);
  };

  const handlePressViewOrder = () => {
    onCloseSuccess();
    navigation.reset({
      index: 1,
      routes: [
        { name: "MainTabs", params: { screen: "Profile" } },
        {
          name: "MyOrder",
        },
      ],
    });
  };

  return (
    <ScreenWrapper
      hasGradient={false}
      backgroundColor="#F5F5F5"
      hasSafeTop={false}
    >
      <Header
        title="Thanh toán"
        titleClassName="font-bold"
        className="pb-6 border-0"
      />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">
            Đang tải thông tin thanh toán...
          </Text>
          <ActivityIndicator size="large" color="#2D946E" />
        </View>
      ) : error || !paymentStatus ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500">
            Có lỗi xảy ra khi tải thông tin thanh toán. Vui lòng thử lại.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: bottom + 20 }}
        >
          <View className="bg-white rounded-2xl p-4 mb-4 flex flex-col gap-4 mt-4">
            <Text className="text-base font-bold text-center text-gray-800">
              Hướng dẫn thanh toán qua chuyển khoản ngân hàng
            </Text>
            <Text className="text-center font-semibold">
              Mã thanh toán{" "}
              <Text className="text-green-600">
                {paymentStatus.paymentMeta.orderCode}
              </Text>
            </Text>
          </View>

          <SePayQRCode
            qrCodeUrl={paymentStatus.paymentMeta.qrCodeUrl}
            status={paymentStatus.status}
            isPolling={isPolling}
          />

          <SePayBankTransfer
            bankName={paymentStatus.paymentMeta.bankName}
            bankLogo={paymentStatus.paymentMeta.bankLogo}
            accountNumber={paymentStatus.paymentMeta.accountNumber}
            accountHolderName={paymentStatus.paymentMeta.accountHolderName}
            amount={paymentStatus.paymentMeta.amount}
            expiredAt={paymentStatus.expiredAt}
            status={paymentStatus.status}
            isPolling={isPolling}
          />

          <SePayOrderInfo
            orderCode={paymentStatus.paymentMeta.orderCode}
            totalAmount={paymentStatus.paymentMeta.amount}
            status={paymentStatus.status}
          />
        </ScrollView>
      )}
      <ModalFailed
        isOpen={isOpenFailed}
        onClose={onCloseFailed}
        content={getErrorMessage(error, "Lỗi khi thanh toán")}
      />
      <ModalSuccess
        isOpen={isOpenSuccess}
        totalAmount={totalAmount}
        onContinueOrder={handlePressContinueOrder}
        onViewOrder={handlePressViewOrder}
      />
    </ScreenWrapper>
  );
};

export default SePayPaymentScreen;
