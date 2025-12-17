// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "swifto-12585.firebaseapp.com",
  projectId: "swifto-12585",
  storageBucket: "swifto-12585.firebasestorage.app",
  messagingSenderId: "138792975176",
  appId: "1:138792975176:web:df639969e07395243f117d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };