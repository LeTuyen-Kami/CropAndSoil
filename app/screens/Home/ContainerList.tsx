import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface ContainerListProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
  linearColor?: [string, string];
  rightComponent?: React.ReactNode;
  onPress?: () => void;
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
  rightComponent,
  onPress,
}) => {
  const Container = linearColor ? LinearGradient : View;

  const Wrapper = onPress ? TouchableOpacity : View;

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
      <Wrapper
        className="flex-row gap-2 items-center px-2 mb-4 w-full"
        onPress={onPress}
      >
        {!!icon && icon}
        <Text className="text-base font-bold text-black uppercase">
          {title}
        </Text>
        {!!rightComponent && rightComponent}
      </Wrapper>
      {children}
    </Container>
  );
};

export default ContainerList;
