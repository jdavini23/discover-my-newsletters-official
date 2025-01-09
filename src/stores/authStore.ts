import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  auth as firebaseAuth,
  doc,
  firestore,
  getDoc,
  logOut,
  onAuthChange,
  setDoc,
  signIn,
  signUp,
  updateDoc,
} from '@/config/firebase';
import { AdminInviteService } from '@/services/adminInviteService';
import { createUserProfile } from '@/services/firestore';
import { User } from '@/types/user';
import { 
  isDefined, 
  isNonEmptyString, 
  safeParse 
} from '@/utils/typeUtils';

// Improved type definitions
type AuthErrorType = 
  | 'INVALID_CREDENTIALS' 
  | 'NETWORK_ERROR' 
  | 'UNKNOWN_ERROR';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: {
    message: string;
    type: AuthErrorType;
  } | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<User>;
  signup: (
    email: string, 
    password: string, 
    additionalData: Partial<User>
  ) => Promise<User>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<() => void>;
  promoteToAdmin: (inviteCode: string) => Promise<boolean>;
}

type AuthStore = AuthState & AuthActions;

const mapErrorToType = (error: unknown): AuthErrorType => {
  if (error instanceof Error) {
    if (error.message.includes('invalid-credential')) return 'INVALID_CREDENTIALS';
    if (error.message.includes('network')) return 'NETWORK_ERROR';
  }
  return 'UNKNOWN_ERROR';
};

const useAuthStore = create<AuthStore>(
  immer((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email: string, password: string): Promise<User> => {
      if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        throw new Error('Invalid email or password');
      }

      set(state => { 
        state.isLoading = true; 
        state.error = null; 
      });

      try {
        const userCredential = await signIn(email, password);
        const user = userCredential.user;

        if (!user) {
          throw new Error('No user returned from login');
        }

        set(state => {
          state.user = user;
          state.isAuthenticated = true;
          state.isLoading = false;
        });

        return user;
      } catch (error) {
        set(state => {
          state.error = {
            message: error instanceof Error ? error.message : 'Login failed',
            type: mapErrorToType(error)
          };
          state.isLoading = false;
          state.isAuthenticated = false;
        });
        throw error;
      }
    },

    signup: async (
      email: string, 
      password: string, 
      additionalData: Partial<User>
    ): Promise<User> => {
      if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        throw new Error('Invalid email or password');
      }

      set(state => { 
        state.isLoading = true; 
        state.error = null; 
      });

      try {
        const userCredential = await signUp(email, password);
        const firebaseUser = userCredential.user;

        if (!firebaseUser) {
          throw new Error('No user returned from signup');
        }

        // Create user profile in Firestore
        const userProfile = await createUserProfile(firebaseUser.uid, {
          email,
          ...additionalData,
        });

        set(state => {
          state.user = userProfile;
          state.isAuthenticated = true;
          state.isLoading = false;
        });

        return userProfile;
      } catch (error) {
        set(state => {
          state.error = {
            message: error instanceof Error ? error.message : 'Signup failed',
            type: mapErrorToType(error)
          };
          state.isLoading = false;
          state.isAuthenticated = false;
        });
        throw error;
      }
    },

    logout: async () => {
      try {
        await logOut();
        set(state => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        });
      } catch (error) {
        set(state => {
          state.error = {
            message: error instanceof Error ? error.message : 'Logout failed',
            type: mapErrorToType(error)
          };
        });
      }
    },

    initializeAuth: async () => {
      set(state => { 
        state.isLoading = true; 
        state.error = null; 
      });

      return onAuthChange(async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(firestore, 'users', user.uid));
            const userData = userDoc.data() as User | undefined;

            set(state => {
              state.user = userData ?? null;
              state.isAuthenticated = !!userData;
              state.isLoading = false;
            });
          } catch (error) {
            set(state => {
              state.error = {
                message: 'Failed to fetch user data',
                type: mapErrorToType(error)
              };
              state.isLoading = false;
              state.isAuthenticated = false;
            });
          }
        } else {
          set(state => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
          });
        }
      });
    },

    promoteToAdmin: async (inviteCode: string): Promise<boolean> => {
      if (!isNonEmptyString(inviteCode)) {
        throw new Error('Invalid invite code');
      }

      const currentUser = get().user;
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      try {
        const isValidInvite = await AdminInviteService.validateInvite(inviteCode);
        
        if (!isValidInvite) {
          throw new Error('Invalid invite code');
        }

        await updateDoc(doc(firestore, 'users', currentUser.uid), {
          role: 'admin'
        });

        set(state => {
          if (state.user) {
            state.user.role = 'admin';
          }
        });

        return true;
      } catch (error) {
        set(state => {
          state.error = {
            message: error instanceof Error ? error.message : 'Failed to promote user',
            type: mapErrorToType(error)
          };
        });
        return false;
      }
    },
  }))
);

export { useAuthStore };
export default useAuthStore;
