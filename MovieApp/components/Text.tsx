import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { Colors, FontSizes } from "../constants/theme";

interface TextProps extends RNTextProps {
  variant?: "regular" | "medium" | "semiBold" | "bold";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
  color?: string;
  children: React.ReactNode;
}

export function Text({
  variant = "regular",
  size = "md",
  color = Colors.textColor,
  style,
  children,
  ...props
}: TextProps) {
  const getFontWeight = () => {
    switch (variant) {
      case "medium":
        return "500";
      case "semiBold":
        return "600";
      case "bold":
        return "700";
      default:
        return "400";
    }
  };

  return (
    <RNText
      style={[
        {
          fontSize: FontSizes[size],
          fontWeight: getFontWeight(),
          color,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}
