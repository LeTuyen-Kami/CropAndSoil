import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenWrapperProps = {
  children: React.ReactNode;
  hasSafeTop?: boolean;
  hasSafeBottom?: boolean;
} & (
  | {
      hasGradient: true;
      gradientColor?: [string, string, ...string[]];
      xStart?: number;
      yStart?: number;
      xEnd?: number;
      yEnd?: number;
    }
  | { hasGradient: false }
);

const ScreenWrapper = ({
  children,
  hasSafeTop = true,
  hasSafeBottom = true,
  ...props
}: ScreenWrapperProps) => {
  const { top, bottom } = useSafeAreaInsets();

  if (props.hasGradient) {
    return (
      <LinearGradient
        style={{
          position: "relative",
          flex: 1,
          paddingTop: hasSafeTop ? top : 0,
          paddingBottom: hasSafeBottom ? bottom : 0,
        }}
        colors={props?.gradientColor || ["#159747", "#23C25F"]}
        start={{ x: props.xStart || 0, y: props.yStart || 0 }}
        end={{ x: props.xEnd || 1, y: props.yEnd || 0 }}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View
      style={{
        position: "relative",
        flex: 1,
        paddingTop: hasSafeTop ? top : 0,
        paddingBottom: hasSafeBottom ? bottom : 0,
      }}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;
