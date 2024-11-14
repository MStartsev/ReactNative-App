import React from "react";
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
}

export const Input: React.FC<InputProps> = ({
  style,
  showPasswordButton,
  onTogglePassword,
  isPasswordVisible,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          showPasswordButton && styles.passwordInput,
          style,
        ]}
        placeholderTextColor={COLORS.input.placeholderText}
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
    </View>
  );
};

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
    fontFamily: FONTS.regular,
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
});
