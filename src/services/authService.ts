import axios, { AxiosError } from 'axios';
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

import analytics from '@/utils/analytics';
import { isNonEmptyString, safeGet, validateEmail, validatePassword } from '@/utils/typeUtils';

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

    if (authErrorCodes.includes(error.code)) {
      switch (error.code) {
        case 'auth/network-request-failed':
          return new AuthServiceError(
            'Network error. Please check your connection.',
            AuthErrorType.NETWORK_ERROR,
            error
          );
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return new AuthServiceError(
            'Invalid email or password.',
            AuthErrorType.INVALID_CREDENTIALS,
            error
          );
        case 'auth/user-not-found':
          return new AuthServiceError(
            'No user found with this email.',
            AuthErrorType.USER_NOT_FOUND,
            error
          );
        case 'auth/email-already-in-use':
          return new AuthServiceError(
            'Email is already registered.',
            AuthErrorType.EMAIL_ALREADY_IN_USE,
            error
          );
        case 'auth/weak-password':
          return new AuthServiceError('Password is too weak.', AuthErrorType.WEAK_PASSWORD, error);
      }
    }

    // Fallback for non-auth errors or unknown error codes
    return new AuthServiceError(
      error.message || 'An unknown authentication error occurred',
      AuthErrorType.UNKNOWN_ERROR,
      error
    );
  }
}

// Comprehensive user profile interface
interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  newsletterPreferences?: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
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
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  SOCIAL_PROVIDERS: {
    GOOGLE: 'google',
    GITHUB: 'github',
  },
};

export class AuthService {
  private static auth = getAuth();
  private static db = getFirestore();
  private static googleProvider = new GoogleAuthProvider();
  private static githubProvider = new GithubAuthProvider();

  // Centralized method to get current user token with enhanced error handling
  static async getCurrentUserToken(): Promise<string> {
    const currentUser = this.auth.currentUser;
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
  private static validateAuthInput(email: string, password: string): void {
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

  // Social Login Methods with comprehensive error handling
  static async signInWithGoogle(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const user = result.user;

      analytics.trackEvent('social_login', { provider: AUTH_CONFIG.SOCIAL_PROVIDERS.GOOGLE });

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

  static async signInWithGitHub(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(this.auth, this.githubProvider);
      const user = result.user;

      analytics.trackEvent('social_login', { provider: AUTH_CONFIG.SOCIAL_PROVIDERS.GITHUB });

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
  static async signUp(email: string, password: string, displayName?: string): Promise<UserProfile> {
    this.validateAuthInput(email, password);

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Optional: Update profile
      if (displayName && isNonEmptyString(displayName)) {
        await this.updateProfile({ displayName });
      }

      analytics.trackEvent('user_signup', { method: 'email' });

      return this.formatUserProfile(user);
    } catch (error) {
      const authError =
        error instanceof FirebaseError
          ? AuthServiceError.fromFirebaseError(error)
          : new AuthServiceError('Sign up failed', AuthErrorType.UNKNOWN_ERROR, error as Error);

      toast.error(authError.message);
      throw authError;
    }
  }

  static async signIn(email: string, password: string): Promise<UserProfile> {
    this.validateAuthInput(email, password);

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      analytics.trackEvent('user_login', { method: 'email' });

      return this.formatUserProfile(userCredential.user);
    } catch (error) {
      const authError =
        error instanceof FirebaseError
          ? AuthServiceError.fromFirebaseError(error)
          : new AuthServiceError('Sign in failed', AuthErrorType.UNKNOWN_ERROR, error as Error);

      toast.error(authError.message);
      throw authError;
    }
  }

  // Password Reset Methods with enhanced error handling
  static async sendPasswordResetCode(email: string, resetCode?: string): Promise<boolean> {
    if (!validateEmail(email)) {
      throw new AuthServiceError('Invalid email format', AuthErrorType.INVALID_CREDENTIALS);
    }

    try {
      if (resetCode) {
        // Verify reset code
        await verifyPasswordResetCode(this.auth, resetCode);
        analytics.trackEvent('password_reset_code_verified', { email });
        toast.success('Password reset code verified');
        return true;
      } else {
        // Send reset code
        await sendPasswordResetEmail(this.auth, email);
        analytics.trackEvent('password_reset_request', { email });
        toast.success('Password reset code sent to your email');
        return true;
      }
    } catch (error) {
      const authError =
        error instanceof FirebaseError
          ? AuthServiceError.fromFirebaseError(error)
          : new AuthServiceError(
              'Failed to process password reset',
              AuthErrorType.UNKNOWN_ERROR,
              error as Error
            );

      toast.error(authError.message);
      return false;
    }
  }

  static async resetPassword(code: string, newPassword: string): Promise<void> {
    if (!validatePassword(newPassword)) {
      throw new AuthServiceError(
        'Password must be at least 8 characters',
        AuthErrorType.WEAK_PASSWORD
      );
    }

    try {
      await confirmPasswordReset(this.auth, code, newPassword);

      analytics.trackEvent('password_reset_success');
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
  static async signOut(): Promise<void> {
    try {
      // Sign out from Firebase
      await signOut(this.auth);

      // Optional: Add analytics tracking for logout
      analytics.track('User Logout', {
        method: 'standard',
        timestamp: new Date().toISOString(),
      });

      // Optional: Clear any local storage or session data
      localStorage.removeItem('user');
      sessionStorage.removeItem('authToken');
    } catch (error) {
      // Handle potential logout errors
      const authError = 
        error instanceof FirebaseError
          ? AuthServiceError.fromFirebaseError(error)
          : new AuthServiceError(
              'Logout failed',
              AuthErrorType.UNKNOWN_ERROR,
              error as Error
            );

      // Log the error for debugging
      console.error('Logout Error:', authError);

      // Optional: Show user-friendly toast notification
      toast.error('Failed to log out. Please try again.');

      // Rethrow the error for caller to handle
      throw authError;
    }
  }

  // Profile Management with comprehensive validation
  static async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    try {
      const token = await this.getCurrentUserToken();
      const currentUser = this.auth.currentUser;

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
      const userDocRef = doc(this.db, 'users', currentUser.uid);
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

  // Utility method to format user profile
  private static formatUserProfile(user: User): UserProfile {
    return {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified,
    };
  }
}

export { AuthErrorType, AuthServiceError };
