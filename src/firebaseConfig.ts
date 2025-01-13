// Add type declarations for Vite environment variables
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut as firebaseSignOut, 
  updateProfile,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  DocumentData 
} from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Firebase configuration object
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Authentication service
export const authService = {
  auth,
  
  async createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: User }> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  },

  async signInWithEmailAndPassword(email: string, password: string): Promise<{ user: User }> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  },

  async updateProfile(user: User, { displayName }: { displayName?: string }): Promise<void> {
    await updateProfile(user, { displayName });
  },

  // Password reset
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  // Sign out
  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  // Get current user
  getCurrentUser(): User | null {
    return auth.currentUser;
  }
};

// User Profile Services
export const userService = {
  async getUserProfile(userId: string, options?: { displayName?: string | null; email?: string | null; }): Promise<DocumentData | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  },

  async updateUserProfile(userId: string, updates: Record<string, any>): Promise<void> {
    await setDoc(doc(db, 'users', userId), updates, { merge: true });
  },

  async updateUserInterests(userId: string, interests: string[]): Promise<void> {
    await setDoc(doc(db, 'users', userId), { interests }, { merge: true });
  },

  async trackNewsletterView(userId: string, newsletterId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() || {};
    
    const viewedNewsletters = userData.viewedNewsletters || {};
    viewedNewsletters[newsletterId] = (viewedNewsletters[newsletterId] || 0) + 1;

    await setDoc(userRef, { viewedNewsletters }, { merge: true });
  }
};

export default app;
