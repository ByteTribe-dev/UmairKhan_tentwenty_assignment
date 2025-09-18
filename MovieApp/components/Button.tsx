import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { Colors } from "../constants/theme";
import { Text } from "./Text";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "outline" | "secondary";
  size?: "small" | "medium" | "large";
}

export function Button({
  title,
  variant = "primary",
  size = "medium",
  style,
  ...props
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles.button;

    switch (variant) {
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: Colors.white,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: Colors.textSecondary,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: Colors.accent,
        };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "outline":
        return Colors.white;
      default:
        return Colors.white;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case "large":
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), getSizeStyle(), style]}
      {...props}
    >
      <Text variant="medium" size="md" color={getTextColor()}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
