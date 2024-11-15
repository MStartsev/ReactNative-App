export type RegistrationFormData = {
  login: string;
  email: string;
  password: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type UserProfile = {
  login: string;
  email: string;
  avatar?: string;
};

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface FormErrors {
  login?: string;
  email?: string;
  password?: string;
}
