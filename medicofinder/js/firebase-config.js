import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyCYuMZy0O8M37lftyv67OAxRIgRc5rLZ9U",
  authDomain: "fir-firebase-8f21e.firebaseapp.com",
  projectId: "fir-firebase-8f21e",
  storageBucket: "fir-firebase-8f21e.firebasestorage.app",
  messagingSenderId: "780386175810",
  appId: "1:780386175810:web:ddb8b03de075ce978096db",
  measurementId: "G-4EG3D9E3ZG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, where };
export const auth = getAuth(app);
