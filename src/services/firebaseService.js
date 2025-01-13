import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Authentication
export const auth = getAuth(app);
// Firestore
export const db = getFirestore(app);
export default app;
