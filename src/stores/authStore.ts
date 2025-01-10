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
  Timestamp,
} from '@/config/firebase';
import { AdminInviteService } from '@/services/adminInviteService';
import { createUserProfile } from '@/services/firestore';
import { User } from '@/types/user';
import { isDefined, isNonEmptyString, safeParse } from '@/utils/typeUtils';

// Improved type definitions
type AuthErrorType = 'INVALID_CREDENTIALS' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';

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
  signup: (email: string, password: string, additionalData: Partial<User>) => Promise<User>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  promoteToAdmin: (inviteCode: string) => Promise<boolean>;
}

// Global initialization function
const initializeAuthState = async (set: (fn: (state: AuthState) => void) => void) => {
  try {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? firebaseUser.uid : 'No user');

      if (firebaseUser) {
        try {
          const userRef = doc(firestore, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          console.log('User document exists:', userSnap.exists());

          if (userSnap.exists()) {
            const userData = userSnap.data() as User;
            console.log('Fetched user data:', userData);
            set((state) => {
              state.user = userData;
              state.isAuthenticated = true;
              state.isLoading = false;
              state.error = null;
            });
          } else {
            // Handle case where user doc doesn't exist
            console.log('Creating default user object');
            set((state) => {
              state.user = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                role: 'user',
                displayName: firebaseUser.displayName || '',
                emailVerified: firebaseUser.emailVerified,
                photoURL: firebaseUser.photoURL || undefined,
                bio: firebaseUser.displayName ?? '',
                interests: [],
                newsletterPreferences: {
                  frequency: 'weekly',
                  categories: [],
                },
                onboarding: {
                  isOnboardingComplete: false,
                  selectedCategories: [],
                  readingFrequency: 'weekly',
                  contentPreferences: {
                    depth: 'quick_insights',
                    formats: [],
                  },
                },
                preferences: {
                  darkMode: false,
                  notifications: true,
                },
                activityLog: [],
                accountCreatedAt: Timestamp.now(),
              };
              state.isAuthenticated = true;
              state.isLoading = false;
              state.error = null;
            });
          }
        } catch (firestoreError) {
          console.error('Firestore user fetch error:', firestoreError);
          set((state) => {
            state.user = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'user',
              displayName: firebaseUser.displayName || '',
              emailVerified: firebaseUser.emailVerified,
              photoURL: firebaseUser.photoURL || undefined,
              bio: firebaseUser.displayName ?? '',
              interests: [],
              newsletterPreferences: {
                frequency: 'weekly',
                categories: [],
              },
              onboarding: {
                isOnboardingComplete: false,
                selectedCategories: [],
                readingFrequency: 'weekly',
                contentPreferences: {
                  depth: 'quick_insights',
                  formats: [],
                },
              },
              preferences: {
                darkMode: false,
                notifications: true,
              },
              activityLog: [],
              accountCreatedAt: Timestamp.now(),
            };
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = {
              message: 'Could not fetch user details',
              type: 'NETWORK_ERROR',
            };
          });
        }
      } else {
        console.log('No user authenticated, resetting state');
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        });
      }
    });

    // Return unsubscribe function to clean up listener
    return unsubscribe;
  } catch (error) {
    console.error('Error in auth initialization:', error);
    set((state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = {
        message: 'Authentication initialization failed',
        type: 'UNKNOWN_ERROR',
      };
    });
  }
};

const useAuthStore = create<AuthState & AuthActions, [['zustand/immer', never]]>(
  immer((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (email: string, password: string): Promise<User> => {
      if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        throw new Error('Invalid email or password');
      }

      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const userCredential = await signIn(email, password);

        if (!userCredential.user) {
          throw new Error('No user returned from login');
        }

        const firebaseUser = userCredential.user;

        set((state) => {
          state.user = {
            ...firebaseUser,
            emailVerified: firebaseUser.emailVerified,
            isAnonymous: firebaseUser.isAnonymous,
            metadata: firebaseUser.metadata,
            providerData: firebaseUser.providerData,
            role: 'user', // Default role
            newsletterPreferences: {
              interestedTopics: [],
              frequencyPreference: 'weekly', // Default preference
              receiveRecommendations: true,
            },
            recommendationProfile: {
              viewedNewsletters: [],
              subscribedNewsletters: [],
              interactionScores: {},
            },
          };
          state.isAuthenticated = true;
          state.isLoading = false;
        });

        return state.user;
      } catch (error) {
        set((state) => {
          state.error = {
            message: error instanceof Error ? error.message : 'Login failed',
            type: mapErrorToType(error),
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

      set((state) => {
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

        set((state) => {
          state.user = {
            ...userProfile,
            emailVerified: firebaseUser.emailVerified,
            isAnonymous: firebaseUser.isAnonymous,
            metadata: firebaseUser.metadata,
            providerData: firebaseUser.providerData,
          };
          state.isAuthenticated = true;
          state.isLoading = false;
        });

        return userProfile;
      } catch (error) {
        set((state) => {
          state.error = {
            message: error instanceof Error ? error.message : 'Signup failed',
            type: mapErrorToType(error),
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
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        });
      } catch (error) {
        set((state) => {
          state.error = {
            message: error instanceof Error ? error.message : 'Logout failed',
            type: mapErrorToType(error),
          };
        });
      }
    },

    initializeAuth: async () => {
      return await initializeAuthState(set);
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
        const isValidInvite = AdminInviteService.validateInvite(inviteCode);

        if (!isValidInvite) {
          throw new Error('Invalid invite code');
        }

        await updateDoc(doc(firestore, 'users', currentUser.uid), {
          role: 'admin',
        });

        set((state) => {
          if (state.user) {
            state.user.role = 'admin';
          }
        });

        return true;
      } catch (error) {
        set((state) => {
          state.error = {
            message: error instanceof Error ? error.message : 'Failed to promote user',
            type: mapErrorToType(error),
          };
        });
        return false;
      }
    },
  }))
);

// Call initialization when store is created
initializeAuthState(useAuthStore.setState);

const mapErrorToType = (error: unknown): AuthErrorType => {
  if (error instanceof Error) {
    if (error.message.includes('invalid-credential')) return 'INVALID_CREDENTIALS';
    if (error.message.includes('network')) return 'NETWORK_ERROR';
  }
  return 'UNKNOWN_ERROR';
};

export { useAuthStore };
export default useAuthStore;
