// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD_Kee7GZadJ7Q6Q0XLhEHWDDF1MVA9UkA",
    authDomain: "ledgerai-c86de.firebaseapp.com",
    projectId: "ledgerai-c86de",
    storageBucket: "ledgerai-c86de.firebasestorage.app",
    messagingSenderId: "224686922545",
    appId: "1:224686922545:web:d970ddde704a44361bee10",
    measurementId: "G-TK0XMV2WCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();