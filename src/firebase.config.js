// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore, doc, setDoc} from "firebase/firestore" 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsUm90JtpjC0prMcwvOq8qEciMbGcXCC4",
  authDomain: "financely-4d40e.firebaseapp.com",
  projectId: "financely-4d40e",
  storageBucket: "financely-4d40e.appspot.com",
  messagingSenderId: "735218106402",
  appId: "1:735218106402:web:349eed4b51d73b921f8a7b",
  measurementId: "G-5QRCQ8XPMK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()