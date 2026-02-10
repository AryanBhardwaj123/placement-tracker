import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDMJKzi4n1tILd1SJ1kSVz5TD8tw9kCfY",
  authDomain: "placement-tracker-84a17.firebaseapp.com",
  projectId: "placement-tracker-84a17",
  storageBucket: "placement-tracker-84a17.appspot.com",
  messagingSenderId: "111847897810",
  appId: "1:111847897810:web:fd61068fbe23c451644b0b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
