import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { Modal, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ICalculateResponse } from "~/services/api/order.service";
import { formatPrice } from "~/utils";
const ModalSuccess = ({
  isOpen,
  onContinueOrder,
  onViewOrder,
  calculatedData,
}: {
  isOpen: boolean;
  onContinueOrder: () => void;
  onViewOrder: () => void;
  calculatedData?: ICalculateResponse;
}) => {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        lottieRef.current?.play();
      }, 100);
    }
  }, [isOpen]);
  return (
    <Modal visible={isOpen} transparent={true} animationType="fade">
      <LinearGradient
        colors={["#17BE4D", "#159747"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-center"
      >
        <View className="flex-col items-center px-9 mb-10">
          <Image
            source={imagePaths.trophy}
            contentFit="contain"
            className="size-[175px] mb-10"
          />
          <Text className="text-xl font-bold leading-loose text-center text-white">
            Bạn đã thanh toán {formatPrice(calculatedData?.total)}
          </Text>
          <Text className="text-sm font-normal leading-tight text-center text-white">
            Đơn hàng của bạn đã được ghi nhận. Theo dõi trạng thái đơn hàng tại
            trang 'Đơn hàng của tôi'. Cảm ơn bạn đã lựa chọn Cropee!
          </Text>
        </View>
        <View className="gap-4 px-9">
          <Button className="bg-secondary" onPress={onContinueOrder}>
            <Text className="font-medium">Tiếp tục mua</Text>
          </Button>
          <Button className="bg-white" onPress={onViewOrder}>
            <Text className="font-medium text-black">Danh sách đơn hàng</Text>
          </Button>
        </View>
        <LottieView
          ref={lottieRef}
          source={require("~/assets/animations/success.json")}
          loop={false}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
          }}
          resizeMode="cover"
        />
      </LinearGradient>
    </Modal>
  );
};

export default ModalSuccess;
