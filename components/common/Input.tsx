import React from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { COLORS, SIZES } from "@/constants/theme";

interface InputProps {
  placeholder: string;
  showPasswordButton?: boolean;
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  showPasswordButton,
}) => (
  <View style={styles.container}>
    <TextInput
      style={[styles.input, showPasswordButton && styles.passwordInput]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.input.placeholderText}
    />
    {showPasswordButton && (
      <TouchableOpacity style={styles.showPasswordButton}>
        <Text style={styles.showPasswordText}>Показати</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: "relative",
  },
  input: {
    height: SIZES.input.height,
    borderWidth: 1,
    borderColor: COLORS.input.border,
    borderRadius: SIZES.borderRadius.input,
    padding: SIZES.padding,
    backgroundColor: COLORS.input.background,
  },
  passwordInput: {
    paddingRight: 100,
  },
  showPasswordButton: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  showPasswordText: {
    color: COLORS.text.secondary,
  },
});
