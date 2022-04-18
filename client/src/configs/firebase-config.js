// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDctDyOUxN-4GpY0bjmYBJDwQ8bTVUsPZc",
  authDomain: "ubprep-a5fa6.firebaseapp.com",
  projectId: "ubprep-a5fa6",
  storageBucket: "ubprep-a5fa6.appspot.com",
  messagingSenderId: "689139875607",
  appId: "1:689139875607:web:2e70f1e2b2cb7b411f4152",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
