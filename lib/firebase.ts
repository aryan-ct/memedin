import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBHj6u4NO_j90ratt7PJwRSV7WjwwDTFwI",
  authDomain: "memedin-2d4b0.firebaseapp.com",
  projectId: "memedin-2d4b0",
  storageBucket: "memedin-2d4b0.firebasestorage.app",
  messagingSenderId: "890687303510",
  appId: "1:890687303510:web:f8b5387191454f43a1f0f7"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = getFirestore(app);
