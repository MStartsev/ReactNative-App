// src/services/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { AppDispatch } from "@/redux/store";
import { setUser, setError, clearUser } from "@/redux/auth/authSlice";
import { UserProfile } from "@/types/user";
import { addUser, updateUserInFirestore } from "./firestore";
import { getImageUrl, uploadImage } from "./storage";

interface AuthCredentials {
  email: string;
  password: string;
  login?: string;
}

export const registerUser = async (
  { email, password, login }: AuthCredentials,
  avatarUri?: string
) => {
  try {
    // Реєстрація користувача
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    let avatarUrl = null;

    if (avatarUri) {
      try {
        // Конвертуємо URI в blob
        const response = await fetch(avatarUri);
        console.log("Fetch response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        console.log("Blob size:", blob.size);
        console.log("Blob type:", blob.type);

        // Завантажуємо фото
        const fileName = `avatar_${Date.now()}.jpg`;
        console.log("Generated filename:", fileName);

        // Отримуємо URL одразу
        avatarUrl = await uploadImage(user.uid, blob, fileName);
        console.log("Got avatar URL:", avatarUrl);

        // Оновлюємо профіль з аватаром
        await updateProfile(user, {
          displayName: login,
          photoURL: avatarUrl,
        });
      } catch (uploadError) {
        console.error("Avatar upload error:", uploadError);
      }
    }

    const userData: UserProfile = {
      id: user.uid,
      email: user.email || "",
      login: login || "",
      avatar: avatarUrl,
    };

    // Зберігаємо в Firestore
    await addUser(user.uid, userData);

    return userData;
  } catch (error: any) {
    console.error("Registration error:", error);
    let message = "Помилка реєстрації";

    switch (error.code) {
      case "auth/email-already-in-use":
        message = "Користувач з такою електронною поштою вже існує";
        break;
      case "auth/invalid-email":
        message = "Невірний формат електронної пошти";
        break;
      case "auth/weak-password":
        message = "Пароль повинен містити мінімум 6 символів";
        break;
    }

    throw new Error(message);
  }
};

export const loginUser = async (
  { email, password }: AuthCredentials,
  dispatch: AppDispatch
) => {
  try {
    console.log("Attempting login with:", email);
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful, user:", user.uid);

    const userData: UserProfile = {
      id: user.uid,
      email: user.email || "",
      login: user.displayName || email.split("@")[0],
      avatar: user.photoURL || null,
    };

    console.log("Prepared user data:", userData);
    return userData;
  } catch (error: any) {
    console.error("Login error:", error.code, error.message);
    let message = "Помилка входу";

    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        message = "Невірна електронна пошта або пароль";
        break;
      case "auth/invalid-email":
        message = "Невірний формат електронної пошти";
        break;
      case "auth/too-many-requests":
        message = "Забагато спроб входу. Спробуйте пізніше";
        break;
    }

    throw new Error(message);
  }
};

export const logoutUser = async (dispatch: AppDispatch) => {
  try {
    await signOut(auth);
    dispatch(clearUser());
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const authStateChanged = (dispatch: AppDispatch) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userData: UserProfile = {
        id: user.uid,
        email: user.email || "",
        login: user.displayName || "",
        avatar: user.photoURL || null,
      };
      dispatch(setUser(userData));
    } else {
      dispatch(clearUser());
    }
  });
};
