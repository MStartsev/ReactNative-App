import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { uploadImage } from "./storage";
import { getCommentsCount } from "./comments";

export interface Post {
  id: string;
  userId: string;
  userAvatar?: string;
  userName: string;
  image: string;
  title: string;
  location: string;
  likes: { [userId: string]: boolean };
  commentsCount: number;
  createdAt: string | null;
}

export interface PostFormData {
  imageBlob: Blob;
  title: string;
  location: string;
}

// Отримання всіх постів
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const posts = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const commentsCount = await getCommentsCount(doc.id);

        return {
          id: doc.id,
          ...data,
          commentsCount,
          createdAt: data.createdAt
            ? data.createdAt.toDate().toISOString()
            : null,
        } as Post;
      })
    );

    return posts;
  } catch (error) {
    console.error("Error getting all posts:", error);
    throw error;
  }
};

// Отримання постів користувача
export const getUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const q = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt
          ? data.createdAt.toDate().toISOString()
          : null,
      } as Post;
    });
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};

// Тогл лайку
export const toggleLike = async (
  postId: string,
  userId: string
): Promise<void> => {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      const likes = postDoc.data().likes || {};
      if (likes[userId]) {
        delete likes[userId];
      } else {
        likes[userId] = true;
      }

      await updateDoc(postRef, { likes });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// Створення поста
export const createPost = async (
  userId: string,
  userName: string,
  userAvatar: string | null,
  postData: PostFormData
): Promise<Post> => {
  try {
    // Завантажуємо зображення
    const imageUrl = await uploadImage(
      userId,
      postData.imageBlob,
      `posts/${Date.now()}.jpg`
    );

    // Створюємо пост
    const newPost = {
      userId,
      userName,
      userAvatar,
      image: imageUrl,
      title: postData.title,
      location: postData.location,
      likes: {},
      commentsCount: 0,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "posts"), newPost);

    // Повертаємо створений пост з id
    return {
      id: docRef.id,
      ...newPost,
      createdAt: new Date().toISOString(),
    } as Post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};
