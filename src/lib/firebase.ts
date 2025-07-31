
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, App } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAdminApp } from './firebase-admin';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "asset-tracker-w0bxu",
  appId: "1:706312783282:web:1de0be7aa749ac502e50ab",
  storageBucket: "asset-tracker-w0bxu.appspot.com",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "asset-tracker-w0bxu.firebaseapp.com",
  messagingSenderId: "706312783282"
};


// Initialize Firebase
let app: App;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const db = getFirestore(app);
const auth = getAuth(app);


export { app, db, auth };
