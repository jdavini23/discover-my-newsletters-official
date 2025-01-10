import axios, { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';

import { trackEvent, trackError } from '@/utils/analytics';
import { isNonEmptyString, safeGet, validateEmail, validatePassword } from '@/utils/typeUtils';
import { initializeApp } from 'firebase/app';
import { USER_ROLES, UserRole } from '@/types/roles';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || '',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Comprehensive error handling for authentication
enum AuthErrorType {
  NETWORK_ERROR = 'Network Error',
  INVALID_CREDENTIALS = 'Invalid Credentials',
  USER_NOT_FOUND = 'User Not Found',
  EMAIL_ALREADY_IN_USE = 'Email Already in Use',
  WEAK_PASSWORD = 'Weak Password',
  UNAUTHORIZED = 'Unauthorized',
  UNKNOWN_ERROR = 'Unknown Error',
}

// Enhanced error class for authentication
class AuthServiceError extends Error {
  type: AuthErrorType;
  originalError?: Error;

  constructor(message: string, type: AuthErrorType, originalError?: Error) {
    super(message);
    this.name = 'AuthServiceError';
    this.type = type;
    this.originalError = originalError;
  }

  static fromFirebaseError(error: FirebaseError): AuthServiceError {
    // Check if the error is specifically an auth error
    const authErrorCodes = [
      'auth/network-request-failed',
      'auth/wrong-password',
      'auth/invalid-credential',
      'auth/user-not-found',
      'auth/email-already-in-use',
      'auth/weak-password',
    ];

    const errorCode = error.code;
    let errorType = AuthErrorType.UNKNOWN_ERROR;

    switch (errorCode) {
      case 'auth/network-request-failed':
        errorType = AuthErrorType.NETWORK_ERROR;
        break;
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        errorType = AuthErrorType.INVALID_CREDENTIALS;
        break;
      case 'auth/user-not-found':
        errorType = AuthErrorType.USER_NOT_FOUND;
        break;
      case 'auth/email-already-in-use':
        errorType = AuthErrorType.EMAIL_ALREADY_IN_USE;
        break;
      case 'auth/weak-password':
        errorType = AuthErrorType.WEAK_PASSWORD;
        break;
    }

    return new AuthServiceError(error.message, errorType, error);
  }
}

// Comprehensive user profile interface
interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  role: string;
  newsletterPreferences?: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
    darkMode?: boolean;
  };
}

// Enhanced update profile payload
interface UpdateProfilePayload {
  displayName?: string;
  email?: string;
  newsletterPreferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
    darkMode?: boolean;
  };
}

// Authentication configuration
const AUTH_CONFIG = {
  BASE_URL: process.env.VITE_API_URL || 'http://localhost:5000/api',
  SOCIAL_PROVIDERS: {
    GOOGLE: 'google',
    GITHUB: 'github',
  },
};

export class AuthService {
  private static instance: AuthService;
  private _app = initializeApp(firebaseConfig);
  private _auth = getAuth(this._app);
  private _db = getFirestore(this._app);
  private _googleProvider = new GoogleAuthProvider();
  private _githubProvider = new GithubAuthProvider();

  private constructor() {}

  public static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }

  // Centralized method to get current user token with enhanced error handling
  async getCurrentUserToken(): Promise<string> {
    if (!this._auth) {
      throw new AuthServiceError('Authentication not initialized', AuthErrorType.UNAUTHORIZED);
    }

    const currentUser = this._auth.currentUser;
    if (!currentUser) {
      throw new AuthServiceError('No authenticated user', AuthErrorType.UNAUTHORIZED);
    }

    try {
      return await currentUser.getIdToken(true);
    } catch (error) {
      const authError =
        error instanceof FirebaseError
          ? AuthServiceError.fromFirebaseError(error)
          : new AuthServiceError(
              'Failed to get user token',
              AuthErrorType.UNAUTHORIZED,
              error as Error
            );

      toast.error(authError.message);
      throw authError;
    }
  }

  // Validate input before authentication
  private validateAuthInput(email: string, password: string): void {
    if (!validateEmail(email)) {
      throw new AuthServiceError('Invalid email format', AuthErrorType.INVALID_CREDENTIALS);
    }

    if (!validatePassword(password)) {
      throw new AuthServiceError(
        'Password must be at least 8 characters',
        AuthErrorType.WEAK_PASSWORD
      );
    }
  }

  private validateFirebaseInitialized() {
    if (!this._auth || !this._db) {
      throw new Error('Firebase not initialized');
    }
  }

  // Social Login Methods with comprehensive error handling
  async signInWithGoogle(): Promise<UserProfile> {
    if (!this._auth || !this._googleProvider) {
      throw new AuthServiceError('Authentication not initialized', AuthErrorType.UNAUTHORIZED);
    }

    try {
      const result = await signInWithPopup(this._auth, this._googleProvider);
      const user = result.user;

      trackEvent('social_login', { provider: AUTH_CONFIG.SOCIAL_PROVIDERS.GOOGLE });

      return this.formatUserProfile(user);
    } catch (error) {
      const authError =
        error instanceof FirebaseError
          ? AuthServiceError.fromFirebaseError(error)
          : new AuthServiceError(
              'Google sign-in failed',
              AuthErrorType.UNKNOWN_ERROR,
              error as Error
            );

      toast.error(authError.message);
      throw authError;
    }
  }

  async signInWithGitHub(): Promise<UserProfile> {
    if (!this._auth || !this._githubProvider) {
      throw new AuthServiceError('Authentication not initialized', AuthErrorType.UNAUTHORIZED);
    }

    try {
      const result = await signInWithPopup(this._auth, this._githubProvider);
      const user = result.user;

      trackEvent('social_login', { provider: AUTH_CONFIG.SOCIAL_PROVIDERS.GITHUB });

      return this.formatUserProfile(user);
    } catch (error) {
      const authError =
        error instanceof FirebaseError
          ? AuthServiceError.fromFirebaseError(error)
          : new AuthServiceError(
              'GitHub sign-in failed',
              AuthErrorType.UNKNOWN_ERROR,
              error as Error
            );

      toast.error(authError.message);
      throw authError;
    }
  }

  // Email Authentication Methods with input validation
  async signUp(
    email: string, 
    password: string, 
    displayName?: string, 
    role: UserRole = USER_ROLES.USER
  ): Promise<UserProfile> {
    this.validateFirebaseInitialized();
    this.validateAuthInput(email, password);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        this._auth!, 
        email, 
        password
      );
      const user = userCredential.user;

      // Determine role (with special case for admin)
      const assignedRole = email.endsWith('@discovermynewsletters.com') 
        ? USER_ROLES.ADMIN 
        : role;

      const userProfile = this.formatUserProfile(user);
      userProfile.role = assignedRole;

      // Create user document in Firestore with role
      const userDocRef = doc(this._db!, 'users', user.uid);
      await setDoc(userDocRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        newsletterPreferences: {
          interestedTopics: [],
          frequencyPreference: 'weekly',
          receiveRecommendations: true
        },
        recommendationProfile: {
          viewedNewsletters: [],
          subscribedNewsletters: [],
          interactionScores: {}
        }
      });

      // Log user creation for analytics
      trackEvent('user_signup', { 
        userId: user.uid, 
        email: user.email,
        role: assignedRole 
      });

      // Format and return user profile
      return userProfile;
    } catch (error) {
      // Enhanced error handling
      trackError(error as Error);
      throw new AuthServiceError(
        'Signup failed', 
        this.mapFirebaseAuthError(error),
        error as Error
      );
    }
  }

  async signIn(email: string, password: string): Promise<UserProfile> {
    this.validateFirebaseInitialized();
    this.validateAuthInput(email, password);

    try {
      const userCredential = await signInWithEmailAndPassword(this._auth!, email, password);

      trackEvent('user_login', { 
        userId: userCredential.user.uid, 
        email: userCredential.user.email
      });

      return this.formatUserProfile(userCredential.user);
    } catch (error) {
      // Enhanced error handling
      trackError(error as Error);
      throw new AuthServiceError(
        'Login failed', 
        this.mapFirebaseAuthError(error),
        error as Error
      );
    }
  }

  // Password Reset Methods with enhanced error handling
  async sendPasswordResetCode(email: string, resetCode?: string): Promise<boolean> {
    this.validateFirebaseInitialized();

    try {
      // Verify reset code if provided
      if (resetCode) {
        await verifyPasswordResetCode(this._auth!, resetCode);
      }

      // Send password reset email
      await sendPasswordResetEmail(this._auth!, email);
      
      return true;
    } catch (error) {
      trackError(error as Error);
      throw new AuthServiceError(
        'Password reset failed', 
        this.mapFirebaseAuthError(error),
        error as Error
      );
    }
  }

  async resetPassword(code: string, newPassword: string): Promise<void> {
    if (!validatePassword(newPassword)) {
      throw new AuthServiceError(
        'Password must be at least 8 characters',
        AuthErrorType.WEAK_PASSWORD
      );
    }

    try {
      await confirmPasswordReset(this._auth!, code, newPassword);

      trackEvent('password_reset_success');
      toast.success('Password reset successfully');
    } catch (error) {
      const authError =
        error instanceof FirebaseError
          ? AuthServiceError.fromFirebaseError(error)
          : new AuthServiceError(
              'Password reset failed',
              AuthErrorType.UNKNOWN_ERROR,
              error as Error
            );

      toast.error(authError.message);
      throw authError;
    }
  }

  // User Logout Method with comprehensive session management
  async signOut(): Promise<void> {
    this.validateFirebaseInitialized();

    try {
      const currentUser = this._auth!.currentUser;
      
      // Track logout event
      if (currentUser) {
        trackEvent('user_logout', {
          userId: currentUser.uid
        });
      }

      await signOut(this._auth!);
    } catch (error) {
      trackError(error as Error);
      throw new AuthServiceError(
        'Logout failed', 
        this.mapFirebaseAuthError(error),
        error as Error
      );
    }
  }

  // Profile Management with comprehensive validation
  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    try {
      const token = await this.getCurrentUserToken();
      const currentUser = this._auth!.currentUser;

      if (!currentUser) {
        throw new AuthServiceError('Unauthorized', AuthErrorType.UNAUTHORIZED);
      }

      const response = await axios.patch(`${AUTH_CONFIG.BASE_URL}/user/profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update local Firestore document if backend update succeeds
      const userDocRef = doc(this._db!, 'users', currentUser.uid);
      await setDoc(userDocRef, payload, { merge: true });

      return this.formatUserProfile(currentUser);
    } catch (error) {
      const authError =
        error instanceof AxiosError
          ? new AuthServiceError(
              error.response?.data?.message || 'Profile update failed',
              AuthErrorType.UNAUTHORIZED,
              error
            )
          : new AuthServiceError(
              'Profile update failed',
              AuthErrorType.UNKNOWN_ERROR,
              error as Error
            );

      toast.error(authError.message);
      throw authError;
    }
  }

  private formatUserProfile(user: FirebaseUser): UserProfile {
    if (!user) {
      throw new Error('Invalid user object');
    }

    return {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || undefined,
      emailVerified: user.emailVerified,
      role: (user as any).role || USER_ROLES.USER,
      newsletterPreferences: {
        categories: [],
        frequency: 'weekly',
        darkMode: false
      }
    };
  }

  private mapFirebaseAuthError(error: unknown): AuthErrorType {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/network-request-failed':
          return AuthErrorType.NETWORK_ERROR;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return AuthErrorType.INVALID_CREDENTIALS;
        case 'auth/user-not-found':
          return AuthErrorType.USER_NOT_FOUND;
        case 'auth/email-already-in-use':
          return AuthErrorType.EMAIL_ALREADY_IN_USE;
        case 'auth/weak-password':
          return AuthErrorType.WEAK_PASSWORD;
        default:
          return AuthErrorType.UNKNOWN_ERROR;
      }
    } else if (error instanceof Error) {
      return AuthErrorType.UNKNOWN_ERROR;
    } else {
      return AuthErrorType.UNKNOWN_ERROR;
    }
  }
}

export { AuthErrorType, AuthServiceError };
