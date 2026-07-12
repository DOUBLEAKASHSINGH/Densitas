// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA4aFqTgRuYems6O-G0AHJcJGrTEwDbEE",
  authDomain: "densitas.firebaseapp.com",
  projectId: "densitas",
  storageBucket: "densitas.firebasestorage.app",
  messagingSenderId: "283296237927",
  appId: "1:283296237927:web:ae599760d8d8aa4a9f07c2",
  measurementId: "G-4L5DPZWBN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
