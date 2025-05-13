import { Modal, View, Dimensions } from "react-native";
import { Image } from "expo-image";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { imagePaths } from "~/assets/imagePath";

export interface ModalAddToCartAnimationRef {
  startAnimation: (
    imageUri: string,
    targetPosition?: { x: number; y: number }
  ) => Promise<void>;
}

interface ModalAddToCartAnimationProps {}

const { width, height } = Dimensions.get("window");

// Default target position (top right corner)
const DEFAULT_TARGET = { x: width - 50, y: 50 };

const ModalAddToCartAnimation = forwardRef<
  ModalAddToCartAnimationRef,
  ModalAddToCartAnimationProps
>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [targetPosition, setTargetPosition] = useState(DEFAULT_TARGET);

  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  // Create a promise ref to resolve when animation completes
  const animationCompleteResolver = React.useRef<(value: void) => void>();

  useImperativeHandle(ref, () => ({
    startAnimation: async (uri: string, target?: { x: number; y: number }) => {
      setImageUri(uri);

      // If target is provided, use it; otherwise use default top-right position
      const finalTarget = target || DEFAULT_TARGET;

      // Ensure target coordinates are valid numbers (not null, undefined, or NaN)
      const validatedTarget = {
        x:
          typeof finalTarget.x === "number" && !isNaN(finalTarget.x)
            ? finalTarget.x
            : DEFAULT_TARGET.x,
        y:
          typeof finalTarget.y === "number" && !isNaN(finalTarget.y)
            ? finalTarget.y
            : DEFAULT_TARGET.y,
      };

      setTargetPosition(validatedTarget);
      setVisible(true);

      // Reset animation values
      progress.value = 0;
      scale.value = 1;

      // Create a new promise that will resolve when animation completes
      return new Promise<void>((resolve) => {
        animationCompleteResolver.current = resolve;

        // Start the animation
        progress.value = withTiming(
          1,
          {
            duration: 800,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
          () => {
            runOnJS(completeAnimation)();
          }
        );

        // Shrink the image as it approaches the target
        scale.value = withTiming(0.3, {
          duration: 800,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      });
    },
  }));

  const completeAnimation = () => {
    setVisible(false);
    if (animationCompleteResolver.current) {
      animationCompleteResolver.current();
      animationCompleteResolver.current = undefined;
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    // Start position (bottom center)
    const startX = width / 2 - 40;
    const startY = height - 100;

    // End position (from targetPosition)
    const endX = targetPosition.x;
    const endY = targetPosition.y;

    // Calculate current position using parabolic trajectory
    // Linear interpolation for x-axis
    const x = startX + (endX - startX) * progress.value;

    // For y-axis, we use a simple parabolic function where:
    // - When progress = 0, y = startY (bottom)
    // - When progress = 1, y = endY (target)
    // - During the animation, it follows a curved path upward

    // Simple quadratic function for parabola: y = a(x-h)² + k
    // where (h,k) is the vertex of the parabola

    // First, linearly interpolate from start to end to get the baseline
    const linearY = startY + (endY - startY) * progress.value;

    // Then, create a parabolic curve that's highest at the middle of the animation
    const parabolicOffset = 200 * (1 - 4 * Math.pow(progress.value - 0.5, 2));

    // Combine linear path with parabolic offset (subtract because y-axis is inverted in UI)
    const y = linearY - parabolicOffset;

    // Calculate opacity that starts fading at 80% of the animation
    const opacity = progress.value > 0.8 ? 1 - (progress.value - 0.8) / 0.2 : 1;

    return {
      transform: [{ translateX: x }, { translateY: y }, { scale: scale.value }],
      opacity,
    };
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View className="flex-1">
        <Animated.View
          className="absolute items-center justify-center w-[80px] h-[80px] bg-white rounded-full shadow-md overflow-hidden"
          style={animatedStyle}
        >
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            contentFit="cover"
            placeholder={imagePaths.placeholder}
            placeholderContentFit="cover"
          />
        </Animated.View>
      </View>
    </Modal>
  );
});

export default ModalAddToCartAnimation;
