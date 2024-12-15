import { ValidationResult, ValidationFields } from "@/types/auth";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateLogin = (login: string): boolean => {
  return login.length >= 3;
};

export const getValidationError = (
  field: ValidationFields,
  value: string
): ValidationResult => {
  // Спочатку перевіряємо на пусте поле
  if (!value.trim()) {
    return {
      isValid: false,
      message: "Це поле обов'язкове",
    };
  }

  // Якщо поле не пусте, перевіряємо на інші умови
  switch (field) {
    case "email":
      return {
        isValid: validateEmail(value),
        message: "Невірний формат електронної пошти",
      };
    case "password":
      return {
        isValid: validatePassword(value),
        message: "Пароль повинен містити мінімум 6 символів",
      };
    case "login":
      return {
        isValid: validateLogin(value),
        message: "Логін повинен містити мінімум 3 символи",
      };
    default:
      return { isValid: true, message: "" };
  }
};
