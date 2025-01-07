import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = (config: typeof firebaseConfig) => {
  const requiredKeys: (keyof typeof firebaseConfig)[] = [
    'apiKey', 'authDomain', 'projectId', 
    'storageBucket', 'messagingSenderId', 'appId'
  ];

  const missingKeys = requiredKeys.filter(key => !config[key]);
  
  if (missingKeys.length > 0) {
    console.error('Missing Firebase configuration keys:', missingKeys);
    throw new Error(`Invalid Firebase configuration. Missing keys: ${missingKeys.join(', ')}`);
  }
};

// Firebase initialization and exports
let auth: ReturnType<typeof getAuth>;
let firestore: ReturnType<typeof getFirestore>;

const initializeFirebase = () => {
  try {
    validateFirebaseConfig(firebaseConfig);
    console.log('Firebase Config Validated:', firebaseConfig);

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication and Firestore
    auth = getAuth(app);
    firestore = getFirestore(app);
  } catch (error) {
    console.error('Firebase Configuration Error:', error);
    throw error;
  }
};

// Authentication helper functions
const signUp = async (email: string, password: string) => {
  if (!auth) initializeFirebase();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

const signIn = async (email: string, password: string) => {
  if (!auth) initializeFirebase();
  try {
    const userCredential = await signInWithEmailAndPassword(auth!, email, password);
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

const logOut = async () => {
  if (!auth) initializeFirebase();
  try {
    await signOut(auth!);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) initializeFirebase();
  return onAuthStateChanged(auth!, callback);
};

// Initialize Firebase on module import
initializeFirebase();

export {
  auth,
  firestore,
  signUp,
  signIn,
  logOut,
  onAuthChange
};
