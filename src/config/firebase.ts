import { initializeApp, getApps, getApp } from 'firebase/app';
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

// Debugging function to log environment variables
const logEnvironmentVariables = () => {
  console.group('🔍 Environment Variables Debug');
  const envVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_MEASUREMENT_ID',
  ];

  envVars.forEach((varName) => {
    const value = import.meta.env[varName];
    console.log(`${varName}: ${value ? '✅ Present' : '❌ Missing'}`);
    if (value) {
      console.log(`  Value: ${value.substring(0, 10)}...`); // Partially mask the value
    }
  });
  console.groupEnd();
};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
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
let auth: ReturnType<typeof getAuth> | null = null;
let firestore: ReturnType<typeof getFirestore> | null = null;
let app: ReturnType<typeof initializeApp> | null = null;

const initializeFirebase = () => {
  try {
    console.group('🔥 Firebase Initialization');
    console.time('Firebase Initialization');

    // Log environment variables for debugging
    logEnvironmentVariables();

    validateFirebaseConfig(firebaseConfig);
    console.log('✅ Firebase configuration validated');

    // Check if app is already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      console.log('🔄 Firebase app already initialized');
      app = getApp();
    } else {
      app = initializeApp(firebaseConfig);
      console.log('✅ Firebase app initialized', {
        projectId: app.options.projectId,
        appId: app.options.appId,
      });
    }

    auth = getAuth(app);
    console.log('✅ Firebase auth initialized', {
      currentUser: auth.currentUser ? '✅ User present' : '❌ No current user',
    });

    firestore = getFirestore(app);
    console.log('✅ Firestore initialized');

    console.timeEnd('Firebase Initialization');
    console.groupEnd();

    return { app, auth, firestore };
  } catch (error) {
    console.groupEnd();
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

// Async initialization function for main.tsx
const initializeAuth = async () => {
  try {
    console.log('🔒 Starting Firebase Authentication Initialization');
    const { auth: firebaseAuth } = initializeFirebase();

    // Set default persistence
    if (firebaseAuth) {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      console.log('✅ Authentication persistence set');
    }

    return true;
  } catch (error) {
    console.error('❌ Authentication initialization failed:', error);
    throw error;
  }
};

// Authentication helper functions
const signUp = async (email: string, password: string) => {
  if (!auth) initializeFirebase();
  if (!auth) throw new Error('Firebase authentication not initialized');

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
  if (!auth) throw new Error('Firebase authentication not initialized');

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
  if (!auth) throw new Error('Firebase authentication not initialized');

  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) initializeFirebase();
  if (!auth) throw new Error('Firebase authentication not initialized');

  return onAuthStateChanged(auth, callback);
};

// Firebase Authentication and Firestore exports
export { auth, firestore, signUp, signIn, logOut, onAuthChange, initializeAuth };
