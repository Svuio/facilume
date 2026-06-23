import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ВАЖНО: Замести този обект с ТВОИТЕ данни от Firebase Console!
const firebaseConfig = {
  apiKey: "AIzaSyC7AFoL5wZhxceS8XxZ_06rmBMJCGRjKT0",
  authDomain: "facilume.firebaseapp.com",
  projectId: "facilume",
  storageBucket: "facilume.firebasestorage.app",
  messagingSenderId: "969775767462",
  appId: "1:969775767462:web:2d4b53fd26c1f187f93967",
  measurementId: "G-DLHVG45W0J"
};

// Инициализираме Firebase
const app = initializeApp(firebaseConfig);

// Инициализираме Firestore (базата данни)
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);