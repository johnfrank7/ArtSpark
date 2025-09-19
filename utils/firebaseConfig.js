import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyAQ7gxHRoQbsKubKTCG-gBKbwikacTV0fU",
  authDomain: "artspark-80236.firebaseapp.com",
  projectId: "artspark-80236",
  storageBucket: "artspark-80236.firebasestorage.app",
  messagingSenderId: "1051300345981",
  appId: "1:1051300345981:web:82d8629d26eb5289c4d914"
};

const app = initializeApp(firebaseConfig);
export { app };

let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  // Lazily require native-only APIs to avoid web bundling errors
  const { initializeAuth, getReactNativePersistence } = require("firebase/auth");
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (e) {
    // Fallback if already initialized
    auth = getAuth(app);
  }
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
