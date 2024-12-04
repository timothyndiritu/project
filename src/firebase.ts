import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA8cWrgtvstRUN9V7pSAE0P95-bZSWKsSQ",
  authDomain: "rsvp-system-eff0c.firebaseapp.com",
  projectId: "rsvp-system-eff0c",
  storageBucket: "rsvp-system-eff0c.firebasestorage.app",
  messagingSenderId: "1044500695902",
  appId: "1:1044500695902:web:225777334a73b933981dcf"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);