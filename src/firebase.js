import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7AFoL5wZhxceS8XxZ_06rmBMJCGRjKT0",
  authDomain: "facilume.firebaseapp.com",
  projectId: "facilume",
  storageBucket: "facilume.firebasestorage.app",
  messagingSenderId: "969775767462",
  appId: "1:969775767462:web:2d4b53fd26c1f187f93967",
  measurementId: "G-DLHVG45W0J"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export { signInAnonymously, onAuthStateChanged };