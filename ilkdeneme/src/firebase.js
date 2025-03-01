import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDROyg8m_AM7PtktwlezHSXECsbt-7Yld0",
  authDomain: "ilkdeneme-2ca44.firebaseapp.com",
  projectId: "ilkdeneme-2ca44",
  storageBucket: "ilkdeneme-2ca44.appspot.com",
  messagingSenderId: "233694261318",
  appId: "1:233694261318:web:71fa3f222c627ba325da47",
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };