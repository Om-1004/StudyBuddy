// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ignitionhacksfirebase.firebaseapp.com",
  projectId: "ignitionhacksfirebase",
  storageBucket: "ignitionhacksfirebase.firebasestorage.app",
  messagingSenderId: "664553450418",
  appId: "1:664553450418:web:b27ae5e7ffaae5251d52ab",
  measurementId: "G-J2P1EV41BL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);