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
import { COLORS, SIZES, FONTS } from "@/constants/theme";
import type { LoginFormData } from "@/types/auth";

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = () => {
    console.log("Login Form Data:", formData);
    Keyboard.dismiss();
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
              <Text style={styles.title}>Увійти</Text>

              <Input
                placeholder="Адреса електронної пошти"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.passwordWrapper}>
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
              </View>

              <Button title="Увійти" onPress={handleSubmit} />

              <View style={styles.registerLink}>
                <Text style={styles.registerText}>Немає акаунту? </Text>
                <TouchableWithoutFeedback>
                  <Text style={styles.registerLinkText}>Зареєструватися</Text>
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
    paddingTop: 32,
    paddingBottom: 144,
    position: "relative",
  },
  title: {
    fontSize: SIZES.text.title,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: 32,
    color: COLORS.text.primary,
  },
  passwordWrapper: {
    marginBottom: 27,
  },
  registerLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    color: COLORS.text.secondary,
    fontFamily: FONTS.regular,
  },
  registerLinkText: {
    color: COLORS.text.secondary,
    textDecorationLine: "underline",
    fontFamily: FONTS.regular,
  },
});
