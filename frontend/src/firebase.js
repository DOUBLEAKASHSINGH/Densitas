// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD34zpOG6h03bVBeuUT86LqsBCn3dxijNU",
  authDomain: "scholorbridge.firebaseapp.com",
  projectId: "scholorbridge",
  storageBucket: "scholorbridge.firebasestorage.app",
  messagingSenderId: "214018101249",
  appId: "1:214018101249:web:94b81379f79df62834b000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
