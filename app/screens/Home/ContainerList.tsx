import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface ContainerListProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
  linearColor?: [string, string];
}

cssInterop(LinearGradient, {
  className: {
    target: "style",
  },
});

const ContainerList: React.FC<ContainerListProps> = ({
  title,
  children,
  icon,
  className,
  bgColor,
  linearColor,
}) => {
  const Container = linearColor ? LinearGradient : View;

  return (
    <Container
      colors={linearColor ?? ["#FDF8EA", "#FDF8EA"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderTopStartRadius: 40,
        borderTopEndRadius: 40,
        paddingHorizontal: 8,
        paddingVertical: 16,
      }}
      className={cn(bgColor, className)}
    >
      <View className="flex-row gap-2 items-center px-2 mb-4 w-full">
        {icon}
        <Text className="text-xl font-bold text-black uppercase">{title}</Text>
      </View>
      {children}
    </Container>
  );
};

export default ContainerList;
