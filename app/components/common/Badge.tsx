import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface BadgeProps {
  count: number;
  className?: string;
  textClassName?: string;
  maxCount?: number;
}

const Badge: React.FC<BadgeProps> = ({
  count,
  className,
  textClassName,
  maxCount = 99,
}) => {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <View
      className={cn(
        "justify-center items-center h-5 rounded-full border border-white bg-[#FCBA26] px-1 min-w-5",
        className
      )}
    >
      <Text className={cn("text-xs font-medium text-white", textClassName)}>
        {displayCount}
      </Text>
    </View>
  );
};

export default Badge;
