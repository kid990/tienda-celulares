import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACXIzFIk2Yn2X_5BAU7bYN1j_i2krGQtw",
  authDomain: "tienda-celulares-6c066.firebaseapp.com",
  projectId: "tienda-celulares-6c066",
  storageBucket: "tienda-celulares-6c066.firebasestorage.app",
  messagingSenderId: "990758082150",
  appId: "1:990758082150:web:a150e421957c44640fbfa7",
  measurementId: "G-RTE1EGQ0PC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
