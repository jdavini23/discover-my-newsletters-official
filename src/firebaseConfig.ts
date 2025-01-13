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
  async getUserProfile(userId: string): Promise<DocumentData | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  },

  async updateUserProfile(userId: string, updates: Record<string, any>): Promise<void> {
    await setDoc(doc(db, 'users', userId), updates, { merge: true });
  }
};

export default app;
