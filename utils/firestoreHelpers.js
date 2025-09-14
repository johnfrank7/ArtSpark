import { db, auth } from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where } from "firebase/firestore";


export const savePhoto = async (photoUrl) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    await addDoc(collection(db, "photos"), {
      uid: user.uid,
      url: photoUrl,
      createdAt: new Date(),
    });

    console.log("Photo saved!");
  } catch (error) {
    console.error("Error saving photo:", error);
  }
};

export const getUserPhotos = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const q = query(collection(db, "photos"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting photos:", error);
    return [];
  }
};


export const deletePhoto = async (id) => {
  try {
    await deleteDoc(doc(db, "photos", id));
    console.log("Photo deleted!");
  } catch (error) {
    console.error("Error deleting photo:", error);
  }
};

export const updatePhoto = async (id, newUrl) => {
  try {
    await updateDoc(doc(db, "photos", id), { url: newUrl });
    console.log("Photo updated!");
  } catch (error) {
    console.error("Error updating photo:", error);
  }
};
