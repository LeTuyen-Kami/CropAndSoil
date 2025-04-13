import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useAtomValue } from "jotai";
import { View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { activeIndexAtom } from "./atom";
import Animated, { useSharedValue } from "react-native-reanimated";
import { useMemo } from "react";

const Background = () => {
  const activeIndex = useAtomValue(activeIndexAtom);

  const colors = useMemo(() => {
    if (activeIndex !== 1) {
      return ["#07692D", "#159747CC"];
    }
    return ["#F09D0F", "#F09D0F"];
  }, [activeIndex]) as [string, string];

  return (
    <View className="absolute top-0 right-0 bottom-0 left-0">
      <Image
        source={imagePaths.shopBackground}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default Background;
