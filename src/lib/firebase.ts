
import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "asset-tracker-w0bxu.firebaseapp.com",
  projectId: "asset-tracker-w0bxu",
  storageBucket: "asset-tracker-w0bxu.appspot.com",
  messagingSenderId: "706312783282",
  appId: "1:706312783282:web:1de0be7aa749ac502e50ab",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
