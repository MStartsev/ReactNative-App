import React, { useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { AuthForm } from "@/components/auth/AuthForm";
import type { RegistrationFormData, FormErrors } from "@/types/auth";
import { getValidationError } from "@/utils/validation";
import { registerUser } from "@/services/auth";
import { setUser, setLoading, setError } from "@/redux/auth/authSlice";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface RegistrationScreenProps {
  navigation: NavigationProp;
}

export default function RegistrationScreen({
  navigation,
}: RegistrationScreenProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<RegistrationFormData>({
    login: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState<string | undefined>();
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFormTouched, setIsFormTouched] = useState<boolean>(false);

  const handleAvatarPick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking avatar:", error);
      Alert.alert("Помилка", "Не вдалося вибрати фото");
    }
  };

  const validateField = (field: keyof RegistrationFormData, value: string) => {
    const validationResult = getValidationError(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: validationResult.isValid ? undefined : validationResult.message,
    }));
    return validationResult.isValid;
  };

  const isFormValid = () => {
    if (!isFormTouched) return true;
    return (
      formData.login.length > 0 &&
      formData.email.length > 0 &&
      formData.password.length > 0 &&
      !errors.login &&
      !errors.email &&
      !errors.password
    );
  };

  const handleSubmit = async () => {
    setIsFormTouched(true);
    const loginValid = validateField("login", formData.login);
    const emailValid = validateField("email", formData.email);
    const passwordValid = validateField("password", formData.password);

    if (loginValid && emailValid && passwordValid) {
      dispatch(setLoading(true));
      try {
        const userData = await registerUser(formData, avatar);
        dispatch(setUser(userData));

        // Очищення форми
        setFormData({
          login: "",
          email: "",
          password: "",
        });
        setAvatar(undefined);
        setErrors({});
        setIsFormTouched(false);
        setShowPassword(false);

        navigation.navigate("Home", { screen: "Posts" });
      } catch (error: any) {
        dispatch(setError(error.message));
        Alert.alert("Помилка", error.message);
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <AuthForm
      title="Реєстрація"
      isRegistration={true}
      onSubmit={handleSubmit}
      inputs={[
        {
          value: formData.login,
          onChange: (text) => {
            setFormData((prev) => ({ ...prev, login: text }));
            if (isFormTouched) validateField("login", text);
          },
          onBlur: () => {
            setIsFormTouched(true);
            validateField("login", formData.login);
          },
          placeholder: "Логін",
          error: errors.login,
        },
        {
          value: formData.email,
          onChange: (text) => {
            setFormData((prev) => ({ ...prev, email: text }));
            if (isFormTouched) validateField("email", text);
          },
          onBlur: () => {
            setIsFormTouched(true);
            validateField("email", formData.email);
          },
          placeholder: "Адреса електронної пошти",
          keyboardType: "email-address",
          error: errors.email,
        },
        {
          value: formData.password,
          onChange: (text) => {
            setFormData((prev) => ({ ...prev, password: text }));
            if (isFormTouched) validateField("password", text);
          },
          onBlur: () => {
            setIsFormTouched(true);
            validateField("password", formData.password);
          },
          placeholder: "Пароль",
          secureTextEntry: !showPassword,
          showPasswordButton: true,
          onTogglePassword: () => setShowPassword(!showPassword),
          isPasswordVisible: showPassword,
          error: errors.password,
        },
      ]}
      submitButtonTitle="Зареєструватися"
      bottomText="Вже є акаунт?"
      bottomLinkText="Увійти"
      onBottomLinkPress={() => navigation.navigate("LoginScreen")}
      onAvatarPress={handleAvatarPick}
      avatarUri={avatar}
      isValid={isFormValid()}
    />
  );
}
