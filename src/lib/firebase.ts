
import { initializeApp, getApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBBn9Rrzd0vklTHVHdR2wKQ9y2w3Id5Yvk",
  authDomain: "asset-tracker-w0bxu.firebaseapp.com",
  projectId: "asset-tracker-w0bxu",
  storageBucket: "asset-tracker-w0bxu.appspot.com",
  messagingSenderId: "706312783282",
  appId: "1:706312783282:web:1de0be7aa749ac502e50ab",
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// NOTE: If you want to use the local Firebase emulators, uncomment the lines below.
// Make sure you have the emulators running with `firebase emulators:start`
// if (typeof window !== 'undefined' && window.location.hostname === "localhost") {
//   console.log("Connecting to local Firebase emulators");
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectFirestoreEmulator(db, "http://localhost:8080");
//   connectStorageEmulator(storage, "http://localhost:9199");
// }


export { app, db, auth, storage };
