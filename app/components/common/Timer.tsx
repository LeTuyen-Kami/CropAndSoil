import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useEffect, useState } from "react";

interface TimerProps {
  expiredTime: Date;
  onExpire?: () => void;
  textColor?: string;
  backgroundColor?: string;
}

const Timer = ({
  expiredTime,
  onExpire,
  textColor = "#0B5226",
  backgroundColor = "#BEE2CB",
}: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = expiredTime.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        onExpire?.();
        return;
      }

      // Calculate hours, minutes, seconds
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    };

    // Initial calculation
    calculateTimeLeft();

    // Update timer every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timer);
  }, [expiredTime, onExpire]);

  if (isExpired) return null;

  return (
    <View className="flex-row justify-center items-center py-4">
      <View
        className="justify-center items-center mx-1 rounded-lg size-7"
        style={{ backgroundColor }}
      >
        <Text className="text-base font-medium" style={{ color: textColor }}>
          {timeLeft.hours}
        </Text>
      </View>
      <Text className="text-base font-medium" style={{ color: textColor }}>
        :
      </Text>
      <View
        className="justify-center items-center mx-1 rounded-lg size-7"
        style={{ backgroundColor }}
      >
        <Text className="text-base font-medium" style={{ color: textColor }}>
          {timeLeft.minutes}
        </Text>
      </View>
      <Text className="text-base font-medium" style={{ color: textColor }}>
        :
      </Text>
      <View
        className="justify-center items-center mx-1 rounded-lg size-7"
        style={{ backgroundColor }}
      >
        <Text className="text-base font-medium" style={{ color: textColor }}>
          {timeLeft.seconds}
        </Text>
      </View>
    </View>
  );
};

export default Timer;
