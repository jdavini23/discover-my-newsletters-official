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
} from 'firebase/auth';/
// Debugging function to log environment variables/
const logEnvironmentVariables = () => {
  console.group('ðŸ” Environment Variables Debug');
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
    console.log(`${varName}: ${value ? 'âœ… Present' : 'âŒ Missing'}`);
    if (value) {
      console.log(`  Value: ${value.substring(0, 10)}...`); // Partially mask the value/
    }
  });
  console.groupEnd();
};
// Your web app's Firebase configuration/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};
// Validate Firebase configuration/
const validateFirebaseConfig = (config: typeof firebaseConfig) => {
  const requiredKeys: (keyof typeof firebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
    'measurementId',
  ];
  // Comprehensive configuration validation/
  const validationResults = requiredKeys.map((key) => ({
    key,
    value: config[key],
    isValid: !!config[key] && config[key].trim() !== '',
  }));
  const missingKeys = validationResults
    .filter((result) => !result.isValid)
    .map((result) => result.key);
  if (missingKeys.length > 0) {
    console.error('ðŸš¨ Missing or Invalid Firebase Configuration Keys:', missingKeys);
    console.error(
      'Validation Details:',
      validationResults.map((result) => ({
        key: result.key,
        isValid: result.isValid,
        value: result.value ? '****' : 'MISSING',
      }))
    );
    throw new Error(
      `Firebase configuration is incomplete or invalid. Missing/Invalid keys: ${missingKeys.join(', ')}`/
    );
  }
  // Advanced API key validation/
  const apiKeyValidation = {
    length: config.apiKey.length === 39,
    startsWithAIza: config.apiKey.startsWith('AIza'),
    containsOnlyValidChars: /^[A-Za-z0-9_-]+/$/.test(config.apiKey),/
  };
  const apiKeyValidationFailed = Object.entries(apiKeyValidation)
    .filter(([_, isValid]) => !isValid)
    .map(([key, _]) => key);
  if (apiKeyValidationFailed.length > 0) {
    console.error('ðŸš¨ Firebase API Key Validation Failed:', {
      failedChecks: apiKeyValidationFailed,
      apiKeyDetails: {
        length: config.apiKey.length,
        startsWithAIza: config.apiKey.startsWith('AIza'),
        containsOnlyValidChars: /^[A-Za-z0-9_-]+/$/.test(config.apiKey),/
      },
    });
    throw new Error(
      `Invalid Firebase API key. Failed checks: ${apiKeyValidationFailed.join(', ')}`
    );
  }
};
// Firebase initialization and exports/
const _app: ReturnType<typeof initializeApp> | null = null;
let _auth: ReturnType<typeof getAuth> | null = null;
const _firestore: ReturnType<typeof getFirestore> | null = null;
// Getter methods for Firebase services/
const getFirebaseAuth = () => {
  // Ensure Firebase is initialized before getting auth/
  if (!_app) {
    throw new Error('Firebase auth not initialized. Call initializeFirebase() first.');
  }
  // Lazily initialize auth if not already created/
  if (!_auth) {
    _auth = getAuth(_app);
  }
  return _auth;
};
// Centralized Firebase initialization with comprehensive error handling/
const initializeFirebase = () => {
  try {
    // Log environment variables for debugging/
    logEnvironmentVariables();
    // Validate Firebase configuration/
    validateFirebaseConfig(firebaseConfig);
    // Prevent multiple initializations/
    const existingApp = getApps().length > 0 ? getApp() : null;
    const app = existingApp || initializeApp(firebaseConfig);
    // Initialize Firebase services/
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    // Configure authentication persistence/
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error('ðŸš¨ Authentication Persistence Error:', error);
    });
    return {
      app,
      auth,
      firestore,
    };
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    throw error;
  }
};
// Ensure auth is properly initialized and exported/
const auth = initializeFirebase().auth;
const firestore = initializeFirebase().firestore;
// Getter methods for Firebase services/
const getFirebaseApp = () => {
  if (!_app) {
    throw new Error('Firebase app not initialized. Call initializeFirebase() first.');
  }
  return _app;
};
const getFirebaseFirestore = () => {
  if (!_firestore) {
    throw new Error('Firestore not initialized. Call initializeFirebase() first.');
  }
  return _firestore;
};
// Async initialization function for main.tsx/
const initializeAuth = async () => {
  try {
    console.log('ðŸ”’ Starting Firebase Authentication Initialization');
    await initializeFirebase();
    console.log('ðŸ” Firebase Authentication Ready');
  } catch (error) {
    console.error('ðŸš¨ Firebase Authentication Initialization Failed:', error);
    throw error;
  }
};
// Authentication helper functions/
const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign Up Error:', error);
    throw error;
  }
};
const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Sign In Error:', error);
    throw error;
  }
};
const logOut = async () => {
  try {
    await signOut(getFirebaseAuth());
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};
// Wrapper for onAuthChange to handle async initialization/
const onAuthChange = (callback: (user: User | null) => void) => {
  const initAndSetupAuthListener = async () => {
    try {
      // Ensure auth is initialized/
      await initializeFirebase();
      // Setup auth state change listener/
      return onAuthStateChanged(getFirebaseAuth(), callback);
    } catch (error) {
      console.error('Auth Change Setup Error:', error);
      throw error;
    }
  };
  // Return a promise that resolves to the unsubscribe function/
  return initAndSetupAuthListener();
};
export {
  auth,
  firestore,
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseFirestore,
  initializeAuth,
  initializeFirebase,
  logOut,
  onAuthChange,
  signIn,
  signUp,
};
import { getApp, getApps, initializeApp } from 'firebase/app';/
import { getFirestore } from 'firebase/firestore';/

import type { GlobalTypes } from '@/type/s/global';/

