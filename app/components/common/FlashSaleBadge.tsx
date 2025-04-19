import { View } from "react-native";
import { Text } from "../ui/text";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import Timer from "./Timer";
import dayjs from "dayjs";

interface FlashSaleBadgeProps {
  expiredTime?: Date;
  onExpire?: () => void;
}

const FlashSaleBadge = ({ expiredTime, onExpire }: FlashSaleBadgeProps) => {
  console.log("expiredTime", expiredTime);

  if (!expiredTime) return null;

  const isExpired = dayjs(expiredTime).isBefore(dayjs());

  if (isExpired) {
    onExpire?.();
    return;
  }

  return (
    <View className="w-full">
      <Image
        source={imagePaths.flashSaleBadge}
        style={{ width: "100%", aspectRatio: 47 / 6 }}
        contentFit="contain"
      />
      <View className="absolute top-0 right-0 bottom-0 flex-row items-center px-2.5">
        <Text className="text-xs font-bold tracking-tight text-white">
          KẾT THÚC TRONG
        </Text>
        <Timer
          expiredTime={expiredTime}
          className="py-0"
          wrapperTimerClassName="size-5 rounded-[3px]"
          textTimerClassName="text-xs"
          backgroundColor="white"
          textColor="#FCBA26"
          onExpire={onExpire}
        />
      </View>
    </View>
  );
};

export default FlashSaleBadge;
