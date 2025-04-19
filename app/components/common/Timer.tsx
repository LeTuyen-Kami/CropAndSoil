import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import dayjs from "dayjs";

interface TimerProps {
  expiredTime?: Date;
  onExpire?: () => void;
  textColor?: string;
  backgroundColor?: string;
  className?: string;
  wrapperTimerClassName?: string;
  textTimerClassName?: string;
}

const Timer = ({
  expiredTime,
  onExpire,
  textColor = "#0B5226",
  backgroundColor = "#BEE2CB",
  className,
  wrapperTimerClassName,
  textTimerClassName,
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
      if (!expiredTime) return;

      const now = new Date();
      const difference = expiredTime?.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        onExpire?.();
        return;
      } else {
        setIsExpired(false);
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

  if (isExpired || !expiredTime || !dayjs(expiredTime).isValid()) return null;

  const Time = ({ timeLeft }: { timeLeft: string }) => {
    return (
      <View
        className={cn(
          "justify-center items-center mx-1 rounded-lg size-7",
          wrapperTimerClassName
        )}
        style={{ backgroundColor }}
      >
        <Text
          className={cn("text-base font-medium", textTimerClassName)}
          style={{ color: textColor }}
        >
          {timeLeft}
        </Text>
      </View>
    );
  };

  return (
    <View
      className={cn("flex-row justify-center items-center py-4", className)}
    >
      <Time timeLeft={timeLeft.hours} />
      <Text className="text-base font-medium" style={{ color: textColor }}>
        :
      </Text>
      <Time timeLeft={timeLeft.minutes} />
      <Text className="text-base font-medium" style={{ color: textColor }}>
        :
      </Text>
      <Time timeLeft={timeLeft.seconds} />
    </View>
  );
};

export default Timer;
