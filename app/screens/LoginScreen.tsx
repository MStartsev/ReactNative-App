import React, { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import type { LoginFormData, FormErrors } from "@/types/auth";
import { getValidationError } from "@/utils/validation";

export default function LoginScreen() {
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

  const handleSubmit = () => {
    setIsFormTouched(true);
    const emailValid = validateField("email", formData.email);
    const passwordValid = validateField("password", formData.password);

    if (emailValid && passwordValid) {
      console.log("Login form submitted:", formData);
      // Очищення форми
      setFormData({
        email: "",
        password: "",
      });
      setErrors({});
      setIsFormTouched(false);
      setShowPassword(false);
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
      onBottomLinkPress={() => console.log("Navigate to Registration")}
      isValid={isFormValid()}
    />
  );
}
