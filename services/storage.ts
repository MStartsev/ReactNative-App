// src/services/storage.ts
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

export const uploadImage = async (
  userId: string,
  file: Blob,
  fileName: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const imageRef = ref(storage, `profilePhotos/${userId}/${fileName}`);
      console.log("Created storage reference:", imageRef.fullPath);

      const metadata = {
        contentType: "image/jpeg",
      };

      const uploadTask = uploadBytesResumable(imageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress monitoring
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Error handling
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          // Upload completed
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at:", downloadURL);
            resolve(downloadURL);
          } catch (urlError) {
            reject(urlError);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const getImageUrl = async (imageRef: any) => {
  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error("Error getting image URL:", error);
    throw error;
  }
};
