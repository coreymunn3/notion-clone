// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCXHVkMAqBW8IbNwoRZWWPJk-5ETcSFqk",
  authDomain: "notion-clone-793df.firebaseapp.com",
  projectId: "notion-clone-793df",
  storageBucket: "notion-clone-793df.firebasestorage.app",
  messagingSenderId: "49642363514",
  appId: "1:49642363514:web:ce7edf5e18da95dfb879c3",
  measurementId: "G-9DP958EMNE"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);
const db = getFirestore(app)