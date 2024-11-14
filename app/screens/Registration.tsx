import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from "react-native";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { AvatarUpload } from "@/components/auth/AvatarUpload";
import { COLORS, SIZES, FONTS } from "@/constants/theme";
import type { RegistrationFormData } from "@/types/auth";

export default function Registration() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    login: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    Keyboard.dismiss();
  };

  const handleAvatarUpload = () => {
    console.log("Avatar upload pressed");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/images/mountains-bg.jpg")}
          style={styles.backgroundImage}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboard}
          >
            <View style={styles.form}>
              <AvatarUpload onPress={handleAvatarUpload} />

              <Text style={styles.title}>Реєстрація</Text>

              <Input
                placeholder="Логін"
                value={formData.login}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, login: text }))
                }
              />

              <Input
                placeholder="Адреса електронної пошти"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                placeholder="Пароль"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, password: text }))
                }
                secureTextEntry={!showPassword}
                showPasswordButton
                onTogglePassword={() => setShowPassword(!showPassword)}
                isPasswordVisible={showPassword}
              />

              <Button title="Зареєструватися" onPress={handleSubmit} />

              <View style={styles.loginLink}>
                <Text style={styles.loginText}>Вже є акаунт? </Text>
                <TouchableWithoutFeedback>
                  <Text style={styles.loginLinkText}>Увійти</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  keyboard: {
    flex: 1,
    justifyContent: "flex-end",
  },
  form: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: SIZES.borderRadius.form,
    borderTopRightRadius: SIZES.borderRadius.form,
    paddingHorizontal: SIZES.padding,
    paddingTop: 92,
    paddingBottom: 78,
    position: "relative",
  },
  title: {
    fontSize: SIZES.text.title,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: 32,
    color: COLORS.text.primary,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    color: COLORS.text.secondary,
  },
  loginText: {
    color: COLORS.text.secondary,
    fontFamily: FONTS.regular,
  },
  loginLinkText: {
    color: COLORS.text.secondary,
    textDecorationLine: "underline",
    fontFamily: FONTS.regular,
  },
});
