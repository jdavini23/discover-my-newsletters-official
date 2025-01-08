import axios, { AxiosError } from 'axios';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  FirebaseError,
  User,
  signInWithPopup,
  confirmPasswordReset,
} from 'firebase/auth';

import { getFirestore, doc, setDoc } from 'firebase/firestore';

import { GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

import analytics from '@/utils/analytics';

interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  newsletterPreferences?: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

interface UpdateProfilePayload {
  displayName?: string;
  email?: string;
  newsletterPreferences?: {
    categories?: string[];
    frequency?: 'daily' | 'weekly' | 'monthly';
    darkMode?: boolean;
  };
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class AuthService {
  private static auth = getAuth();
  private static db = getFirestore();
  private static googleProvider = new GoogleAuthProvider();
  private static githubProvider = new GithubAuthProvider();

  // Centralized method to get current user token
  static async getCurrentUserToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      toast.error('No authenticated user');
      return null;
    }

    try {
      return await currentUser.getIdToken();
    } catch (error: unknown) {
      console.error('Failed to get user token:', error);
      toast.error('Authentication failed');
      return null;
    }
  }

  // Social Login Methods
  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const user = result.user;

      analytics.trackEvent('social_login', { provider: 'google' });

      return this.formatUserProfile(user);
    } catch (error: unknown) {
      console.error('Google Sign-In Error', error);
      toast.error('Google sign-in failed');
      throw error;
    }
  }

  static async signInWithGitHub() {
    try {
      const result = await signInWithPopup(this.auth, this.githubProvider);
      const user = result.user;

      analytics.trackEvent('social_login', { provider: 'github' });

      return this.formatUserProfile(user);
    } catch (error: unknown) {
      console.error('GitHub Sign-In Error', error);
      toast.error('GitHub sign-in failed');
      throw error;
    }
  }

  // Email Authentication Methods
  static async signUp(email: string, password: string, displayName?: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      const user = userCredential.user;

      // Optional: Update profile
      if (displayName) {
        await this.updateProfile({ displayName });
      }

      analytics.trackEvent('user_signup', { method: 'email' });

      return this.formatUserProfile(user);
    } catch (error: unknown) {
      console.error('Sign Up Error', error);
      toast.error('Sign up failed');
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      analytics.trackEvent('user_login', { method: 'email' });

      return this.formatUserProfile(userCredential.user);
    } catch (error: unknown) {
      console.error('Sign In Error', error);
      toast.error('Sign in failed');
      throw error;
    }
  }

  // Password Reset Methods
  static async sendPasswordResetCode(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);

      analytics.trackEvent('password_reset_request', { email });

      return true;
    } catch (error: unknown) {
      console.error('Password Reset Error', error);
      toast.error('Failed to send reset code');
      throw error;
    }
  }

  static async verifyPasswordResetCode(email: string, code: string) {
    try {
      // In Firebase, this is typically handled automatically
      // You might need to implement custom backend logic
      const response = await axios.post('/api/auth/verify-reset-code', {
        email,
        code,
      });

      return response.data.isValid;
    } catch (error: unknown) {
      console.error('Code Verification Error', error);
      toast.error('Invalid reset code');
      throw error;
    }
  }

  static async resetPassword(email: string, code: string, newPassword: string) {
    try {
      // Firebase method for password reset
      await confirmPasswordReset(this.auth, code, newPassword);

      analytics.trackEvent('password_reset_success', { email });

      return true;
    } catch (error: unknown) {
      console.error('Password Reset Error', error);
      toast.error('Password reset failed');
      throw error;
    }
  }

  // Profile Management
  static async updateProfile(payload: UpdateProfilePayload) {
    try {
      // Get the current user token
      const token = await this.getCurrentUserToken();
      if (!token) {
        throw new Error('Unauthorized');
      }

      const response = await axios.patch(`${BASE_URL}/user/profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update local Firestore document if backend update succeeds
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(this.db, 'users', currentUser.uid);
        await setDoc(
          userDocRef,
          {
            ...payload,
            updatedAt: new Date(),
          },
          { merge: true }
        );
      }

      toast.success('Profile updated successfully');
      return response.data;
    } catch (error: unknown) {
      console.error('Profile update error:', error);

      // Handle specific error scenarios
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          switch (axiosError.response.status) {
            case 400:
              toast.error('Invalid profile data');
              break;
            case 401:
              toast.error('Unauthorized. Please log in again.');
              this.signOut();
              break;
            case 404:
              toast.error('User profile endpoint not found');
              break;
            case 500:
              toast.error('Server error. Please try again later.');
              break;
            default:
              toast.error('Failed to update profile');
          }
        } else if (axiosError.request) {
          toast.error('No response from server. Check your connection.');
        } else {
          toast.error('Error updating profile');
        }
      }

      throw error;
    }
  }

  static async uploadProfileImage(formData: FormData) {
    try {
      // Get the current user token
      const token = await this.getCurrentUserToken();
      if (!token) {
        throw new Error('Unauthorized');
      }

      const response = await axios.post(`${BASE_URL}/user/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update Firestore with new profile image
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(this.db, 'users', currentUser.uid);
        await setDoc(
          userDocRef,
          {
            profileImage: response.data.imageUrl,
            updatedAt: new Date(),
          },
          { merge: true }
        );
      }

      toast.success('Profile image updated');
      return response.data;
    } catch (error: unknown) {
      console.error('Avatar upload error:', error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          switch (axiosError.response.status) {
            case 400:
              toast.error('Invalid image file');
              break;
            case 401:
              toast.error('Unauthorized. Please log in again.');
              this.signOut();
              break;
            case 413:
              toast.error('Image file is too large');
              break;
            case 500:
              toast.error('Server error uploading image');
              break;
            default:
              toast.error('Failed to upload avatar');
          }
        } else if (axiosError.request) {
          toast.error('No response from server. Check your connection.');
        } else {
          toast.error('Error uploading avatar');
        }
      }

      throw error;
    }
  }

  // Sign Out Method
  static async signOut() {
    try {
      await this.auth.signOut();
      // Clear any stored tokens or user data
      localStorage.removeItem('token');
      // Redirect to login page or home
      window.location.href = '/login';
    } catch (error: unknown) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  }

  static async handleError(error: FirebaseError | Error): Promise<never> {
    console.error('An error occurred:', error);
    toast.error('An unexpected error occurred');
    throw error;
  }

  // Utility method to format user profile
  private static formatUserProfile(user: User): UserProfile {
    return {
      id: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
    };
  }
}
