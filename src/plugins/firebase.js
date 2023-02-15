import AsyncStorage from '@react-native-async-storage/async-storage';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getReactNativePersistence,
  updateProfile
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5zsqqN_h5A8CE-kSXXElRiEdq5yERhm4",
  authDomain: "testepwa-8612f.firebaseapp.com",
  projectId: "testepwa-8612f",
  storageBucket: "testepwa-8612f.appspot.com",
  messagingSenderId: "226649003057",
  appId: "1:226649003057:web:345d1aa211e53cdf2b3110"
};

const app = initializeApp(firebaseConfig)

const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
const db = getFirestore(app)

export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  collection,
  addDoc,
  getDocs,
  query,
  where
}