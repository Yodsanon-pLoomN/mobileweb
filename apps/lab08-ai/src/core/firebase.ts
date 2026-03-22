import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyASqfQetUTRVOM4B-3jpR_7lu5_Byf_qYk",
  authDomain: "lab06-expense-41e26.firebaseapp.com",
  projectId: "lab06-expense-41e26",
  storageBucket: "lab06-expense-41e26.firebasestorage.app",
  messagingSenderId: "1030631609771",
  appId: "1:1030631609771:android:2b3f7c56c34436d49ceeee",
  measurementId: "G-GP0EN5LKXR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);