// utils/firestoreHelpers.js
import { db, auth } from "./firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const PHOTOS_COL = "photos";
const BOOKMARKS_COL = "bookmarks";

/**
 * Save a photo (new or update).
 * Photo fields: { id?, title, url }
 * Will auto-add ownerId & ownerEmail from current user.
 */
export async function savePhoto(photo) {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  const baseData = {
    title: photo.title,
    url: photo.url,
    ownerId: user.uid,
    ownerEmail: user.email,
    createdAt: serverTimestamp(),
  };

  if (photo.id) {
    // update existing doc
    const ref = doc(db, PHOTOS_COL, photo.id);
    await setDoc(ref, baseData, { merge: true });
    return photo.id;
  } else {
    // create new doc
    const colRef = collection(db, PHOTOS_COL);
    const docRef = await addDoc(colRef, baseData);
    return docRef.id;
  }
}

// ===== Bookmarks (Saved from Search) =====
export async function addBookmark(url, source = "unsplash") {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  const colRef = collection(db, BOOKMARKS_COL);
  const docRef = await addDoc(colRef, {
    uid: user.uid,
    url,
    source,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getMyBookmarks() {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(collection(db, BOOKMARKS_COL), where("uid", "==", user.uid));
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  return items;
}

export async function removeBookmark(id) {
  const ref = doc(db, BOOKMARKS_COL, id);
  await deleteDoc(ref);
}

/**
 * One-time get all photos (latest first).
 */
export async function getAllPhotosOnce() {
  const q = query(collection(db, PHOTOS_COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Real-time subscription for photos feed.
 */
export function subscribeAllPhotos(onUpdate) {
  const q = query(collection(db, PHOTOS_COL), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    onUpdate(items);
  });
}

/**
 * Get photos uploaded by a specific user.
 */
export async function getUserPhotos(uid) {
  // Allow callers to omit uid; fall back to current user
  const effectiveUid = uid || auth.currentUser?.uid;
  if (!effectiveUid) {
    // No user context; return empty list instead of throwing where(undefined)
    return [];
  }

  // Avoid composite index requirement by removing server-side orderBy
  const q = query(collection(db, PHOTOS_COL), where("ownerId", "==", effectiveUid));
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  // Client-side sort by createdAt desc (createdAt may be a Firestore Timestamp)
  items.sort((a, b) => {
    const aTime = a.createdAt?.seconds || 0;
    const bTime = b.createdAt?.seconds || 0;
    return bTime - aTime;
  });
  return items;
}

/**
 * Update photo metadata.
 */
export async function updatePhoto(id, updates) {
  const ref = doc(db, PHOTOS_COL, id);
  await updateDoc(ref, updates);
}

/**
 * Get a single photo by ID.
 */
export async function getPhotoById(id) {
  const ref = doc(db, PHOTOS_COL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Delete photo (with ownership check).
 */
export async function deletePhoto(id, ownerId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  if (user.uid !== ownerId) throw new Error("You can only delete your own photos");

  const ref = doc(db, PHOTOS_COL, id);
  await deleteDoc(ref);
}
