// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASqfQetUTRVOM4B-3jpR_7lu5_Byf_qYk",
  authDomain: "lab06-expense-41e26.firebaseapp.com",
  projectId: "lab06-expense-41e26",
  storageBucket: "lab06-expense-41e26.firebasestorage.app",
  messagingSenderId: "1030631609771",
  appId: "1:1030631609771:web:846817eebc5f3a559ceeee",
  measurementId: "G-GP0EN5LKXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);