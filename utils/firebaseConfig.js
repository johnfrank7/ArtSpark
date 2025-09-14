import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQ7gxHRoQbsKubKTCG-gBKbwikacTV0fU",
  authDomain: "artspark-80236.firebaseapp.com",
  projectId: "artspark-80236",
  storageBucket: "artspark-80236.firebasestorage.app",
  messagingSenderId: "1051300345981",
  appId: "1:1051300345981:web:82d8629d26eb5289c4d914"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)