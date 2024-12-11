import React, { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import type { RegistrationFormData, FormErrors } from "@/types/auth";
import { getValidationError } from "@/utils/validation";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface RegistrationScreenProps {
  navigation: NavigationProp;
}

export default function RegistrationScreen({
  navigation,
}: RegistrationScreenProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    login: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFormTouched, setIsFormTouched] = useState<boolean>(false);

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

  const handleSubmit = () => {
    setIsFormTouched(true);
    const loginValid = validateField("login", formData.login);
    const emailValid = validateField("email", formData.email);
    const passwordValid = validateField("password", formData.password);

    if (loginValid && emailValid && passwordValid) {
      console.log("Registration form submitted:", formData);
      // Очищення форми
      setFormData({
        login: "",
        email: "",
        password: "",
      });
      setErrors({});
      setIsFormTouched(false);
      setShowPassword(false);

      navigation.navigate("Home", { screen: "Posts" });
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
      onBottomLinkPress={() => navigation.navigate("LoginScreen")} //"Navigate to Login"
      onAvatarPress={() => console.log("Avatar upload pressed")}
      isValid={isFormValid()}
    />
  );
}
