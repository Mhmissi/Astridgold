import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjQEkJPtnhvCKK2pTpBI6HmZq5wf0FUn0",
  authDomain: "astridgold-97417.firebaseapp.com",
  projectId: "astridgold-97417",
  storageBucket: "astridgold-97417.appspot.com",
  messagingSenderId: "326118642347",
  appId: "1:326118642347:web:00f429b7e3b4e925c95dee"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { app }; 