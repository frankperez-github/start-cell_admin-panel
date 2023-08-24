// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6RB3AxXR4XSdmINv9CWj3sZyfacF7fkI",
  authDomain: "start-cell-8bf90.firebaseapp.com",
  projectId: "start-cell-8bf90",
  storageBucket: "start-cell-8bf90.appspot.com",
  messagingSenderId: "429445511075",
  appId: "1:429445511075:web:0eb21a8aa3a63feb554c16",
  measurementId: "G-C1JVKPF1SL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()
