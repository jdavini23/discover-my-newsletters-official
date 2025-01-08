import { create } from 'zustand';
import { User, UserCredential } from 'firebase/auth';
import { signIn, signUp, logOut, onAuthChange } from '@/config/firebase';
import { createUserProfile } from '@/services/firestore';
import { AdminInviteService } from '@/services/adminInviteService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Authentication methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;

  // Authentication state management
  initializeAuth: () => void;

  // Admin promotion methods
  promoteToAdmin: (inviteCode: string) => Promise<boolean>;
  generateAdminInviteCode: () => Promise<string | null>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signIn(email, password);
      const user = userCredential.user;

      // Fetch user profile to get the role
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const userData = userDoc.data() as UserProfile;

      set({
        user: {
          ...user,
          role: userData?.role || 'user'
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential: UserCredential = await signUp(email, password);

      // Create user profile with default role
      await createUserProfile(userCredential.user);

      set({
        user: {
          ...userCredential.user,
          role: 'user'
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await logOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false,
      });
      throw error;
    }
  },

  initializeAuth: () => {
    console.log('Initializing authentication...');
    onAuthChange((user) => {
      console.log('Auth state changed:', user);
      if (user) {
        console.log('User authenticated:', user.email);
        set({
          user: {
            ...user,
            role: 'user'
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        console.log('No user authenticated');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });
  },

  promoteToAdmin: async (inviteCode: string): Promise<boolean> => {
    if (!useAuthStore.getState().user) {
      throw new Error('No authenticated user');
    }

    try {
      const isValidInvite = await AdminInviteService.validateAdminInviteCode(
        useAuthStore.getState().user.uid, 
        inviteCode
      );

      if (isValidInvite) {
        // Update local state
        set({
          user: {
            ...useAuthStore.getState().user,
            role: 'admin'
          }
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Admin promotion failed:', error);
      return false;
    }
  },

  generateAdminInviteCode: async (): Promise<string | null> => {
    if (!useAuthStore.getState().user || useAuthStore.getState().user.role !== 'admin') {
      return null;
    }

    try {
      return await AdminInviteService.generateAdminInviteCode();
    } catch (error) {
      console.error('Failed to generate admin invite code:', error);
      return null;
    }
  }
}));

// Export both default and named exports
export { useAuthStore };
export default useAuthStore;
