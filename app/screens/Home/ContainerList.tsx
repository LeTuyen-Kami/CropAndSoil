import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface ContainerListProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const ContainerList: React.FC<ContainerListProps> = ({
  title,
  children,
  icon,
  className,
}) => {
  return (
    <View className={cn("bg-primary-100 rounded-t-[40] px-2 py-4", className)}>
      <View className="flex-row w-full items-center gap-2">
        {icon}
        <Text className="text-black text-xl font-bold uppercase">{title}</Text>
      </View>
      {children}
    </View>
  );
};

export default ContainerList;
