// src/services/firestore.ts
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { UserProfile } from "@/types/user";

export const addUser = async (
  userId: string,
  userData: UserProfile
): Promise<void> => {
  try {
    await setDoc(doc(db, "users", userId), userData, { merge: true });
    console.log("User added:", userId);
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Помилка створення профілю користувача");
  }
};

export const getUser = async (userId: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Помилка отримання даних користувача");
  }
};

export const updateUserInFirestore = async (
  userId: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    await setDoc(doc(db, "users", userId), data, { merge: true });
    console.log("User updated:", userId);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Помилка оновлення даних користувача");
  }
};
