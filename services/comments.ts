import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export interface NewComment {
  userId: string;
  userName: string;
  userAvatar: string | null;
  text: string;
}

export interface Comment extends NewComment {
  id: string;
  postId: string;
  createdAt: string;
}

export const addComment = async (
  postId: string,
  commentData: NewComment
): Promise<Comment> => {
  try {
    // Додаємо коментар
    const docRef = await addDoc(collection(db, "comments"), {
      ...commentData,
      postId,
      createdAt: serverTimestamp(),
    });

    // Оновлюємо лічильник коментарів у пості
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      commentsCount: increment(1),
    });

    return {
      id: docRef.id,
      postId,
      ...commentData,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getPostComments = async (postId: string): Promise<Comment[]> => {
  try {
    const q = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : new Date().toISOString(),
      } as Comment;
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    throw error;
  }
};

export const getCommentsCount = async (postId: string): Promise<number> => {
  try {
    const q = query(collection(db, "comments"), where("postId", "==", postId));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting comments count:", error);
    return 0;
  }
};
