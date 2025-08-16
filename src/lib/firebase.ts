
import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBBn9Rrzd0vklTHVHdR2wKQ9y2w3Id5Yvk",
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
const storage = getStorage(app);

export { app, db, auth, storage };
