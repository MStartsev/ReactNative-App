import React from "react";
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
import { Stack } from "expo-router";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { AvatarUpload } from "@/components/auth/AvatarUpload";
import { COLORS, SIZES } from "@/constants/theme";

export default function Registration() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ImageBackground
          source={require("../../assets/images/mountains-bg.jpg")}
          style={styles.backgroundImage}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboard}
          >
            <View style={styles.form}>
              <AvatarUpload />

              <Text style={styles.title}>Реєстрація</Text>

              <Input placeholder="Логін" />

              <Input placeholder="Адреса електронної пошти" />

              <Input placeholder="Пароль" showPasswordButton />

              <Button title="Зареєструватися" />

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
    fontSize: 30,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 32,
    color: COLORS.text.primary,
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: COLORS.text.secondary,
  },
  loginLinkText: {
    color: COLORS.text.secondary,
    textDecorationLine: "underline",
  },
});
