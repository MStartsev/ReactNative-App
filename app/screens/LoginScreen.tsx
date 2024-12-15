import React, { useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { AuthForm } from "@/components/auth/AuthForm";
import type { LoginFormData, FormErrors } from "@/types/auth";
import { getValidationError } from "@/utils/validation";
import { loginUser } from "@/services/auth";
import { setUser, setLoading, setError } from "@/redux/auth/authSlice";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface LoginScreenProps {
  navigation: NavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFormTouched, setIsFormTouched] = useState<boolean>(false);

  const validateField = (field: keyof LoginFormData, value: string) => {
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
      formData.email.length > 0 &&
      formData.password.length > 0 &&
      !errors.email &&
      !errors.password
    );
  };

  const handleSubmit = async () => {
    setIsFormTouched(true);
    const emailValid = validateField("email", formData.email);
    const passwordValid = validateField("password", formData.password);

    if (emailValid && passwordValid) {
      dispatch(setLoading(true));
      try {
        const userData = await loginUser(formData, dispatch); // передаємо dispatch
        dispatch(setUser(userData));

        // Очищення форми
        setFormData({
          email: "",
          password: "",
        });
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
      title="Увійти"
      isRegistration={false}
      onSubmit={handleSubmit}
      inputs={[
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
      submitButtonTitle="Увійти"
      bottomText="Немає акаунту?"
      bottomLinkText="Зареєструватися"
      onBottomLinkPress={() => navigation.navigate("RegistrationScreen")}
      isValid={isFormValid()}
    />
  );
}
