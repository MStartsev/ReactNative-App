import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { COLORS, FONTS, SIZES } from "@/constants/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  style,
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      {...props}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    height: SIZES.input.height,
    borderRadius: SIZES.borderRadius.button,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: COLORS.input.border,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: SIZES.text.button,
    fontFamily: FONTS.regular,
  },
  buttonTextDisabled: {
    color: COLORS.input.placeholderText,
  },
});
