import { create } from 'zustand';

import {
  signIn,
  signUp,
  logOut,
  onAuthChange,
  auth as firebaseAuth,
  firestore,
  User as FirebaseUser,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from '@/config/firebase';
import { createUserProfile } from '@/services/firestore';
import { AdminInviteService } from '@/services/adminInviteService';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, additionalData: any) => Promise<any>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<() => void>;
  promoteToAdmin: (inviteCode: string) => Promise<boolean>;
}

interface AuthStore extends AuthState, AuthActions {}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signIn(email, password);
      // Additional login logic if needed
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signup: async (email, password, additionalData) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signUp(email, password);

      // Create user profile in Firestore
      if (userCredential.user) {
        await createUserProfile(userCredential.user.uid, {
          email,
          ...additionalData,
        });
      }

      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      set({
        error: error instanceof Error ? error.message : 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await logOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
      });
    }
  },

  initializeAuth: async () => {
    console.log('Initializing Authentication...');
    set({ isLoading: true });

    try {
      // Return a cleanup function for the auth listener
      return onAuthChange(async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Fetch user profile from Firestore
            const userDocRef = doc(firestore, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              console.log('User Data Retrieved:', userData);

              set({
                user: {
                  ...userData,
                  uid: firebaseUser.uid,
                  email: firebaseUser.email || userData.email,
                },
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              // If no user doc, create a basic profile
              const newUserData: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                role: 'user',
                createdAt: new Date(),
                interests: [],
              };

              // Save to Firestore
              await setDoc(userDocRef, newUserData);

              set({
                user: newUserData,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            }
          } catch (error) {
            console.error('Error retrieving user data:', error);
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Failed to retrieve user data',
            });
          }
        } else {
          // No user is signed in
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      });
    } catch (error) {
      console.error('Authentication initialization error:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication initialization failed',
      });
      throw error;
    }
  },

  promoteToAdmin: async (inviteCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const adminService = new AdminInviteService();
      const success = await adminService.validateAdminInviteCode(
        firebaseAuth.currentUser!.uid,
        inviteCode
      );

      if (success) {
        // Permanently update user role in Firestore
        const userRef = doc(firestore, 'users', firebaseAuth.currentUser!.uid);
        await updateDoc(userRef, { role: 'admin', adminPromotedAt: new Date() });

        // Update local user state
        set((state) => ({
          user: state.user ? { ...state.user, role: 'admin' } : null,
          isLoading: false,
        }));

        return true;
      }

      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Admin Promotion Error:', error);
      set({
        error: error instanceof Error ? error.message : 'Admin promotion failed',
        isLoading: false,
      });
      return false;
    }
  },
}));

// Export both default and named exports
export { useAuthStore };
export default useAuthStore;
