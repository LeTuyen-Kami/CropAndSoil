import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "../../constants/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], style]}
      {...props}
    >
      <Text style={[styles.text, variant === "outline" && styles.outlineText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: SPACING.md,
    borderRadius: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: "500",
  },
  outlineText: {
    color: COLORS.primary,
  },
});
