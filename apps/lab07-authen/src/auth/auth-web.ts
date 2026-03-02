const firebaseConfig = {
  apiKey: "AIzaSyASqfQetUTRVOM4B-3jpR_7lu5_Byf_qYk",
  authDomain: "lab06-expense-41e26.firebaseapp.com",
  projectId: "lab06-expense-41e26",
  storageBucket: "lab06-expense-41e26.firebasestorage.app",
  messagingSenderId: "1030631609771",
  appId: "1:1030631609771:web:846817eebc5f3a559ceeee",
  measurementId: "G-GP0EN5LKXR"
};

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { AuthUser, IAuthService, EmailPasswordCredentials,PhoneCredentials } from "./auth-interface";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  ConfirmationResult,
  onAuthStateChanged
} from "firebase/auth";


export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);


function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoUrl: u.photoURL,
  };
}


import { RecaptchaVerifier } from "firebase/auth";
import { code } from "ionicons/icons";


let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;


// ควรมี div สำหรับ reCAPTCHA ในหน้า login สำหรับโทรศัพท์ ด้วย id="recaptcha-container"
const recaptchaContainerId: string = "recaptcha-container";


export function getRecaptchaVerifier(
  containerId: string
): RecaptchaVerifier {
  if (!verifier) {
    verifier = new RecaptchaVerifier(
      firebaseAuth,
      containerId,
      {
        size: "invisible", // หรือ "normal"
      }
    );
  }
  return verifier;
}


export class FirebaseWebAuthService implements IAuthService {
  
  // โค้ดใหม่: บังคับให้รอจนกว่า Firebase จะเช็คสถานะเสร็จจริงๆ
  async getCurrentUser(): Promise<AuthUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        unsubscribe(); // เลิกดักฟังทันทีเมื่อได้คำตอบครั้งแรก
        resolve(user ? mapUser(user) : null);
      });
    });
  }

  // ... ฟังก์ชันอื่นๆ (loginWithEmailPassword, ฯลฯ) ปล่อยไว้เหมือนเดิมครับ ...


  async loginWithEmailPassword(creds: EmailPasswordCredentials) {
    const r = await signInWithEmailAndPassword(
      firebaseAuth,
      creds.email,
      creds.password
    );
    return mapUser(r.user);
  }


  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }


  async logout() {
    await firebaseAuth.signOut();
  }


  async startPhoneLogin(
    creds: PhoneCredentials
  ): Promise<{ verificationId: string }> {
    const verifier = getRecaptchaVerifier(recaptchaContainerId);
    confirmationResult = await signInWithPhoneNumber(
      firebaseAuth,
      creds.phoneNumberE164,
      verifier
    );
    return { verificationId: confirmationResult.verificationId };
  }


  async confirmPhoneCode(payload: { verificationId: string; verificationCode: string }): Promise<AuthUser> {
    if (!confirmationResult) {
      throw new Error("No confirmation result");
    }
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }


}
