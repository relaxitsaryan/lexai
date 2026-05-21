import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const getEnv = (key: string) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

if (!getEnv("VITE_FIREBASE_API_KEY") && !getEnv("NEXT_PUBLIC_FIREBASE_API_KEY")) {
  console.warn("Firebase API Key is missing. Check your .env.local file.");
}

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY") || getEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN") || getEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID") || getEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET") || getEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") || getEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("VITE_FIREBASE_APP_ID") || getEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID") || getEnv("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID")
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics conditionally (it doesn't work in some environments like SSR)
export const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export default app;
