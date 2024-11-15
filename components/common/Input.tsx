import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { COLORS, FONTS, SIZES } from "@/constants/theme";

interface InputProps extends TextInputProps {
  showPasswordButton?: boolean;
  onTogglePassword?: () => void;
  isPasswordVisible?: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  style,
  showPasswordButton,
  onTogglePassword,
  isPasswordVisible,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, error ? styles.containerWithError : null]}>
      <TextInput
        style={[
          styles.input,
          showPasswordButton && styles.passwordInput,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        maxLength={64}
        placeholderTextColor={COLORS.input.placeholderText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {showPasswordButton && (
        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={onTogglePassword}
        >
          <Text style={styles.showPasswordText}>
            {isPasswordVisible ? "Сховати" : "Показати"}
          </Text>
        </TouchableOpacity>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  containerWithError: {
    marginBottom: 16,
  },
  input: {
    height: SIZES.input.height,
    borderWidth: 1,
    borderColor: COLORS.input.border,
    borderRadius: SIZES.borderRadius.input,
    padding: SIZES.padding,
    backgroundColor: COLORS.input.background,
    fontFamily: FONTS.regular,
  },
  inputFocused: {
    borderColor: COLORS.input.borderFocused,
  },
  inputError: {
    borderColor: COLORS.error,
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
    fontFamily: FONTS.regular,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    fontFamily: FONTS.regular,
  },
});
