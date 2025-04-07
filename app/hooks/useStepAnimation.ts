import { useSharedValue } from "react-native-reanimated";
import {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from "react-native-reanimated";

export type ResetPasswordStep = "phone" | "code" | "newPassword";
export type LoginStep = "signIn" | "signUp" | "resetPassword";

export const useStepAnimation = <T extends string>() => {
  const animationProgress = useSharedValue(0);

  const getEnteringAnimation = (currentStep: T, prevStep: T | null) => {
    if (!prevStep) return FadeIn.duration(300);

    return SlideInRight.duration(300);
  };

  const getExitingAnimation = (currentStep: T, prevStep: T | null) => {
    if (!prevStep) return FadeOut.duration(300);

    return SlideOutLeft.duration(300);
  };

  return {
    animationProgress,
    getEnteringAnimation,
    getExitingAnimation,
  };
};
