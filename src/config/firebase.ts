import { initializeApp } from 'firebase/app';
import {
  AuthError,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
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
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingKeys = requiredKeys.filter((key) => !config[key]);

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

    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app); // Initialize firestore with the app
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

// Authentication helper functions
const signUp = async (email: string, password: string) => {
  if (!auth) initializeFirebase();
  try {
    // Set persistence before creating user
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

const signIn = async (email: string, password: string) => {
  if (!auth) initializeFirebase();
  try {
    // Set persistence before signing in
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const logOut = async () => {
  if (!auth) initializeFirebase();
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) initializeFirebase();
  return onAuthStateChanged(auth, callback);
};

// Initialize Firebase on module import
initializeFirebase();

// Firebase Authentication and Firestore exports
export { auth, firestore, logOut, onAuthChange, signIn, signUp };

// Direct Firebase Auth exports
export * from 'firebase/auth';
export * from 'firebase/firestore';
