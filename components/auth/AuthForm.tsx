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
  StatusBar,
  Dimensions,
} from "react-native";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { AvatarUpload } from "@/components/auth/AvatarUpload";
import { COLORS, SIZES, FONTS, statusBarHeight } from "@/constants/theme";
import { useKeyboardStatus } from "@/hooks/useKeyboardStatus";

interface AuthFormProps {
  title: string;
  isRegistration?: boolean;
  onSubmit: () => void;
  inputs: {
    value: string;
    onChange: (text: string) => void;
    onBlur?: () => void;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address";
    showPasswordButton?: boolean;
    onTogglePassword?: () => void;
    isPasswordVisible?: boolean;
    error?: string;
  }[];
  submitButtonTitle: string;
  bottomText: string;
  bottomLinkText: string;
  onBottomLinkPress: () => void;
  onAvatarPress?: () => void;
  avatarUri?: string;
  isValid: boolean;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  isRegistration,
  onSubmit,
  inputs,
  submitButtonTitle,
  bottomText,
  bottomLinkText,
  onBottomLinkPress,
  onAvatarPress,
  avatarUri, // Додаємо в деструктуризацію
  isValid = true,
}) => {
  const isKeyboardVisible = useKeyboardStatus();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ImageBackground
          source={require("../../assets/images/mountains-bg.jpg")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboard}
          >
            <View
              style={[
                styles.form,
                isRegistration ? { paddingTop: 92 } : { paddingTop: 32 },
                isKeyboardVisible
                  ? { marginBottom: 0 }
                  : { marginBottom: -statusBarHeight },
              ]}
            >
              {isRegistration && onAvatarPress && (
                <AvatarUpload onPress={onAvatarPress} avatarUri={avatarUri} />
              )}

              <Text style={styles.title}>{title}</Text>

              <View
                style={[
                  styles.formContainer,
                  isKeyboardVisible && { marginBottom: 32 },
                ]}
              >
                {inputs.map((input, index) => (
                  <Input
                    key={index}
                    placeholder={input.placeholder}
                    value={input.value}
                    onChangeText={input.onChange}
                    onBlur={input.onBlur}
                    keyboardType={input.keyboardType}
                    secureTextEntry={input.secureTextEntry}
                    showPasswordButton={input.showPasswordButton}
                    onTogglePassword={input.onTogglePassword}
                    isPasswordVisible={input.isPasswordVisible}
                    autoCapitalize="none"
                    error={input.error}
                  />
                ))}
              </View>

              {!isKeyboardVisible && (
                <View
                  style={[
                    isRegistration
                      ? { marginBottom: 78 }
                      : { marginBottom: 111 },
                  ]}
                >
                  <Button
                    title={submitButtonTitle}
                    onPress={onSubmit}
                    disabled={!isValid}
                  />
                  <View style={styles.bottomLink}>
                    <Text style={styles.bottomText}>{bottomText}</Text>
                    <TouchableWithoutFeedback onPress={onBottomLinkPress}>
                      <Text style={styles.bottomLinkText}>
                        {bottomLinkText}
                      </Text>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    height: SCREEN_HEIGHT,
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
    position: "relative",
  },
  formContainer: {
    gap: 16,
    marginBottom: 43,
  },
  title: {
    fontSize: SIZES.text.title,
    fontFamily: FONTS.medium,
    textAlign: "center",
    marginBottom: 32,
    color: COLORS.text.primary,
  },
  bottomLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  bottomText: {
    color: COLORS.text.secondary,
    fontFamily: FONTS.regular,
  },
  bottomLinkText: {
    color: COLORS.text.secondary,
    textDecorationLine: "underline",
    fontFamily: FONTS.regular,
  },
});
