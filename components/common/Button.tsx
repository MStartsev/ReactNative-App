import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS, SIZES } from "@/constants/theme";

interface ButtonProps {
  title: string;
}

export const Button: React.FC<ButtonProps> = ({ title }) => (
  <TouchableOpacity style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

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
    fontSize: SIZES.input.fontSize,
  },
});
