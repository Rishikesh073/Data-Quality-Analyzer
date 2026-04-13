import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBLmaaeMsJq8QFRUnbsf18s7p1vjt8JSYA",
  authDomain: "data-quality-analyzer-8db16.firebaseapp.com",
  projectId: "data-quality-analyzer-8db16",
  storageBucket: "data-quality-analyzer-8db16.firebasestorage.app",
  messagingSenderId: "608651653057",
  appId: "1:608651653057:web:eb1a0f83009832f3b84940"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
