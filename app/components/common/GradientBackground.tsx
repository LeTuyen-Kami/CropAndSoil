import React, { forwardRef } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientBackgroundProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  gradientStyle?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

const GradientBackground = forwardRef<View, GradientBackgroundProps>(
  (
    {
      children,
      style,
      gradientStyle,
      start = { x: 0, y: 0 },
      end = { x: 1, y: 0.4 },
    },
    ref
  ) => {
    return (
      <View style={[styles.container, style]} ref={ref}>
        <LinearGradient
          colors={["#159747", "#07BE4D"]}
          start={start}
          end={end}
          style={gradientStyle}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
});

export default GradientBackground;
