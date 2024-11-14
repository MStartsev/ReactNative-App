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
}

export const Button: React.FC<ButtonProps> = ({ title, style, ...props }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={styles.buttonText}>{title}</Text>
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
  buttonText: {
    color: COLORS.background,
    fontSize: SIZES.text.button,
    fontFamily: FONTS.regular,
  },
});
