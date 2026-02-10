// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// REPLACE these values with your own keys from the Firebase Console!
const firebaseConfig = {
    apiKey: "AIzaSyDMJKzi4n1tILd1dSJ1kSVz5TD8tw9kCfY",
    authDomain: "placement-tracker-84a17.firebaseapp.com",
    projectId: "placement-tracker-84a17",
    storageBucket: "placement-tracker-84a17.firebasestorage.app",
    messagingSenderId: "111847897810",
    appId: "1:111847897810:web:fd61068fbe23c451644b0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore
import { getFirestore } from "firebase/firestore";
const db = getFirestore(app);

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };
