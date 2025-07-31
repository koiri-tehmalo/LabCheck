// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "asset-tracker-w0bxu",
  appId: "1:706312783282:web:1de0be7aa749ac502e50ab",
  storageBucket: "asset-tracker-w0bxu.firebasestorage.app",
  apiKey: "AIzaSyBBn9Rrzd0vklTHVHdR2wKQ9y2w3Id5Yvk",
  authDomain: "asset-tracker-w0bxu.firebaseapp.com",
  messagingSenderId: "706312783282"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
