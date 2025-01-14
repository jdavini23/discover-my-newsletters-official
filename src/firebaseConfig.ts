// Add type declarations for Vite environment variables
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_RECAPTCHA_SITE_KEY: string;
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
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// Firebase configuration object
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const performance = getPerformance(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Initialize App Check only if site key is available
const initializeAppCheckSafely = () => {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  
  if (recaptchaSiteKey) {
    try {
      return initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true
      });
    } catch (error) {
      console.warn('Failed to initialize App Check:', error);
      return null;
    }
  } else {
    console.warn('reCAPTCHA site key is not provided. App Check will be disabled.');
    return null;
  }
};

// Safely initialize App Check
const appCheck = initializeAppCheckSafely();

// Enhanced Analytics Service
const analyticsService = {
  /**
   * Log a custom event
   * @param eventName - Name of the event
   * @param eventData - Additional event parameters
   */
  logEvent: (eventName: string, eventData?: Record<string, any>) => {
    try {
      logEvent(analytics, eventName, {
        ...eventData,
        environment: import.meta.env.MODE
      });
    } catch (error) {
      console.warn('Failed to log analytics event:', error);
    }
  },

  /**
   * Set user ID for tracking
   * @param userId - Unique user identifier
   */
  setUserId: (userId?: string) => {
    try {
      setUserId(analytics, userId || null);
    } catch (error) {
      console.warn('Failed to set user ID:', error);
    }
  },

  /**
   * Set custom user properties
   * @param properties - User properties object
   */
  setUserProperties: (properties: Record<string, any>) => {
    try {
      setUserProperties(analytics, properties);
    } catch (error) {
      console.warn('Failed to set user properties:', error);
    }
  },

  /**
   * Track page views
   * @param pageName - Name of the page
   */
  trackPageView: (pageName: string) => {
    analyticsService.logEvent('page_view', { page_name: pageName });
  }
};

// Authentication service
const authService = {
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
const userService = {
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

// Explicitly rename exports to avoid conflicts
const firebaseAuthService = authService;
const firebaseUserService = userService;

export { 
  app, 
  analytics, 
  auth, 
  db, 
  performance, 
  functions, 
  storage,
  appCheck,
  analyticsService
};

export { 
  firebaseConfig as firebaseConfiguration,
  firebaseAuthService as authService, 
  firebaseUserService as userService 
};
