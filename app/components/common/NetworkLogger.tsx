import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/text";
import NW from "react-native-network-logger";
import { ENV } from "~/utils";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { devModeAtom } from "~/store/atoms";
import { useAtomValue } from "jotai";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const NetworkLogger = () => {
  const [expanded, setExpanded] = useState(false);
  const position = useSharedValue({ x: 0, y: 0 });
  const previousPosition = useSharedValue({ x: 0, y: 0 });
  const { bottom } = useSafeAreaInsets();
  const devMode = useAtomValue(devModeAtom);

  const style: any = expanded
    ? {
        position: "absolute",
        top: 40,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 1000,
      }
    : {
        position: "absolute",
        top: 100,
        right: 0,
        zIndex: 1000,
      };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: position.value.x },
        { translateY: position.value.y },
      ],
    };
  });

  const pan = Gesture.Pan()
    .onStart(() => {
      previousPosition.value = position.value;
    })
    .onUpdate((event) => {
      position.value = {
        x: event.translationX + previousPosition.value.x,
        y: event.translationY + previousPosition.value.y,
      };
    });

  const tap = Gesture.Tap()
    .onEnd(() => {
      setExpanded(!expanded);
    })
    .runOnJS(true);

  if (!devMode.showNetworkLogger || !devMode.networkLoggerUnlocked) {
    return null;
  }

  return (
    <View style={style}>
      <GestureHandlerRootView className="flex-1">
        <GestureDetector gesture={Gesture.Race(pan, tap)}>
          <Animated.View
            className="p-4 bg-red-500 rounded-lg opacity-40"
            style={{
              ...animatedStyle,
              opacity: expanded ? 1 : 0.2,
            }}
          ></Animated.View>
        </GestureDetector>
        {expanded && (
          <View className="size-full" style={{ paddingBottom: bottom }}>
            <NW />
          </View>
        )}
      </GestureHandlerRootView>
    </View>
  );
};

export default NetworkLogger;
